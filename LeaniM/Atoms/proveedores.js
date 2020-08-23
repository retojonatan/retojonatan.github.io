function altaProveedor() {
  var form = document.getElementById('formProveedor');
  var jsonData = {
    RazonSocial: "razon2",
    Cuit: 546546161,
    Direccion: "siempre viva",
    Telefono: 47844514,
    Rubro: "rubraso",
    Contacto: "Marcos",
    FechaAlta: "2020-08-01",
    Calidad: "super calidad"
  };

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProveedores/IngresarNuevoProveedor',
    type: 'POST',
    data: JSON.stringify(jsonData)
  });

  req.done(function () {
    console.log('OK');
  });

  req.fail(function () {
    console.log('FAIL');
  });
}