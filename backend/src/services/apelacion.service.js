"use strict";
// Importa el modelo de datos 'apelacion'
const Apelacion = require("../models/apelacion.model.js");
const { handleError } = require("../utils/errorHandler");
const Deuda = require("../models/deuda.model.js");
const User = require("../models/user.model.js");

/**
 * Obtiene todas las apelacion de la base de datos.
 *
 * @returns {Promise} Una promesa que resuelve con una lista de todas las apelaciones si se encontraron apelaciones, o con un mensaje de error si no se encontraron apelacions.
 */
async function getApelacion() {
  try {
    const apelacion = await Apelacion.find()
    .populate("descripcion")
    .populate("documento")
    .populate("estado")
    /* .populate("deudaID")
    .populate("RUTEncargado")
    .populate("RUTUsuario") */
    .exec();
    if (!apelacion) return [null, "No hay apelaciones"];

    return [apelacion, null];
  } catch (error) {
    handleError(error, "apelacion.service -> getApelacion");
  }
}

async function getApelacionById(id) {
    try{
    const apelacion = await Apelacion.findOne({ apelacionId: id })
    .populate("descripcion")
    .populate("documento")
    .populate("deudaID")
    .populate("RUTEncargado")
    .populate("RUTUsuario")
    .exec();

    if (!apelacion) return [null, "No hay apelacion"];

    return [apelacion, null];
    } catch (error) {
        handleError(error, "apelacion.service -> getApelacionById");
    }

}

/**
 * Crea una nueva apelacion en la base de datos.
 *
 * @param {Object} apelacionData Un objeto que contiene los datos de la nueva apelacion.
 * @returns {Promise} Una promesa que resuelve con la nueva apelacion creada si la creación fue exitosa, o con un mensaje de error si la creación falló.
 */
async function createApelacion(apelacionData) {
    try {
        const { apelacionId, descripcion, documento, estado, deudaID, RUTEncargado, RUTUsuario  } = apelacionData;

        const apelacionFound = await Apelacion.findOne({ apelacionId: apelacionId });
        if (apelacionFound) return [null, "La apelacion ya existe"];
        
        const deudaFound = await Deuda.findOne({ deudaID: deudaID });
        if (!deudaFound) return [null, "La deuda no existe"];

        const encargadoFound = await User.findOne({ RUT: RUTEncargado });
        if (!encargadoFound) return [null, "El encargado no existe"];

        const userFound = await User.findOne({ RUT: RUTUsuario });
        if (!userFound) return [null, "El usuario no existe"];

        const newApelacion = new Apelacion({
            apelacionId,
            descripcion,
            documento,
            estado,
            deudaID,
            RUTEncargado,
            RUTUsuario,
        });
        await newApelacion.save();

        return [newApelacion, null];

    } catch (error) {
        handleError(error, "apelacion.service -> createApelacion");
  }
};

/**
 * Actualiza una apelacion por su ID en la base de datos.
 *
 * @param {Number} apelacionId El ID de la apelacion que se desea actualizar.
 * @param {Object} Apelacion Un objeto que contiene los datos actualizados de la apelacion.
 * @returns {Promise} Una promesa que resuelve con la apelacion actualizada si la actualización fue exitosa, o con un mensaje de error si la actualización falló.
 */
async function updateApelacion(apelacionId, Apelacion) {
    try {
        const apelacionFound = await Apelacion.findOne({ apelacionId: apelacionId });
        if (!apelacionFound) return [null, "La apelacion no existe"];

        const { descripcion, documento, estado, deudaID, RUTEncargado, RUTUsuario } = apelacion;

        const apelacionUpdated = await Apelacion.findOneAndUpdate({ apelacionId: apelacionId }, {
            descripcion,
            documento,
            estado,
            deudaID,
            RUTencargado,
            RUTUsuario,
        },
        { new: true });

        return [apelacionUpdated, null];
    } catch (error) {
        handleError(error, "apelacion.service -> updateApelacion");
    }
}

/**
 * Elimina una apelacion por su ID de la base de datos.
 *
 * @param {Number} apelacionId El ID de la apelacion que se desea eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con la apelacion eliminada si la eliminación fue exitosa, o con un mensaje de error si la eliminación falló.
 */

async function deleteApelacion(apelacionId) {
  try {
    const apelacion = await Apelacion.findOneAndDelete({ apelacionId });
    if (!apelacion) {
      throw errorHandler("No se encontró la apelacion especificada.", 404);
    }
    return apelacion;
  } catch (error) {
    handleError(error, "apelacion.service -> deleteApelacion");
  }
}

module.exports = {
  getApelacion,
  getApelacionById,
  createApelacion,
  updateApelacion,
  deleteApelacion,
};