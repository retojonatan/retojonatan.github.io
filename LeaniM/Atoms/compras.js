var formCompras = document.getElementById('formCompras');
var listaProveedores = document.getElementById('listaProveedores');
var listaProductos = document.getElementById('listaProductos');
var filaProducto = document.getElementById('filaProducto');
var comprobante = document.getElementById('comprobante');
var iva = document.getElementById('iva');
var ivaPesos = document.getElementById('ivaPesos');
var ivaTotal = document.getElementById('ivaTotal');
var montoTotal = document.getElementById('montoTotal');
var idEditable = 0;
var count = 1;
// fecha de facturacion maxima
var hoy = new Date();
var dd = hoy.getDate();
var mm = hoy.getMonth() + 1; //January is 0!
var yyyy = hoy.getFullYear();
if (dd < 10) {
  dd = '0' + dd
}
if (mm < 10) {
  mm = '0' + mm
}
hoy = yyyy + '-' + mm + '-' + dd;
document.getElementById("fechaFc").setAttribute("max", hoy);

// Handler de vista para agregar productos
function addProduct() {
  document.getElementById('listaProveedores').setAttribute('disabled', 'disabled');
  document.getElementById('comprobante').setAttribute('disabled', 'disabled');
  var clon = filaProducto.firstElementChild.cloneNode(true);
  clon.id = "columnaProducto" + count;
  for (var i = 0; i < clon.getElementsByTagName('select').length; i++) {
    clon.getElementsByTagName('select')[i].id = filaProducto.getElementsByTagName('select')[i].id + count;
    clon.getElementsByTagName('select')[i].value = "";
    // lista de productos clonada
    clon.getElementsByTagName('select')[0].addEventListener('change', function (e) {
      var opcionElegida = e.target.options.selectedIndex;
      var productoId = e.srcElement[opcionElegida].id;
      presentarDatosProducto(productoId);
    });
    clon.getElementsByTagName('select')[0].removeAttribute('disabled');
    // inicializar guardar precio en 'No'
    clon.getElementsByTagName('select')[1].value = "No";
    // iva clonado
    clon.getElementsByTagName('select')[2].value = filaProducto.firstElementChild.getElementsByTagName('select')[2].value;
    clon.getElementsByTagName('select')[2].addEventListener('change', function (e) {
      calcularIva();
      calcularSubtotal();
    });
  }
  for (var i = 0; i < clon.getElementsByTagName('input').length; i++) {
    clon.getElementsByTagName('input')[i].id = filaProducto.getElementsByTagName('input')[i].id + count;
    clon.getElementsByTagName('input')[i].value = 0;
  }
  var precio = "precio" + count;
  var cantidad = "cantidad" + count;
  filaProducto.appendChild(clon);
  document.getElementById(precio.toString()).addEventListener('change', function () {
    calcularIva()
    calcularSubtotal();
  });
  document.getElementById(cantidad.toString()).addEventListener('change', function () {
    calcularSubtotal();
  });
  document.getElementById(cantidad.toString()).value = 1;
  count++;
  document.getElementById('listaProductos').setAttribute('disabled', 'disabled');
  for (let i = 1; i < count - 1; i++) {
    document.getElementById('listaProductos' + i).setAttribute('disabled', 'disabled');
  }
  document.getElementById('borrarProducto').style.display = "inline-block";
}

// Handler de vista para borrar productos
function deleteProduct() {
  if (filaProducto.lastChild != filaProducto.firstElementChild) {
    filaProducto.lastChild.remove();
    count--;
    esconderDelete();
    calcularIva();
    if (count != 1) {
      document.getElementById('listaProductos' + (count - 1)).removeAttribute('disabled');
    }
  }
}

// Handler cuando tenes un solo producto
function esconderDelete() {
  if (count == 1) {
    document.getElementById('borrarProducto').style.display = "none";
    document.getElementById('comprobante').removeAttribute("disabled");
    document.getElementById('listaProveedores').removeAttribute("disabled");
    document.getElementById('listaProductos').removeAttribute('disabled');
  }
}

