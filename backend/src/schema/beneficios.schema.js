"use strict";

const Joi = require("joi");

/**
 * Esquema de validación para el cuerpo de la solicitud de beneficios.
 * @constant {Object}
 */
// Esquema de validación para el cuerpo de la solicitud de beneficios
const beneficiosBodySchema = Joi.object({
  beneficiosID: Joi.number().required().messages({
    "any.required": "La ID del beneficio es obligatoria.",
  }),
  nombreBeneficio: Joi.string().required().messages({
    "any.required": "El Beneficio debe tener un nombre.",
    "string.base": "El nombre debe ser de tipo string.",
  }),
  descripcion: Joi.string().required().messages({
    "any.required": "La descripción del beneficio no puede estar vacía.",
    "string.base": "La descripción debe ser de tipo string.",
  }),
  monto: Joi.number()
    .required()
    .messages({
      "any.required": "El monto no puede estar vacío.",
      "number.base": "El monto debe ser de tipo number.",
    }),
});


module.exports = {
  beneficiosBodySchema,
};
