"use strict";
// Maneja peticiones HTTP relacionadas a tramites
const { respondSuccess, respondError } = require("../utils/resHandler");
const TramiteService = require("../services/tramite.service.js");
const { tramiteBodySchema, tramiteIdSchema } = require("../schema/tramite.schema.js");
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene todas las tramites
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getTramite(req, res) {
  try {
    const [tramite, errorTramite] = await TramiteService.getTramite();
    if (errorTramite) return respondError(req, res, 404, errorTramite);

    Tramite.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, tramite);
  } catch (error) {
    handleError(error, "tramite.controller -> getTramite");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea una nuevo tramite
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createTramite(req, res) {
  try {
    const { body } = req;
    const { error: tramiteError } = tramiteBodySchema.validate(body);
    if (tramiteError) return respondError(req, res, 400, tramiteError.message);

    const [newTramite, errorTramite] = await TramiteService.createTramite(body);

    if (errorTramite) return respondError(req, res, 400, errorTramite);
    if (!newTramite) {
        return respondError(req, res, 400, "No se creo el tramite");
    }

    respondSuccess(req, res, 201, newTramite);
  } catch (error) {
    handleError(error, "tramite.controller -> createTramite");
    respondError(req, res, 500, "No se creo la Tramite");
  }
}

/**
 * Obtiene un tramite por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getTramiteById(req, res) {
    try{
        const { params } = req;
        const { error: paramsError } = tramiteIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [tramite, errorTramite] = await TramiteService.getTramiteById(params.tramiteID);

        if (errorTramite) return respondError(req, res, 404, errorTramite);

        respondSuccess(req, res, 200, tramite);
    } catch (error) {
        handleError(error, "tramite.controller -> getTramiteById");
        respondError(req, res, 400, "No se encontro el tramite");
    }
}

/**
 * Actualiza un tramite por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateTramite(req, res) {
    try{
        const { params, body } = req;
        const { error: paramsError } = tramiteIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const { error: bodyError } = tramiteBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [tramite, errorTramite] = await TramiteService.updateTramite(params.tramiteID, body);

        if (errorTramite) return respondError(req, res, 404, errorTramite);

        respondSuccess(req, res, 200, tramite);
    } catch (error) {
        handleError(error, "tramite.controller -> updateTramite");
        respondError(req, res, 400, "No se pudo actualizar el tramite");
    }
}

/**
 * Elimina un tramite por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteTramite(req, res) {
    try{
        const { params } = req;
        const { error: paramsError } = tramiteIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const tramite = await TramiteService.deleteTramite(params.tramiteID);
        !tramite
        ? respondError(req, res, 404, "No se encontro el tramite")
        : respondSuccess(req, res, 200, tramite);
    } catch (error) {
        handleError(error, "tramite.controller -> deleteTramite");
        respondError(req, res, 400, "No se pudo eliminar el tramite");
    };
}

module.exports = {
  getTramite,
  createTramite,
  getTramiteById,
  updateTramite,
  deleteTramite,
};
