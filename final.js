
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

const loveButton = document.getElementById("loveButton");
const answer = document.getElementById("answer");

let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars = [];

    for (let i = 0; i < 140; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.8,
            opacity: Math.random(),
            speed: Math.random() * 0.015 + 0.003
        });
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.opacity += star.speed;

        if (star.opacity > 1 || star.opacity < 0.15) {
            star.speed *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255, 225, 255, ${star.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#e6aaff";
        ctx.fill();
    });

    requestAnimationFrame(animateStars);
}

function createHeart() {
    const heart = document.createElement("div");

    heart.className = "floating-heart";
    heart.textContent = ["❤️", "💗", "💕", "✨"][
        Math.floor(Math.random() * 4)
    ];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (15 + Math.random() * 20) + "px";

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}

loveButton.addEventListener("click", () => {
    loveButton.style.display = "none";
    answer.classList.remove("hidden");

    for (let i = 0; i < 35; i++) {
        setTimeout(createHeart, i * 120);
    }
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animateStars();

setInterval(createHeart, 900);
