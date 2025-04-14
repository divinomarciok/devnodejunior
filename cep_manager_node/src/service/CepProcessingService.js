const dbService = require('../service/mongodb.service');
const checkCepApi = require('./api.service');
const { sqsMonitor, deleteMessageQueue } = require('../service/sqs.service');
const {getvalueKey} = require ('../utilities/utilities');

async function cepProcessing() {
    try {

        const dataQueue = await sqsMonitor();
        if (dataQueue != null) {
            const sucessoHandles = await processarLoteDeMensagens(dataQueue);
            await deleteMessageQueue(sucessoHandles);
        }

    } catch (error) {
        console.error("Erro ao resolver mensagem da fila : ", error)
    }


}

async function updateDataCepMongoDb(Address, id, dataCep) {

    try {
        const dataCepRefresh = await Cep.updateById(Address,
            id,
            {
                data: dataCep,
                status: 'CONCLUIDO'
            },
            { new: true }
        );

        if (dataCepRefresh) {
            console.log('registro atualizado')
            return dataCepRefresh;
        } else {
            console.log('erro ao atualizar');
        }


    } catch (error) {
        console.log(error);
    }



}

async function createObjectUpdte(cepData) {

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

async function processarLoteDeMensagens(mensagens) {
    if (mensagens.length > 0) {

        console.log(`Total de ${mensagens.length} mensagens para processar neste lote.`);

        mensagens.map(async (message) => {
        
            const cep = getvalueKey(message.Body,"cep");          
            const cepData = await checkCepApi(cep);
            const dataUpdate = createObjectUpdte(cepData);

            console.log(dataUpdate);        
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

setInterval(cepProcessing, 5000);