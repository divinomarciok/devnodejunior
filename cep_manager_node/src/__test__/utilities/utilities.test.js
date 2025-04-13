const removeHifen = require ('../../utilities/utilities.js');

describe('Teste classe utilities', () => {

    it('Função deve remover o hifen dos caracteres do CEP', () => {
       const cepWithHifen = '75902-030';
       const cepFormated = removeHifen(cepWithHifen);
       expect (cepFormated).toBe('75902030'); 
    })


});