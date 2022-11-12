//####################################################################
//#### Esto es un Simulador de Solicitud de traslados de Mascotas ####
//####################################################################
//
//--Variables
const modalRetorno = document.getElementById("modalRetorno"),
    btnsRetorno = document.getElementById("btnsRetorno"),
    servCortaDist = document.getElementById("cardCortaDist"),
    servLargaDist = document.getElementById("cardLargaDist"),
    modalCorta = document.getElementById("modalCorta"),
    msjCorta = document.getElementById("msjCorta"),
    modalMesa = document.getElementById("modalMesa"),
    btnfecha = document.getElementById("btnfecha"),
    valFecha = document.getElementById("valFecha"),
    btnsMenu = document.getElementById("menu"),
    verPedido = document.getElementById("verPedido"),
    modalSolicitud = document.getElementById("solicitud"),
    listaSolicitud = document.getElementById("listaSolicitud"),
    total = document.getElementById("total"),
    btnEnviar = document.getElementById("enviar"),
    btnCancelar = document.getElementById("cancelar"),
    btnFalta = document.getElementById("falta"),
    modalEnviarSolicitud = document.getElementById("modalEnviarSolicitud"),
    msjEnviarSolicitud = document.getElementById("msjEnviarSolicitud");
  
let retorno = JSON.parse(localStorage.getItem("retorno")) ?? "";
let numFecha = JSON.parse(sessionStorage.getItem("numFecha")) || "";
let retornoServ;
let itemSolicitud;
let solicitud = JSON.parse(localStorage.getItem("solicitudEnCurso")) || [];
let totalPedido = 0;
let totalCantidad = 0;

//--FLUJO SIMULADOR - Listo

// fetch - Obteniendo datos - función asíncrona
const fetchDatos = async () => {
  const res = await fetch('../json/servicio.json');
  const datos = await res.json();
  console.log(datos);
  // guardo arrays de productos por categoría en constantes
  const servCorta = filtrarPorCategoria(datos, "Corta Distancia");
  const servLarga = filtrarPorCategoria(datos, "Larga Distancia");
  // pintando tarjeta de productos
  pintServicio(servCorta, servCortaDist);
  pintServicio(servLarga, servLargaDist);
  return (menu = datos);
};

// ejecuciones
fetchDatos();
pintarCantidad();

//--eventos

// escucha botones para agregar productos al pedido por delegación de evento
btnsMenu.addEventListener("click", (e) => {
  e.preventDefault;
  seleccion(e);
  e.stopPropagation();
});

// modalValEdad
// guarda en local storage si el cliente es mayor o no a partir de la fecha de nacimiento que ingresa
//Guarda en session storage si el cliente es mayor o no
btnsRetorno.addEventListener("click", (e) => {
    e.preventDefault();
    const btnsRetorno = e.target.value;
    sessionStorage.setItem("retorno", btnsRetorno);
    if (btnsRetorno === "true" || btnsRetorno === "false") {
      modalRetorno.close();
    }
    retorno = JSON.parse(sessionStorage.getItem("retorno"));
    abrirModal();
    return retorno;
  });

// modalFecha
// guarda en session storage el número de mesa
btnfecha.addEventListener("click", (e) => {
  e.preventDefault();
  const inputFecha = parseFloat(
    document.getElementById("inputFecha").value
  );
  validarNumMesa(inputFecha);
  if (inputFecha > 0 && inputFecha < 21 && Number.isInteger(inputFecha)) {
    sessionStorage.setItem("numFecha", inputFecha);
    numFecha = JSON.parse(sessionStorage.getItem("numFecha"));
    modalFecha.close();
    modalSolicitud.showModal();
    pintarNumMesa();
  }
  e.stopPropagation();
});

// abre modalSolicitud
verPedido.addEventListener("click", (e) => {
  e.preventDefault();
  modalSolicitud.showModal();
  noEscape(modalSolicitud);
  pintarNumMesa();
  pintarPedido();
  e.stopPropagation();
});

//Muestra modalMesa una vez que se valida la edad
function abrirModal() {
    if (modalRetorno.open === false) {
      modalFecha.showModal();
    }
  }

