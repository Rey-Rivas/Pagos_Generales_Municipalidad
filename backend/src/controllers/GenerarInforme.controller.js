// importacion de librearias
const ExcelJS = require("exceljs");
const express = require("express");
const router = express.Router();
const moment = require("moment");
const Deuda = require("../models/deuda.model.js");
const User = require("../models/user.model.js");



// importacion de funciones de Datosaexcel.js

async function informeExcel(req, res) {
  // Accede a las fechas desde el cuerpo JSON de la solicitud
  const { fechaInicio, fechaFin } = req.body;

// Validacion de fechas -------------------------------------------------------------------

  // Validación de formato de fechas
  if (
    !fechaInicio ||
    !fechaFin 
  ) {
    return res
      .status(400)
      .json({ error: "Fechas inválidas. Deben estar en formato DD-MM-YYYY" });
  }

  // Convierte las fechas en objetos Moment.js para su posterior uso
  const fechaInicioMoment = moment(fechaInicio, "YYYY-MM-DD");
  const fechaFinMoment = moment(fechaFin, "YYYY-MM-DD");

  // Verifica si las fechas son reales
  if (!fechaInicioMoment.isValid() || !fechaFinMoment.isValid()) {
    return res.status(400).json({ error: "Las fechas son inválidas" });
  }

  // Funcion para generar el informe Excel --------------------------------------------------

  // Crea un array para almacenar las deudas
  const listado_deudas = [];
  const listado_usuarios = [];

  // Funcion para generar el informe Excel
  async function generarInformeExcel(listado_deudas, fechaInicio, fechaFin) {
    try {
      // Vacía el array de deudas antes de agregar nuevos datos
      listado_deudas.length = 0;
      listado_usuarios.length = 0;

      // Obtiene todas las deudas dentro de la base de datos
      const deudas = await Deuda.find();
      const usuarios = await User.find();



      // Une la información de las deudas con la de los usuarios
      const UnionDeudaUsuario = deudas.map((deuda) => {
        const usuarioAsociado = usuarios.find((usuario) => usuario.RUT === deuda.RUTUsuario);
      
        // Si hay un usuario asociado, se agrega a la información de la deuda
        if (usuarioAsociado) {
          return {
            ...deuda.toObject(),
            usuario: usuarioAsociado.toObject(),
          };
        }
      
        // Si no hay un usuario asociado, se devuelve la información de la deuda tal cual
        return deuda.toObject();
      });
      
      // Filtra los datos por fecha de emision y vencimiento
      const datosFiltrados = UnionDeudaUsuario.filter((dato) => {
      
        // Convierte fecha de emision y vencimiento para ser comparadas con Moment.js
        const fechaInicioDato = moment(dato.fechaEmision, "YYYY-MM-DD");
        const fechaFinDato = moment(dato.fechaVencimiento, "YYYY-MM-DD");

        return (
          fechaInicioDato.isSameOrAfter(fechaInicio) &&
          fechaFinDato.isSameOrBefore(fechaFin)
        );
      });

      // Workbook para guardar los datos
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Informe");

      // Estructura del excel
      worksheet.columns = [
        { header: "RUT Usuario", key: "RUT", width: 15},
        { header: "Nombre", key: "nombre", width: 20 },
        { header: "Correo Electronico", key: "email", width: 40},
        { header: "Descripcion Deuda", key: "descripcion", width: 20 },
        { header: "Fecha de Emisión", key: "fechaInicio", width: 15 },
        { header: "Fecha de Termino", key: "fechaFin", width: 15 },
        { header: "Estado de Deuda", key: "estado", width: 15 },
      ];

      // Agrega los datos que correspondan a la fecha al .xlsx
      datosFiltrados.forEach((dato) => {
        worksheet.addRow({
          RUT: dato.usuario.RUT,
          nombre: dato.usuario.username,
          email: dato.usuario.email,
          descripcion: dato.descripcion,
          fechaInicio: moment(dato.fechaEmision).format("YYYY-MM-DD"),
          fechaFin: moment(dato.fechaVencimiento).format("YYYY-MM-DD"),
          estado: dato.estado,
        });
      });


      // Genera el archivo Excel y lo almacena en un buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Retorna el archivo Excel y su nombre
      return {
        buffer,
        nombreArchivo: `Informe_deudas_${moment().format(
          "DD-MM-YYYY_HH-mm",
        )}.xlsx`,
      };
    } catch (error) {
      console.error("Error al generar el informe Excel:", error);
      throw error;
    }
  }

  // Se genera el informe con las fechas especificadas en el body -----------------------------------------------------
 // Se genera el informe con las fechas especificadas en el body -----------------------------------------------------
generarInformeExcel(listado_deudas, fechaInicioMoment, fechaFinMoment)
.then((informe) => {
  // Configura las cabeceras de la respuesta HTTP
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${informe.nombreArchivo}`,
  );
  // Envia mensaje de éxito y el archivo como respuesta
  console.log("Informe Excel generado, se llama:\n", informe.nombreArchivo);
  
  // Cambia esta línea para enviar el buffer como respuesta directa
  res.end(informe.buffer);
})
.catch((error) => {
  console.error("Error al generar el informe Excel:", error);
  res.status(500).send("Error al generar el informe");
});
}

module.exports = { router, informeExcel };
