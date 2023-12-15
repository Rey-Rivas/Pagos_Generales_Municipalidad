"use strict";
// Importa el modelo de datos 'User'
const Deuda = require("../models/deuda.model.js");
const { handleError } = require("../utils/errorHandler");
const moment = require('moment');

/**
 * Obtiene todas las deudas de la base de datos.
 *
 * @returns {Promise} Una promesa que resuelve con una lista de todas las deudas si se encontraron deudas, o con un mensaje de error si no se encontraron deudas.
 */
async function getDeudas() {
  try {

    console.log("hola");

    const deudas = await Deuda.find()
      .populate("tramiteID")
      .populate("RUTAdmin")
      .populate("RUTUsuario")
      .exec();

    if (!deudas) return [null, "No hay usuarios"];

    // Mapea sobre el array de deudas y actualiza la propiedad fechaVencimiento
    const deudasFormateadas = deudas.map((deuda) => {
      // Utiliza moment para formatear la fecha
      const fechaVencimientoFormateada = moment(deuda.fechaVencimiento).format('DD-MM-YYYY');
      const fechaEmisionFormateada = moment(deuda.fechaEmision).format('DD-MM-YYYY');
      const fechaPagoFormateada = deuda.fechaPago ? moment(deuda.fechaPago).format('DD-MM-YYYY') : null;
      // Crea una copia del objeto deuda con la fechaVencimiento actualizada
      return {
        ...deuda._doc,  // _doc contiene las propiedades del documento MongoDB
        fechaVencimiento: fechaVencimientoFormateada,
        fechaEmision: fechaEmisionFormateada,
        fechaPago: fechaPagoFormateada,
      };
    });

    return [deudasFormateadas, null];
  } catch (error) {
    handleError(error, "deuda.service -> getDeudas");
  }
}

async function getDeudaById(id) {
  try {
    const deuda = await Deuda.findById(id)
      .populate("tramiteID")
      .populate("RUTAdmin")
      .populate("RUTUsuario")
      .exec();

    if (!deuda) return [null, "No hay deuda"];

    // Utiliza moment para formatear las fechas
    const fechaVencimientoFormateada = moment(deuda.fechaVencimiento).format('DD-MM-YYYY');
    const fechaEmisionFormateada = moment(deuda.fechaEmision).format('DD-MM-YYYY');
    const fechaPagoFormateada = deuda.fechaPago ? moment(deuda.fechaPago).format('DD-MM-YYYY') : null;

    // Crea un nuevo objeto deuda con las fechas formateadas
    const deudaFormateada = {
      ...deuda._doc,  // _doc contiene las propiedades del documento MongoDB
      fechaVencimiento: fechaVencimientoFormateada,
      fechaEmision: fechaEmisionFormateada,
      fechaPago: fechaPagoFormateada
    };

    return [deudaFormateada, null];
  } catch (error) {
    handleError(error, "deuda.service -> getDeudaById");
  }
}

async function getDeudaByRUTUsuario(RUTUsuario) {
  try {
    const deudas = await Deuda.find({ RUTUsuario: RUTUsuario })
      .populate("tramiteID")
      .populate("RUTAdmin")
      .populate("RUTUsuario")
      .exec();

    if (!deudas || deudas.length === 0) {
      return [null, "No hay deudas para el RUTUsuario proporcionado"];
    }

    // Utiliza moment para formatear las fechas
    const deudasFormateadas = deudas.map((deuda) => {
      const fechaVencimientoFormateada = moment(deuda.fechaVencimiento).format('DD-MM-YYYY');
      const fechaEmisionFormateada = moment(deuda.fechaEmision).format('DD-MM-YYYY');
      const fechaPagoFormateada = deuda.fechaPago ? moment(deuda.fechaPago).format('DD-MM-YYYY') : null;

      return {
        ...deuda._doc,  // _doc contiene las propiedades del documento MongoDB
        fechaVencimiento: fechaVencimientoFormateada,
        fechaEmision: fechaEmisionFormateada,
        fechaPago: fechaPagoFormateada
      };
    });

    return [deudasFormateadas, null];
  } catch (error) {
    handleError(error, "deuda.service -> getDeudaByRUTUsuario");
  }
}



/**
 * Crea una nueva deuda en la base de datos.
 *
 * @param {Object} deudaData Un objeto que contiene los datos de la nueva deuda.
 * @returns {Promise} Una promesa que resuelve con la nueva deuda creada si la creación fue exitosa, o con un mensaje de error si la creación falló.
 */
async function createDeuda(deudaData) {
  try {
    const { deudaID, descripcion, monto, fechaEmision, fechaVencimiento, fechaPago, estado, tramiteID, RUTAdmin, RUTUsuario } = deudaData;

    const deudaFound = await Deuda.findOne({ deudaID: deudaID });
    if (deudaFound) return [null, "La deuda ya existe"];

    const newDeuda = new Deuda({
      deudaID,
      descripcion,
      monto,
      fechaEmision,
      fechaVencimiento,
      fechaPago,
      estado,
      tramiteID,
      RUTAdmin,
      RUTUsuario,
    });
    await newDeuda.save();

    return [newDeuda, null];

  } catch (error) {
    handleError(error, "deuda.service.js -> createDeuda");
  }
};

/**
 * Actualiza una deuda por su ID en la base de datos.
 *
 * @param {Number} deudaID El ID de la deuda que se desea actualizar.
 * @param {Object} deuda Un objeto que contiene los datos actualizados de la deuda.
 * @returns {Promise} Una promesa que resuelve con la deuda actualizada si la actualización fue exitosa, o con un mensaje de error si la actualización falló.
 */
async function updateDeuda(deudaID, deuda) {
  try {
    const deudaFound = await Deuda.findOne({ deudaID: deudaID });
    if (!deudaFound) return [null, "La deuda no existe"];

    const { descripcion, monto, fechaEmision, fechaVencimiento, fechaPago, estado, tramiteID, RUTAdmin, RUTUsuario } = deuda;

    const deudaUpdated = await Deuda.findOneAndUpdate({ deudaID: deudaID }, {
      descripcion,
      monto,
      fechaEmision,
      fechaVencimiento,
      fechaPago,
      estado,
      tramiteID,
      RUTAdmin,
      RUTUsuario,
    },
      { new: true });

    return [deudaUpdated, null];
  } catch (error) {
    handleError(error, "deuda.service -> updateDeuda");
  }
}

/**
 * Elimina una deuda por su ID de la base de datos.
 *
 * @param {Number} deudaID El ID de la deuda que se desea eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con la deuda eliminada si la eliminación fue exitosa, o con un mensaje de error si la eliminación falló.
 */

async function deleteDeuda(deudaID) {
  try {
    const deuda = await Deuda.findOneAndDelete({ deudaID });
    if (!deuda) {
      throw errorHandler("No se encontró la deuda especificada.", 404);
    }
    return deuda;
  } catch (error) {
    handleError(error, "deuda.service -> deleteDeuda");
  }
}

module.exports = {
  getDeudas,
  getDeudaById,
  createDeuda,
  updateDeuda,
  deleteDeuda,
  getDeudaByRUTUsuario
};