function calcularIva() {
  for (let i = 0; i < count; i++) {
    var porcentaje = parseFloat(document.getElementById('iva').value / 100);
    document.getElementById('ivaPesos').value = (document.getElementById('precio').value * porcentaje).toFixed(2);
    if (document.getElementById('comprobante').value == "Fc A") {
      document.getElementById('precioBruto').value = parseFloat(parseFloat(document.getElementById('precio').value) + parseFloat(document.getElementById('ivaPesos').value)).toFixed(2);
    } else {
      document.getElementById('precioBruto').value = document.getElementById('precio').value;
    }
    if (i != 0) {
      porcentaje = document.getElementById('iva' + i).value / 100;
      document.getElementById('ivaPesos' + i).value = (document.getElementById('precio' + i).value * porcentaje).toFixed(2);
      if (document.getElementById('comprobante').value == "Fc A") {
        document.getElementById('precioBruto' + i).value = parseFloat(parseFloat(document.getElementById('precio' + i).value) + parseFloat(document.getElementById('ivaPesos' + i).value)).toFixed(2);

      } else {
        document.getElementById('precioBruto' + i).value = document.getElementById('precio' + i).value;
      }
    }
    calcularIvaTotal();
  }
}

function calcularSubtotal() {
  for (let i = 0; i < count; i++) {
    if (i == 0) {
      document.getElementById('subtotal').value = parseFloat(parseFloat(document.getElementById('precioBruto').value) * parseFloat(document.getElementById('cantidad').value)).toFixed(2);
    } else {
      var precioBruto = document.getElementById('precioBruto' + i);
      var cantidad = document.getElementById('cantidad' + i);
      document.getElementById('subtotal' + i).value = parseFloat(parseFloat(precioBruto.value) * parseFloat(cantidad.value)).toFixed(2);
    }
  }
  calcularIvaTotal();
}

function calcularIvaTotal() {
  for (let i = 0; i < count; i++) {
    if (i == 0) {
      document.getElementById('ivaTotal').value = parseFloat(parseFloat(document.getElementById('ivaPesos').value) * parseFloat(document.getElementById('cantidad').value)).toFixed(2);
    } else {
      ivaProducto = parseFloat(parseFloat(document.getElementById('ivaPesos' + i).value) * parseFloat(document.getElementById('cantidad' + i).value)).toFixed(2);
      document.getElementById('ivaTotal').value = parseFloat(parseFloat(ivaProducto) + parseFloat(document.getElementById('ivaTotal').value)).toFixed(2);
    }
  }
  calcularMontoTotal();
}

function calcularMontoTotal() {
  for (let i = 0; i < count; i++) {
    if (i == 0) document.getElementById('montoTotal').value = parseFloat(parseFloat(document.getElementById('precioBruto').value) * parseFloat(document.getElementById('cantidad').value)).toFixed(2);
    else {
      totales = parseFloat(parseFloat(document.getElementById('precioBruto' + i).value) * parseFloat(document.getElementById('cantidad' + i).value)).toFixed(2);
      document.getElementById('montoTotal').value = parseFloat(parseFloat(document.getElementById('montoTotal').value) + parseFloat(totales)).toFixed(2);
    }
  }
}

