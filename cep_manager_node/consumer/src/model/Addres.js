class Address{
    constructor(json){
        this.cep = json.cep;
        this.logradouro = json.logradouro;
        this.complemento = json.complemento;
        this.unidade = json.unidade;
        this.bairro = json.bairro;
        this.localidade = json.localidade;
        this.uf = json.uf;
        this.estado = json.estado;
        this.regiao = json.regiao;
        this.ibge = json.ibge;
        this.gia = json.gia;
        this.ddd = json.ddd;
        this.siafi = json.siafi;        
    }

    toString(){
        let addressString = `${this.logradouro}, ${this.bairro}, ${this.localidade} - ${this.uf}, ${this.cep}`;
        if (this.complemento) {
          addressString += ` (${this.complemento})`;
        }
        return addressString;
    }

    getCep() {
        return this.cep;
    }
}

module.exports = Address;
