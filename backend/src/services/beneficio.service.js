const beneficios = require("../models/beneficios.model.js");
const { handleError } = require("../utils/errorHandler");
async function createBeneficio(req) {
    try {
        const { nombreBeneficio, descripcion, monto, estado, idDeuda, RUTUsuario } = req;
        const beneficio = new beneficios({
            nombreBeneficio,
            descripcion,
            monto,
            estado,
            idDeuda,
            RUTUsuario,
        });
        const beneficioCreado = await beneficio.save();
        return [beneficioCreado, null];
    } catch (error) {
        handleError(error, "beneficio.service -> createBeneficio");
    }
}

async function getBeneficios() {
    try {
        const beneficio = await beneficios.find()
            .populate("nombreBeneficio")
            .populate("descripcion")
            .populate("monto")
            .populate("estado")
            .populate("idDeuda")
            .populate("RUTUsuario")
            .exec();
        if (!beneficio) return [null, "No hay beneficios"];
        return [beneficio, null];
    } catch (error) {
        handleError(error, "beneficio.service -> getBeneficios");
    }
}




async function getBeneficioById(id) {
    try {
        const beneficio = await beneficios.findById(id)
        .populate("nombreBeneficio")
        .populate("descripcion")
        .populate("monto")
        .populate("estado")
        .populate("idDeuda")
        .populate("RUTUsuario")
        .exec();
        if (!beneficio) return [null, "No hay beneficios"];
        return [beneficio, null];
    } catch (error) {
        handleError(error, "beneficio.service -> getBeneficio");
    }
}

async function updateEstado(req) {
    try {
        const { params } = req;
        const { nombreBeneficio,descripcion,monto, estado,idDeuda } = req;
        console.log("id beneficio "+params);
        console.log("body: " + JSON.stringify(params));
        const beneficio = await beneficios.findById(id);
        if (!beneficio) return [null, "No hay beneficios"];
        beneficio.nombreBeneficio = nombreBeneficio;
        beneficio.descripcion = descripcion;
        beneficio.monto = monto;
        beneficio.estado = estado;
        beneficio.idDeuda = idDeuda;
        const beneficioActualizado = await beneficio.save();
        return [beneficioActualizado, null];
    } catch (error) {
        handleError(error, "beneficio.service -> updateEstado");
    }
}

module.exports = {
    getBeneficios,
    createBeneficio,
    getBeneficioById,
    updateEstado,
};