"use strict";
// Maneja peticiones HTTP relacionadas a apelaciones
const { respondSuccess, respondError } = require("../utils/resHandler");
const ApelacionService = require("../services/apelacion.service.js");
const { apelacionBodySchema, apelacionIdSchema } = require("../schema/apelacion.schema.js");
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene todas las apelaciones
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getApelacion(req, res) {
  try {
    const [apelacion, errorApelacion] = await ApelacionService.getApelacion();
    if (errorApelacion) return respondError(req, res, 404, errorApelacion);

    apelacion.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, apelacion);
  } catch (error) {
    handleError(error, "apelacion.controller -> getApelacion");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea una nueva apelacion
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createApelacion(req, res) {
  try {
    const { body } = req;
    const { error: apelacionError } = apelacionBodySchema.validate(body);
    if (apelacionError) return respondError(req, res, 400, apelacionError.message);
    
    const [newApelacion, errorApelacion] = await ApelacionService.createApelacion(body);
    
    if (errorApelacion) return respondError(req, res, 400, errorApelacion);
    if (!newApelacion) {
        return respondError(req, res, 400, "No se creo la apelacion");
    }

    respondSuccess(req, res, 201, newApelacion);
  } catch (error) {
    handleError(error, "apelacion.controller -> createApelacion");
    respondError(req, res, 500, "No se creo la apelacion");
  }
}

/**
 * Obtiene una apelacion por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getApelacionById(req, res) {
    try{
        const { params } = req;
        const { error: paramsError } = apelacionIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [apelacion, errorApelacion] = await ApelacionService.getApelacionById(params.apelacionId);

        if (errorApelacion) return respondError(req, res, 404, errorApelacion);

        respondSuccess(req, res, 200, apelacion);
    } catch (error) {
        handleError(error, "apelacion.controller -> getApelacionById");
        respondError(req, res, 400, "No se encontro la apelacion");
    }
}

/**
 * Actualiza una apelacion por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateApelacion(req, res) {
    try{
        const { params, body } = req;
        const { error: paramsError } = apelacionIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const { error: bodyError } = apelacionBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        if (body.estado && !estados.includes(body.estado)) {
          return respondError(req, res, 400, "El estado de la apelación no es válido");
        }

        const [apelacion, errorApelacion] = await ApelacionService.updateApelacion(params.apelacionId, body);

        if (errorApelacion) return respondError(req, res, 404, errorApelacion);

        respondSuccess(req, res, 200, apelacion);
    } catch (error) {
        handleError(error, "apelacion.controller -> updateApelacion");
        respondError(req, res, 400, "No se pudo actualizar la apelacion");
    }
}

/**
 * Elimina una apelacion por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteApelacion(req, res) {
    try{
        const { params } = req;
        const { error: paramsError } = apelacionIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const apelacion = await ApelacionService.deleteApelacion(params.apelacionId);
        !apelacion
        ? respondError(req, res, 404, "No se encontro la apelacion")
        : respondSuccess(req, res, 200, apelacion);
    } catch (error) {
        handleError(error, "apelacion.controller -> deleteApelacion");
        respondError(req, res, 400, "No se pudo eliminar la apelacion");
    };
}

module.exports = {
  getApelacion,
  createApelacion,
  getApelacionById,
  updateApelacion,
  deleteApelacion,
};
