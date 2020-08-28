var formProductos = document.getElementById('formProductos');
formProductos.addEventListener("submit", function (e) {
  altaProducto();
  e.preventDefault();
});

$(window).on("load", function () {
  uploadTable();
  selectProveedor();
});

function altaProducto() {
  var jsonData = {
    ProveedorId: document.getElementById('listaProveedores').value,
    Descripcion: document.getElementById('producto').value,
    Marca: document.getElementById('marca').value,
    Tipo: document.getElementById('tipo').value,
    Calidad: document.getElementById('calidad').value,
    Precio: document.getElementById('precio').value.toString(),
    IVA: document.getElementById('iva').value,
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/IngresarNuevoProducto',
    type: "POST",
    data: JSON.stringify(jsonData),
    contentType: "application/json"
  });

  req.done(function () {
    uploadTable();
    document.getElementById('formProducto').reset();
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function selectProveedor() {
  var lista = document.getElementById("listaProveedores");
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

function uploadTable() {

  var tablaProductos = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/ObtenerProductos',
    type: "GET",
    data: {},
    contentType: "application/json"
  });

  tablaProductos.done(function (res) {
    console.log(res);
    $('#tablaProductos').DataTable().clear().destroy();
    $('#tablaProductos').DataTable({
      data: res,
      columns: [{
          "data": "Descripcion"
        },
        {
          "data": "Marca"
        },
        {
          "data": "Tipo"
        },
        {
          "data": "Calidad"
        },
        {
          "data": "Precio"
        },
        {
          "data": "IVA"
        },
        {
          "data": "ProveedorId",
          render: function (data, type, row) {
            return `<a class="btn btn-sm btn-warning" href="#" id="${data}" >Modificar <i class="fa fa-edit" ></i></a>`;
          }
        }
      ]
    });
    document.getElementById('formProductos').reset();
  });

  tablaProductos.fail(function (err) {
    console.log("fail" + err);
  });
}