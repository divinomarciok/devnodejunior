const Router = require ('express');
const validateCep = require('../middleware/validacep.middleware');
const registerAndQueue = require('../controller/cep.controller');

const ceproute = Router();

ceproute.get('/cep',validateCep,registerAndQueue); 

module.exports = ceproute;