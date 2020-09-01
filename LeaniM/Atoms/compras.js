var formCompras = document.getElementById('formCompras');
var proveedor = document.getElementById('listaProveedores');
var idEditable = 0;

formCompras.addEventListener("submit", function (e) {
  altaCompra();
  e.preventDefault();
});

proveedor.addEventListener('select', function (e) {
  listarProductos();
})

$(window).on("load", function () {
  uploadTable();
  listarProveedores();
  document.getElementById('precio').addEventListener('change', function () {
    document.getElementById('subtotal').value = document.getElementById('precio').value * document.getElementById('cantidad').value;
  });
  document.getElementById('cantidad').addEventListener('change', function () {
    document.getElementById('subtotal').value = document.getElementById('precio').value * document.getElementById('cantidad').value;
  });
});

function altaCompra() {
  var jsonData = {
    ProveedorId: document.getElementById('proveedorId'),
    Fecha: document.getElementById('fechaFc').value,
    NumFactura: document.getElementById('numFc').value,
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/IngresarNuevaCompra',
    type: "POST",
    data: JSON.stringify(jsonData),
    contentType: "application/json"
  });

  req.done(function () {
    console.log("OK");
    alert(JSON.stringify(jsonData));
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function listarProveedores() {
  var lista = document.getElementById("listaProveedores");
  var listaEdit = document.getElementById("listaProveedoresEdit");
  var tabla = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/ObtenerProveedores',
    type: "GET",
    data: {},
    contentType: "application/json"
  });

  tabla.done(function (res) {
    res.forEach(element => {
      var proveedor = document.createElement('option');
      proveedor.appendChild(document.createTextNode(element.Nombre));
      proveedor.value = element.ProveedorId;
      lista.appendChild(proveedor);
    });
    res.forEach(element => {
      var proveedor = document.createElement('option');
      proveedor.appendChild(document.createTextNode(element.Nombre));
      proveedor.value = element.ProveedorId;
      listaEdit.appendChild(proveedor);
    });
  });

  tabla.fail(function (err) {
    console.log(err)
  });
}

function listarProductos() {
  var lista = document.getElementById("listaProductos");
  var listaEdit = document.getElementById("listaProductosEdit");
  var tabla = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/ObtenerProductos',
    type: "GET",
    data: {},
    contentType: "application/json"
  });

  tabla.done(function (res) {
    res.forEach(element => {
      var producto = document.createElement('option');
      producto.appendChild(document.createTextNode(element.Nombre));
      producto.value = element.productoId;
      lista.appendChild(producto);
    });
    res.forEach(element => {
      var producto = document.createElement('option');
      producto.appendChild(document.createTextNode(element.Nombre));
      producto.value = element.productoId;
      listaEdit.appendChild(producto);
    });
  });

  tabla.fail(function (err) {
    console.log(err)
  });
}

// Manejo de vista para productos
var listaProductos = document.getElementById('listaProductos');
var count = 1;

function addProduct() {
  var clon = listaProductos.firstElementChild.cloneNode(true);
  clon.id = "columnaProducto" + count;
  for (var i = 0; i < clon.getElementsByTagName('input').length; i++) {
    clon.getElementsByTagName('input')[i].id = listaProductos.getElementsByTagName('input')[i].id + count;
    clon.getElementsByTagName('input')[i].value = "";
  }
  var precio = "precio" + count;
  var cantidad = "cantidad" + count;
  var subtotal = "subtotal" + count;
  listaProductos.appendChild(clon);
  document.getElementById(precio.toString()).addEventListener('change', function () {
    document.getElementById(subtotal.toString()).value = document.getElementById(precio).value * document.getElementById(cantidad).value;
  });
  document.getElementById(cantidad.toString()).addEventListener('change', function () {
    document.getElementById(subtotal.toString()).value = document.getElementById(precio).value * document.getElementById(cantidad).value;
  });
  count++;
  document.getElementById('borrarProducto').style.display = "inline-block";
}

function deleteProduct() {
  if (listaProductos.lastChild != listaProductos.firstElementChild) {
    listaProductos.lastChild.remove();
    count--;
    hideDelete(listaProductos);
  }
}

function hideDelete(e) {
  if (count == 1) {
    document.getElementById('borrarProducto').style.display = "none";
  }
}

function uploadTable() {

  var tabla = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionCompras/ObtenerCompras',
    type: "GET",
    data: {},
    contentType: "application/json"
  });

  tabla.done(function (res) {
    $('#tablaCompras').DataTable().clear().destroy();
    $('#tablaCompras').DataTable({
      data: res,
      columns: [{
          "data": "Nombre"
        },
        {
          "data": "TipoRubro"
        },
        {
          "data": "Contacto"
        },
        {
          "data": "RazonSocial"
        },
        {
          "data": "Direccion"
        },
        {
          "data": "Telefono"
        },
        {
          "data": "ProveedorId",
          render: function (data, type, row) {
            return `<a class="btn btn-sm btn-warning" href="#" onclick="mostrarProveedor(${data})">Modificar <i class="fa fa-edit" ></i></a>`;
          }
        }
      ]
    });
  });

  tabla.fail(function (err) {
    console.log("fail" + err);
  });
}


// document.getElementsByName("listaProductos")[0]