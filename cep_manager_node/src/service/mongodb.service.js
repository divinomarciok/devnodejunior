const { MongoClient } = require('mongodb');
const dbConfig = require('../config/mongodb.config');

class DbService {
  constructor() {
    this.client = new MongoClient(dbConfig.uri, dbConfig.options);
    this.dbName = dbConfig.uri.split('/').pop();
    this.db = null;
  }

  async connect() {
    
    if (!this.db) {
      try {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        console.log('Conectado ao MongoDB');
      } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
      }
    }
    return this.db;
  }

  async getCollection(collectionName) {
    if (!this.db) {
      await this.connect();
    }
    return this.db.collection(collectionName);
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.db = null;
      console.log('Conexão com o MongoDB fechada');
    }
  }

  async getAll(collectionName) {
    if (!this.db) {
      await this.connect();
    }
    const collection = await this.getCollection(collectionName);
    return collection.find({}).toArray();
  }

  async getById(collectionName, id) {
    if (!this.db) {
      await this.connect();
    }
    const collection = await this.getCollection(collectionName);
    return collection.findOne({ _id: id });
    
  }

  async create(collectionName, userData) {
    if (!this.db) {
      await this.connect();
    }
    const collection = await this.getCollection(collectionName);  
    return collection.insertOne(userData);
  }

  async update(collectionName, id, userData) {
    if (!this.db) {
      await this.connect();
    }
    const collection = await this.getCollection(collectionName);
    return collection.updateOne(
      { _id: id },
      { $set: userData }
    );
  }

  async updateById(collectionName, id, updateData, options = {}) {
    
    if (!this.db) {
      await this.connect();
    }
    const collection = await this.getCollection(collectionName);
    const objectId = new ObjectId(id);
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: 'after', ...options } //
    );
    return result.value; 
  }
}

 
  

module.exports = new DbService();