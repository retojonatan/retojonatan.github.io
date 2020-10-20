var formProveedor = document.getElementById('formProveedor');
var idEditable = 0;

formProveedor.addEventListener("submit", function (e) {
  altaProveedor();
  e.preventDefault();
});

$(window).on("load", function () {
  uploadTable();
  listarTipoProveedores();
});

function altaProveedor() {
  var jsonData = {
    Nombre: document.getElementById('proveedor').value,
    RazonSocial: document.getElementById('razonSocial').value,
    Cuit: document.getElementById('cuit').value.toString(),
    Direccion: document.getElementById('direccion').value,
    Localidad: document.getElementById('localidad').value,
    Telefono: document.getElementById('tel').value.toString(),
    TipoRubro: document.getElementById('tipo').value,
    Contacto: document.getElementById('contacto').value,
    CondicionFiscal: document.getElementById('condicionFiscal').value,
    IIBB: document.getElementById('iibb').value,
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/IngresarNuevoProveedor',
    type: "POST",
    data: JSON.stringify(jsonData),
    contentType: "application/json"
  });

  req.done(function () {
    uploadTable();
    document.getElementById('formProveedor').reset();
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function mostrarProveedor(idProveedor) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/ObtenerProveedor',
    type: "GET",
    data: {
      id: idProveedor
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
  document.getElementById('proveedorEdit').value = data.Nombre;
  document.getElementById('razonSocialEdit').value = data.RazonSocial;
  document.getElementById('cuitEdit').value = data.Cuit;
  document.getElementById('direccionEdit').value = data.Direccion;
  document.getElementById('localidadEdit').value = data.Localidad;
  document.getElementById('telEdit').value = data.Telefono;
  document.getElementById('tipoEdit').value = data.TipoRubro;
  document.getElementById('contactoEdit').value = data.Contacto;
  document.getElementById('condicionFiscalEdit').value = data.CondicionFiscal;
  document.getElementById('iibbEdit').value = data.IIBB;
  idEditable = data.ProveedorId;
}

function editarProveedor() {
  var jsonData = {
    ProveedorId: idEditable,
    Nombre: document.getElementById('proveedorEdit').value,
    RazonSocial: document.getElementById('razonSocialEdit').value,
    Cuit: document.getElementById('cuitEdit').value.toString(),
    Direccion: document.getElementById('direccionEdit').value,
    Localidad: document.getElementById('localidadEdit').value,
    Telefono: document.getElementById('telEdit').value.toString(),
    TipoRubro: document.getElementById('tipoEdit').value,
    Contacto: document.getElementById('contactoEdit').value,
    CondicionFiscal: document.getElementById('condicionFiscalEdit').value,
    IIBB: document.getElementById('iibbEdit').value,
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/EditarProveedor',
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

function preguntaBorrar(idProveedor, nombre) {
  document.getElementById('modalDel').innerHTML = `Se está eliminando el proveedor: <b>${nombre}</b>`;
  document.getElementById('idBorrar').value = idProveedor;
  $('#modalBorrar').modal('show');
  setTimeout(function () {
    document.getElementById('borrarBtn').removeAttribute('disabled');
    document.getElementById('borrarBtn').innerHTML = 'ELIMINAR';
  }, 4000);
}

function eliminarProveedor() {
  let id = document.getElementById('idBorrar').value;

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/EliminarProveedor?id=' + id,
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

function listarTipoProveedores() {
  var lista = document.getElementById("tipo");
  var listaEdit = document.getElementById("tipoEdit");
  var tabla = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionTiposRubro/ObtenerTipos',
    type: "GET",
    data: {},
    contentType: "application/json"
  });

  tabla.done(function (res) {
    res.forEach(element => {
      var tipoRubro = document.createElement('option');
      tipoRubro.appendChild(document.createTextNode(element.Nombre));
      tipoRubro.value = element.Nombre;
      lista.appendChild(tipoRubro);
    });
    res.forEach(element => {
      var tipoRubro = document.createElement('option');
      tipoRubro.appendChild(document.createTextNode(element.Nombre));
      tipoRubro.value = element.Nombre;
      listaEdit.appendChild(tipoRubro);
    });
  });

  tabla.fail(function (err) {
    console.log(err)
  });
}


function uploadTable() {

  var tabla = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/ObtenerProveedores',
    type: "GET",
    data: {},
    contentType: "application/json"
  });

  tabla.done(function (res) {
    $('#tablaProveedores').DataTable().clear().destroy();
    $('#tablaProveedores').DataTable({
      pageLength: 25,
      data: res,
      columns: [{
          "data": "Nombre"
        },
        {
          "data": "RazonSocial"
        },
        {
          "data": "Cuit"
        },
        {
          "data": "Telefono"
        },
        {
          "data": "Localidad"
        },
        {
          "data": "ProveedorId",
          "data": "Nombre",
          "data": function (data, type, row) {
            return `
            <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar(${data.ProveedorId}, '${data.Nombre}')">Borrar <i class="far fa-trash-alt" ></i></a>
            <a class="btn btn-sm btn-warning" href="#" onclick="mostrarProveedor(${data.ProveedorId})">Modificar <i class="fa fa-edit" ></i></a>`;
          }
        }
      ]
    });
  });

  tabla.fail(function (err) {
    console.log("fail" + err);
  });
}