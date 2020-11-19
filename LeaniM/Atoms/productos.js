var formProductos = document.getElementById('formProductos');
var listaProveedores = document.getElementById('listaProveedores');
var listaProveedoresEdit = document.getElementById('listaProveedoresEdit');
var valorRubroEdit = "";
var idEditable = 0;

formProductos.addEventListener("submit", function (e) {
  altaProducto();
  e.preventDefault();
});

listaProveedores.addEventListener("change", function (e) {
  listarRubros(e.target.value);
});

listaProveedoresEdit.addEventListener("change", function (e) {
  listarRubros(e.target.value);
});

$(window).on("load", function () {
  uploadTable();
  listarProveedores();
});

function altaProducto() {
  var jsonData = {
    ProveedorId: document.getElementById('listaProveedores').value,
    NombreProducto: document.getElementById('producto').value,
    Marca: document.getElementById('marca').value,
    Rubro: document.getElementById('rubro').value,
    // Calidad: document.getElementById('calidad').value,
    Precio: document.getElementById('precio').value.toString(),
    IVA: parseFloat(document.getElementById('iva').value),
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/IngresarNuevoProducto',
    type: "POST",
    data: JSON.stringify(jsonData),
    contentType: "application/json"
  });

  req.done(function () {
    uploadTable();
    document.getElementById('formProductos').reset();
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

function mostrarProducto(idProducto) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/ObtenerProducto',
    type: "GET",
    data: {
      id: idProducto
    },
    contentType: "application/json"
  });

  req.done(function (res) {
    completarModal(res);
    $('#modalEdit').modal('show');
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function completarModal(data) {
  listarRubros(data.ProveedorId);
  document.getElementById('listaProveedoresEdit').value = data.ProveedorId;
  document.getElementById('productoEdit').value = data.NombreProducto;
  document.getElementById('marcaEdit').value = data.Marca;
  document.getElementById('precioEdit').value = data.Precio;
  document.getElementById('ivaEdit').value = data.IVA;
  // document.getElementById('calidadEdit').value = data.Calidad;
  valorRubroEdit = data.Rubro;
  idEditable = data.ProductoId;
}

function limpiarRubro(lista) {
  if (lista.length > 0) {
    while (lista.length > 1)
      lista.remove(lista.length - 1)
  }
}

function editarProducto() {
  var jsonData = {
    ProductoId: idEditable,
    ProveedorId: document.getElementById('listaProveedoresEdit').value,
    NombreProducto: document.getElementById('productoEdit').value,
    Marca: document.getElementById('marcaEdit').value.toString(),
    Precio: document.getElementById('precioEdit').value,
    IVA: document.getElementById('ivaEdit').value.toString(),
    Rubro: document.getElementById('rubroEdit').value,
    // Calidad: document.getElementById('calidadEdit').value,
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/EditarProducto',
    type: "POST",
    data: JSON.stringify(jsonData),
    contentType: "application/json"
  });

  req.done(function () {
    uploadTable();
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function listarRubros(idProveedor) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/ObtenerProveedor',
    type: "GET",
    data: {
      id: idProveedor
    },
    contentType: "application/json"
  });

  req.done(function (res) {
    filtrarRubros(res.TipoRubro);
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function filtrarRubros(proveedor) {
  var lista = document.getElementById("rubro");
  var listaEdit = document.getElementById("rubroEdit");
  var tabla = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionRubros/ObtenerRubros',
    type: "GET",
    data: {
      nombreTipoRubro: proveedor
    },
    contentType: "application/json"
  });

  tabla.done(function (res) {
    limpiarRubro(lista);
    res.forEach(element => {
      var rubro = document.createElement('option');
      rubro.appendChild(document.createTextNode(element.Nombre));
      rubro.value = element.Nombre;
      lista.appendChild(rubro);
    });
    limpiarRubro(listaEdit);
    res.forEach(element => {
      var rubro = document.createElement('option');
      rubro.appendChild(document.createTextNode(element.Nombre));
      rubro.value = element.Nombre;
      listaEdit.appendChild(rubro);
    });
    listaEdit.value = valorRubroEdit;
  });

  tabla.fail(function (err) {
    console.log(err)
  });
}

function preguntaBorrar(idProducto, nombre) {
  document.getElementById('modalDel').innerHTML = `Se está eliminando el producto: <b>${nombre}</b>`;
  document.getElementById('idBorrar').value = idProducto;
  $('#modalBorrar').modal('show');
  setTimeout(function () {
    document.getElementById('borrarBtn').removeAttribute('disabled');
    document.getElementById('borrarBtn').innerHTML = 'ELIMINAR';
  }, 4000);
}

function eliminarProducto() {
  let id = document.getElementById('idBorrar').value;
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/EliminarProducto?id=' + id,
    type: "POST",
  });

  req.done(function () {
    uploadTable();
    document.getElementById('idBorrar').value = '';
    document.getElementById('borrarBtn').setAttribute('disabled', 'disabled');
  });

  req.fail(function (err) {
    console.log(err);
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
    $('#tablaProductos').DataTable().clear().destroy();
    $('#tablaProductos').DataTable({
      pageLength: 25,
      data: res,
      columns: [{
          "data": "NombreProducto"
        },
        {
          "data": "Marca"
        },
        {
          "data": "Rubro"
        },
        {
          "data": "Precio",
          render: function (data, type, row) {
            return '$ ' + data;
          }
        },
        {
          "data": "IVA",
          render: function (data, type, row) {
            return data + '%';
          }
        },
        {
          "data": "ProductoId",
          "data": "NombreProducto",
          "data": function (data, type, row) {
            return `<a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar(${data.ProductoId}, '${data.NombreProducto}')">Borrar <i class="far fa-trash-alt" ></i></a>
            <a class="btn btn-sm btn-warning" href="#" onclick="mostrarProducto(${data.ProductoId})">Modificar <i class="fa fa-edit" ></i></a>`;
          }
        }
      ]
    });
    document.getElementById('formProductos').reset();
  });

  tablaProductos.fail(function (err) {
    console.log(err);
  });
}