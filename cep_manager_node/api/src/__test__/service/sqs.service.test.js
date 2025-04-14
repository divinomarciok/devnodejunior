const { sendMessageQueue } = require("../../services/sqs.service");
const { SendMessageCommand } = require("@aws-sdk/client-sqs");

jest.mock("@aws-sdk/client-sqs", () => {
  const sendMock = jest.fn();

  return {
    SQSClient: jest.fn(() => ({
      send: sendMock
    })),
    SendMessageCommand: jest.fn(),
    __mocks__: {
      sendMock
    }
  };
});

describe("Teste da função sendMessageQueue (simplificado)", () => {
  const { __mocks__ } = require("@aws-sdk/client-sqs");
  const mockSend = __mocks__.sendMock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.QUEUEURL = "https://sqs.sa-east-1.amazonaws.com/623360491589/cep_manager_queue";
    process.env.REGION = "sa-east-1";
  });

  it("Deve tentar enviar uma mensagem para a fila e retornar o resultado da AWS", async () => {
    const fakeResult = { MessageId: "1234", ResponseMetadata: {} };
    mockSend.mockResolvedValue(fakeResult);

    const result = await sendMessageQueue({ cep:"86010-001" });

    expect(SendMessageCommand).toHaveBeenCalledWith({
      QueueUrl: process.env.QUEUEURL,
      MessageBody: JSON.stringify({ cep: "86010-001" }),
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeResult);
  });

  it("Deve tratar erro caso o envio falhe", async () => {
    mockSend.mockRejectedValue(new Error("Erro de envio"));

    const result = await sendMessageQueue({ cep: "0000-000" });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });
});
