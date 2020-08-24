var submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  altaProveedor();
});

$(window).on("load", function () {
  uploadTable();
});

function altaProveedor() {
  var jsonData = {
    RazonSocial: document.getElementById('razonSocial').value,
    Cuit: document.getElementById('cuit').value.toString(),
    Direccion: document.getElementById('direccion').value,
    Telefono: document.getElementById('tel').value.toString(),
    Rubro: document.getElementById('rubro').value,
    Contacto: document.getElementById('contacto').value,
    FechaAlta: '2020-07-20',
    Calidad: document.getElementById('calidad').value,
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
    console.log("OK");
    alert(JSON.stringify(jsonData));
    //refresh datatable
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function uploadTable() {


  $('#tablaProveedores').DataTable({
    ajax: {
      url: 'http://leanim.switchit.com.ar/OperacionProveedores/ObtenerProveedores',
      type: "GET",
      data: {},
      contentType: "json"
    },
    columns: [{
        "data": "Rubro"
      },
      {
        "data": "RazonSocial"
      },
      {
        "data": "Direccion"
      },
      {
        "data": "Cuit"
      }
    ]
  });
}