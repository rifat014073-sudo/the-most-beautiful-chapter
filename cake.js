
const flame = document.getElementById("flame");
const instruction = document.getElementById("instruction");
const blowButton = document.getElementById("blowButton");
const surprise = document.getElementById("surprise");

let audioContext;
let microphone;
let animationId;
let isBlownOut = false;

async function startMicrophone() {
    if (isBlownOut) return;

    blowButton.disabled = true;
    blowButton.textContent = "🎤 LISTENING...";

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();

        await audioContext.resume();

        microphone = audioContext.createMediaStreamSource(stream);

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        microphone.connect(analyser);

        const data = new Uint8Array(analyser.fftSize);

        instruction.textContent =
            "Now gently blow towards your microphone! 💨";

        blowButton.textContent = "🎤 BLOW NOW!";

        let noiseLevel = 0;
        let calibrationFrames = 0;
        let blowFrames = 0;

        function detectBlow() {
            if (isBlownOut) return;

            analyser.getByteTimeDomainData(data);

            let sum = 0;

            for (let i = 0; i < data.length; i++) {
                const value = (data[i] - 128) / 128;
                sum += value * value;
            }

            const volume = Math.sqrt(sum / data.length);

            // First, measure normal background sound.
            if (calibrationFrames < 30) {
                noiseLevel += volume;
                calibrationFrames++;

                if (calibrationFrames === 30) {
                    noiseLevel /= 30;
                    instruction.textContent =
                        "Ready! Blow towards the microphone! 💨";
                }
            } else {
                const threshold = Math.max(
                    0.035,
                    noiseLevel * 2.5
                );

                if (volume > threshold) {
                    blowFrames++;
                } else {
                    blowFrames = 0;
                }

                // Detect a sustained blowing sound.
                if (blowFrames >= 5) {
                    blowOut();
                    return;
                }
            }

            animationId = requestAnimationFrame(detectBlow);
        }

        detectBlow();

    } catch (error) {
        console.error(error);

        instruction.textContent =
            "Microphone unavailable. Tap the flame to blow it out! ❤️";

        blowButton.disabled = false;
        blowButton.textContent = "🎤 TRY AGAIN";
    }
}

function blowOut() {
    if (isBlownOut) return;

    isBlownOut = true;

    cancelAnimationFrame(animationId);

    if (microphone) {
        microphone.mediaStream.getTracks().forEach(track => {
            track.stop();
        });
    }

    if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
    }

    flame.classList.add("off");

    instruction.textContent =
        "Your wish is on its way to the stars... ✨";

    blowButton.style.display = "none";

    surprise.classList.remove("hidden");
}

function goNext() {
    window.location.href = "page6.html";
}

// Tap the flame as an alternative.
flame.addEventListener("click", blowOut);

// Start microphone after user interaction.
blowButton.addEventListener("click", startMicrophone);
