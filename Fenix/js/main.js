// FORMULARIO
function contactForm() {
    var nombre = document.getElementById("nombre").value;
    var email = document.getElementById("email").value;
    var asunto = document.getElementById("asunto").value;
    var mensaje = document.getElementById("mensaje").value;
    envioFormulario(nombre, email, asunto, mensaje);
}

function envioFormulario(nombre, email, asunto, mensaje) {
    var urlCompleta = "https://www.nuevasocialfenix.com.ar/OperacionFormulario/MensajeContacto";

    var request = $.ajax({
        url: urlCompleta,
        type: 'GET',
        dataType: 'json',
        data: {
            nombre: nombre,
            email: email,
            asunto: asunto,
            mensaje: mensaje
        }
    })
    request.done(function (response) {
        document.getElementById("form-contacto").reset();
        $('#modalExito').modal('show');
    })
    request.fail(function (jqXHR, textStatus) {
        document.getElementById("form-contacto").reset();
        $('#modalFail').modal('show');
    })
}

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

// SCROLL NAVBAR CHANGE
$(function () {
    $(document).scroll(function () {
        var $nav = $(".sticky-top");
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height() + 450);
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
$('.carru-prod').slick({
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: false,
    arrows: true,
    autoplay: true,
    draggable: true,
    infinite: true,
    autoplaySpeed: 3000,
    speed: 2000
});