comprobante.addEventListener('change', function (e) {
  // limpia la lista de opciones anteriores de iva
  while (iva.childElementCount != 0) {
    iva.lastElementChild.remove();
  }
  // manejos de la eleccion de comprobantes
  switch (e.target.value) {
    case 'Fc A':
      var opcion = document.createElement('option');
      opcion.appendChild(document.createTextNode('10.5%'));
      opcion.value = 10.5;
      iva.appendChild(opcion);
      var opcion2 = document.createElement('option');
      opcion2.appendChild(document.createTextNode('21%'));
      opcion2.value = 21;
      opcion2.setAttribute('selected', 'selected');
      iva.appendChild(opcion2);
      var opcion3 = document.createElement('option');
      opcion3.appendChild(document.createTextNode('27%'));
      opcion3.value = 27;
      iva.appendChild(opcion3);
      var opcion4 = document.createElement('option');
      opcion4.appendChild(document.createTextNode('30%'));
      opcion4.value = 30;
      iva.appendChild(opcion4);
      var opcion5 = document.createElement('option');
      opcion5.appendChild(document.createTextNode('0%'));
      opcion5.value = 0;
      iva.appendChild(opcion5);
      calcularIva();
      break;
      // case 'Fc B':
      //   var opcion = document.createElement('option');
      //   opcion.appendChild(document.createTextNode('21%'));
      //   opcion.value = 21;
      //   opcion.setAttribute('selected', 'selected');
      //   iva.appendChild(opcion);
      //   calcularIva();
      //   break;
      // case 'Fc C':
      //   var opcion = document.createElement('option');
      //   opcion.appendChild(document.createTextNode('21%'));
      //   opcion.value = 21;
      //   opcion.setAttribute('selected', 'selected');
      //   iva.appendChild(opcion);
      //   calcularIva();
      //   break;
      // case 'Ticket':
      //   var opcion = document.createElement('option');
      //   opcion.appendChild(document.createTextNode('21%'));
      //   opcion.value = 21;
      //   opcion.setAttribute('selected', 'selected');
      //   iva.appendChild(opcion);
      //   calcularIva();
      //   break;
      // case 'S/C':
      //   var opcion = document.createElement('option');
      //   opcion.appendChild(document.createTextNode('0%'));
      //   opcion.value = 0;
      //   opcion.setAttribute('selected', 'selected');
      //   iva.appendChild(opcion);
      //   calcularIva();
      //   break;
    default:
      var opcion = document.createElement('option');
      opcion.appendChild(document.createTextNode('0%'));
      opcion.value = 0;
      opcion.setAttribute('selected', 'selected');
      iva.appendChild(opcion);
      calcularIva();
      break;
  }
  calcularSubtotal();
})

// handler para vaciar los campos de los productos
function limpiarFilasProductos(lista) {
  for (var i = 0; i < lista.getElementsByTagName('input').length; i++) {
    lista.getElementsByTagName('input')[i].value = 0;
  }
  for (var j = 0; j < document.getElementsByName('cantidad').length; j++) {
    document.getElementsByName('cantidad')[j].value = "1";
  }
  while (lista.childElementCount != 1) {
    if (lista.firstElementChild != lista.lastElementChild)
      lista.lastElementChild.remove();
  }
}

// setup de ejecucion inicial con handlers y eventlisteners
$(window).on("load", function () {
  uploadTable();
  listarProveedores();
  document.getElementById('precio').addEventListener('change', function () {
    calcularIva();
    calcularSubtotal();
  });
  formCompras.addEventListener("submit", function (e) {
    altaCompra();
    e.preventDefault();
  });

  listaProveedores.addEventListener('change', function (e) {
    presentarDatosProveedor(e.target.value);
    listarProductos(listaProductos, e.target.value);
    limpiarFilasProductos(filaProducto);
  })

  listaProductos.addEventListener('change', function (e) {
    var opcionElegida = e.target.options.selectedIndex;
    var productoId = e.srcElement[opcionElegida].id;
    presentarDatosProducto(productoId);
  })

  document.getElementById('iva').addEventListener('change', function () {
    calcularIva();
    calcularSubtotal();
  })

  document.getElementById('cantidad').addEventListener('change', function () {
    calcularSubtotal();
    calcularMontoTotal();
  })
});

// Funcion que los datos del proveedor seleccionado
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
    document.getElementById('cuit').value = res.Cuit;
    document.getElementById('proveedorId').value = res.ProveedorId;
  });

  req.fail(function (err) {
    console.log(err);
  });
}

// Funcion que los datos del producto seleccionado
function presentarDatosProducto(idProducto) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/ObtenerProducto',
    type: "GET",
    data: {
      Id: idProducto
    },
    contentType: "application/json"
  });

  req.done(function (res) {
    // caso que sea seleccionado el primer producto
    if (count == 1) {
      document.getElementById('marca').value = res.Marca;
      document.getElementById('precio').value = res.Precio;
      document.getElementById('iva').value = res.IVA;
      document.getElementById('precio').addEventListener('change', function () {
        calcularIva();
        calcularSubtotal();
      });
    }
    // caso que se seleccione mas de un producto
    else {
      var productoCount = count - 1;
      document.getElementById('marca' + productoCount).value = res.Marca;
      document.getElementById('precio' + productoCount).value = res.Precio;
      document.getElementById('iva' + productoCount).value = res.IVA;
      document.getElementById('precio' + productoCount).addEventListener('change', function () {
        calcularIva();
        calcularSubtotal();
      });
    }
    calcularIva();
    calcularSubtotal();
  });

  req.fail(function (err) {
    console.log(err);
  });
}

