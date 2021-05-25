const formProveedor = document.getElementById('formProveedor');
const lista = document.getElementById("tipo");
const listaEdit = document.getElementById("tipoEdit");
let idEditable = 0;

formProveedor.addEventListener("submit", function (e) {
  altaProveedor();
  e.preventDefault();
});

$(window).on("load", function () {
  uploadTable();
  listarTipoProveedores(lista);
  listarTipoProveedores(listaEdit);
})

async function altaProveedor() {
  let jsonProveedor = {
    Nombre: document.getElementById('proveedor').value,
    RazonSocial: document.getElementById('razonSocial').value,
    Cuit: document.getElementById('cuit').value,
    Direccion: document.getElementById('direccion').value,
    Localidad: document.getElementById('localidad').value,
    Telefono: document.getElementById('tel').value,
    TipoRubro: document.getElementById('tipo').value,
    Contacto: document.getElementById('contacto').value,
    CondicionFiscal: document.getElementById('condicionFiscal').value,
  }

  await db.collection('proveedores').doc().set(jsonProveedor)
    .then(() => {
      uploadTable();
      formProveedor.reset();
    })
    .catch(err => {
      console.error(err);
    })
}

function mostrarProveedor(id) {
  db.collection('proveedores').doc(id.toString()).get()
    .then(doc => {
      completarModal(doc.data(), id)
      $('#modalEdit').modal('show')
    })
    .catch(error => {
      console.error(error)
    })
}

function completarModal(data, id) {
  document.getElementById('proveedorEdit').value = data.Nombre;
  document.getElementById('razonSocialEdit').value = data.RazonSocial;
  document.getElementById('cuitEdit').value = data.Cuit;
  document.getElementById('direccionEdit').value = data.Direccion;
  document.getElementById('localidadEdit').value = data.Localidad;
  document.getElementById('telEdit').value = data.Telefono;
  document.getElementById('tipoEdit').value = data.TipoRubro;
  document.getElementById('contactoEdit').value = data.Contacto;
  document.getElementById('condicionFiscalEdit').value = data.CondicionFiscal;
  idEditable = id;
}

async function editarProveedor() {
  let jsonEditado = {
    Nombre: document.getElementById('proveedorEdit').value,
    RazonSocial: document.getElementById('razonSocialEdit').value,
    Cuit: document.getElementById('cuitEdit').value,
    Direccion: document.getElementById('direccionEdit').value,
    Localidad: document.getElementById('localidadEdit').value,
    Telefono: document.getElementById('telEdit').value,
    TipoRubro: document.getElementById('tipoEdit').value,
    Contacto: document.getElementById('contactoEdit').value,
    CondicionFiscal: document.getElementById('condicionFiscalEdit').value,
  }
  await db.collection('proveedores').doc(idEditable).update(jsonEditado)
    .then(() => {
      uploadTable()
    })
    .catch(err => {
      console.error(err);
    })
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

async function eliminarProveedor() {
  let id = document.getElementById('idBorrar').value;
  await db.collection('proveedores').doc(id).delete()
    .then(() => {
      uploadTable();
      document.getElementById('idBorrar').value = ''
      document.getElementById('borrarBtn').setAttribute('disabled', 'disabled')
    })
    .catch(err => {
      console.error(err);
    })
}

function listarTipoProveedores(lista) {
  const listar = data => {
    if (data.length) {
      data.forEach(doc => {
        const tipo = doc.data()
        let tipoRubro = document.createElement('option');
        tipoRubro.appendChild(document.createTextNode(tipo.Nombre));
        tipoRubro.value = tipo.Nombre;
        lista.appendChild(tipoRubro);
      });
    }
  }
  db.collection('tipoProveedores').get()
    .then((snapshot) => {
      listar(snapshot.docs)
    })
    .catch(err => {
      console.error(err);
    })
}

function uploadTable() {
  let datos = []
  db.collection('proveedores').get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        const proveedor = doc.data()
        proveedor.ProveedorId = doc.id
        datos.push(proveedor)
      })
    })
    .then(() => {
      $('#tablaProveedores').DataTable().clear().destroy();
      $('#tablaProveedores').DataTable({
        pageLength: 25,
        data: datos,
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
              <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data.ProveedorId}', '${data.Nombre}')">Borrar <i class="far fa-trash-alt" ></i></a>
              <a class="btn btn-sm btn-warning" href="#" onclick="mostrarProveedor('${data.ProveedorId}')">Modificar <i class="fa fa-edit" ></i></a>`;
            }
          }
        ]
      })
    })
    .catch(error => {
      console.error(error)
    })

}