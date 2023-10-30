const Deuda = require("../models/deuda.model.js");
const Notifica = require("../models/notifica.model.js");
const User = require("../models/user.model.js");
const NotificaService = require("../services/notifica.service.js");

function llamarRevisaEnvios() {

    console.log('Revisando potenciales notificaciones...')
    revisarEnviosPendientes();
    setTimeout(llamarRevisaEnvios, 15 * 1000);
}

  // Inicia la ejecución de la tarea
  llamarRevisaEnvios();


  async function revisarEnviosPendientes(){
    try{
        const fechaHoy = new Date();

        const deudasNotificables = await Deuda.find({
            estado: { $ne: 'pagado' },
        });

        for (const deuda of deudasNotificables){
            //Ahora hay que buscar todos los notifica cuyo deudaID coincida con la deuda.
            const notificaciones = await Notifica.find({
                deudaID: deuda.deudaID
            });
            //console.log("Noti length para " + deuda.deudaID + ": " + notificaciones.length)
            //De todos estos notifica, se guarda en una variable llamada ultimoNotifica, el cual tenga el mayor fechadenotificacion.
            //Ten en cuenta que en un inicio, ultimoNotifica es igual a una fecha 0.
            var ultimoNotifica = new Date(0);
            for (const notifica of notificaciones){
                fechaNoti = new Date(notifica.fechadenotificacion.getTime() + (3 * 60 * 60 * 1000))
                //console.log("(Para deuda " + deuda.deudaID + ") A punto de correr un if que compara " + fechaNoti + " con " + ultimoNotifica)
                if (fechaNoti > ultimoNotifica){
                    ultimoNotifica = fechaNoti;
                }
            }

            //console.log("Para " + deuda.deudaID + " (que vence el " + deuda.fechaVencimiento + ") de " + deuda.RUTUsuario + " el ultimoNotifica fue en " + ultimoNotifica + ".")
            //console.log("En este caso, fechaVencimiento = " + deuda.fechaVencimiento + ".")
            //console.log("En este caso, fechaVencimiento + 1 = " + new Date(deuda.fechaVencimiento.getTime() + (24 * 60 * 60 * 1000)) + ".")
            //console.log("ultimoNotifica para " + deuda.deudaID + ": " + ultimoNotifica)
            //SI estamos a menos de un día de la fecha de vencimiento (Vale decir, fechaVencimiento < fechaHoy < fechaVencimiento + 1 día)...
            //Y si el ultimo notifica fue hace más de un día (ultimoNotifica < fechaHoy - 1 día)...
            //Se llama a enviarCorreoAtraso(deuda.deudaID, "Recordatorio 1 dia")
            if (new Date(deuda.fechaVencimiento.getTime() - (24 * 60 * 60 * 1000)) < fechaHoy
                && fechaHoy < deuda.fechaVencimiento
                && ultimoNotifica < new Date(fechaHoy.getTime() - (24 * 60 * 60 * 1000)) ){

                enviarCorreoAtraso(deuda, "Deuda por vencer");
                //console.log("Ciclo for -> Deuda " + deuda.deudaID + " -> Recordatorio 1 dia" + " pues fechaHoy (" + fechaHoy + ") < deuda.fechaVencimiento + 1 (" + deuda.fechaVencimiento + 1 + ").")
            }
            //Si estamos pasados de la fecha de vencimiento (fechaVencimiento < fechaHoy)...
            //Y el ultimo notifica fue antes de la fecha de vencimiento (ultimoNotifica < fechaVencimiento)...
            //Se llama a enviarCorreoAtraso(deuda.deudaID, "Aviso deuda vencida")
            if (fechaHoy > deuda.fechaVencimiento
                && ultimoNotifica < deuda.fechaVencimiento){

                enviarCorreoAtraso(deuda, "Deuda vencida");
                //console.log("Ciclo for -> Deuda " + deuda.deudaID + " -> Deuda vencida" + " pues ultimoNotifica = " + ultimoNotifica + " < deuda.fechaVencimiento = " + deuda.fechaVencimiento + ".")
            }
            //Si estamos pasados de la fecha de vencimiento...
            //El ultimo notifica fue despues de la fecha de vencimiento...
            //Y el ultimo notifica fue hace más de una semana...
            //Se llama a enviarCorreoAtraso(deuda.deudaID, "Recordatorio 1 semana")
            if (fechaHoy > deuda.fechaVencimiento
                && ultimoNotifica > deuda.fechaVencimiento
                //&& ultimoNotifica < new Date(fechaHoy.getTime() - (7 * 24 * 60 * 60 * 1000))){
                && ultimoNotifica < new Date(fechaHoy.getTime() - (7 * 24 * 60 * 60 * 1000))){

                enviarCorreoAtraso(deuda, "Deuda vencida 1 semana");
            }
        }
        } catch (error) {
        console.error('Error al revisar envios de notificaciones pendientes:', error);
    };

    async function enviarCorreoAtraso(deuda, tipoMensaje){
        //Lo primero es encontrar un User cuyo RUT sea igual al RUTUsuario de la deuda.
        const usuario = await User.findOne({
            RUT: deuda.RUTUsuario
        });
        //Si no se encuentra un usuario, se hace un console.log() que diga que no se encontro el usuario.
        if (!usuario){
            console.log('No se encontro el usuario con RUT ' + deuda.RUTUsuario + '.');
            return;
        } else {
            await NotificaService.createNotifica(deuda.deudaID, "11111111-1", usuario.RUT, tipoMensaje);
            console.log('Enviando correo a ' + usuario.email + ', con mensaje' + tipoMensaje + ', para la deuda ' + deuda.deudaID + '.');
        }
    }
  }


