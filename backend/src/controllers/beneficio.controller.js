"use strict";
const { beneficiosBodySchema } = require("../schema/beneficios.schema.js");
const { deudaIdSchema } = require("../schema/beneficios.schema.js");
const BeneficioService = require("../services/beneficio.service.js");
const { handleError } = require("../utils/errorHandler");
const { respondSuccess, respondError } = require("../utils/resHandler");

async function createBeneficio(req, res) {
    try {
        const { body } = req;
        console.log(body);
        //const { error: beneficioError } = beneficiosBodySchema.validate(body);
        //if (beneficioError) return respondError(req, res, 400, beneficioError.message);
        const [newBeneficio, errorBeneficio] = await BeneficioService.createBeneficio(body);
        if (errorBeneficio) return respondError(req, res, 400, errorBeneficio);
        if (!newBeneficio) {
            return respondError(req, res, 400, "No se creo el beneficio");
        }
        respondSuccess(req, res, 201, newBeneficio);
    } catch (error) {
        handleError(error, "beneficio.controller -> createBeneficio");
        respondError(req, res, 500, "No se creo el beneficio");
    }
}

async function getBeneficios(req, res) {
    try {
        const [beneficios, errorBeneficios] = await BeneficioService.getBeneficios();
        if (errorBeneficios) return respondError(req, res, 404, errorBeneficios);
        respondSuccess(req, res, 200, beneficios);
    }
    catch (error) {
        handleError(error, "beneficio.controller -> getBeneficios");
        respondError(req, res, 400, error.message);
    }
}


async function getBeneficioById(req, res) {
    try {
      const [beneficio, errorBeneficio] = await BeneficioService.getBeneficioById(req.params.id);
      if (errorBeneficio) return respondError(req, res, 404, errorBeneficio);
  
      beneficio.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, beneficio);
    } catch (error) {
      handleError(error, "beneficio.controller -> getBeneficio");
      respondError(req, res, 400, error.message);
    }
  }

async function updateEstado(req, res) {
    try {
        const updatedBeneficio = await BeneficioService.updateEstado(body);
        respondSuccess(req, res, 200, updatedBeneficio);
    } catch (error) {
        handleError(error, "beneficio.controller -> updateBeneficio");
        respondError(req, res, 500, "No se actualizo el beneficio");
    }
}

module.exports = {
    getBeneficios,
    createBeneficio,
    getBeneficioById,
    updateEstado,
};