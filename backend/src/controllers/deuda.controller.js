"use strict";
// Maneja peticiones HTTP relacionadas a deudas
const { respondSuccess, respondError } = require("../utils/resHandler");
const DeudaService = require("../services/deuda.service.js");
const { deudaBodySchema, deudaIdSchema } = require("../schema/deuda.schema.js");
const { handleError } = require("../utils/errorHandler");
/**
 * Obtiene todas las deudas
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
const impuesto = 1.05;
async function getDeudas(req, res) {
  try {
    const [deudas, errorDeudas] = await DeudaService.getDeudas();
    if (errorDeudas) return respondError(req, res, 404, errorDeudas);

    deudas.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, deudas);
  } catch (error) {
    handleError(error, "deuda.controller -> getDeudas");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea una nueva deuda
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createDeuda(req, res) {
  try {
    const { body } = req;
    const { error: deudaError } = deudaBodySchema.validate(body);
    if (deudaError) return respondError(req, res, 400, deudaError.message);

    const [newDeuda, errorDeuda] = await DeudaService.createDeuda(body);

    if (errorDeuda) return respondError(req, res, 400, errorDeuda);
    if (!newDeuda) {
        return respondError(req, res, 400, "No se creo la deuda");
    }

    respondSuccess(req, res, 201, newDeuda);
  } catch (error) {
    handleError(error, "deuda.controller -> createDeuda");
    respondError(req, res, 500, "No se creo la deuda");
  }
}

/**
 * Obtiene una deuda por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getDeudaById(req, res) {
    try{
        const { params } = req;
        const { error: paramsError } = deudaIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [deuda, errorDeuda] = await DeudaService.getDeudaById(params.id);

        if (errorDeuda) return respondError(req, res, 404, errorDeuda);
        console.log("DeudaEncontrada");
        setearDeudaTemporal(deuda); 
        respondSuccess(req, res, 200, deuda);
    } catch (error) {
        handleError(error, "deuda.controller -> getDeudaById");
        respondError(req, res, 400, "No se encontro la deuda");
    }
}

/**
 * Actualiza una deuda por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateDeuda(req, res) {
    try{
        const { params, body } = req;
        const { error: paramsError } = deudaIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const { error: bodyError } = deudaBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [deuda, errorDeuda] = await DeudaService.updateDeuda(params.deudaID, body);

        if (errorDeuda) return respondError(req, res, 404, errorDeuda);

        respondSuccess(req, res, 200, deuda);
    } catch (error) {
        handleError(error, "deuda.controller -> updateDeuda");
        respondError(req, res, 400, "No se pudo actualizar la deuda");
    }
}

/**
 * Elimina una deuda por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteDeuda(req, res) {
    try{
        const { params } = req;
        const { error: paramsError } = deudaIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const deuda = await DeudaService.deleteDeuda(params.deudaID);
        !deuda
        ? respondError(req, res, 404, "No se encontro la deuda")
        : respondSuccess(req, res, 200, deuda);
    } catch (error) {
        handleError(error, "deuda.controller -> deleteDeuda");
        respondError(req, res, 400, "No se pudo eliminar la deuda");
    };
}


let deudaTemporal = null;

function obtenerDeudaTemporal() {
  return deudaTemporal;
}

function setearDeudaTemporal(deuda) {
  deudaTemporal = deuda;
}

function getImpuesto(){
  return impuesto;
}

function setImpuesto(nuevoImpuesto){
  impuesto=nuevoImpuesto;
}










module.exports = {
  getDeudas,
  createDeuda,
  getDeudaById,
  updateDeuda,
  deleteDeuda,
  obtenerDeudaTemporal,
  setearDeudaTemporal,
  getImpuesto,
  setImpuesto
};