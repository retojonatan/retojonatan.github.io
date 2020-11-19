let mercaderia = document.getElementById('listaMercaderia');
let tipoPeso = document.getElementById('tipoPeso');
let peso = document.getElementById('peso');
let precioPorKilo = document.getElementById('precioKilo');
let cantidad = document.getElementById('cantidad');
let subtotal = document.getElementById('subtotal');
let precioTotal = document.getElementById('precioTotal');
let formMercaderia = document.getElementById('formMercaderia');

function start() {
  mercaderia.addEventListener('change', () => filtrarPeso(mercaderia.value));
  tipoPeso.addEventListener('change', () => ponerPesoMaximo(tipoPeso.value));
  peso.addEventListener('change', () => categorizarPeso(peso.value));
  cantidad.addEventListener('change', () => actualizarTotal());
  precioTotal.addEventListener('change', () => calcularCambios());
  formMercaderia.addEventListener('submit', e => altaMercaderia(e));
}

function filtrarPeso(mercaderia) {
  switch (mercaderia) {
    case "Lechón":
      limpiarFiltro();
      tipoPeso.options[5].setAttribute('disabled', 'disabled')
      tipoPeso.options[6].setAttribute('disabled', 'disabled')
      tipoPeso.options[7].setAttribute('disabled', 'disabled')
      peso.max = 50;
      break;
    case "Capón":
      limpiarFiltro();
      tipoPeso.options[1].setAttribute('disabled', 'disabled')
      tipoPeso.options[2].setAttribute('disabled', 'disabled')
      tipoPeso.options[3].setAttribute('disabled', 'disabled')
      tipoPeso.options[4].setAttribute('disabled', 'disabled')
      peso.min = 50;
      break;
    case "Ternero":
      limpiarFiltro();
      tipoPeso.options[4].setAttribute('disabled', 'disabled')
      tipoPeso.options[5].setAttribute('disabled', 'disabled')
      tipoPeso.options[6].setAttribute('disabled', 'disabled')
      tipoPeso.options[7].setAttribute('disabled', 'disabled')
      peso.max = 40;
      break;
    default:
      limpiarFiltro();
      tipoPeso.options[2].setAttribute('disabled', 'disabled')
      tipoPeso.options[3].setAttribute('disabled', 'disabled')
      tipoPeso.options[4].setAttribute('disabled', 'disabled')
      tipoPeso.options[5].setAttribute('disabled', 'disabled')
      tipoPeso.options[6].setAttribute('disabled', 'disabled')
      tipoPeso.options[7].setAttribute('disabled', 'disabled')
      peso.max = 20;
      break;
  }
}

function limpiarFiltro() {
  for (let i = 0; i < tipoPeso.options.length; i++) {
    tipoPeso.options[i].removeAttribute('disabled');
    tipoPeso[i].selected = false;
  }
  peso.value = "";
}

function altaMercaderia(e) {
  e.preventDefault();
  var jsonData = {
    Mercaderia: mercaderia.value,
    TipoPeso: tipoPeso.value,
    Peso: peso.value,
    PrecioPorKilo: precioPorKilo.value,
    Cantidad: cantidad.value,
    Subtotal: subtotal.value,
    PrecioTotal: precioTotal.value,
  }
  console.log(jsonData);
}

function actualizarTotal() {
  precioTotal.value = parseFloat(peso.value * precioPorKilo.value * cantidad.value).toFixed(2);
  subtotal.value = parseFloat(peso.value * precioPorKilo.value * cantidad.value).toFixed(2);
}

function calcularCambios() {
  precioPorKilo.value = parseFloat((precioTotal.value / cantidad.value) / peso.value).toFixed(2);
  subtotal.value = precioTotal.value;
}

function ponerPesoMaximo(categoria) {
  switch (categoria) {
    case "A":
      peso.value = 20;
      break;
    case "B":
      peso.value = 30;
      break;
    case "C":
      peso.value = 40;
      break;
    case "D":
      peso.value = 50;
      break;
    case "E":
      peso.value = 70;
      break;
    case "F":
      peso.value = 100;
      break;
    default:
      peso.value = "";
      break;
  }
}

function categorizarPeso(peso) {
  switch (true) {
    case (peso <= 20):
      tipoPeso.value = "A";
      break;
    case (peso <= 30):
      tipoPeso.value = "B";
      break;
    case (peso <= 40):
      tipoPeso.value = "C";
      break;
    case (peso <= 50):
      tipoPeso.value = "D";
      break;
    case (peso <= 70):
      tipoPeso.value = "E";
      break;
    case (peso <= 100):
      tipoPeso.value = "F";
      break;
    default:
      tipoPeso.value = "G";
      break;
  }
  actualizarTotal();
}

window.addEventListener('load', start())