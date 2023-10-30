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
        // Obtén el cuerpo de la solicitud
        const cuerpoSolicitud = req.body;
        // Verifica que el monto a pagar sea menor o igual al monto de la deuda
        const saldoAcreedor=cuerpoSolicitud.PagarCantidad-deudaTemporal.monto;
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
                    estado: deudaTemporal.monto > cuerpoSolicitud.PagarCantidad ? 'pendiente' : 'pagado',
                    fechaPago: fechaActual
                }
            },
            { new: true, runValidators: true }
        );
        deudaActualizada.save();
        const response = {
            status: 'success',
            message: 'Pago realizado con exito',
            Tramite: deudaTemporal.descripcion,
            MontoPagado: req.body.PagarCantidad,
            MontoPorPagar: deudaTemporal.monto,
            SaldoAcreedor: saldoAcreedor,
            FechaPago: fechaFormateada,
            estado: deudaTemporal.monto > req.body.PagarCantidad ? 'pendiente' : 'pagado',
          };
        res.json(response);
        setearDeudaTemporal(null);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al procesar el pago de la deuda' });
    }
};

module.exports = {
    pagarDeuda,
};