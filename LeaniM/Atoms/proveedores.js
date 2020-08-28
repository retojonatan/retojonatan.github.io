var formProveedor = document.getElementById('formProveedor');
var idEditable = 0;

formProveedor.addEventListener("submit", function (e) {
  altaProveedor();
  e.preventDefault();
});

$(window).on("load", function () {
  uploadTable();
});

function altaProveedor() {
  var jsonData = {
    Nombre: document.getElementById('proveedor').value,
    RazonSocial: document.getElementById('razonSocial').value,
    Cuit: document.getElementById('cuit').value.toString(),
    Direccion: document.getElementById('direccion').value,
    Telefono: document.getElementById('tel').value.toString(),
    Rubro: document.getElementById('rubro').value,
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
    console.log(res);
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
  document.getElementById('telEdit').value = data.Telefono;
  document.getElementById('rubroEdit').value = data.Rubro;
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
    Telefono: document.getElementById('telEdit').value.toString(),
    Rubro: document.getElementById('rubroEdit').value,
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
      data: res,
      columns: [{
          "data": "Nombre"
        },
        {
          "data": "Rubro"
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