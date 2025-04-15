const axios = require('axios');
const checkCepApi = require('../../services/api.service'); 

jest.mock('axios');

describe('Teste da função checkCepApi', () => {
    const validCep = '75901653';
    const invalidCep = '000000000';

    it('Deve retornar dados válidos para um CEP correto', async () => {
        const mockResponse = {
            status: 200,
            data: {
                cep: "75901-653",
                logradouro: "Rua Dona Maricota",
                complemento: "",
                unidade: "",
                bairro: "Jardim Neves",
                localidade: "Rio Verde",
                uf: "GO",
                estado: "Goiás",
                regiao: "Centro-Oeste",
                ibge: "5218805",
                gia: "",
                ddd: "64",
                siafi: "9571"
            },
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await checkCepApi(validCep);

        expect(result).toBeDefined();
        expect(result.cep).toBe('75901-653');
        expect(result.localidade).toBe('Rio Verde');
    });

    it('Deve retornar null se o CEP for inválido erro na resposta', async () => {
        const mockResponse = {
            status: 200,
            data: { erro: true },
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await checkCepApi(invalidCep);
        expect(result).toBeNull();
    });


    it('Deve retornar null se a API retornar um erro HTTP com status 400', async () => {
        axios.get.mockRejectedValue({
          isAxiosError: true, 
          response: {
            status: 400,
            data: { mensagem: 'CEP inválido' },
          },
        });
        
      
        const result = await checkCepApi('00000000'); 
        expect(result).toBeNull();
      });
});
