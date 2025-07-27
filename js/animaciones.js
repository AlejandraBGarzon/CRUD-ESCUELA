// =======================================
// =============== SLIDES ================
// =======================================

let currentSlide = 0;
const slides = document.getElementById('slides');
const totalSlides = document.querySelectorAll('.slide').length;

function updateSlide() {
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlide();
}

setInterval(nextSlide, 5000);


/* -------------------------------------------------------------------------- */
/*                       Desplazmiento flecha bienvenida                      */
/* -------------------------------------------------------------------------- */
document.querySelector('#arrow-down').addEventListener('click', function (e) {
  e.preventDefault();

  const target = document.querySelector('#main');
  const targetPosition = target.offsetTop;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 1500; // 1.5 segundos

  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percent = Math.min(progress / duration, 1);

    // Easing: easeInOutQuad
    const eased = percent < 0.5
      ? 2 * percent * percent
      : -1 + (4 - 2 * percent) * percent;

    window.scrollTo(0, startPosition + distance * eased);

    if (progress < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
});

