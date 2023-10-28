"use strict";
// Importa el modelo de datos 'Notifica'
const Notifica = require('../models/notifica.model.js');
const Deuda = require('../models/deuda.model.js');
const User = require('../models/user.model.js');
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene todas las notificaciones de la base de datos.
 *
 * @returns {Promise} Una promesa que resuelve con una lista de todas las notificaciones si se encontraron notificaciones, o con un mensaje de error si no se encontraron notificaciones.
 */
async function getNotificaciones() {
    try {
      const notifica = await Notifica.find().exec();
      if (!notifica) return [null, "No hay notificaciones"];

      return [notifica, null];
    } catch (error) {
      handleError(error, "notifica.service -> getNotificaciones");
    }
  }

/**
 * @param {Number} deudaID
 * @param {String} RUTEncargado
 * @param {String} RUTUsuario
 * @returns {Promise} Una promesa que resuelve con la notificacion si se encontró, o con un mensaje de error si no se encontró.
 */
async function getNotificaById(params) {
    try {
        const query = { deudaID: params.deudaID };

        if (params.RUTEncargado) {
          query.RUTEncargado = params.RUTEncargado;
        }
  
        if (params.RUTUsuario) {
          query.RUTUsuario = params.RUTUsuario;
        }

        const notifica = await Notifica.find(query).exec();

        if (!notifica) return [null, "No hay notificacion con esos parametros"];

        console.log(params.deudaID + " y " + notifica);
        return [notifica, null];
    } catch (error) {
        handleError(error, "notifica.service -> getNotificaById");
    }
  }

/**
 * Crea una nueva deuda en la base de datos.
 *
 * @param {Number} deudaID
 * @param {String} RUTEncargado
 * @param {String} RUTUsuario
 * @returns {Promise} Una promesa que resuelve con la nueva deuda creada si la creación fue exitosa, o con un mensaje de error si la creación falló.
 */
async function createNotifica(deudaID, RUTEncargado, RUTUsuario) {
  try{
    const fechadenotificacion = new Date();
    fechadenotificacion.setHours(fechadenotificacion.getHours() - 3);

    const deudaFound = await Deuda.findOne({ deudaID: deudaID });
    if (!deudaFound) return [null, "La deuda no existe"];

    const encargadoFound = await User.findOne({ RUT: RUTEncargado });
    if (!encargadoFound) return [null, "El encargado no existe"];

    const usuarioFound = await User.findOne({ RUT: RUTUsuario });
    if (!usuarioFound) return [null, "El usuario no existe"];

    const newNotifica = new Notifica({
      deudaID,
      RUTEncargado,
      RUTUsuario,
      fechadenotificacion
    });
    await newNotifica.save();

    return [newNotifica, null];
  } catch (error) {
    handleError(error, "notifica.service -> createNotifica");
  };
};

/**
 * @param {Number} deudaID
 * @param {String} RUTEncargado
 * @param {String} RUTUsuario
 * @returns {Promise} Una promesa.
 */
async function deleteNotifica(params) {
  try {
    const query = { deudaID: params.deudaID };

    if (params.RUTEncargado) {
      query.RUTEncargado = params.RUTEncargado;
    }

    if (params.RUTUsuario) {
      query.RUTUsuario = params.RUTUsuario;
    }

    const notifica = await Notifica.deleteMany(query);
    if (!notifica) {
      throw errorHandler("No se encontró la notificacion especificada.", 404);
    }
    return notifica;
  } catch (error) {
    handleError(error, "notifica.service -> deleteNotifica");
  }
};

/**
 * @param {Number} deudaID
 * @param {String} RUTEncargado
 * @param {String} RUTUsuario
 * @param {Date} fechadenotifiacion
 * @returns {Promise} Una promesa.
 */
async function updateNotifica(deudaID, RUTEncargado, RUTUsuario, fechadenotifiacion) {
  try {
    const notificaFound = await Notifica.findOne({ deudaID, RUTEncargado, RUTUsuario });
    if (!notificaFound) return [null, "La notificacion no existe"];

    const { deudaID, RUTEncargado, RUTUsuario, fechadenotifiacion } = notifica;

    const notificaUpdated = await Notifica.findOneAndUpdate({ deudaID, RUTEncargado, RUTUsuario }, {
      deudaID,
      RUTEncargado,
      RUTUsuario,
      fechadenotifiacion,
    },
    { new: true });

    return [notificaUpdated, null];
  } catch (error) {
    handleError(error, "notifica.service -> updateNotifica");
  }
}

module.exports = {
  getNotificaciones,
  getNotificaById,
  createNotifica,
  deleteNotifica,
  updateNotifica,
};