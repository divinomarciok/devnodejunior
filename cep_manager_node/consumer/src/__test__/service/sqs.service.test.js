const { SQSClient, ReceiveMessageCommand, DeleteMessageBatchCommand } = require("@aws-sdk/client-sqs");
const { sqsMonitor, deleteMessageQueue } = require('../../service/sqs.service');

jest.mock('@aws-sdk/client-sqs');

describe("Teste classe SQS Monitor", () => {
    
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    beforeEach(() => {
       
        jest.clearAllMocks();       
       
        console.log = jest.fn();
        console.error = jest.fn();        
 
        SQSClient.prototype.send = jest.fn();
    });
    
    afterEach(() => {
      
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    });
    
    it("Deve processar mensagens quando a fila contém mensagens", async () => {
   
        const mockMessages = [
            {
                MessageId: 'msg1',
                ReceiptHandle: 'receipt1',
                Body: JSON.stringify({ id: 'test-id-1', data: 'test-data-1' })
            },
            {
                MessageId: 'msg2',
                ReceiptHandle: 'receipt2',
                Body: JSON.stringify({ id: 'test-id-2', data: 'test-data-2' })
            }
        ];
        
         SQSClient.prototype.send.mockImplementationOnce(() => {
            return Promise.resolve({ Messages: mockMessages });
        });
          
        await sqsMonitor();
        
        
        expect(SQSClient.prototype.send).toHaveBeenCalledTimes(1);
        expect(SQSClient.prototype.send.mock.calls[0][0]).toBeInstanceOf(ReceiveMessageCommand);      
        
     
    });
    
    it("Deve informar quando não há mensagens na fila", async () => {
     
        SQSClient.prototype.send.mockImplementationOnce(() => {
            return Promise.resolve({ Messages: [] });
        });
        
         await sqsMonitor();               
        expect(SQSClient.prototype.send).toHaveBeenCalledTimes(1);
        expect(SQSClient.prototype.send.mock.calls[0][0]).toBeInstanceOf(ReceiveMessageCommand);
        
       
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Nenhuma mensagem nova na fila <CEP_MANAGER_QUEUE>"));
    });
    

    it("Deve excluir mensagens após processamento com sucesso", async () => {
       
        const mockMessages = [
            {
                MessageId: "msg1",
                ReceiptHandle: "receipt1",
                Body: JSON.stringify({ id: "test-id-1" })
            },
            {
                MessageId: "msg2",
                ReceiptHandle: "receipt2",
                Body: JSON.stringify({ id: "test-id-2" })
            }
        ];
        
        SQSClient.prototype.send.mockImplementationOnce(() => {
            return Promise.resolve({ 
                Successful: [
                    { Id: "msg1" },
                    { Id: "msg" }
                ],
                Failed: []
            });
        });
        
    
        await deleteMessageQueue(mockMessages);
        
 
        expect(SQSClient.prototype.send).toHaveBeenCalledTimes(1);
        expect(SQSClient.prototype.send.mock.calls[0][0] instanceof DeleteMessageBatchCommand).toBe(true);       
    
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining("2 : mensagens excluídas com sucesso"));
    });

    it("Deve tratar falhas ao excluir mensagens", async () => {
    
        const mockMessages = [
            {
                MessageId: "msg1",
                ReceiptHandle: "receipt1",
                Body: JSON.stringify({ id: "test-id-1" })
            }
        ];
        
        SQSClient.prototype.send.mockImplementationOnce(() => {
            return Promise.resolve({ 
                Successful: [],
                Failed: [{ Id: 'msg1', Code: 'TestError', Message: 'Erro de teste' }]
            });
        });
        
     
        await deleteMessageQueue(mockMessages);
        
        expect(SQSClient.prototype.send).toHaveBeenCalledTimes(1);        
  
        expect(console.error).toHaveBeenCalledWith('Erros ao excluir mensagens ', [
            { Id: 'msg1', Code: 'TestError', Message: 'Erro de teste' }
        ]);
    });
    
    it("Deve tratar erro ao excluir mensagens", async () => { 

        const mockMessages = [{ MessageId: "msg1", ReceiptHandle: "receipt1" }];       
        const mockError = new Error("Erro de teste na exclusão");

        SQSClient.prototype.send.mockRejectedValueOnce(mockError);        
      
        await deleteMessageQueue(mockMessages);        
        
        expect(console.error).toHaveBeenCalledWith("Erro ao excluir lote de mensagens", mockError);
    });
});