// botones en modalSolicitud - btnFalta / btnCancelar / btnEnviar
btnFalta.addEventListener("click", (e) => {
  e.preventDefault();
  modalSolicitud.close();
  e.stopPropagation();
});
btnCancelar.addEventListener("click", (e) => {
  e.preventDefault;
  resetearPedido();
  pintarCantidad();
  modalSolicitud.close();
  e.stopPropagation();
});
btnEnviar.addEventListener("click", (e) => {
  e.preventDefault;
  validarPedido();
  if (solicitud.length > 0 && !(numFecha === "")) {
    crearDatosPedido();
    resetearPedido();
    pintarCantidad();
    modalSolicitud.close();
    modalTemporizado(modalEnviarSolicitud);
    numFecha = JSON.parse(sessionStorage.getItem("numFecha"));
    msjEnviarSolicitud.innerText = `FEcha ${numFecha} registrada`;
  }
  e.stopPropagation();
});

// botones editar pedido -  por delegación de evento
listaSolicitud.addEventListener("click", (e) => {
  e.preventDefault;
  const btn = e.target.dataset;
  const idItemEditar = parseInt(btn.id);
  editarPedidoMas(btn, idItemEditar);
  editarPedidoMenos(btn, idItemEditar);
  editarPedidoBorrar(btn, idItemEditar);
  pintarPedido();
  pintarCantidad();
  e.stopPropagation();
});

//--FUNCIONES

// filtra servicios por categoria
function filtrarPorCategoria(datos, filtro) {
  return datos.filter((servicio) => servicio.categoria == filtro);
}

// agrega cards de servicios de manera dinámica //

function pintServicio(categoriaServicio, contenedor) {
  categoriaServicio.forEach((servicio) => {
    contenedor.innerHTML += `
    <div class="tarjeta-producto" >
    <img src="${servicio.imgSrc}" alt="Imagen Servicio" class="img-producto" /> <br>
    <h4 class="parrafo ">${servicio.nombre}</h4><br>
    <p class="detalle-producto d-flex align-items-center">${servicio.detalle}</p>
    <h4 class="precio-producto ">$ ${servicio.precio}</h4>
    <button class="btn-agregar" id="${servicio.id}" type="submit")">Agregar</button>
    </div>
    `;
  });
}

// verifica si se presionó el botón agregar y ejecuta funciones
function seleccion(e) {
  if (e.target.classList.contains("btn-agregar")) {
    let idSeleccion = parseInt(e.target.id);
    encuentraSeleccion(idSeleccion);
    validarFecha(itemSolicitud);
    controlRetorno(itemSolicitud);
    agregarAlPedido(itemSolicitud);
    pintarCantidad();
  }
  return itemSolicitud, retornoServ;
}

// buscar servicio seleccionado
function encuentraSeleccion(idSeleccion) {
  itemSolicitud = menu.find((servicio) => servicio.id === idSeleccion);
  return itemSolicitud;
}

// verifica si el servicio requiere validar fecha de solicitud
/* function validarFecha(itemSolicitud) {
  itemSolicitud.retorno && retorno === "" && modalValEdad.showModal();
  noEscape(modalValEdad);
} */
modalRetorno.showModal();
noEscape(modalRetorno);


// verifica si el cliente es mayor, algunos productos requieren mayoria de edad
function controlRetorno(itemSolicitud) {
  if (retorno === false && itemSolicitud.retorno) {
    modalTemporizado(modalCorta);
    msjCorta.innerText = `El producto "${itemSolicitud.nombre}" es para mayores de 18 años.`;
    retornoServ = false;
  }
  retorno && (retornoServ = true);
  return retornoServ;
}

// agrega al pedido y localstorage para no perder los propuctos agrgados si se recarga la página
function agregarAlPedido(itemSolicitud) {
  if (!itemSolicitud.retorno || retornoServ) {
    validarCantidadEnPedido(itemSolicitud);
  }
  localStorage.setItem("solicitudEnCurso", JSON.stringify(solicitud));
  return solicitud;
}

// pinta cantidad de servicios solicitados
function pintarCantidad() {
  if (solicitud.length === 0) {
    cantidad.style.display = "none";
  } else {
    cantidad.style.display = "block";
    totalCantidad = solicitud.reduce((suma, { cantidad }) => suma + cantidad, 0);
    cantidad.innerText = `${totalCantidad}`;
  }
}

// verifica si el producto a agregar existe en el carrito, aumenta cantidad
function validarCantidadEnPedido(itemSolicitud) {
  if (solicitud.some((item) => item.id === itemSolicitud.id)) {
    const indice = solicitud.findIndex((item) => item.id === itemSolicitud.id);
    solicitud[indice].cantidad++;
  } else {
    solicitud.push({ ...itemSolicitud, cantidad: 1 });
  }
}

