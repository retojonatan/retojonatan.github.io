var formCompras = document.getElementById('formCompras');
var listaProveedores = document.getElementById('listaProveedores');
var listaProductos = document.getElementById('listaProductos');
var idEditable = 0;

formCompras.addEventListener("submit", function (e) {
  altaCompra();
  e.preventDefault();
});

listaProveedores.addEventListener('change', function (e) {
  presentarDatosProveedor(e.target.value);
  listarProductos(listaProductos);
})

listaProductos.addEventListener('change', function (e) {
  presentarDatosProducto(e.target.value);
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

function presentarDatosProveedor(idProveedor) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/ObtenerProveedor',
    type: "GET",
    data: {
      id: idProveedor
    },
    contentType: "application/json"
  });

  req.done(function (res) {
    document.getElementById('razonSocial').value = res.RazonSocial;
    document.getElementById('condicion').value = res.CondicionFiscal;
    document.getElementById('tipo').value = res.TipoRubro;
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function presentarDatosProducto(idProducto) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/ObtenerProducto',
    type: "GET",
    data: {
      id: idProducto
    },
    contentType: "application/json"
  });

  req.done(function (res) {
    document.getElementById('marca').value = res.Marca;
    document.getElementById('precio').value = res.Precio;
    document.getElementById('iva').value = res.IVA;
    document.getElementById('subtotal').value = document.getElementById('precio').value * document.getElementById('cantidad').value;
  });

  req.fail(function (err) {
    console.log(err);
  });
}

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
    console.log(JSON.stringify(jsonData));
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
  });

  tabla.fail(function (err) {
    console.log(err)
  });
}

function listarProductos(lista) {
  var tabla = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/ObtenerProductos',
    type: "GET",
    data: {},
    contentType: "application/json"
  });

  tabla.done(function (res) {
    res.forEach(element => {
      var producto = document.createElement('option');
      producto.appendChild(document.createTextNode(element.Descripcion));
      producto.value = element.ProductoId;
      lista.appendChild(producto);
    });
  });

  tabla.fail(function (err) {
    console.log(err)
  });
}

// Manejo de vista para productos
var filaProducto = document.getElementById('filaProducto');
var count = 1;

function addProduct() {
  var clon = filaProducto.firstElementChild.cloneNode(true);
  clon.id = "columnaProducto" + count;
  for (var i = 0; i < clon.getElementsByTagName('select').length; i++) {
    clon.getElementsByTagName('select')[i].id = filaProducto.getElementsByTagName('select')[i].id + count;
    clon.getElementsByTagName('select')[i].value = "";
    clon.getElementsByTagName('select')[i].addEventListener('change', function (e) {
      presentarDatosProducto(e.target.value);
    })
  }
  for (var i = 0; i < clon.getElementsByTagName('input').length; i++) {
    clon.getElementsByTagName('input')[i].id = filaProducto.getElementsByTagName('input')[i].id + count;
    clon.getElementsByTagName('input')[i].value = "";
  }
  var precio = "precio" + count;
  var cantidad = "cantidad" + count;
  var subtotal = "subtotal" + count;
  filaProducto.appendChild(clon);
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
  if (filaProducto.lastChild != filaProducto.firstElementChild) {
    filaProducto.lastChild.remove();
    count--;
    hideDelete(filaProducto);
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