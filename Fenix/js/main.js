// SMOOTH SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
    });
});

// CARRUSEL PRINCIPAL
$('.carru').slick({
    dots: true,
    arrows: false,
    autoplay: true,
    draggable: true,
    fade: true,
    lazyLoad: 'progressive',
    infinite: true,
    autoplaySpeed: 6000,
    speed: 2000,
}).slick("slickPause");
let initialDelay = 2000;
setTimeout(function () {
    $('.carru').slick("slickPlay");
}, initialDelay);

// CARRUSEL PRODUCTOS
