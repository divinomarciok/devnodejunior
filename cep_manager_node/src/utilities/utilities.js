function removeHifen(cep){
    if(!cep){
        return '';        
    }
    return cep.replace(/[^0-9]/g,'');
}

module.exports = removeHifen;