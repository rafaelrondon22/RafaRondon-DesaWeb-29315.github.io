//####################################################################
//#### Esto es un Simulador de Solicitud de traslados de Mascotas ####
//####################################################################
//
//--Variables
const modalRetorno = document.getElementById("modalRetorno"),
    btnsRetorno = document.getElementById("btnsRetorno"),
    servCortaDist = document.getElementById("cardCortaDist"),
    servLargaDist = document.getElementById("cardLargaDist"),
    modalMenor = document.getElementById("modalMenor"),
    msjMenor = document.getElementById("msjMenor"),
    modalMesa = document.getElementById("modalMesa"),
    btnNumMesa = document.getElementById("btnNumMesa"),
    valNumMesa = document.getElementById("valNumMesa"),
    btnsMenu = document.getElementById("menu"),
    verPedido = document.getElementById("verPedido"),
    modalSolicitud = document.getElementById("solicitud"),
    listaSolicitud = document.getElementById("listaSolicitud"),
    total = document.getElementById("total"),
    btnEnviar = document.getElementById("enviar"),
    btnCancelar = document.getElementById("cancelar"),
    btnFalta = document.getElementById("falta"),
    modalEnviarPedido = document.getElementById("modalEnviarPedido"),
    msjEnviarPedido = document.getElementById("msjEnviarPedido");
  
let retorno = JSON.parse(localStorage.getItem("retorno")) ?? "";
let numMesa = JSON.parse(sessionStorage.getItem("numMesa")) || "";
let edadClienteProducto;
let itemSolicitud;
let pedido = JSON.parse(localStorage.getItem("solicitudEnCurso")) || [];
let totalPedido = 0;
let totalCantidad = 0;
/* // Luxon JS
const DateTime = luxon.DateTime;
 */
//--FLUJO SIMULADOR

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
      modalMayorEdad.close();
    }
    retorno = JSON.parse(sessionStorage.getItem("retorno"));
    abrirModalMesa();
    return retorno;
  });

