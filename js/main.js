//---- Elección de Servicio de Traslado-------




//IF
alert ("Indique que tipo de Servicio de Traslado desea:")
let servicio = +(prompt(" Opcion 1 - Traslado al Vete\n Opcion 2 - Paseo con tu mascota"));
    if (servicio==""){
        alert("Debe seleccionar una de la opciones");
    }
    else if (servicio==1){
        alert("Traslado al Vete");
        console.log("Opción " + servicio + " " + "Traslado al Vete");
    }   
    else {
        (servicio==2)
        alert("Paseo con tu mascota");
        console.log("Opción " + servicio + " " + "Paseo con tu mascota");
    }

    

    let tarifaDistancia = +(prompt(" Opcion 1 - Dentro de Capital Federal\n Opcion 2 - Es dentro del Amba\n Opcion 3 - Es Fuera del Amba"));
        switch (tarifaDistancia) {
            case 1: {
                alert("La tarifa es $1500");
                break;
            }
            case 2: {
                alert("La tarifa es $2500");
                break;
            }
            case 3: {
                alert("La tarifa es $3500");
                break;
            }
            default :{
                alert ("La opcion no es correcta");
                break;
        }
        tarifaDistancia = +(prompt(" Opcion 1 - Dentro de Capital Federal\n Opcion 2 - Es dentro del Amba\n Opcion 3 - Es Fuera del Amba"));
    }

let cantidaMascota = +(prompt("¿Cuantas Mascotas desea trasladar?"));


    alert ("Se trasladaran" +" "+ cantidaMascota +" "+ "Mascota(s)");

//Pantalla conn muestra de solicitud de servicio
    function solicitud(a,b,c){
        let mensaje = "Codigo de Servicio: " + a + "\n"; 
        mensaje+="Tipo de Tarifa: " + b + "\n"; 
        mensaje+="Cantidad de Mascota(s): " + c + "\n"; 
    
        return mensaje;
    }

let completado = solicitud (servicio, tarifaDistancia, cantidaMascota);

alert ("Tu solicitud de servicio es por: "+ " " + "\n"+ completado);