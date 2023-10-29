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