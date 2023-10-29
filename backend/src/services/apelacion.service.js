"use strict";
// Importa el modelo de datos 'User'
const Apelacion = require("../models/apelacion.model.js");
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene todas las apelacions de la base de datos.
 *
 * @returns {Promise} Una promesa que resuelve con una lista de todas las apelacions si se encontraron apelacions, o con un mensaje de error si no se encontraron apelacions.
 */
async function getApelacion() {
  try {
    const apelacion = await apelacion.find()
    .populate("apelacionID")
    .populate("descripcion")
    .populate("documento")
    .populate("estado")
    .populate("deudaID")
    .populate("RUTEncargado")
    .populate("RUTUsuario")
    .exec();
    if (!apelacion) return [null, "No hay usuarios"];

    return [apelacion, null];
  } catch (error) {
    handleError(error, "apelacion.service -> getApelacion");
  }
}

async function getApelacionById(id) {
    try{
    const apelacion = await apelacion.findOne({ apelacionID: id })
    .populate("ApelacionID")
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
        const { apelacionID, descripcion, documento, estado, deudaID, RUTEncargado, RUTUsuario } = apelacionData;
        
        const apelacionFound = await apelacion.findOne({ apelacionID: apelacionID });
        if (apelacionFound) return [null, "La apelacion ya existe"];

        //const apelacionFound = await Apelacion.findOne({ apelacionID: apelacionID });
        //if (!apelacionFound) return [null, "La apelacion no existe"];

        //const descripcionFound = await Apelacion.findOne({ descripcion: descripcion });
        //if (!descripcionFound) return [null, "La descripcion no existe"];

        //const documentoFound = await Apelacion.findOne({ documento: documento });
        //if (!documentoFound) return [null, "El documento no existe"];

        //const estadoFound = await Apelacion.findOne({ estado: estado });
        //if (!estadoFound) return [null, "El estado no existe"];

        //const deudaFound = await deuda.findOne({ deudaID: deudaID });
        //if (!deudaFound) return [null, "La deuda no existe"];

        //const encargadoFound = await User.findOne({ RUT: RUTEncargado });
        //if (!encargadoFound) return [null, "El encargado no existe"];

        //const userFound = await User.findOne({ RUT: RUTUsuario });
        //if (!userFound) return [null, "El usuario no existe"];

        const newApelacion = new apelacion({
            apelacionID,
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
        handleError(error, "apelacion.service.js -> createApelacion");
  }
};

/**
 * Actualiza una apelacion por su ID en la base de datos.
 *
 * @param {Number} apelacionID El ID de la apelacion que se desea actualizar.
 * @param {Object} Apelacion Un objeto que contiene los datos actualizados de la apelacion.
 * @returns {Promise} Una promesa que resuelve con la apelacion actualizada si la actualización fue exitosa, o con un mensaje de error si la actualización falló.
 */
async function updateApelacion(apelacionID, Apelacion) {
    try {
        const apelacionFound = await apelacion.findOne({ apelacionID: apelacionID });
        if (!apelacionFound) return [null, "La apelacion no existe"];

        const { descripcion, documento, estado, tramiteID, RUTEncargado, RUTUsuario } = Apelacion;

        const apelacionUpdated = await apelacion.findOneAndUpdate({ apelacionID: apelacionID }, {
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
        handleError(error, "apelacion.service.js -> updateApelacion");
    }
}

/**
 * Elimina una apelacion por su ID de la base de datos.
 *
 * @param {Number} apelacionID El ID de la apelacion que se desea eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con la apelacion eliminada si la eliminación fue exitosa, o con un mensaje de error si la eliminación falló.
 */

async function deleteApelacion(apelacionID) {
  try {
    const apelacion = await apelacion.findOneAndDelete({ apelacionID });
    if (!apelacion) {
      throw errorHandler("No se encontró la apelacion especificada.", 404);
    }
    return apelacion;
  } catch (error) {
    handleError(error, "apelacion.service.js -> deleteApelacion");
  }
}

module.exports = {
  getApelacion,
  getApelacionById,
  createApelacion,
  updateApelacion,
  deleteApelacion,
};
