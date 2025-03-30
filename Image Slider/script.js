const slides = document.querySelectorAll(".slide")
const back = document.getElementById("back")
const next = document.getElementById("next")
let cslide = 0;
function getslide() {
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - cslide)}%)`
    })
}
getslide()

back.addEventListener("click", () => {
    if (cslide > 0) {
        cslide--;
        getslide();
    }
});

// Next button (next slide)
next.addEventListener("click", () => {
    if (cslide < slides.length - 1) {
        cslide++;
        getslide();
    }
});