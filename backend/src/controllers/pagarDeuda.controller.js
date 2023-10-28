const { getImpuesto } = require('../controllers/deuda.controller.js');
const { obtenerDeudaTemporal, setearDeudaTemporal } = require("../controllers/deuda.controller.js");
const { format } = require('date-fns');
const fechaActual = new Date();
const deuda=require('../models/deuda.model.js')
const fechaFormateada = format(fechaActual, 'yyyy-MM-dd');
const impuesto_pagar = getImpuesto();
const pagarDeuda = async (req, res) => {
    try {
        deudaTemporal = obtenerDeudaTemporal();
        const fechaDeuda = new Date(deudaTemporal.fechaVencimiento)
        // Obtén el cuerpo de la solicitud
        const cuerpoSolicitud = req.body;
        if (fechaFormateada > fechaDeuda) {

            const diferenciaEnMilisegundos = fechaActual - fechaDeuda;

            // Convierte la diferencia a días
            const diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
            deudaTemporal.monto = deudaTemporal.monto * impuesto_pagar * diferenciaEnDias;
            deudaTemporal.estado = "Atrasado";
        }
        deudaTemporal.monto -= cuerpoSolicitud.PagarCantidad;
        // Asegúrate de que el monto no sea negativo
        deudaTemporal.monto = Math.max(0, deudaTemporal.monto);
        if(deudaTemporal.monto>0){
          deudaTemporal.estado = "pendiente";
        }
        else{
          deudaTemporal.estado = "pagado";
        }
        // Responde con la deuda modificada

        const deudaActualizada = await deuda.findOneAndUpdate(
            { deudaID: deudaTemporal.deudaID },
            {
                $set: {
                    monto: deudaTemporal.monto,
                    estado: deudaTemporal.monto > cuerpoSolicitud.PagarCantidad ? 'pendiente' : 'pagado'
                }
            },
            { new: true, runValidators: true }
        );

        res.json(deudaTemporal);
        setearDeudaTemporal(null);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al procesar el pago de la deuda' });
    }
};

module.exports = {
    pagarDeuda,
};