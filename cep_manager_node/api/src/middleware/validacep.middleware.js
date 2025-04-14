const {
  withoutCep,
  cepNoString,
  invalidCountCep,
  justNumbers,
  removeHifen,
  removeSpaces,
} = require('../utilities/utilities'); 


function validateCep(req, res, next) {

    const { cep } = req.body;

    const cepNoHifen = removeHifen(cep);
    const ceptreated  = removeSpaces(cepNoHifen);
  
    if (withoutCep(ceptreated)) {
      return res.status(400).json({ erro: "O campo cep no json é obrigatório" });
    }
  
    if (cepNoString(ceptreated)) {
      return res.status(400).json({ erro: "O campo cep deve ser uma string" });
    }
  
    if (invalidCountCep(ceptreated)) {
      return res.status(400).json({ erro: "O campo cep  deve ter 8 dígitos"});
    }
  
    if (justNumbers(ceptreated)) {
      return res.status(400).json({ erro: "O campo cep não deve conter caracteres não numéricos." });
    } 
        
    req.body.cep = ceptreated;
    next();
  }
  
  module.exports = validateCep;