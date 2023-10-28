"use strict";
// Importa el modelo de datos 'Notifica'
const Notifica = require('../models/notifica.model.js');
const Deuda = require('../models/deuda.model.js');
const User = require('../models/user.model.js');
const { handleError } = require("../utils/errorHandler");
const { Resend } = require('resend');
const UserService = require("./user.service.js");

const resend = new Resend('re_U5fioJ7N_6AxhNB9zjqeLgiP3yX89pr4n');

/**
 * Obtiene todas las notificaciones de la base de datos.
 *
 * @returns {Promise} Una promesa que resuelve con una lista de todas las notificaciones si se encontraron notificaciones, o con un mensaje de error si no se encontraron notificaciones.
 */
async function getNotificaciones() {
    try {
      const notifica = await Notifica.find().exec();
      if (!notifica) return [null, "No hay notificaciones"];

      return [notifica, null];
    } catch (error) {
      handleError(error, "notifica.service -> getNotificaciones");
    }
  }

/**
 * @param {Number} deudaID
 * @param {String} RUTEncargado
 * @param {String} RUTUsuario
 * @returns {Promise} Una promesa que resuelve con la notificacion si se encontró, o con un mensaje de error si no se encontró.
 */
async function getNotificaById(params) {
    try {
        const query = { deudaID: params.deudaID };

        if (params.RUTEncargado) {
          query.RUTEncargado = params.RUTEncargado;
        }
  
        if (params.RUTUsuario) {
          query.RUTUsuario = params.RUTUsuario;
        }

        const notifica = await Notifica.find(query).exec();

        if (!notifica) return [null, "No hay notificacion con esos parametros"];

        console.log(params.deudaID + " y " + notifica);
        return [notifica, null];
    } catch (error) {
        handleError(error, "notifica.service -> getNotificaById");
    }
  }

async function notiPost(deudaID, RUTEncargado, RUTUsuario) {
    try {

      const deudaFound = await Deuda.findOne({ deudaID: deudaID });
      if (deudaFound) {
        console.log(deudaFound);
      } else {
        console.log('Deuda con ID ${deudaID} no encontrada.');
      }

      const userFound = await User.findOne({ RUT: RUTUsuario });
      if (userFound) {
        console.log(userFound);
      } else {
        console.log('Usuario con RUT ${RUTUsuario} no encontrado.');
      } 

      const encargadoFound = await User.findOne({ RUT: RUTEncargado });
      if (encargadoFound) {
        console.log(encargadoFound);
      } else {
        console.log('Encargado con RUT ${RUTEncargado} no encontrado.');
      }

      const achetemele = `
      <p>Estimado(a) ${userFound.username},</p>
      <p>Le informamos que tiene una deuda pendiente por ${deudaFound.descripcion} con el siguiente detalle:</p>
      <ul>
        <li>Monto: ${deudaFound.monto}</li>
        <li>Fecha de vencimiento: ${deudaFound.fechaVencimiento}</li>
      </ul>
      <p>Por favor, regularice su situación a la brevedad posible. Saludos.</p>
      `;

      resend.emails.send({
        from: 'onboarding@resend.dev',
        to: "devector13@gmail.com",
        subject: 'Hello World',
        html: achetemele
      });

    console.log("mail enviado a " + "devector13@gmail.com");
  
    } catch (error) {
      handleError(error, "notifica.service -> notiPost");
    }
  }

function correoNotifica() {
  resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'marco.araneda2001@alumnos.ubiobio.cl',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
  });
}

/**
 * Crea una nueva deuda en la base de datos.
 *
 * @param {Number} deudaID
 * @param {String} RUTEncargado
 * @param {String} RUTUsuario
 * @returns {Promise} Una promesa que resuelve con la nueva deuda creada si la creación fue exitosa, o con un mensaje de error si la creación falló.
 */
async function createNotifica(deudaID, RUTEncargado, RUTUsuario) {
  try{
    const fechadenotificacion = new Date();
    fechadenotificacion.setHours(fechadenotificacion.getHours() - 3);

    const deudaFound = await Deuda.findOne({ deudaID: deudaID });
    if (!deudaFound) return [null, "La deuda no existe"];

    const encargadoFound = await User.findOne({ RUT: RUTEncargado });
    if (!encargadoFound) return [null, "El encargado no existe"];

    const usuarioFound = await User.findOne({ RUT: RUTUsuario });
    if (!usuarioFound) return [null, "El usuario no existe"];

    const newNotifica = new Notifica({
      deudaID,
      RUTEncargado,
      RUTUsuario,
      fechadenotificacion
    });
    await newNotifica.save();

    //correoNotifica()
    notiPost(deudaID, RUTEncargado, RUTUsuario);

    return [newNotifica, null];
  } catch (error) {
    handleError(error, "notifica.service -> createNotifica");
  };
};

/**
 * @param {Number} deudaID
 * @param {String} RUTEncargado
 * @param {String} RUTUsuario
 * @returns {Promise} Una promesa.
 */
async function deleteNotifica(params) {
  try {
    const query = { deudaID: params.deudaID };

    if (params.RUTEncargado) {
      query.RUTEncargado = params.RUTEncargado;
    }

    if (params.RUTUsuario) {
      query.RUTUsuario = params.RUTUsuario;
    }

    const notifica = await Notifica.deleteMany(query);
    if (!notifica) {
      throw errorHandler("No se encontró la notificacion especificada.", 404);
    }
    return notifica;
  } catch (error) {
    handleError(error, "notifica.service -> deleteNotifica");
  }
};

/**
 * @param {Number} deudaID
 * @param {String} RUTEncargado
 * @param {String} RUTUsuario
 * @param {Date} fechadenotifiacion
 * @returns {Promise} Una promesa.
 */
async function updateNotifica(deudaID, RUTEncargado, RUTUsuario, fechadenotifiacion) {
  try {
    const notificaFound = await Notifica.findOne({ deudaID, RUTEncargado, RUTUsuario });
    if (!notificaFound) return [null, "La notificacion no existe"];

    const { deudaID, RUTEncargado, RUTUsuario, fechadenotifiacion } = notifica;

    const notificaUpdated = await Notifica.findOneAndUpdate({ deudaID, RUTEncargado, RUTUsuario }, {
      deudaID,
      RUTEncargado,
      RUTUsuario,
      fechadenotifiacion,
    },
    { new: true });

    return [notificaUpdated, null];
  } catch (error) {
    handleError(error, "notifica.service -> updateNotifica");
  }
}

module.exports = {
  getNotificaciones,
  getNotificaById,
  createNotifica,
  deleteNotifica,
  updateNotifica,
};