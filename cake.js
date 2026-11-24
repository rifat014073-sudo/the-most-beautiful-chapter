
const flame = document.getElementById("flame");
const instruction = document.getElementById("instruction");
const blowButton = document.getElementById("blowButton");
const surprise = document.getElementById("surprise");

let audioContext;
let microphone;
let animationId;
let micStream;
let isBlownOut = false;

async function startMicrophone() {
    if (isBlownOut) return;

    blowButton.disabled = true;
    blowButton.textContent = "🎤 LISTENING...";

    try {
        micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        });

        audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();

        await audioContext.resume();

        microphone = audioContext.createMediaStreamSource(micStream);

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.2;

        microphone.connect(analyser);

        const data = new Uint8Array(analyser.fftSize);

        instruction.textContent =
            "Microphone ready! Now blow towards your microphone 💨";

        blowButton.textContent = "💨 BLOW NOW!";

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

            // Sensitive blow detection
            if (volume > 0.025) {
                blowFrames++;
            } else {
                blowFrames = Math.max(0, blowFrames - 1);
            }

            if (blowFrames >= 8) {
                blowOut();
                return;
            }

            animationId = requestAnimationFrame(detectBlow);
        }

        detectBlow();

    } catch (error) {
        console.error(error);

        instruction.textContent =
            "Microphone unavailable. Tap the flame instead! ❤️";

        blowButton.disabled = false;
        blowButton.textContent = "🎤 TRY AGAIN";
    }
}

function blowOut() {
    if (isBlownOut) return;

    isBlownOut = true;

    cancelAnimationFrame(animationId);

    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
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

flame.addEventListener("click", blowOut);
blowButton.addEventListener("click", startMicrophone);