const Deuda = require("../models/deuda.model.js");
const {getImpuesto} = require('../controllers/deuda.controller.js');
async function actualizarDeudasVencidas() {
    try {
        const impuesto = getImpuesto();
        const fechaActual = new Date();

        // Obtén las deudas vencidas que no están pagadas
        const deudasVencidas = await Deuda.find({
            estado: { $ne: 'pagado' }, // $ne significa "no es igual a"
            fechaVencimiento: { $lt: fechaActual }
        });

        // Actualiza cada deuda vencida aplicando el impuesto
        for (const deuda of deudasVencidas) {
            const fechaVencimiento = new Date(deuda.fechaVencimiento);
            const diferenciaEnMilisegundos = fechaActual - fechaVencimiento;
            const diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

            // Aplica el impuesto al monto
            deuda.monto = deuda.monto * impuesto * diferenciaEnDias;

            // Actualiza el estado si es necesario
            if (deuda.monto > 0) {
                deuda.estado = 'pendiente';
            } else {
                deuda.estado = 'pagado';
            }

            // Guarda los cambios en la base de datos
            await deuda.save();
        }

        console.log('Deudas vencidas actualizadas correctamente.');
    } catch (error) {
        console.error('Error al actualizar deudas vencidas:', error);
    }
}

function calcularTiempoHastaMediodia() {
    const ahora = new Date();
    const mediodia = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(), // Día actual
      12, // Hora del mediodía
      0, // Minuto
      0, // Segundo
      0 // Milisegundo
    );
  
    // Si la hora actual es después del mediodía, programa la próxima ejecución para el próximo día
    if (ahora.getHours() >= 12) {
      mediodia.setDate(mediodia.getDate() + 1);
    }
  
    return mediodia - ahora;
  }
    // Bandera para saber si es la primera ejecución
  let primeraEjecucion = true;
  function ejecutarTarea() {
    if (!primeraEjecucion) {
        // Ejecuta la tarea solo si no es la primera ejecución
        console.log('Montos actualizados');
        actualizarDeudasVencidas();
    } else {
        // Cambia la bandera para las siguientes ejecuciones
        primeraEjecucion = false;
    }

    // Calcula el tiempo hasta la próxima ejecución a las 12:00 PM
    const tiempoHastaMediodia = calcularTiempoHastaMediodia();

    // Programa la próxima ejecución a las 12:00 PM
    setTimeout(ejecutarTarea, tiempoHastaMediodia);
}

  // Llama a la función para iniciar la ejecución periódica
  ejecutarTarea();
