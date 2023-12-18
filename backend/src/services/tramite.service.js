"use strict";
// Importa el modelo de datos 'User'
const tramite = require("../models/tramite.model.js");
const User = require("../models/user.model.js");
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene todas los tramites de la base de datos.
 *
 * @returns {Promise} Una promesa que resuelve con una lista de todas los tramites si se encontraron tramites, o con un mensaje de error si no se encontraron tramites.
 */
async function getTramite() {
  try {
    const tramiteSel = await tramite.find()
    .populate("tramiteID")
    .populate("montoFijo")
    .populate("nombreTramite")
    .populate("descripcionTramite")
    .populate("RUTAdmin")
    .exec();
    if (!tramiteSel) return [null, "No hay usuarios"];

    return [tramiteSel, null];
  } catch (error) {
    handleError(error, "tramite.service -> getTramite");
  }
}

async function getTramiteById(id) {
    try{
    const tramiteSel = await tramite.findOne({ tramiteID: id })
    .populate("tramiteID")
    .populate("montoFijo")
    .populate("nombreTramite")
    .populate("descripcionTramite")
    .populate("RUTAdmin")
    .exec();

    if (!tramiteSel) return [null, "No hay tramites con ese ID"];

    return [tramiteSel, null];
    } catch (error) {
        handleError(error, "tramite.service -> getTramiteById");
    }

}

/**
 * Crea una nuevo tramite en la base de datos.
 *
 * @param {Object} tramiteData Un objeto que contiene los datos de el nuevo tramite.
 * @returns {Promise} Una promesa que resuelve con el nuevo tramite si la creación fue exitosa, o con un mensaje de error si la creación falló.
 */
async function createTramite(tramiteData) {
    try {
        const { tramiteID, montoFijo, nombreTramite, descripcionTramite, RUTAdmin } = tramiteData;
        
        const tramiteFound = await tramite.findOne({ tramiteID: tramiteID });
        if (tramiteFound) return [null, "El tramite ya existe"];
        
        const adminFound = await User.findOne({ RUT: RUTAdmin });
        if (!adminFound) return [null, "El admin no existe"];

        const newTramite = new tramite({
            tramiteID,
            montoFijo,
            nombreTramite,
            descripcionTramite,
            RUTAdmin,
        });
        await newTramite.save();

        return [newTramite, null];

    } catch (error) {
        handleError(error, "tramite.service.js -> createTramite");
  }
};

/**
 * Actualiza un Tramite por su ID en la base de datos.
 *
 * @param {Number} tramiteID El ID del tramite que se desea actualizar.
 * @param {Object} Tramite Un objeto que contiene los datos actualizados del tramite.
 * @returns {Promise} Una promesa que resuelve con el tramite actualizado si la actualización fue exitosa, o con un mensaje de error si la actualización falló.
 */
async function updateTramite(tramiteID, Tramite) {
    try {
        const tramiteFound = await tramite.findOne({ tramiteID: tramiteID });
        if (!tramiteFound) return [null, "El tramite no existe"];

        const { montoFijo, descripcion, RUTAdmin } = Tramite;

        const tramiteUpdated = await tramite.findOneAndUpdate({ tramiteID: tramiteID }, {
            montoFijo,
            descripcion,
            RUTAdmin,
        },
        { new: true });

        return [tramiteUpdated, null];
    } catch (error) {
        handleError(error, "tramite.service.js -> updateTramite");
    }
}

/**
 * Elimina un tramite por su ID de la base de datos.
 *
 * @param {Number} tramiteID El ID del tramite que se desea eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con el tramite eliminado si la eliminación fue exitosa, o con un mensaje de error si la eliminación falló.
 */

async function deleteTramite(tramiteID) {
  try {
    const tramite = await tramite.findOneAndDelete({ tramiteID });
    if (!tramite) {
      throw errorHandler("No se encontró el tramite especificado.", 404);
    }
    return tramite;
  } catch (error) {
    handleError(error, "tramite.service.js -> deleteTramite");
  }
}

module.exports = {
  getTramite,
  getTramiteById,
  createTramite,
  updateTramite,
  deleteTramite,
};