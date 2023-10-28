const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de notificación
const notificaBodySchema = Joi.object({
  deudaID: Joi.number().required().messages({
    "any.required": "La ID de la deuda es obligatoria.",
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
  fechadenotificacion: Joi.date().messages({
  }),
});

// Esquema de validación para el ID de notificación

  const notificaIdSchema = Joi.object({
    deudaID: Joi.number().required().messages({
      "any.required": "La ID de la deuda es obligatoria.",
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

  const notificaIdOptionalSchema = Joi.object({
    deudaID: Joi.number().required().messages({
      "any.required": "La ID de la deuda es obligatoria.",
    }),
    RUTEncargado: Joi.string().allow(null).messages({
      "string.base": "El RUT del encargado debe ser de tipo string.",
    }),
    RUTUsuario: Joi.string().allow(null).messages({
      "string.base": "El RUT del usuario debe ser de tipo string.",
    }),
  });

module.exports = {
  notificaBodySchema,
  notificaIdSchema,
  notificaIdOptionalSchema,
};