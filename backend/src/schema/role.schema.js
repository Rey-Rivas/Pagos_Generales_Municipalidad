const Joi = require("joi");
const ROLES = require("../constants/roles.constants");

// Esquema de validación para el cuerpo de la solicitud de rol
const roleBodySchema = Joi.object({
  name: Joi.string().valid(...ROLES).required().messages({
    "any.required": "El nombre del rol no puede estar vacío.",
    "any.only": "El nombre del rol debe ser uno de los roles permitidos.",
  }),
});

// Esquema de validación para el ID de rol
const roleIdSchema = Joi.object({
  id: Joi.objectId().required().messages({
    "any.required": "El ID del rol no puede estar vacío.",
  }),
});

module.exports = {
  roleBodySchema,
  roleIdSchema,
};