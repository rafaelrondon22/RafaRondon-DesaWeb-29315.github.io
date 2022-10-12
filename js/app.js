// Funcion para determinar servicio//
function service (nombre,documento,fecha,servicio){
    this.nombre = nombre;
    this.documento = documento;
    this.fecha = fecha;
    this.servicio = servicio;
    this.totalReserva=0;
    
    this.agregar = function(contenido){
        this.servicio.push(contenido);
    }

    this.calcularTotal = function(){
        this.servicio.forEach(serv => {
            this.totalReserva+=serv[3]*serv[4];
        });
    }

    this.mostrarReserva = function(){
        console.log("La reserva se ha realizado con Exito " + this.nombre);
        console.log("Número de DNI / Pasaporte : " + this.documento);
        console.log("Fecha    : " + this.fecha);
        console.log("Nombre del Servicio: ");
        this.servicio.forEach(serv => {
            console.log(`${serv[1]} / Tarifa por: ${serv[2]} Cantidad de Km: ${serv[4]} Precio por Km: ${serv[3]} `)
        });
        console.log(`El total de la reserva es: ${this.totalReserva} pesos`);
        alert(`El total de la reserva es: ${this.totalReserva} pesos`);
    }

}
// Declaracion de var array//
let serv = [];

let tipoServ=[
    [1,'Traslado al Vete','1 Km',400],
    [2,'Viaje a la Peluqueria','1 Km',400],
    [3,'Paseo con tu mascota','1 Km',500],
    [4,'Viaje a Cariló-Gesell-Mar de las Pampas','1 Km',150],
    [5,'Viaje a Santa Clara-Mar de Plata-Necochea','1 Km',100]
]
// llamado a funcion service//
let nombreCliente = prompt("Ingrese su nombre para reservar un servicio");
let documentoCliente = prompt("Ingrese su documento para reserva un servicio");
let fechaActual=prompt("Ingrese la fecha de la solicitud del servicio");;
let obj =new service(nombreCliente,documentoCliente,fechaActual,serv);
let continuarReserva="si";
let servSeleccionado= [];

do {
    let cantidadKm =0;
    // Seleccion //
    Seleccion=parseInt(prompt("Indique el Servicio que desea Reservar:\n Opcion 1 - Traslado al Vete\n Opcion 2 - Viaje a la Peluqueria\n Opción 3 - Paseo con tu mascota\n Opción 4 - Viaje a Cariló\n Opción 5 - Viaje a Mar de Plata"));
    if (Seleccion>0 && Seleccion <=5) {
        if (obj.servicio.find(element => element[0] ==Seleccion)==undefined) {
            servSeleccionado=tipoServ.find(element => element[0] ==Seleccion);
            cantidadKm = parseInt(prompt(servSeleccionado[1] +"\n Indique la cantidad del Km del Servicio: "+' \n- Precio por Km: '+ servSeleccionado[3]));
            servSeleccionado.push(cantidadKm);
            obj.agregar(servSeleccionado);
        } else {
            Seleccion=Seleccion-1;
            cantidadKm = parseInt(prompt(servSeleccionado[1] +"\n Indique la cantidad del Km del Servicio: "+' \n- Precio por Km: '+ servSeleccionado[3]));
            console.log(obj.servicio[Seleccion]);
            obj.servicio[Seleccion][4]=obj.servicio[Seleccion][4]+cantidadKm;
            
        }
        
        console.log(obj);
    } else {
        alert('Debe seleccionar una opcion valida');
    }

    continuarReserva = prompt("Desea Agregar otro Servicio? \n-Si\n-No");
    if (continuarReserva!='no'){
        if(continuarReserva!='si'){
            continuarReserva='no';
        }
    }
} while (continuarReserva=='si');

obj.calcularTotal();
obj.mostrarReserva();