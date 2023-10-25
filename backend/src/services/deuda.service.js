"use strict";
// Importa el modelo de datos 'User'
const Deuda = require("./deuda.model");
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene todas las deudas de la base de datos.
 *
 * @returns {Promise} Una promesa que resuelve con una lista de todas las deudas si se encontraron deudas, o con un mensaje de error si no se encontraron deudas.
 */
async function getDeudas() {
  try {
    const deudas = await Deuda.find()
    .populate("tramiteID")
    .populate("RUTAdmin")
    .populate("RUTUsuario")
    .exec();
    if (!deudas) return [null, "No hay usuarios"];

    return [deudas, null];
  } catch (error) {
    handleError(error, "deuda.service -> getDeudas");
  }
}

async function getDeudaById(id) {
    try{
    const deuda = await Deuda.findOne({ deudaID: id });
    .populate("tramiteID")
    .populate("RUTAdmin")
    .populate("RUTUsuario")
    .exec();

    if (!deuda) return [null, "No hay deuda"];

    return [deuda, null];
    } catch (error) {
        handleError(error, "deuda.service -> getDeudaById");
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

        const tramiteFound = await Tramite.findOne({ tramiteID: tramiteID });
        if (!tramiteFound) return [null, "El tramite no existe"];
        
        const adminFound = await User.findOne({ RUT: RUTAdmin });
        if (!adminFound) return [null, "El admin no existe"];

        const userFound = await User.findOne({ RUT: RUTUsuario });
        if (!userFound) return [null, "El usuario no existe"];

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
        handleError(error, "deuda.service -> createDeuda");
  }

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
};