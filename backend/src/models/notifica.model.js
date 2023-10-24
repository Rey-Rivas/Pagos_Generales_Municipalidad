"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// Crea el esquema de la coleccion 'notifica'
const notificaSchema = new mongoose.Schema(
    {
        deudaID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deuda",
            primaryKey: true,          
            },
        RUTEncargado:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                primaryKey: true,            
            },
        RUTUsuario:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                primaryKey: true,          
            },
        fechadenotificacion: {
            type: Date,
            required: true,
        },  
    },
);

/** Modelo de datos 'notifica' */
const Notifica = mongoose.model("notifica", tramiteSchemaSchema);

// Exporta el modelo de datos 'notifica'
module.exports = Notifica;