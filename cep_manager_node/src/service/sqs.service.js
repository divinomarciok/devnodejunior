const { SQSClient, ReceiveMessageCommand, DeleteMessageBatchCommand } = require('@aws-sdk/client-sqs');

const queueURL = 'https://sqs.sa-east-1.amazonaws.com/623360491589/cep_manager_queue';
const region =  'sa-east-1' 
const sqsClient = new SQSClient({ region });

async function sqsMonitor() {
  const receiveParams = {
    QueueUrl: queueURL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  };

  try {
    const receiveCommand = new ReceiveMessageCommand(receiveParams);
    const data = await sqsClient.send(receiveCommand);


    if (data.Messages && data.Messages.length > 0) {
      console.log(`[${new Date().toLocaleString()}]\n Quantidade mensagens recebidas <CEP_MANAGER_QUEUE> : ${data.Messages.length}`);

      console.log(data.Messages);

      return data.Messages;
    } else {
      console.log(`[${new Date().toLocaleString()}] Nenhuma mensagem nova na fila <CEP_MANAGER_QUEUE>`);
      return null;
    }
  } catch (err) {
    console.error('Erro ao receber mensagens fila <CEP_MANAGER_QUEUE> :', err);
  }
}


async function deleteMessageQueue(messages) {
  const deleteEntries = messages.map(message => ({
    Id: message.MessageId,
    ReceiptHandle: message.ReceiptHandle,
  }));

  const deleteParams = {
    QueueUrl: queueURL,
    Entries: deleteEntries,
  };

  try {
    const deleteCommand = new DeleteMessageBatchCommand(deleteParams);
    const deleteResult = await sqsClient.send(deleteCommand);
    if (deleteResult.Successful) {
      console.log(`[${new Date().toLocaleString()}] ${deleteResult.Successful.length} : mensagens excluídas com sucesso`);
    }
    if (deleteResult.Failed) {
      console.error('Erros ao excluir mensagens ', deleteResult.Failed);
    }
  } catch (err) {
    console.error('Erro ao excluir lote de mensagens ', err);
  }
}

console.log('Serviço de monitoramento de fila SQS iniciado');

module.exports = { deleteMessageQueue, sqsMonitor };
