const { saveAddress, getAddressById, getAllAddresses } = require('../../repositories/address.repository');
const dbService = require('../../service/mongodb.service');

jest.mock('../../service/mongodb.service');

describe('Teste classe AddressRepository', () => {
    const COLLECTION_NAME = 'Address';
    
    const mockAddressData = {
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
    
    const mockInsertResult = {
        acknowledged: true,
        insertedId: 'mock-id-123'
    };
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('Deve salvar um endereço com sucesso', async () => {
        dbService.create.mockResolvedValue(mockInsertResult);
        
        const result = await saveAddress(mockAddressData);
        
        expect(dbService.create).toHaveBeenCalledWith(COLLECTION_NAME, mockAddressData);
        
        expect(result).toEqual(mockInsertResult);
        expect(result.acknowledged).toBe(true);
        expect(result.insertedId).toBe('mock-id-123');
    });
    
    it('Deve lançar erro ao tentar salvar um endereço inválido', async () => {
        const mockError = new Error('Erro ao salvar');
        dbService.create.mockRejectedValue(mockError);
        
        await expect(saveAddress(mockAddressData)).rejects.toThrow('Erro ao salvar');
        
        expect(dbService.create).toHaveBeenCalledWith(COLLECTION_NAME, mockAddressData);
    });
    
    it('Deve buscar um endereço pelo ID com sucesso', async () => {
        const mockAddress = { ...mockAddressData, _id: 'mock-id-123' };
        dbService.getById.mockResolvedValue(mockAddress);
        
        const result = await getAddressById('mock-id-123');
        
        expect(dbService.getById).toHaveBeenCalledWith(COLLECTION_NAME, 'mock-id-123');
        
        expect(result).toEqual(mockAddress);
    });
    
    it('Deve lançar erro ao buscar um endereço com ID inválido', async () => {
        const mockError = new Error('Endereço não encontrado');
        dbService.getById.mockRejectedValue(mockError);
        
        await expect(getAddressById('id-inexistente')).rejects.toThrow('Endereço não encontrado');
        
        expect(dbService.getById).toHaveBeenCalledWith(COLLECTION_NAME, 'id-inexistente');
    });
    
    it('Deve buscar todos os endereços com sucesso', async () => {
        const mockAddresses = [
            { ...mockAddressData, _id: 'mock-id-123' },
            { ...mockAddressData, _id: 'mock-id-456', logradouro: 'Outra Rua' }
        ];
        dbService.getAll.mockResolvedValue(mockAddresses);
        
        const result = await getAllAddresses();
        
        expect(dbService.getAll).toHaveBeenCalledWith(COLLECTION_NAME);
        
        expect(result).toEqual(mockAddresses);
        expect(result).toHaveLength(2);
        expect(result[0]._id).toBe('mock-id-123');
        expect(result[1]._id).toBe('mock-id-456');
    });
    
    it('Deve lançar erro ao buscar todos os endereços quando há falha no banco', async () => {
        const mockError = new Error('Erro ao buscar');
        dbService.getAll.mockRejectedValue(mockError);
        
        await expect(getAllAddresses()).rejects.toThrow('Erro ao buscar');
        
        expect(dbService.getAll).toHaveBeenCalledWith(COLLECTION_NAME);
    });
});