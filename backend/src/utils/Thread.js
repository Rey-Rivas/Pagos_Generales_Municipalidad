
const Deuda = require("../models/deuda.model.js");
const Notifica = require("../models/notifica.model.js");
const User = require("../models/user.model.js");
const NotificaService = require("../services/notifica.service.js");

function llamarRevisaEnvios() {

    console.log('Revisando potenciales notificaciones...')
    revisarEnviosPendientes();
    setTimeout(llamarRevisaEnvios, 6 * 1000);
}

  // Inicia la ejecución de la tarea
  llamarRevisaEnvios();


  async function revisarEnviosPendientes(){
    try{
        const fechaHoy = new Date();

        const deudasNotificables = await Deuda.find({
            estado: { $ne: 'pagado' },
            fechaVencimiento: { $lt: fechaHoy }
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
                //console.log("A punto de correr un if que compara " + notifica.fechadenotificacion + " con " + ultimoNotifica)
                if (notifica.fechadenotificacion > ultimoNotifica){
                    ultimoNotifica = notifica.fechaDeNotificacion;
                }
            }
            //console.log("ultimoNotifica para " + deuda.deudaID + ": " + ultimoNotifica)
            //SI estamos a menos de un día de la fecha de vencimiento (Vale decir, fechaVencimiento < fechaHoy < fechaVencimiento + 1 día)...
            //Y si el ultimo notifica fue hace más de un día (ultimoNotifica < fechaHoy - 1 día)...
            //Se llama a enviarCorreoAtraso(deuda.deudaID, "Recordatorio 1 dia")
            if (fechaHoy < deuda.fechaVencimiento + 1
                && ultimoNotifica < fechaHoy - 1){

                enviarCorreoAtraso(deuda, "Recordatorio 1 dia");
                console.log("Ciclo for -> Deuda " + deuda.deudaID + " -> Recordatorio 1 dia" + " pues fechaHoy (" + fechaHoy + ") < deuda.fechaVencimiento + 1 (" + deuda.fechaVencimiento + 1 + ").")
            }
            //Si estamos pasados de la fecha de vencimiento (fechaVencimiento < fechaHoy)...
            //Y el ultimo notifica fue antes de la fecha de vencimiento (ultimoNotifica < fechaVencimiento)...
            //Se llama a enviarCorreoAtraso(deuda.deudaID, "Aviso deuda vencida")
            if (fechaHoy > deuda.fechaVencimiento
                && ultimoNotifica < deuda.fechaVencimiento){

                enviarCorreoAtraso(deuda, "Aviso deuda vencida");
                console.log("Ciclo for -> Deuda " + deuda.deudaID + " -> Recordatorio 1 dia" + " pues ultimoNotifica = " + ultimoNotifica + " < deuda.fechaVencimiento = " + deuda.fechaVencimiento + ".")
            }
            //Si estamos pasados de la fecha de vencimiento...
            //El ultimo notifica fue despues de la fecha de vencimiento...
            //Y el ultimo notifica fue hace más de una semana...
            //Se llama a enviarCorreoAtraso(deuda.deudaID, "Recordatorio 1 semana")
            if (fechaHoy > deuda.fechaVencimiento
                && ultimoNotifica > deuda.fechaVencimiento
                && ultimoNotifica < fechaHoy - 7){

                enviarCorreoAtraso(deuda, "Recordatorio 5 minutos");
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