// Creacion de compras en base
function altaCompra() {
  var listaP = document.getElementById('listaProveedores');
  var nombreP = listaP.options[listaP.selectedIndex].getAttribute('data-nombre');
  var jsonProductos = [{
    Marca: document.getElementById('marca').value,
    Precio: document.getElementById('precio').value,
    Cantidad: document.getElementById('cantidad').value,
    Subtotal: document.getElementById('subtotal').value,
    PorcentajeIVA: document.getElementById('iva').value,
    MontoIVA: document.getElementById('ivaPesos').value,
    PrecioBruto: document.getElementById('precioBruto').value,
  }]
  // Handler para el caso que haya mas de un producto
  for (let i = 1; i < count; i++) {
    var producto = {
      Marca: document.getElementById('marca' + i).value,
      Precio: document.getElementById('precio' + i).value,
      Cantidad: document.getElementById('cantidad' + i).value,
      Subtotal: document.getElementById('subtotal' + i).value,
      PorcentajeIVA: document.getElementById('iva' + i).value,
      MontoIVA: document.getElementById('ivaPesos' + i).value,
      PrecioBruto: document.getElementById('precioBruto' + i).value,
    }
    jsonProductos.push(producto);
  }
  // json con la compra con productos
  var jsonData = {
    Proveedor: nombreP,
    RazonSocial: document.getElementById('razonSocial').value,
    CondicionFiscal: document.getElementById('condicion').value,
    TipoProveedor: document.getElementById('tipo').value,
    NumeroFactura: document.getElementById('numFc').value,
    FechaFactura: document.getElementById('fechaFc').value,
    MontoTotal: document.getElementById('montoTotal').value,
    MontoTotalIVA: document.getElementById('ivaTotal').value,
    ProveedorId: document.getElementById('proveedorId').value,
    Cuit: document.getElementById('cuit').value,
    TipoComprobante: document.getElementById('comprobante').value,
    Observaciones: document.getElementById('observaciones').value,
    ListaProductosComprados: jsonProductos
  }

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionCompras/IngresarNuevaCompra',
    type: "POST",
    async: false,
    data: JSON.stringify(jsonData),
    contentType: "application/json"
  });

  req.done(function () {
    anotarPrecio(document.getElementById('listaProductos')[document.getElementById('listaProductos').selectedIndex].id, parseFloat(jsonProductos[0].Precio));
    if (document.getElementById('guardarPrecio').value == "Si") {
      obtenerProducto(document.getElementById('listaProductos')[document.getElementById('listaProductos').selectedIndex].id, document.getElementById('precio').value);
    }
    for (let i = 1; i < count; i++) {
      anotarPrecio(document.getElementById('listaProductos' + i)[document.getElementById('listaProductos' + i).selectedIndex].id, parseFloat(jsonProductos[i].Precio));
      if (document.getElementById('guardarPrecio' + i).value == "Si") {
        obtenerProducto(document.getElementById('listaProductos' + i)[document.getElementById('listaProductos' + i).selectedIndex].id, parseFloat(document.getElementById('precio' + i).value));
      }
    }
    uploadTable();
    document.getElementById('formCompras').reset();
    while (count != 1) {
      deleteProduct();
    }
  });

  req.fail(function (err) {
    console.log(err);
  });
}

function preguntaBorrar(id, nombre, monto) {
  document.getElementById('modalDel').innerHTML = `Se está eliminando la compra al proveedor: <b>${nombre}</b> por <b>$ ${monto}</b>`;
  document.getElementById('idBorrar').value = id;
  $('#modalBorrar').modal('show');
  setTimeout(function () {
    document.getElementById('borrarBtn').removeAttribute('disabled');
    document.getElementById('borrarBtn').innerHTML = 'ELIMINAR';
  }, 4000);
}

