
// Star Animation
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars = [];

    for (let i = 0; i < 180; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            speed: Math.random() * 0.015 + 0.003
        });
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.alpha += star.speed;

        if (star.alpha >= 1 || star.alpha <= 0.1) {
            star.speed *= -1;
        }

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(220, 200, 255, ${star.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#b98cff";
        ctx.fill();
    });

    requestAnimationFrame(animateStars);
}

window.addEventListener("resize", resize);

resize();
animateStars();

// Page 2 Navigation
function openSurprise() {
    window.location.href = "page2.html";
}