// modalMesa
// guarda en session storage el número de mesa
btnNumMesa.addEventListener("click", (e) => {
  e.preventDefault();
  const inputNumMesa = parseFloat(
    document.getElementById("inputNumMesa").value
  );
  validarNumMesa(inputNumMesa);
  if (inputNumMesa > 0 && inputNumMesa < 21 && Number.isInteger(inputNumMesa)) {
    sessionStorage.setItem("numMesa", inputNumMesa);
    numMesa = JSON.parse(sessionStorage.getItem("numMesa"));
    modalMesa.close();
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
  if (pedido.length > 0 && !(numMesa === "")) {
    crearDatosPedido();
    resetearPedido();
    pintarCantidad();
    modalSolicitud.close();
    modalTemporizado(modalEnviarPedido);
    numMesa = JSON.parse(sessionStorage.getItem("numMesa"));
    msjEnviarPedido.innerText = `Pedido de mesa número ${numMesa} enviado exitosamente`;
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
    validarEdad(itemSolicitud);
    controlMayorEdad(itemSolicitud);
    agregarAlPedido(itemSolicitud);
    pintarCantidad();
  }
  return itemSolicitud, edadClienteProducto;
}

// busca producto seleccionado
function encuentraSeleccion(idSeleccion) {
  itemSolicitud = menu.find((producto) => producto.id === idSeleccion);
  return itemSolicitud;
}

// verifica si el producto requiere validar edad del cliente
/* function validarEdad(itemSolicitud) {
  itemSolicitud.retorno && retorno === "" && modalValEdad.showModal();
  noEscape(modalValEdad);
} */
modalRetorno.showModal();
noEscape(modalRetorno);


// verifica si el cliente es mayor, algunos productos requieren mayoria de edad
function controlMayorEdad(itemSolicitud) {
  if (retorno === false && itemSolicitud.retorno) {
    modalTemporizado(modalMenor);
    msjMenor.innerText = `El producto "${itemSolicitud.nombre}" es para mayores de 18 años.`;
    edadClienteProducto = false;
  }
  retorno && (edadClienteProducto = true);
  return edadClienteProducto;
}

// agrega al pedido y localstorage para no perder los propuctos agrgados si se recarga la página
function agregarAlPedido(itemSolicitud) {
  if (!itemSolicitud.retorno || edadClienteProducto) {
    validarCantidadEnPedido(itemSolicitud);
  }
  localStorage.setItem("solicitudEnCurso", JSON.stringify(pedido));
  return pedido;
}

// pinta cantidad de productos en el pedido
function pintarCantidad() {
  if (pedido.length === 0) {
    cantidad.style.display = "none";
  } else {
    cantidad.style.display = "block";
    totalCantidad = pedido.reduce((suma, { cantidad }) => suma + cantidad, 0);
    cantidad.innerText = `${totalCantidad}`;
  }
}

// verifica si el producto a agregar existe en el carrito, aumenta cantidad
function validarCantidadEnPedido(itemSolicitud) {
  if (pedido.some((item) => item.id === itemSolicitud.id)) {
    const indice = pedido.findIndex((item) => item.id === itemSolicitud.id);
    pedido[indice].cantidad++;
  } else {
    pedido.push({ ...itemSolicitud, cantidad: 1 });
  }
}

// pinta pedido dinámicamente
function pintarPedido() {
  // detalle del pedido
  listaSolicitud.innerHTML = "";
  pedido.forEach((item) => {
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
  if (pedido.length === 0) {
    total.innerText = `Vacío`;
  } else {
    totalPedido = pedido.reduce(
      (suma, { cantidad, precio }) => suma + cantidad * precio,
      0
    );
    total.innerText = `$${totalPedido}`;
  }
}

// resetea el pedido
function resetearPedido() {
  pedido = [];
  pedidoJSON = JSON.stringify(pedido);
  localStorage.setItem("solicitudEnCurso", pedidoJSON);
  totalPedido = 0;
}

// valida pedido a enviar
function validarPedido() {
  if (pedido.length === 0) {
    modalTemporizado(modalEnviarPedido);
    msjEnviarPedido.innerText = `Pedido vacío`;
    modalSolicitud.close();
  } else if (numMesa === "") {
    valNumMesa.innerText = `Se requiere número de mesa para continuar`;
    modalMesa.showModal();
    noEscape(modalMesa);
    modalSolicitud.close();
  }
}

// pinta numero de mesa
function pintarNumMesa() {
  const textoNumMesa = numMesa ? `Mesa N°${numMesa}` : "";
  modalSolicitud.children[1].innerText = textoNumMesa;
}

// funciones editar pedido
// botón más
function editarPedidoMas(btn, idItemEditar) {
  const indice = pedido.findIndex((item) => item.id === idItemEditar);
  btn.name === "mas" && pedido[indice].cantidad++;
  localStorage.setItem("solicitudEnCurso", JSON.stringify(pedido));
  return pedido;
}
// botón menos
function editarPedidoMenos(btn, idItemEditar) {
  const indice = pedido.findIndex((item) => item.id === idItemEditar);
  if (btn.name === "menos") {
    pedido[indice].cantidad--;
    pedido[indice].cantidad === 0 && pedido.splice(indice, 1);
  }
  localStorage.setItem("solicitudEnCurso", JSON.stringify(pedido));
  return pedido;
}
// botón borrar
function editarPedidoBorrar(btn, idItemEditar) {
  const indice = pedido.findIndex((item) => item.id === idItemEditar);
  btn.name === "borrar" && pedido.splice(indice, 1);
  localStorage.setItem("solicitudEnCurso", JSON.stringify(pedido));
  return pedido;
}

// función constructora objeto con datos del pedido
function DatosPedido(fecha, hora, numMesa, total) {
  this.fecha = fecha;
  this.hora = hora;
  this.numMesa = numMesa;
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
  const datosPedido = new DatosPedido(fecha, hora, numMesa, totalPedido);
  const pedidoCerrado = [...pedido, datosPedido];
  const jsonPedido = JSON.stringify(pedidoCerrado);
  localStorage.setItem(`Pedido Enviado N°${numPedido}`, jsonPedido);
}

// valida número de mesa que se está ingresando
function validarNumMesa(inputNumMesa) {
  while (
    inputNumMesa > 20 ||
    inputNumMesa < 1 ||
    !Number.isInteger(inputNumMesa)
  ) {
    valNumMesa.innerText = `El número de mesa ingresado es incorrecto`;
    break;
  }
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
