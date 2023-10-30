const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de notificación
const notificaBodySchema = Joi.object({
  deudaID: Joi.objectId().required().messages({
    "any.required": "El ID de la deuda no puede estar vacío.",
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
  fechadenotificacion: Joi.date().required().messages({
    "any.required": "La fecha de notificación no puede estar vacía.",
  }),
});

// Esquema de validación para el ID de notificación
const notificaIdSchema = Joi.object({
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
  notificaBodySchema,
  notificaIdSchema,
};