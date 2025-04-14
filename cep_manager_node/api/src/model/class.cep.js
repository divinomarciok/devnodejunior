class Cep {
    constructor(cep, status = 'PENDENTE', data = {}) {
      this.cep = cep;
      this.status = status;
      this.data = data;

    }
}

module.exports = Cep;