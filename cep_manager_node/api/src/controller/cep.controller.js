const dbService = require('../services/mongodb.service');
const CepModel = require('../model/class.cep')
const { sendMessageQueue } = require('../services/sqs.service');
require('dotenv').config();

const collectionName = process.env.COLLECTIONAME;

async function registerAndQueue(req, res) {


    try {
        const { cep } = req.body;
        const newCep = new CepModel(cep);
        const result = await dbService.create(collectionName, newCep);
        
        const resultsqs = await sendMessageQueue({
            id: result.insertedId,
            cep: cep,
            status: "PENDENTE"
        });

        if (result.insertedId && resultsqs.MessageId) {
            res.json({
                "id": result.insertedId,
                "idQueue": resultsqs.MessageId,
                "cep": cep,
                "status": "inserido com status  : PENDENTE"
            });
        } else {
            res.json({
                falha: "Falha ao inserir registro no banco ou registro na fila"
            })
            console.log('Erro ao inserir registro no banco ou na fila');
        }
    } catch (error) {
        console.error("Error Controller : ", error);
        res.json({
            error: "Error no bloco try do controller"
        })
    }
}
module.exports = registerAndQueue;