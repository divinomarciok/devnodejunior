function removeHifen(cep){
    if(!cep){
        return '';        
    }
    return cep.replace(/[^0-9]/g,'');
}

function removeSpaces(cep) {
  if (typeof cep === 'string') {
    return cep.replace(/\s+/g, '');
  }
  return cep;
}


function withoutCep(cep) {
    return !cep 
 }
  
  function cepNoString(cep) {
    return typeof cep !== 'string';
  }
  
  function invalidCountCep(cep) {
    return cep.length !== 8;
  }
  
  function justNumbers(cep) {
    return !/^[0-9]+$/.test(cep);
  }

 

module.exports = {removeHifen,removeSpaces,justNumbers,cepNoString,withoutCep,invalidCountCep};