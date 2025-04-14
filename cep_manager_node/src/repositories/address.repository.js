const dbService = require('../service/mongodb.service');

const addressJson = {
  cep: '12345-678',
  logradouro: 'Rua Teste',
  complemento: 'Bairro Teste', 
  unidade: '',
  bairro: 'Cidade Teste', 
  localidade: 'XX',
  uf: 'Goiás',
  estado: 'Centro-Oeste',
  regiao: '5218805',
  ibge: '456769',
  gia: '64',
  ddd: '9571',
  siafi: ''
};

const COLLECTION_NAME = 'Address';

async function saveAddress(addressData) {
  try {
    const result = await dbService.create(COLLECTION_NAME, addressData);
    //console.log(result.insertedId);
     return result;
  } catch (error) {
    console.error('Erro ao salvar endereço:', error);
    throw error;
  }
}

async function getAddressById(id) {
  try {
    return await dbService.getById(COLLECTION_NAME, id);
  } catch (error) {
    console.error('Erro ao buscar endereço por ID:', error);
    throw error;
  }
}

async function getAllAddresses() {
  try {
    return await dbService.getAll(COLLECTION_NAME);
  } catch (error) {
    console.error('Erro ao buscar todos os endereços:', error);
    throw error;
  }
}

saveAddress(addressJson);

module.exports = { saveAddress, getAddressById, getAllAddresses };

