
const flame = document.getElementById("flame");
const instruction = document.getElementById("instruction");
const blowButton = document.getElementById("blowButton");
const surprise = document.getElementById("surprise");

let audioContext;
let micStream;
let animationId;
let isBlownOut = false;
let blowFrames = 0;

async function startMicrophone() {
    if (isBlownOut) return;

    blowButton.disabled = true;
    blowButton.textContent = "🎤 CONNECTING...";

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

        const microphone =
            audioContext.createMediaStreamSource(micStream);

        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0;

        microphone.connect(analyser);

        const data = new Uint8Array(analyser.fftSize);

        instruction.textContent =
            "Microphone ready! Blow towards your microphone 💨";

        blowButton.textContent = "💨 BLOW NOW!";
        blowButton.disabled = false;

        function detectBlow() {
            if (isBlownOut) return;

            analyser.getByteTimeDomainData(data);

            let sum = 0;

            for (let i = 0; i < data.length; i++) {
                const value = (data[i] - 128) / 128;
                sum += value * value;
            }

            const volume = Math.sqrt(sum / data.length);

            instruction.textContent =
                "Sound level: " + volume.toFixed(3) + " 💨";

            if (volume > 0.025) {
                blowFrames++;
            } else {
                blowFrames = 0;
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
            "Microphone unavailable. Tap the flame instead ❤️";

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
