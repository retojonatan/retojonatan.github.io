var idEditable;
var estado;
var fechaAlta;

$(window).on("load", function () {
  uploadTable();
  document.getElementById('formUsuario').addEventListener('submit', function (e) {
    registrarUsuario();
    e.preventDefault();
  });

});

function modificarUsuario(userId) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionUsuarios/ObtenerUsuario',
    type: "GET",
    data: {
      id: userId
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

function editarUsuario() {
  var jsonData = {
    UsuarioId: idEditable,
    Estado: estado,
    FechaAlta: fechaAlta,
    Nombre: document.getElementById('nombreEdit').value,
    Apellido: document.getElementById('apellidoEdit').value,
    Username: document.getElementById('userEdit').value,
    Password: document.getElementById('passwordEdit').value,
    Rol: document.getElementById('rolEdit').value,
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionUsuarios/EditarUsuario',
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

function completarModal(data) {
  document.getElementById('nombreEdit').value = data.Nombre;
  document.getElementById('apellidoEdit').value = data.Apellido;
  document.getElementById('userEdit').value = data.Username;
  document.getElementById('passwordEdit').value = data.Password;
  document.getElementById('rolEdit').value = data.Rol;
  idEditable = data.UsuarioId;
  estado = data.Estado;
  fechaAlta = data.FechaAlta;
}

function registrarUsuario() {
  var jsonData = {
    Nombre: document.getElementById('nombre').value,
    Apellido: document.getElementById('apellido').value,
    Username: document.getElementById('user').value,
    Password: document.getElementById('password').value,
    Rol: document.getElementById('rol').value,
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionUsuarios/IngresarUsuarioNuevo',
    type: "POST",
    data: JSON.stringify(jsonData),
    contentType: "application/json"
  });

  req.done(function () {
    uploadTable();
    document.getElementById('formUsuario').reset();
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function uploadTable() {
  var tabla = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionUsuarios/ObtenerUsuarios',
    type: "GET",
    data: {},
    contentType: "application/json"
  });

  tabla.done(function (res) {
    $('#tablaUsuarios').DataTable().clear().destroy();
    $('#tablaUsuarios').DataTable({
      data: res,
      columns: [{
          "data": "UsuarioId"
        },
        {
          "data": "Username"
        },
        {
          "data": "Rol"
        },
        {
          "data": "FechaAlta",
          render: function (data, type, row) {
            if (data === null) return '-';
            var tdat = data.split('T');
            var fecha = tdat[0].split('-');
            return fecha[2] + '-' + fecha[1] + '-' + fecha[0];
          }
        },
        {
          "data": "UsuarioId",
          render: function (data, type, row) {
            return `<a class="btn btn-sm btn-warning" href="#" onclick="modificarUsuario(${data})">Modificar <i class="fa fa-edit"></i></a>`;
          }
        }
      ]
    });
  });

  tabla.fail(function (err) {
    console.log("fail" + err);
  });
}