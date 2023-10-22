"use strict";

const startDate = '2023-01-01';
const endDate = '2023-12-31';

const query = {
    date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
    }
};

// llama a la bdd que se este usando
const results = await Muni - db.find(query);

const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('informe.pdf'));

// Agregar contenido al PDF
doc.text('Informe de datos:');
results.forEach((item) => {
    doc.text(`- ${item.nombre}: ${item.valor}`);
});

// Finalizar y guardar el PDF
doc.end();

// exportacion de doc
module.exports = {
    doc
};