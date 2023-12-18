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
    .populate("RUTUsuario")
    .exec();
    if (!apelacion) return [null, "No hay apelaciones"];

    return [apelacion, null];
  } catch (error) {
    handleError(error, "apelacion.service -> getApelacion");
  }
}

async function getApelacionById(id) {
    try{
    const apelacion = await Apelacion.findById(id)
    .populate("descripcion")
    .populate("documento")
    .populate("estado")
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
        const { descripcion, documento, estado, deudaID, RUTUsuario  } = apelacionData;
        
        const deudaFound = await Deuda.findOne({ _id: deudaID });
        if (!deudaFound) return [null, "La deuda no existe"];
        if (deudaFound.estado !== 'fuera de plazo') return [null, "La deuda no está fuera de plazo"];

        const userFound = await User.findOne({ RUT: RUTUsuario });
        if (!userFound) return [null, "El usuario no existe"];

        const newApelacion = new Apelacion({
            descripcion,
            documento,
            estado,
            deudaID,
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
 * @param {ObjectId} _id El ID de la apelacion que se desea actualizar.
 * @param {Object} apelacionData Un objeto que contiene los datos actualizados de la apelacion.
 * @returns {Promise} Una promesa que resuelve con la apelacion actualizada si la actualización fue exitosa, o con un mensaje de error si la actualización falló.
 */
async function updateApelacion(_id, apelacionData) {
    try {
        const {descripcion, documento, estado, deudaID, RUTUsuario,RUTEncargado, observacion} = apelacionData;  

        const apelacionFound = await Apelacion.findById(_id);
        if (!apelacionFound) return [null, "La apelacion no existe"];
        
        const encargadoFound = await User.findOne({ RUT: RUTEncargado });
        if (!encargadoFound) return [null, "El encargado no existe"];


        const apelacionUpdated = await Apelacion.findOneAndUpdate({_id: _id }, {
            descripcion,
            documento,
            estado,
            deudaID,
            RUTUsuario,
            RUTEncargado,
            observacion,
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
 * @param {ObjectId} _id El ID de la apelacion que se desea eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con la apelacion eliminada si la eliminación fue exitosa, o con un mensaje de error si la eliminación falló.
 */

async function deleteApelacion(_id) {
  try {
    const apelacion = await Apelacion.findOneAndDelete({ _id:_id });
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
