const DbService = require('../../service/mongodb.service'); // Ajuste o caminho conforme necessário
const { ObjectId } = require('mongodb');

describe('Teste classe DbService', () => {
    // Variáveis para testes
    const collectionName = 'test_collection';
    let testDocId;
    let testDoc;

    beforeAll(async () => {
        testDocId = new ObjectId();
        testDoc = {
            _id: testDocId,
            name: 'Test User',
            email: 'test@example.com',
            createdAt: new Date()
        };
        await DbService.connect();
    });

    afterAll(async () => {
        const collection = await DbService.getCollection(collectionName);
        await collection.deleteMany({});
        await DbService.close();
    });

    it('Deve conectar ao MongoDB com sucesso', async () => {
        const db = await DbService.connect();
        expect(db).toBeDefined();
        expect(db).not.toBeNull();
    });

    it('Deve obter uma coleção com sucesso', async () => {
        const collection = await DbService.getCollection(collectionName);
        expect(collection).toBeDefined();
        expect(collection.collectionName).toBe(collectionName);
    });

    it('Deve criar um documento com sucesso', async () => {
        const result = await DbService.create(collectionName, testDoc);
        expect(result).toBeDefined();
        expect(result.acknowledged).toBe(true);
        expect(result.insertedId).toEqual(testDocId);
    });

    it('Deve buscar um documento pelo ID com sucesso', async () => {
        const foundDoc = await DbService.getById(collectionName, testDocId);
        expect(foundDoc).toBeDefined();
        expect(foundDoc._id).toEqual(testDocId);
        expect(foundDoc.name).toBe('Test User');
        expect(foundDoc.email).toBe('test@example.com');
    });

    it('Deve buscar todos os documentos com sucesso', async () => {
        const docs = await DbService.getAll(collectionName);
        expect(docs).toBeDefined();
        expect(Array.isArray(docs)).toBe(true);
        expect(docs.length).toBeGreaterThan(0);
        
        const testDocExists = docs.some(doc => doc._id.toString() === testDocId.toString());
        expect(testDocExists).toBe(true);
    });

    it('Deve atualizar um documento com sucesso', async () => {
        const updateData = {
            name: 'Updated User',
            updatedAt: new Date()
        };
        
        const result = await DbService.update(collectionName, testDocId, updateData);
        expect(result).toBeDefined();
        expect(result.acknowledged).toBe(true);
        expect(result.modifiedCount).toBe(1);
        
        const updatedDoc = await DbService.getById(collectionName, testDocId);
        expect(updatedDoc.name).toBe('Updated User');
        expect(updatedDoc.email).toBe('test@example.com');
        expect(updatedDoc.updatedAt).toBeDefined();
    });

    it('Deve fechar a conexão com sucesso', async () => {
        await DbService.close();
        const db = await DbService.connect();
        expect(db).toBeDefined();
    });
});