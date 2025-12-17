let slides = document.querySelectorAll('.slide');
let index = 0;

function showSlide(n) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[n].classList.add('active');
}

// Next button
document.querySelector('.next').onclick = function() {
  index = (index + 1) % slides.length;
  showSlide(index);
}

// Prev button
document.querySelector('.prev').onclick = function() {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
}

// Auto slide every 5s
setInterval(() => {
  index = (index + 1) % slides.length;
  showSlide(index);
}, 5000);
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
 window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    const hero = document.querySelector(".hero");
    const heroBottom = hero.offsetHeight;

    if (window.scrollY > heroBottom - 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
  // subtle hover emphasis for service blocks
const serviceBoxes = document.querySelectorAll(
  ".service-box-left, .service-box-right"
);

serviceBoxes.forEach(box => {
  box.addEventListener("mouseenter", () => {
    box.style.transform = "translateY(-6px)";
    box.style.transition = "0.4s ease";
  });

  box.addEventListener("mouseleave", () => {
    box.style.transform = "translateY(0)";
  });
});
