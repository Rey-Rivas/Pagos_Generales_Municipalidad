"use strict";

const Joi = require("joi");

/**
 * Esquema de validación para el cuerpo de la solicitud de usuario.
 * @constant {Object}
 */
// Esquema de validación para el cuerpo de la solicitud de deuda
const deudaBodySchema = Joi.object({
  deudaID: Joi.number().required().messages({
    "any.required": "La ID de la deuda es obligatoria.",
  }),
  descripcion: Joi.string().required().messages({
    "any.required": "La descripción de la deuda no puede estar vacía.",
    "string.base": "La descripción debe ser de tipo string.",
  }),
  monto: Joi.number()
    .required()
    .messages({
      "any.required": "El monto no puede estar vacío.",
      "number.base": "El monto debe ser de tipo number.",
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
    .allow(null)
    .min(Joi.ref("fechaEmision"))
    .messages({
      "date.min": "La fecha de pago debe ser posterior a la fecha de emisión.",
      "date.base": "La fecha de pago de la deuda debe ser de tipo fecha.",
    }),
  estado: Joi.string().required().messages({
    "any.required": "El estado de la deuda no puede estar vacío.",
    "string.base": "El estado debe ser de tipo string.",
  }),
  tramiteID: Joi.number()
    .required()
    .messages({
      "any.required": "El ID del trámite no puede estar vacío.",
      "number.base": "El estado debe ser de tipo number.",
    }),
  RUTAdmin: Joi.string()
  .required()
  .custom((value, helpers) => {
    if (!validateRut(value)) {
      return helpers.message("El RUT del administrador no es válido.");
    }
    return value;
  })
  .messages({
    "string.empty": "El RUT del administrador no puede estar vacío.",
    "any.required": "El RUT del administrador es obligatorio.",
    "string.base": "El RUT del administrador debe ser de tipo string.",
  }),
  RUTUsuario: Joi.string()
  .required()
  .custom((value, helpers) => {
    if (!validateRut(value)) {
      return helpers.message("El RUT del usuario no es válido.");
    }
    return value;
  })
  .messages({
    "string.empty": "El RUT del usuario no puede estar vacío.",
    "any.required": "El RUT del usuario es obligatorio.",
    "string.base": "El RUT del usuario debe ser de tipo string.",
  }),
});

// Esquema de validación para el ID de deuda
const deudaIdSchema = Joi.object({
  id: Joi.object().required().messages({
    "any.required": "El ID de la deuda no puede estar vacío.",
  }),
});

function validateRut(rut) {
  rut = rut.replace(/[.]/g, "");
  // Split the RUT into the number and the verifier digit
  const [rutNumber, verifierDigit] = rut.split("-");

  // Remove any dots or dashes from the RUT
  rut = rut.replace(/[-]/g, "");

  // Convert the verifier digit to a number or 10 if it's a "K"
  const verifierNumber = verifierDigit.toUpperCase() === "K" ? 10 : parseInt(verifierDigit);

  // Calculate the verifier digit using the RUT number
  let sum = 0;
  let multiplier = 2;
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const calculatedVerifierDigit = 11 - (sum % 11);

  // Compare the calculated verifier digit with the one provided
  return verifierNumber === calculatedVerifierDigit;
}

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