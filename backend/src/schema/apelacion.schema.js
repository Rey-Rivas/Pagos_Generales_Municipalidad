"use strict";

const Joi = require("joi");
const { ESTADOS } = require("../constants/estados.constants.js");

/**
 * Esquema de validación para el cuerpo de la solicitud de usuario.
 * @constant {Object}
 */
// Esquema de validación para el cuerpo de la solicitud de apelación
const apelacionBodySchema = Joi.object({
    apelacionId: Joi.number().required().messages({
        "any.required": "La ID de la apelación no puede estar vacía.",
      }),
    descripcion: Joi.string().required().messages({
        "any.required": "La descripción no puede estar vacía.",
        "string.base": "La descripción debe ser de tipo string.",
    }),
    documento: Joi.string().required().messages({
        "any.required": "El documento de la apelación no puede estar vacío.",
    }),
    estado: Joi.string()
  .valid(...Object.values(ESTADOS))
  .required()
  .messages({
    "any.required": "El estado de la deuda no puede estar vacío.",
    "string.base": "El estado debe ser de tipo string.",
  }),
    deudaID: Joi.number().required().messages({
        "any.required": "La ID de la deuda no puede estar vacía.",
    }),
    RUTEncargado: Joi.string().required().messages({
        "string.empty": "El RUT del encargado no puede estar vacío.",
        "any.required": "El RUT del encargado es obligatorio.",
        "string.base": "El RUT del encargado debe ser de tipo string.",
      }),
    RUTUsuario: Joi.string().required().messages({
        "string.empty": "El RUT del usuario no puede estar vacío.",
        "any.required": "El RUT del usuario es obligatorio.",
        "string.base": "El RUT del usuario debe ser de tipo string.",
      }),
});

// Esquema de validación para el ID de apelación
const apelacionIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "any.required": "El ID de la apelacion no puede estar vacío.",
  }),
});

module.exports = {
  apelacionBodySchema,
  apelacionIdSchema,
};