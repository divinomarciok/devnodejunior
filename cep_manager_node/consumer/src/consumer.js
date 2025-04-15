const cepProcessing = require('./services/cep.processing.service')
require('dotenv').config();


console.log("CEP PROCESSING  > ON ");
setInterval(cepProcessing,process.env.TIMELOOP);