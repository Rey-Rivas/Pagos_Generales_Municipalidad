const Joi = require("joi");

// Esquema de validación para el cuerpo de la solicitud de asignar
const asignarBodySchema = Joi.object({
  asignarID: Joi.number().required().messages({
    "any.required": "El ID de la asignacion no puede estar vacío.",
    "string.base": "El ID de la asignacion debe ser un numero.",
  }),
  RUTUsuario: Joi.string().required().messages({
    "string.empty": "El RUT del usuario no puede estar vacío.",
    "any.required": "El RUT del usuario es obligatorio.",
    "string.base": "El RUT del usuario debe ser de tipo string.",
  }),
  fechaAsignacion: Joi.date()
    .allow(null)
    .messages({
      "date.base": "La fecha de asignacion del beneficio debe ser de tipo fecha.",
    }),
});


module.exports = { 
    asignarBodySchema,
};