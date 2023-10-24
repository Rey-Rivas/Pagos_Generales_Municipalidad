"use strict";

const Joi = require("joi");

/**
 * Esquema de validación para el cuerpo de la solicitud de usuario.
 * @constant {Object}
 */
// Esquema de validación para el cuerpo de la solicitud de deuda
const deudaBodySchema = Joi.object({
  DeudaID: Joi.number().required().messages({
    "any.required": "La ID de la deuda es obligatoria.",
  }),
  Descripcion: Joi.string().required().messages({
    "any.required": "La descripción de la deuda no puede estar vacía.",
    "string.base": "La descripción debe ser de tipo string.",
  }),
  fechaEmision: Joi.date().required().messages({
    "any.required": "La fecha de emisión de la deuda no puede estar vacía.",
    "date.base": "La fecha de emisión de la deuda debe ser de tipo fecha.",
  }),
  fechaVencimiento: Joi.date()
    .min(Joi.ref("fechaEmision"))
    .required()
    .messages({
      "any.required": "La fecha de vencimiento de la deuda no puede estar vacía.",
      "date.min": "La fecha de vencimiento debe ser posterior a la fecha de emisión.",
      "date.base": "La fecha de vencimiento de la deuda debe ser de tipo fecha.",
    }),
  fechaPago: Joi.date()
    .min(Joi.ref("fechaEmision"))
    .required()
    .messages({
      "any.required": "La fecha de pago de la deuda no puede estar vacía.",
      "date.min": "La fecha de pago debe ser posterior a la fecha de emisión.",
      "date.base": "La fecha de pago de la deuda debe ser de tipo fecha.",
    }),
  estado: Joi.string().required().messages({
    "any.required": "El estado de la deuda no puede estar vacío.",
    "string.base": "El estado debe ser de tipo string.",
  }),
  tramiteID: Joi.objectId()
    .required()
    .valid(
      ...await Tramite.distinct("_id").exec(),
      "El ID del trámite no es válido."
    )
    .messages({
      "any.required": "El ID del trámite no puede estar vacío.",
    }),
  RUTAdmin: Joi.string().required().messages({
    "string.empty": "El RUT del administrador no puede estar vacío.",
    "any.required": "El RUT del administrador es obligatorio.",
    "string.base": "El RUT del administrador debe ser de tipo string.",
  }),
  RUTUsuario: Joi.string().required().messages({
    "string.empty": "El RUT del usuario no puede estar vacío.",
    "any.required": "El RUT del usuario es obligatorio.",
    "string.base": "El RUT del usuario debe ser de tipo string.",
  }),
});

// Esquema de validación para el ID de deuda
const deudaIdSchema = Joi.object({
  id: Joi.objectId().required().messages({
    "any.required": "El ID de la deuda no puede estar vacío.",
  }),
});

module.exports = {
  deudaBodySchema,
  deudaIdSchema,
};


//"Deuda" tendrá dos esquemas: deudaBodySchema y deudaIdSchema
//parámetros para deudaBodySchema:
//DeudaID: Number, Primary Key (no puede estar vacío y es obligatorio)
//Descripcion: String (no puede estar vacío y es obligatorio)
//fechaEmision: Date (no puede estar vacío y es obligatorio)
//fechaVencimiento: Date (no puede estar vacío y es obligatorio, y debe ser posterior a fechaEmision)
//fechaPago: Date (no puede estar vacío y es obligatorio, y debe ser posterior a fechaEmision)
//estado: String (no puede estar vacío y es obligatorio)
//tramiteID: ObjectId referenciando a tramite (no puede estar vacío y es obligatorio)
//RUTAdmin: ObjectId referenciando a usuario (no puede estar vacío y es obligatorio)
//RUTUsuario: ObjectId referenciando a usuario (no puede estar vacío y es obligatorio)