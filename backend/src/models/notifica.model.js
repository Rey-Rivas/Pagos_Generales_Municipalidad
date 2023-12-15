"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'notifica'
const notificaSchema = new mongoose.Schema(
    {
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            primaryKey: true,      
            },
        RUTEncargado:{
            type: String,
            required: true, 
            primaryKey: true,         
            },
        RUTUsuario:{
            type: String,
            required: true, 
            primaryKey: true,         
            },
        fechadenotificacion: {
            type: Date,
            required: true,
        },  
    },
);

/** Modelo de datos 'notifica' */
const Notifica = mongoose.model("notifica", notificaSchema);

// Exporta el modelo de datos 'notifica'
module.exports = Notifica;
