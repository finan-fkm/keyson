const slides = document.querySelectorAll(".slide");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let current = 0;

function updateSlider() {

    slides.forEach(slide => {
        slide.className = "slide";
    });

    slides[current].classList.add("active");

    const left = (current - 1 + slides.length) % slides.length;
    const right = (current + 1) % slides.length;

    const farLeft = (current - 2 + slides.length) % slides.length;
    const farRight = (current + 2) % slides.length;

    slides[left].classList.add("left");
    slides[right].classList.add("right");

    slides[farLeft].classList.add("far-left");
    slides[farRight].classList.add("far-right");
}

next.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    updateSlider();
});

prev.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    updateSlider();
});

// Auto Slide Every 4 Seconds
setInterval(() => {
    current = (current + 1) % slides.length;
    updateSlider();
}, 4000);

// Initialize
updateSlider();