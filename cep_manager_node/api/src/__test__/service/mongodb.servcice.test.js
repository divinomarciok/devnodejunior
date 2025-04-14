const DbService = require("../../services/mongodb.service"); 
const { ObjectId } = require("mongodb");

describe("Teste classe DbService", () => {
   
    const collectionName = "test_collection";
    let testDocId;
    let testDoc;

    beforeAll(async () => {
        testDocId = new ObjectId();
        testDoc = {
            _id: testDocId,
            name: "Test User",
            email: "test@example.com",
            createdAt: new Date()
        };
        
        await DbService.connect();
        const collection = await DbService.getCollection(collectionName);
        await collection.insertOne(testDoc);
    });

    afterAll(async () => {
        const collection = await DbService.getCollection(collectionName);
        await collection.deleteMany({});
        await DbService.close();
    });

    it("Deve conectar ao MongoDB com sucesso", async () => {
        const db = await DbService.connect();
        expect(db).toBeDefined();
        expect(db).not.toBeNull();
    });

    it("Deve obter uma coleção com sucesso", async () => {
        const collection = await DbService.getCollection(collectionName);
        expect(collection).toBeDefined();
        expect(collection.collectionName).toBe(collectionName);
    });


    it("Deve buscar um documento pelo ID com sucesso", async () => {
        const foundDoc = await DbService.getById(collectionName, testDocId);
        expect(foundDoc).toBeDefined();
        expect(foundDoc._id).toEqual(testDocId);
        expect(foundDoc.name).toBe("Test User");
        expect(foundDoc.email).toBe("test@example.com");
    });


    it("Deve fechar a conexão com sucesso", async () => {
        await DbService.close();
        const db = await DbService.connect();
        expect(db).toBeDefined();
    });
});