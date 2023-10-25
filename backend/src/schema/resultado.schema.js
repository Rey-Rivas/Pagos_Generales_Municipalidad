const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de resultado
const resultadoBodySchema = Joi.object({
  apelacionID: Joi.number().required().messages({
    "any.required": "El ID de la apelación no puede estar vacío.",
    "string.base": "El ID de la apelación debe ser un numero.",
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

// Esquema de validación para el ID de resultado
const resultadoIdSchema = Joi.object({
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
  resultadoBodySchema,
  resultadoIdSchema,
};