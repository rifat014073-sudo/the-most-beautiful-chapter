
function openPhoto(card) {
    const image = card.querySelector("img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    lightboxImage.src = image.src;
    lightbox.classList.add("active");
}

function closePhoto() {
    document.getElementById("lightbox").classList.remove("active");
}

function goNext() {
    window.location.href = "page5.html";
}

// Close photo with Escape key
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closePhoto();
    }
});