function eliminarCompra() {
  let id = document.getElementById('idBorrar').value;

  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionCompras/EliminarCompra?id=' + id,
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

function obtenerProducto(idProducto, precio) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/ObtenerProducto',
    type: "GET",
    async: false,
    data: {
      Id: idProducto
    },
    contentType: "application/json"
  });

  req.done(function (res) {
    res.Precio = precio;
    editarProducto(res);
  });

  req.fail(function (err) {
    console.log(err);
  });
}

// Funcion para presentar la lista de proveedores
function listarProveedores() {
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
      proveedor.dataset.nombre = element.Nombre;
      lista.appendChild(proveedor);
    });
  });

  tabla.fail(function (err) {
    console.log(err)
  });
}

function anotarPrecio(productoId, precio) {
  var cambioPrecio = {
    ProductoId: productoId,
    PrecioNuevo: precio,
  }
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionPrecios/IngresarNuevoPrecio',
    type: "POST",
    data: JSON.stringify(cambioPrecio),
    contentType: 'application/json'
  });

  req.done(function () {
    calcularIva()
    calcularSubtotal()
  });

  req.fail(function (err) {
    console.log(err);
  });
}

// Handler para cuando se cambia de proveedor, limpia la lista de productos
function limpiarListaProductos(lista) {
  $(lista).empty();
  var option = document.createElement('option');
  option.setAttribute('selected', 'selected');
  option.setAttribute('hidden', 'hidden');
  option.setAttribute('disabled', 'disabled');
  lista.appendChild(option)
}

// Funcion para presentar la lista de productos
function listarProductos(lista, idProveedor) {
  var tabla = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/ObtenerProductosPorProveedor',
    type: "GET",
    data: {
      idProveedor: idProveedor
    },
    contentType: "application/json"
  });

  tabla.done(function (res) {
    limpiarListaProductos(lista);
    res.forEach(element => {
      var producto = document.createElement('option');
      producto.appendChild(document.createTextNode(element.NombreProducto));
      producto.value = element.NombreProducto;
      producto.id = element.ProductoId;
      lista.appendChild(producto);
    });
  });

  tabla.fail(function (err) {
    console.log(err)
  });
}

// en compras es utilizado para actualizar los cambios de precio de lista
function editarProducto(jsonData) {
  var req = $.ajax({
    url: 'http://leanim.switchit.com.ar/OperacionProductos/EditarProducto',
    type: "POST",
    async: false,
    data: JSON.stringify(jsonData),
    contentType: "application/json"
  });

  req.done(function () {
    console.log("editado");
  });

  req.fail(function (err) {
    console.log(err);
  });
}

// carga de la tabla de compras
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
      pageLength: 25,
      data: res,
      columns: [{
          "data": "FechaFactura",
          render: function (data, type, row) {
            if (data === null) return '-';
            var tdat = data.split('T');
            var fecha = tdat[0].split('-');
            return fecha[2] + '-' + fecha[1] + '-' + fecha[0];
          }
        },
        {
          "data": "CompraId"
        },
        {
          "data": "Proveedor"
        },
        {
          "data": "Cuit"
        },
        {
          "data": "NumeroFactura",
          render: function (data, type, row) {
            return 'Nº ' + data;
          }
        },
        {
          "data": "MontoTotal",
          render: function (data, type, row) {
            return '$ ' + data;
          }
        },
        {
          "data": "CompraId",
          "data": "Proveedor",
          "data": "MontoTotal",
          "data": function (data, type, row) {
            return `
            <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar(${data.CompraId},'${data.Proveedor}','${data.MontoTotal}')">Borrar <i class="far fa-trash-alt"></i></a>
            <a class="btn btn-sm btn-warning" hidden href="#" onclick="mostrarCompra(${data.CompraId})">Modificar <i class="fa fa-edit"></i></a>`;
          }
        }
      ]
    });
  });

  tabla.fail(function (err) {
    console.log(err);
  });
}