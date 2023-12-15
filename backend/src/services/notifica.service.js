"use strict";
// Importa el modelo de datos 'Notifica'
const Notifica = require('../models/notifica.model.js');
const Deuda = require('../models/deuda.model.js');
const User = require('../models/user.model.js');
const { handleError } = require("../utils/errorHandler");
const nodemailer = require("nodemailer");
const UserService = require("./user.service.js");
// Create a transporter object using your email service's SMTP settings
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ingenieriadesoftwareproyecto@gmail.com",
    pass: "mqzj cqju lpps ghcq",
  },
});

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

async function notiPost(deudaID, RUTEncargado, RUTUsuario, notiCausa) {
    try {
      var achetemele = ""
      const deudaFound = await Deuda.findOne({ deudaID: deudaID });
      if (deudaFound) {
        //console.log(deudaFound);
      } else {
        console.log('Deuda con ID ${deudaID} no encontrada.');
      }

      const userFound = await User.findOne({ RUT: RUTUsuario });
      if (userFound) {
        //console.log(userFound);
      } else {
        console.log('Usuario con RUT ${RUTUsuario} no encontrado.');
      } 

      const encargadoFound = await User.findOne({ RUT: RUTEncargado });
      if (encargadoFound) {
        //console.log(encargadoFound);
      } else {
        console.log('Encargado con RUT ${RUTEncargado} no encontrado.');
      }

      //achetemele cambia dependiendo de la notificacion
      if (notiCausa == "Deuda por vencer") {
        achetemele = `
        <p>Estimado(a) ${userFound.username},</p>
        <p>Le recordamos que su deuda por <strong>${deudaFound.descripcion}</strong> está a punto de vencer:</p>
        <ul>
          <li>Monto: ${deudaFound.monto}</li>
          <li>Fecha de vencimiento: ${deudaFound.fechaVencimiento.toLocaleDateString()}</li>
        </ul>
        <p>Por favor, regularice su situación a la brevedad posible. Saludos.</p>
        <img src="https://i.imgur.com/gYyHtrw.gif" alt="jijiji"></img>`
      ;} else if (notiCausa == "Deuda vencida") {
        achetemele = `
        <p>Estimado(a) ${userFound.username},</p>
        <p>Le informamos que su deuda por <strong>${deudaFound.descripcion}</strong> acaba de vencer:</p>
        <ul>
          <li>Monto: ${deudaFound.monto}</li>
          <li>Fecha de vencimiento: ${deudaFound.fechaVencimiento.toLocaleDateString()}</li>
        </ul>
        <p>Por favor, regularice su situación a la brevedad posible. Saludos.</p>
        <img src="https://i.imgur.com/gYyHtrw.gif" alt="jijiji"></img>`
      } else if (notiCausa == "Deuda vencida 1 semana") {
        achetemele = `
        <p>Estimado(a) ${userFound.username},</p>
        <p>Le recordamos que realice el pago de su deuda por <strong>${deudaFound.descripcion}</strong>:</p>
        <ul>
          <li>Monto: ${deudaFound.monto}</li>
          <li>Fecha de vencimiento: ${deudaFound.fechaVencimiento.toLocaleDateString()}</li>
        </ul>
        <p>Por favor, regularice su situación a la brevedad posible. Saludos.</p>
        <img src="https://i.imgur.com/gYyHtrw.gif" alt="jijiji"></img>`
      } else {
        achetemele = `
        <p>Estimado(a) ${userFound.username},</p>
        <p>Le recordamos sobre su deuda por <strong>${deudaFound.descripcion}</strong> con el siguiente detalle:</p>
        <ul>
          <li>Monto: ${deudaFound.monto}</li>
          <li>Fecha de vencimiento: ${deudaFound.fechaVencimiento.toLocaleDateString()}</li>
        </ul>
        <p>Saludos.</p>
        <img src="https://i.imgur.com/gYyHtrw.gif" alt="jijiji"></img>`
      }

      const mailOptions = {
        from: "ingenieriadesoftwareproyecto@gmail.com",
        to: userFound.email,
        subject: notiCausa,
        html: achetemele,
      };
  
      console.log("Sending email to " + userFound.email + " ...");

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: " + info.response + " ,sent to: " + mailOptions.to);
        }
      });

    } catch (error) {
      handleError(error, "notifica.service -> notiPost");
    }
  }

/**
 * Crea una nueva deuda en la base de datos.
 *
 * @param {Number} deudaID
 * @param {String} RUTEncargado
 * @param {String} RUTUsuario
 * @returns {Promise} Una promesa que resuelve con la nueva deuda creada si la creación fue exitosa, o con un mensaje de error si la creación falló.
 */
async function createNotifica(deudaID, RUTEncargado, RUTUsuario, notiCausa = null) {
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
    console.log("Se creo la notificacion " + newNotifica + ".");
    //correoNotifica()
    console.log("ejecutando notiPost con notiCausa=" + notiCausa + ".")
    notiPost(deudaID, RUTEncargado, RUTUsuario, notiCausa);
    //correito();

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