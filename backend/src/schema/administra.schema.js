const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de administrar
const administraBodySchema = Joi.object({
   administraID: Joi.number().required().messages({
    "any.required": "La ID de la administracion es obligatoria.",
  }),
  RUTEncargado: Joi.string().required().messages({
    "string.empty": "El RUT del encargado no puede estar vacío.",
    "any.required": "El RUT del encargado es obligatorio.",
    "string.base": "El RUT del encargado debe ser de tipo string.",
  }),
});

module,exports = {
  administraBodySchema,
};