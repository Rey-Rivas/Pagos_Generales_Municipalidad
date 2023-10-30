const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de trámite
const tramiteBodySchema = Joi.object({
  tramiteID: Joi.number().required().messages({
    "number.empty": "El ID del trámite no puede estar vacío.",
    "any.required": "El RUT es obligatorio.",
    "number.base": "El RUT debe ser de tipo string.",
  }),
  nombreTramite: Joi.string().required().messages({
    "any.required": "El nombre del trámite no puede estar vacío.",
    "string.base": "El nombre del trámite debe ser de tipo string.",
  }),
  descripcionTramite: Joi.string().required().messages({
    "any.required": "La descripción del trámite no puede estar vacía.",
    "string.base": "La descripción del trámite debe ser de tipo string.",
  }),
  RUTAdmin: Joi.string().required().messages({
    "string.empty": "El RUT del administrador no puede estar vacío.",
    "any.required": "El RUT del administrador es obligatorio.",
    "string.base": "El RUT del administrador debe ser de tipo string.",
  }),
});

// Esquema de validación para el ID de trámite

const tramiteIdSchema = Joi.object({
    id: Joi.string()
      .required()
      .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
      .messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.base": "El id debe ser de tipo string.",
        "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
      }),
  });

module.exports = {
  tramiteBodySchema,
  tramiteIdSchema,
};