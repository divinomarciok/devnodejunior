# Projeto CEP Manager

### Visão Geral

O Projeto CEP Manager é uma aplicação Node.js responsável por consultar informações de endereços a partir de códigos (CEPs) e armazená-los em um banco de dados MongoDB.È utilizadp uma fila de mensagens SQS para processar as requisições de CEP de forma assíncrona, garantindo escalabilidade.

## Funcionalidades Principais

* **Consulta de CEP**: Busca informações detalhadas de endereço através de uma API externa (ViaCEP).

* **Processamento Assíncrono**: Utiliza uma fila SQS para receber e processar as requisições de consulta de CEP.

* **Armazenamento no MongoDB**: Persiste as informações de endereço consultadas em um banco de dados MongoDB para consultas futuras.

* **Monitoramento de Fila**: Permite monitorar o estado da fila SQS e o processamento de mensagens.

* **Testes Unitários**: Inclui testes unitários para garantir funcionamento das funcionalidades principais.

## Arquitetura

O projeto segue uma arquitetura baseada em microsserviços, com os seguintes componentes principais:

* **API**: Responsável por receber requisições.
* **Consumer**: Aplicação Node.js que consome mensagens da fila SQS, consulta a API de CEP e armazena os dados no MongoDB.
* **SQS**: Fila de mensagens utilizada para comunicação assíncrona.
* **MongoDB**: Banco de dados NoSQL para armazenar as informações de endereço.
* **Serviços**: Módulos responsáveis pela lógica de negócio, como comunicação com a API de CEP (api.service.js), interação com o MongoDB (mongodb.service.js) e interação com o SQS (sqs.service.js).
* **Testes**: Testes unitários utilizando Jest (__test__ diretório).

### Pré-requisitos

Antes de executar o projeto, você precisará ter instalado:

* **Node.js**: Versão 18 ou superior.

* **AWS CLI**: Configurado com as credenciais necessárias para acessar o SQS.

 * **MongoDB**: Uma instância do MongoDB rodando localmente ou acessível através de uma URI.

Variáveis de Ambiente: Configure as seguintes variáveis de ambiente em um arquivo .env na raiz do projeto:


  ```
    QUEUEURL=SUA_URL_DA_FILA_SQS
    REGION=SUA_REGIAO_AWS
    MONGODB_URI=SUA_STRING_DE_CONEXAO_DO_MONGODB
    MONGODB_DB_NAME=NOME_DO_SEU_BANCO_DE_DADOS_MONGODB
    ```
