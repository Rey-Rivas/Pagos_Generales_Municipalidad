"use strict";
// Maneja peticiones HTTP relacionadas a resultado
const { respondSuccess, respondError } = require("../utils/resHandler");
const ResultadoService = require("../services/resultado.service.js");
const { resultadoBodySchema, resultadoIdSchema, resultadoIdOptionalSchema } = require("../schema/resultado.schema");
const { handleError } = require("../utils/errorHandler");

/**
 * Obtiene todos los resultados
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getResultado(req, res) {
  try {
    const [resultado, errorResultado] = await ResultadoService.getResultado();
    if (errorResultado) return respondError(req, res, 404, errorresultado);

    resultado.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, resultado);
  } catch (error) {
    handleError(error, "resultado.controller -> getResultado");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Obtiene un resultado por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */


async function getResultadoById(req, res) {
  try{
      const { params } = req;
      const { error: paramsError } = resultadoIdOptionalSchema.validate(params);
      if (paramsError) return respondError(req, res, 400, paramsError.message);

      const [resultado, errorResultado] = await ResultadoService
      .getResultadoById(params);

      if (errorResultado) return respondError(req, res, 404, errorResultado);

      respondSuccess(req, res, 200, resultado);
  } catch (error) {
      handleError(error, "resultado.controller -> getResultadoById");
      respondError(req, res, 400, "No se encontro el resultado de la apelacion");
  }
}

/**
 * Crea un nuevo resultado
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createResultado(req, res) {
  try {
    const { body } = req;
    const { error: resultadoError } = resultadoBodySchema.validate(body);
    if (resultadoError) return respondError(req, res, 400, resultadoError.message);

    const [newResultado, errorResultado] = await ResultadoService.createResultado(body.apelacionID, body.RUTEncargado, body.RUTUsuario);
    if (errorResultado) return respondError(req, res, 400, errorResultado);
    if (!newResultado) {
        return respondError(req, res, 400, "No se creo el resultado de la apelación");
    }

    respondSuccess(req, res, 201, newResultado);
  } catch (error) {
    handleError(error, "resultado.controller -> createResultado");
    respondError(req, res, 500, "No se creo el resultado de la apelación");
  }
}

/**
 * Actualiza un resultado por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateResultado(req, res) {
    try{
        const { params, body } = req;
        const { error: paramsError } = resultadoIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const { error: bodyError } = resultadoBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [resultado, errorResultado]
        = await ResultadoService.updateResultado(params.apelacionID, params.RUTEncargado, params.RUTUsuario, body);

        if (errorResultado) return respondError(req, res, 404, errorResultado);

        respondSuccess(req, res, 200, resultado);
    } catch (error) {
        handleError(error, "resultado.controller -> updateResultado");
        respondError(req, res, 400, "No se pudo actualizar el resultado de la apelación");
    }
}

/**
 * Elimina un resultado por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteResultado(req, res) {
    try{
        const { params } = req;
        const { error: paramsError } = resultadoIdOptionalSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const resultado = await ResultadoService.deleteResultado(params);
        !resultado
        ? respondError(req, res, 404, "No se encontro el resultado de la apelación")
        : respondSuccess(req, res, 200, "Se elimino el resultado de la apelación");
    } catch (error) {
        handleError(error, "resultado.controller -> deleteResultado");
        respondError(req, res, 400, "No se pudo eliminar el resultado de la apelación");
    };
}

module.exports = {
  getResultado,
  createResultado,
  getResultadoById,
  updateResultado,
  deleteResultado,
};