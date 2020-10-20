var idEditable,
  debe,
  haber,
  cantidadVentas;

$(window).on("load", function () {
  uploadTable();
  document.getElementById('formClientes').addEventListener('submit', function (e) {
    registrarCliente();
    e.preventDefault();
  });
});

function registrarCliente() {
  var jsonData = {
    Nombre: document.getElementById('nombre').value,
    Alias: document.getElementById('alias').value,
    Telefono: document.getElementById('tel').value,
    Direccion: document.getElementById('dir').value,
    Localidad: document.getElementById('localidad').value,
    Debe: 0,
    Haber: 0,
    CantidadVentas: 0,
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionClientes/IngresarNuevoCliente',
    type: "POST",
    data: JSON.stringify(jsonData),
    contentType: "application/json"
  });

  req.done(function () {
    uploadTable();
    document.getElementById('formClientes').reset();
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function mostrarCliente(clienteId) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionClientes/ObtenerCliente',
    type: "GET",
    data: {
      id: clienteId
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
  document.getElementById('nombreEdit').value = data.Nombre;
  document.getElementById('aliasEdit').value = data.Alias;
  document.getElementById('telEdit').value = data.Telefono;
  document.getElementById('dirEdit').value = data.Direccion;
  document.getElementById('localidadEdit').value = data.Localidad;
  idEditable = data.ClienteId;
  debe = data.Debe;
  haber = data.Haber;
  cantidadVentas = data.CantidadVentas;
}

function editarCliente() {
  var jsonData = {
    ClienteId: idEditable,
    Debe: debe,
    Haber: haber,
    CantidadVentas: cantidadVentas,
    Nombre: document.getElementById('nombreEdit').value,
    Alias: document.getElementById('aliasEdit').value,
    Telefono: document.getElementById('telEdit').value,
    Direccion: document.getElementById('dirEdit').value,
    Localidad: document.getElementById('localidadEdit').value,
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionClientes/EditarCliente',
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

function preguntaBorrar(idCliente, nombre) {
  document.getElementById('modalDel').innerHTML = `Se está eliminando el cliente: <b>${nombre}</b>`;
  document.getElementById('idBorrar').value = idCliente;
  $('#modalBorrar').modal('show');
  setTimeout(function () {
    document.getElementById('borrarBtn').removeAttribute('disabled');
    document.getElementById('borrarBtn').innerHTML = 'ELIMINAR';
  }, 4000);
}

function eliminarCliente() {
  let id = document.getElementById('idBorrar').value;

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionClientes/EliminarCliente?id=' + id,
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

  var tablaClientes = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionClientes/ObtenerClientes',
    type: "GET",
    data: {},
    contentType: "application/json"
  });

  tablaClientes.done(function (res) {
    $('#tablaClientes').DataTable().clear().destroy();
    $('#tablaClientes').DataTable({
      pageLength: 25,
      data: res,
      columns: [{
          "data": "Nombre"
        },
        {
          "data": "Alias"
        },
        {
          "data": "Telefono"
        },
        {
          "data": "Localidad"
        },
        {
          "data": "ClienteId",
          "data": "Nombre",
          "data": function (data, type, row) {
            return `<a href="./PanelClientes" class="btn btn-sm btn-info">Acceder <i class="fa fa-user-cog"></i></a>
            <a class="btn btn-sm btn-warning" href="#" onclick="mostrarCliente(${data.ClienteId})">Editar <i class="fa fa-edit" ></i></a>
            <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar(${data.ClienteId}, '${data.Nombre}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
          }
        }
      ]
    });
    document.getElementById('formClientes').reset();
  });

  tablaClientes.fail(function (err) {
    console.log(err);
  });
}