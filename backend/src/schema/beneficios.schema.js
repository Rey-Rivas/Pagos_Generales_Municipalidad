"use strict";

const Joi = require("joi");
const { ESTADOS } = require("../constants/estados.constants.js");
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
  estado: Joi.string()
  .required()
  .messages({
    "any.required": "El estado del beneficio no puede estar vacío.",
    "string.base": "El estado debe ser de tipo string.",
  }),
  idDeuda: Joi.string()
  .length(24)
  .hex()
  .required()
  .messages({
    "any.required": "El id del beneficio no puede estar vacío.",
    "string.length": "El id debe tener una longitud de 24 caracteres.",
    "string.hex": "El id debe ser una cadena hexadecimal.",
  }),
  RUTUsuario: Joi.string()
    .required()
    .messages({
      "any.required": "El RUT del usuario no puede estar vacío.",
      "string.base": "El RUT del usuario debe ser de tipo string.",
    }),
});


module.exports = {
  beneficiosBodySchema,
};