// pinta pedido dinámicamente
function pintarPedido() {
  // detalle del pedido
  listaSolicitud.innerHTML = "";
  solicitud.forEach((item) => {
    listaSolicitud.innerHTML += `
    <tr>
    <td class="col2">${item.nombre}</td>
    <td class="col3">${item.cantidad}</td>
    <td class="col5">$${item.cantidad * item.precio}</td>
    <td>
    <img class="btn-edit-pedido" data-name="menos"
    data-id="${item.id}" src="./img/circle-minus-fill.svg"/>
    <img class="btn-edit-pedido" data-name="borrar"
      data-id="${item.id}" src="./img/trash-can.svg"/>
      <img class="btn-edit-pedido" data-name="mas" 
      data-id="${item.id}" src="./img/circle-plus-fill.svg"/>
      </td>
      </tr>
      `;
  });
  // total del pedido
  if (solicitud.length === 0) {
    total.innerText = `Vacío`;
  } else {
    totalPedido = solicitud.reduce(
      (suma, { cantidad, precio }) => suma + cantidad * precio,
      0
    );
    total.innerText = `$${totalPedido}`;
  }
}

// resetea el pedido
function resetearPedido() {
    solicitud = [];
    solicitudJSON = JSON.stringify(solicitud);
  localStorage.setItem("solicitudEnCurso", solicitudJSON);
  totalPedido = 0;
}

// valida solicitud a enviar
function validarPedido() {
  if (solicitud.length === 0) {
    modalTemporizado(modalEnviarSolicitud);
    msjEnviarSolicitud.innerText = `Solicitud vacia`;
    modalSolicitud.close();
  } else if (numFecha === "") {
    valFecha.innerText = `Se requiere fecha del servicio para continuar`;
    modalFecha.showModal();
    noEscape(modalMesa);
    modalSolicitud.close();
  }
}

// pinta numero de mesa
function pintarNumMesa() {
  const textoNumMesa = numFecha ? `Mesa N°${numFecha}` : "";
  modalSolicitud.children[1].innerText = textoNumMesa;
}

// funciones editar pedido
// botón más
function editarPedidoMas(btn, idItemEditar) {
  const indice = solicitud.findIndex((item) => item.id === idItemEditar);
  btn.name === "mas" && solicitud[indice].cantidad++;
  localStorage.setItem("solicitudEnCurso", JSON.stringify(solicitud));
  return solicitud;
}
// botón menos
function editarPedidoMenos(btn, idItemEditar) {
  const indice = solicitud.findIndex((item) => item.id === idItemEditar);
  if (btn.name === "menos") {
    solicitud[indice].cantidad--;
    solicitud[indice].cantidad === 0 && solicitud.splice(indice, 1);
  }
  localStorage.setItem("solicitudEnCurso", JSON.stringify(solicitud));
  return solicitud;
}
// botón borrar
function editarPedidoBorrar(btn, idItemEditar) {
  const indice = solicitud.findIndex((item) => item.id === idItemEditar);
  btn.name === "borrar" && solicitud.splice(indice, 1);
  localStorage.setItem("solicitudEnCurso", JSON.stringify(solicitud));
  return solicitud;
}

// función constructora objeto con datos del pedido
function DatosPedido(fecha, hora, numFecha, total) {
  this.fecha = fecha;
  this.hora = hora;
  this.numFecha = numFecha;
  this.total = total;
}

// crea numero de pedido
function obtenerNumPedido() {
  const ultimoNumPedido = localStorage.getItem("ultimoNumPedido") || "0";
  const nuevoNumPedido = JSON.parse(ultimoNumPedido) + 1;
  localStorage.setItem("ultimoNumPedido", JSON.stringify(nuevoNumPedido));
  return nuevoNumPedido;
}

// crea el objeto con los datos del pedido y los agrega a un array junto con el detalle de productos para guargarlo en el localStorage
function crearDatosPedido() {
  const numPedido = obtenerNumPedido();
  const fecha = DateTime.now().toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY); //aplicando Luxon JS
  const hora = DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS); //aplicando Luxon JS
  const datosPedido = new DatosPedido(fecha, hora, numFecha, totalPedido);
  const pedidoCerrado = [...solicitud, datosPedido];
  const jsonPedido = JSON.stringify(pedidoCerrado);
  localStorage.setItem(`Pedido Enviado N°${numPedido}`, jsonPedido);
}


// modal temporizado - abre y cierra
function modalTemporizado(modal) {
  modal.showModal();
  setTimeout(() => modal.close(), 2000);
}

// deshabilita tecla "escape" cuando el modal está abierto
function noEscape(modal) {
  if (modal.open) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
      }
    });
  }
}
//Muestra modalMesa una vez que se valida la edad
function abrirModal() {
    if (modalRetorno.open === false) {
      modalFecha.showModal();
    }
}
  
