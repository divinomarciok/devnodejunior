const axios = require('axios');

async function checkCepApi(cep) {
  try {

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (response.status === 200 && !response.data.erro) {
      //console.log('Dados do CEP recebidos:', response.data);        
      return response.data;
    } else {
      console.log(`Erro ao consultar CEP ${cep}:`, response.data);
      return null;
    }
  } catch (error) {
    console.error(`Erro ao consultar o CEP :`, error.message);
    return null;
  }
};

module.exports = checkCepApi;