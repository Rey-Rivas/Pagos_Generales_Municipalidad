const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de apelación
const apelacionBodySchema = Joi.object({
    apelacionID: Joi.number().required().messages({
        "any.required": "La ID de la apelación no puede estar vacía.",
      }).custom(async (value, helpers) => {
        // Verificar si existe una apelación con la ID especificada
        const apelacion = await Apelacion.findOne({ apelacionID: value });
        if (!apelacion) {
          return helpers.message("La ID de la apelación no es válida.");
        }
        return value;
      }),
    descripcion: Joi.string().required().messages({
        "any.required": "La descripción no puede estar vacía.",
        "string.base": "La descripción debe ser de tipo string.",
    }),
    documento: Joi.string().required().messages({
        "any.required": "El documento de la apelación no puede estar vacío.",
    }),
    estado: Joi.string().required().messages({
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
  apelacionBodySchema,
  apelacionIdSchema,
};