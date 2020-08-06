// **** ESTE ES EL CARRUSEL DEL INDEX ****
$("#carousel-landing").slick({
  dots: false,
  arrows: false,
  autoplay: true,
  draggable: true,
  fade: true,
  lazyLoad: 'progressive',
  infinite: true,
  autoplaySpeed: 4000,
  speed: 2000,
});

// **** ESTE ES EL CARRUSEL DE LOS PRODUCTOS ****
$(".carousel-product").slick({
  dots: true,
  arrows: true,
  autoplay: true,
  draggable: true,
  fade: true,
  lazyLoad: 'progressive',
  infinite: true,
  autoplaySpeed: 5000,
  speed: 3000,
});

// **** ESTO ES EL TOGGLER DEL MENU PARA VERSION MOBILE ****
$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

// **** ESTO PRESENTA LAS IMGS DEL CARRUSEL EN EL BOTON DE EDITAR ****
// seteamos el dir y la extensión de los archivos a buscar
var dir = "/img/carousel";
var fileextension = [".jpeg", ".jpg"];
$.ajax({
  // hacemos la consulta a ajax con la url donde están las imgs y los ok los presentamos en el html
  url: dir,
  success: function (data) {
    // acá listamos todos los archivos encontrados
    $(data).find("a:contains(" + (fileextension[0]) + "), a:contains(" + (fileextension[1]) +
      ")").each(function () {
      var filename = this.href.replace(window.location.host, "").replace("http://",
        "");
      $("#preview").append(
        `<div class='edit-carousel col p-0'>
            <a href="#" class='seleccionar d-block' name='` + filename + `' onclick='selectImg(this)'>
                <img class='img-fluid' src='` + filename + `'>
            </a>
        </div>`
      );
    });
  }
});

// **** ESTO PRESENTA LAS IMGS DEL CARRUSEL EN EL BOTON DE BORRAR ****
var dir = "/img/carousel";
var fileextension = [".jpeg", ".jpg"];
$.ajax({
  url: dir,
  success: function (data) {
    $(data).find("a:contains(" + (fileextension[0]) + "), a:contains(" + (fileextension[1]) +
      ")").each(function () {
      var filename = this.href.replace(window.location.host, "").replace("http://",
        "");
      $("#deleteCar").append(
        `<div class='edit-carousel col p-0'>
            <a href="#" class='seleccionar d-block' name='` + filename + `' onclick='selectImg(this)'>
              <img class='img-fluid' src='` + filename + `'>
            </a>
          </div>`
      );
    });
  }
});

// **** ESTO DETECTA CLICKS EN LAS IMG DEL EDITOR CARRUSEL ****
// **** TE DEVUELVE EL URL DE LA IMG ****
// se genera array de imgs con la clase .seleccionar
const arrImgs = document.getElementsByClassName('.seleccionar');
// se itera el array
for (let item of arrImgs) {
  // le agregamos un listener al hacer click con la funcion selectImg
  item.addEventListener('click', selectImg(this));
}
// esta funcion te devuelve el filename del attr name
const selectImg = e => {
  let imagen = e.getElementsByTagName('img')[0];
  alert("la url es " + imagen.src)
}

// **** ACTIVA EL SCROLLREVEALER WOW ****
var wow = new WOW({
  boxClass: 'wow', // animated element css class (default is wow)
  animateClass: 'animate__animated', // animation css class (default is animated)
  offset: 15, // distance to the element when triggering the animation (default is 0)
  mobile: false, // trigger animations on mobile devices (default is true)
  live: true, // act on asynchronously loaded content (default is true)
  callback: function (box) {
    // the callback is fired every time an animation is started
    // the argument that is passed in is the DOM node being animated
  },
  scrollContainer: null, // optional scroll container selector, otherwise use window,
  resetAnimation: true, // reset animation on end (default is true)
});
wow.init();