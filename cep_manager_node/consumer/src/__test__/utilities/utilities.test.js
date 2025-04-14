const {removeHifen,getvalueKey} = require ('../../utilities/utilities.js');

describe('Teste classe utilities', () => {

    it('Função deve remover o hifen dos caracteres do CEP', () => {
       const cepWithHifen = '75902-030';
       const cepFormated = removeHifen(cepWithHifen);
       expect (cepFormated).toBe('75902030'); 
    })


});

describe('getvalueKey', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('deve retornar o valor do campo passado via key', () => {
        const inputJson = JSON.stringify({
            cep: '75902030',
            status: 'PENDENTE'
        });

        const result = getvalueKey(inputJson, 'cep');

        expect(result).toBe('75902030');
        expect(console.log).toHaveBeenCalledWith('75902030');
    });

    it('deve retornar undefined se a chave não existir', () => {
        const inputJson = JSON.stringify({
            cep: '75902030'
        });

        const result = getvalueKey(inputJson, 'status');

        expect(result).toBeUndefined();
        expect(console.log).toHaveBeenCalledWith(undefined);
    });
});
