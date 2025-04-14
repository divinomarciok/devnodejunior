function removeHifen(cep){
    if(!cep){
        return '';        
    }
    return cep.replace(/[^0-9]/g,'');
}

function getvalueKey(body,key){

    body  = JSON.parse(body);
    const cep = body[key];
    console.log(cep);
    return cep;
}

module.exports = {removeHifen,getvalueKey};