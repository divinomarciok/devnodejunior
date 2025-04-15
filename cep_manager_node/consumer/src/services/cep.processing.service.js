const dbService = require('./mongodb.service');
const checkCepApi = require('./api.service');
const { sqsMonitor, deleteMessageQueue } = require('./sqs.service');
const { ObjectId } = require('mongodb'); // Importe ObjectId aqui



async function cepProcessing() {
    try {

        const dataQueue = await sqsMonitor();
        if (dataQueue != null) {
            const sucessoHandles = await processMessageLote(dataQueue);
            await deleteMessageQueue(sucessoHandles);        }

    } catch (error) {
        console.error("Erro ao resolver mensagem da fila : ", error)
    }


}

async function updateDataCepMongoDb(collection, id, dataCep) {

    try {

        const objectId = new ObjectId(id);
        console.log("objectid >> ",objectId)
        const dataCepRefresh = await dbService.updateById(collection, objectId, dataCep, { new: true });

        console.log("cep atualizado", dataCepRefresh);
       // if (dataCepRefresh) {
       //     console.log('registro atualizado')
       //     return dataCepRefresh;
       // } else {
       //     console.log('erro ao atualizar');
       //
       // }


    } catch (error) {
        console.log(error);
    }



}


function createObjectUpdte(cepData) {

    if (cepData != null) {
        const jsonAtualizado =
        {
            status: "CONCLUIDO",
            data: cepData

        }
        return jsonAtualizado;
    } else {
        const jsonAtualizado =
        {
            status: "REJEITADO",

        }
        return jsonAtualizado;
    }

}

async function processMessageLote(mensagens) {
    if (mensagens.length > 0) {

        console.log(`Total de ${mensagens.length} mensagens para processar neste lote.`);

        mensagens.map(async (message) => {
        
            const cep = getvalueKey(message.Body,"cep");    
            const id =  getvalueKey(message.Body,"id");
            console.log('pegou o id no map',id);
            const cepData = await checkCepApi(cep);
            const dataUpdate = createObjectUpdte(cepData);

            const update = await updateDataCepMongoDb(process.env.COLECTIONNAME,id,dataUpdate);
            if(update){
                console.log(update.value);
                console.log(update);
            }
           
        })


        return mensagens;
    } else {
        console.log('Não há mensagens para processar neste lote.');
        return [];
    }
}




async function atualizarRegistro(collectionName, id, dataRecord) {
    const data = {
        "status": "CONCLUIDO",
        "data": dataCep
    }

    try {
        const updatedRecord = await mongoService.updateByStringId(
            collectionName,
            id,
            updateInformation
        );
        if (updatedRecord) {
            console.log('Registro atualizado com sucesso:', updatedRecord);
        } else {
            console.log('Nenhum registro encontrado com o ID:', recordId);
        }
    } catch (error) {
        console.error('Erro ao atualizar o registro:', error);
    }
}

function getvalueKey(body,key){

    body  = JSON.parse(body);
    const cep = body[key];
    console.log(cep);
    return cep;
}

//setInterval(cepProcessing, 5000);

module.exports= cepProcessing;