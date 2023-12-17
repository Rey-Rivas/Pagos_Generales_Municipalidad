const beneficios = require("../models/beneficios.model.js");
const { handleError } = require("../utils/errorHandler");
async function createBeneficio(req) {
    try {
        const { beneficiosID, nombreBeneficio, descripcion, monto, estado, idDeuda, RUTUsuario } = req;
        const beneficio = new beneficios({
            beneficiosID,
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
            .populate("beneficiosID")
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
        const beneficio = await beneficios.findOne({beneficiosID: id})
        .populate("beneficiosID")
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
        const { beneficiosID, estado } = req;
        const beneficio = await beneficios.findOne({ beneficiosID: beneficiosID });
        if (!beneficio) return [null, "No hay beneficios"];
        beneficio.estado = estado;
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