const formProductos = document.getElementById('formProductos');
const listaProveedores = document.getElementById('listaProveedores');
const listaProveedoresEdit = document.getElementById('listaProveedoresEdit');
const listaRubro = document.getElementById("rubro");
const listaRubroEdit = document.getElementById("rubroEdit");
let valorRubroEdit = "";
let idEditable = 0;

formProductos.addEventListener("submit", function (e) {
  altaProducto();
  e.preventDefault();
})

listaProveedores.addEventListener("change", function (e) {
  buscarRubros(e.target.value);
})

listaProveedoresEdit.addEventListener("change", function (e) {
  buscarRubros(e.target.value);
})

$(window).on("load", function () {
  uploadTable();
  listarProveedores(listaProveedores);
  listarProveedores(listaProveedoresEdit);
})

async function altaProducto() {
  let jsonProducto = {
    Proveedor: listaProveedores.selectedOptions[0].innerHTML,
    TipoRubro: document.getElementById('listaProveedores').value,
    Nombre: document.getElementById('producto').value,
    Marca: document.getElementById('marca').value,
    Rubro: document.getElementById('rubro').value,
    Precio: parseFloat(document.getElementById('precio').value),
    IVA: parseFloat(document.getElementById('iva').value),
  }

  await db.collection('productos').doc().set(jsonProducto)
    .then(() => {
      uploadTable();
      formProductos.reset();
    })
    .catch(err => {
      console.error(err);
    })
}

async function listarProveedores(lista) {
  await db.collection('proveedores').get()
    .then(docs => {
      docs.forEach(querysnapshot => {
        let doc = querysnapshot.data()
        let proveedor = document.createElement('option');
        proveedor.appendChild(document.createTextNode(doc.Nombre));
        proveedor.value = doc.TipoRubro;
        lista.appendChild(proveedor);
      })
    })
    .catch(err => {
      console.error(err);
    })
}

function mostrarProducto(id) {
  db.collection('productos').doc(id).get()
    .then(doc => {
      completarModal(doc.data(), id)
      $('#modalEdit').modal('show');
    })
    .catch(err => {
      console.error(err)
    })
}

function completarModal(data, id) {
  buscarRubros(data.TipoRubro);
  document.getElementById('listaProveedoresEdit').value = data.TipoRubro;
  document.getElementById('productoEdit').value = data.Nombre;
  document.getElementById('marcaEdit').value = data.Marca;
  document.getElementById('precioEdit').value = data.Precio;
  document.getElementById('ivaEdit').value = data.IVA;
  valorRubroEdit = data.Rubro;
  idEditable = id;
}

function limpiarRubro(lista) {
  if (lista.length > 0) {
    while (lista.length > 1)
      lista.remove(lista.length - 1)
  }
}

async function editarProducto() {
  var jsonEditado = {
    Proveedor: listaProveedoresEdit.selectedOptions[0].innerHTML,
    TipoRubro: document.getElementById('listaProveedoresEdit').value,
    Nombre: document.getElementById('productoEdit').value,
    Marca: document.getElementById('marcaEdit').value,
    Precio: parseFloat(document.getElementById('precioEdit').value),
    IVA: parseFloat(document.getElementById('ivaEdit').value),
    Rubro: document.getElementById('rubroEdit').value,
  };

  await db.collection('productos').doc(idEditable).update(jsonEditado)
    .then(() => {
      uploadTable()
    })
    .catch(err => {
      console.error(err)
    })
}

async function buscarRubros(tipoProveedor) {
  let rubros = []
  await db.collection('rubros').where('Tipo', "==", tipoProveedor)
    .get()
    .then(querysnapshot => {
      querysnapshot.forEach(doc => {
        rubros.push(doc.data())
      })
    })
    .then(() => {
      filtrarRubros(rubros)
    })
    .catch(err => {
      console.error(err);
    })
}

function filtrarRubros(rubros) {
  limpiarRubro(listaRubro);
  rubros.forEach(rubro => {
    let opcionRubro = document.createElement('option');
    opcionRubro.appendChild(document.createTextNode(rubro.Nombre));
    opcionRubro.value = rubro.Nombre;
    listaRubro.appendChild(opcionRubro);
  });
  limpiarRubro(listaRubroEdit);
  rubros.forEach(rubro => {
    let opcionRubro = document.createElement('option');
    opcionRubro.appendChild(document.createTextNode(rubro.Nombre));
    opcionRubro.value = rubro.Nombre;
    listaRubroEdit.appendChild(opcionRubro);
  });
  listaRubroEdit.value = valorRubroEdit;
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

async function eliminarProducto() {
  let id = document.getElementById('idBorrar').value;
  await db.collection('productos').doc(id).delete()
    .then(() => {
      uploadTable();
      id.value = ''
      document.getElementById('borrarBtn').setAttribute('disabled', 'disabled')
    })
    .catch(err => {
      console.error(err);
    })
}


function uploadTable() {
  let datos = []
  db.collection('productos').get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        const producto = doc.data()
        producto.ProductoId = doc.id
        datos.push(producto)
      })
    })
    .then(() => {
      $('#tablaProductos').DataTable().clear().destroy();
      $('#tablaProductos').DataTable({
        pageLength: 25,
        data: datos,
        columns: [{
            "data": "Nombre"
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
            "data": "Nombre",
            "data": function (data, type, row) {
              return `<a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data.ProductoId}', '${data.Nombre}')">Borrar <i class="far fa-trash-alt" ></i></a>
            <a class="btn btn-sm btn-warning" href="#" onclick="mostrarProducto('${data.ProductoId}')">Modificar <i class="fa fa-edit" ></i></a>`;
            }
          }
        ]
      })
    })
    .catch(error => {
      console.error(error)
    })
}