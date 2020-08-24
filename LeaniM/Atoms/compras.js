var submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  altaCompra();
})

function altaCompra() {
  var form = document.getElementById('formCompras');
  console.log(form);
  debugger;
  var jsonData = {
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