"use strict";
// Maneja peticiones HTTP relacionadas a notificaciones
const { respondSuccess, respondError } = require("../utils/resHandler");
const NotificaService = require("../services/notifica.service.js");
const { notificaBodySchema, notificaIdSchema, notificaIdOptionalSchema } = require("../schema/notifica.schema");
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene todas las notificaciones
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getNotificaciones(req, res) {
  try {
    const [notificaciones, errorNotificaciones] = await NotificaService.getNotificaciones();
    if (errorNotificaciones) return respondError(req, res, 404, errorNotificaciones);

    notificaciones.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, notificaciones);
  } catch (error) {
    handleError(error, "notifica.controller -> getNotificaciones");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Obtiene una notificación por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */


async function getNotificaById(req, res) {
  try{
      const { params } = req;
      const { error: paramsError } = notificaIdOptionalSchema.validate(params);
      if (paramsError) return respondError(req, res, 400, paramsError.message);

      const [notifica, errorNotifica] = await NotificaService
      .getNotificaById(params);

      if (errorNotifica) return respondError(req, res, 404, errorNotifica);

      respondSuccess(req, res, 200, notifica);
  } catch (error) {
      handleError(error, "notifica.controller -> getNotificaById");
      respondError(req, res, 400, "No se encontro la notificación");
  }
}

/**
 * Crea una nueva notificación
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createNotifica(req, res) {
  try {
    const { body } = req;
    const { error: notificaError } = notificaBodySchema.validate(body);
    if (notificaError) return respondError(req, res, 400, notificaError.message);

    const [newNotifica, errorNotifica] = await NotificaService.createNotifica(body._id, body.RUTEncargado, body.RUTUsuario);
    if (errorNotifica) return respondError(req, res, 400, errorNotifica);
    if (!newNotifica) {
        return respondError(req, res, 400, "No se creo la notificación");
    }

    respondSuccess(req, res, 201, newNotifica);
  } catch (error) {
    handleError(error, "notifica.controller -> createNotifica");
    respondError(req, res, 500, "No se creo la notificación");
  }
}

/**
 * Actualiza una notificación por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateNotifica(req, res) {
    try{
        const { params, body } = req;
        const { error: paramsError } = notificaIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const { error: bodyError } = notificaBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [notifica, errorNotifica]
        = await NotificaService.updateNotifica(params._id, params.RUTEncargado, params.RUTUsuario, body);

        if (errorNotifica) return respondError(req, res, 404, errorNotifica);

        respondSuccess(req, res, 200, notifica);
    } catch (error) {
        handleError(error, "notifica.controller -> updateNotifica");
        respondError(req, res, 400, "No se pudo actualizar la notificación");
    }
}

/**
 * Elimina una notificación por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteNotifica(req, res) {
    try{
        const { params } = req;
        const { error: paramsError } = notificaIdOptionalSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const notifica = await NotificaService.deleteNotifica(params);
        !notifica
        ? respondError(req, res, 404, "No se encontro la notificación")
        : respondSuccess(req, res, 200, notifica);
    } catch (error) {
        handleError(error, "notifica.controller -> deleteNotifica");
        respondError(req, res, 400, "No se pudo eliminar la notificación");
    };
}

module.exports = {
  getNotificaciones,
  createNotifica,
  getNotificaById,
  updateNotifica,
  deleteNotifica,
};