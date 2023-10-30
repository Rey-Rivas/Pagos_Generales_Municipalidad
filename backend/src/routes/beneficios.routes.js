const { Router } = require('express');
const beneficioController = require('../controllers/beneficio.controller.js');
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware = require("../middlewares/authorization.middleware.js");
const router = Router();
router.use(authenticationMiddleware);

router.get('/:id', beneficioController.getBeneficio);
router.post('/',beneficioController.createBeneficio);
router.post('/estado', authorizationMiddleware.isAdmin,beneficioController.updateEstado);
module.exports = router;