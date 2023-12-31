"use strict";
// Maneja peticiones HTTP relacionadas a deudas
const { respondSuccess, respondError } = require("../utils/resHandler");
const DeudaService = require("../services/deuda.service.js");
const { deudaBodySchema, deudaIdSchema, validateRut } = require("../schema/deuda.schema.js");
const { handleError } = require("../utils/errorHandler");
const tramite = require("../models/tramite.model.js");
const beneficio = require("../models/beneficios.model.js");
/**
 * Obtiene todas las deudas
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
let impuesto = 1.05;
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
    const Tramite = await tramite.findOne({ tramiteID: body.tramiteID })
    if (!Tramite) {
      return respondError(req, res, 404, "No se encontró el tramite");
    }
    body.monto = Tramite.montoFijo;
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
        console.log("Buscando deuda con id: "+params.id);
        const { error: paramsError } = deudaIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);

        const [deuda, errorDeuda] = await DeudaService.getDeudaById(params.id);

        if (errorDeuda) return respondError(req, res, 404, errorDeuda);
        console.log("DeudaEncontrada");
        const Beneficio = await beneficio.findOne({ idDeuda: params.id})
        if (Beneficio) {
          deuda.monto = deuda.monto - Beneficio.monto;
          console.log("Beneficio Encontrado");
        }
        else{
          console.log("Beneficio No Encontrado para la deuda");
        }
        setearDeudaTemporal(deuda); 
        respondSuccess(req, res, 200, deuda);
    } catch (error) {
        handleError(error, "deuda.controller -> getDeudaById");
        respondError(req, res, 400, "No se encontro la deuda");
    }
}

async function getDeudaByRUT(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = validateRut(params.RUTUsuario);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [deudas, errorDeuda] = await DeudaService.getDeudaByRUTUsuario(params.RUTUsuario);

    if (errorDeuda) return respondError(req, res, 404, errorDeuda);
    
    console.log("Deudas Encontradas");
    setearDeudaTemporal(deudas); 
    respondSuccess(req, res, 200, deudas);
  } catch (error) {
    handleError(error, "deuda.controller -> getDeudaByRUT");
    respondError(req, res, 400, "No se encontró la deuda");
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

        const [deuda, errorDeuda] = await DeudaService.updateDeuda(params.id, body);

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

        const deuda = await DeudaService.deleteDeuda(params.id);
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

async function obtenerImpuesto(req, res) {
  const Valorimpuesto = getImpuesto();
  return res.status(200).json({ Valorimpuesto });
}


function setImpuesto(nuevoImpuesto){
  impuesto=nuevoImpuesto;
}

async function actualizarImpuesto(req, res) {
  try {
    const nuevoImpuesto = parseFloat(req.params.nuevoImpuesto);

    // Validar si el nuevo impuesto es un número válido
    if (isNaN(nuevoImpuesto) || nuevoImpuesto <= 0) {
      return res.status(400).json({ mensaje: 'El nuevo impuesto no es válido' });
    }

    // Actualizar el impuesto llamando a la función setImpuesto
    setImpuesto(nuevoImpuesto);

    res.status(200).json({ mensaje: 'Impuesto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el impuesto' });
  }
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
  setImpuesto,
  getDeudaByRUT,
  actualizarImpuesto,
  obtenerImpuesto
};