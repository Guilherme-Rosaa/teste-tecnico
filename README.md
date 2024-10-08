# Teste Tecnico

Este projeto foi gerado com Angular CLI versão 18.1.4.

## Sobre

teste-tecnico-interface é o frontend da aplicação, construído com Angular, e teste-tecnico-api é o backend construído com Node.js. Eles interagem para formar a aplicação completa.

## Configuração e Execução

### Ambiente de Desenvolvimento

#### Frontend (TesteTecnicoInterface)

1. **Instalar Dependências**

   Navegue até o diretório do frontend e instale as dependências:

   ```bash
   cd teste-tecnico-interface
   npm install
   ```

2. **Executar o Servidor de Desenvolvimento**

   Inicie o servidor de desenvolvimento com:

   ```bash
   ng serve
   ```

   Navegue para [http://localhost:4200/](http://localhost:4200/) para visualizar a aplicação. O aplicativo será recarregado automaticamente se você modificar algum arquivo de origem.

#### Backend (TesteTecnicoApi)

1. **Instalar Dependências**

   Navegue até o diretório da API e instale as dependências:

   ```bash
   cd teste-tecnico-api
   npm install
   ```

2. **Executar a API**

   Inicie o servidor da API com:

   ```bash
   npm start
   ```

   A API estará disponível na porta configurada no `server.js` (por padrão, pode ser [http://localhost:3000/](http://localhost:3000/)).

### Build

#### Frontend (TesteTecnicoInterface)

Para gerar os artefatos de build, execute:

```bash
ng build
```

Os arquivos de build serão armazenados no diretório `dist/`.

Para builds específicos, você pode usar:

- **Build de Produção:**

  ```bash
  ng build --prod
  ```

- **Build para Ambiente de Staging (se aplicável):**

  ```bash
  ng build --configuration=staging
  ```

#### Backend (TesteTecnicoApi)

Não há um comando específico para build no Node.js, pois o código JavaScript é executado diretamente. Você pode usar ferramentas como PM2 para gerenciar e monitorar a execução da API em produção.

### Deploy

#### Frontend (TesteTecnicoInterface)

1. **Hospedar o Frontend**

   - **Usar Amazon S3:**
     - Criar um bucket no Amazon S3: Acesse o console do S3 e crie um bucket.
     - Configurar o bucket para hospedagem de site estático: Habilite a opção de hospedagem de site estático e defina o `index.html` como o documento de índice.
     - Fazer o upload dos arquivos de build: Faça o upload do conteúdo do diretório `dist/` para o bucket.

   - **Configurar o Amazon CloudFront (opcional):**
     - Criar uma distribuição no CloudFront: Aponte a distribuição para o bucket S3.
     - Ajustar configurações de cache e segurança: Configure conforme necessário.

#### Backend (TesteTecnicoApi)

1. **Hospedar a API**

   - **Usar Amazon EC2:**
     - Criar uma instância EC2: Escolha uma AMI apropriada e configure a instância.
     - Instalar dependências e fazer o deploy da API: Conecte-se à instância via SSH, instale o Node.js e as dependências, e faça o deploy da API.
     - Configurar o servidor: Configure o servidor para rodar a API e ajuste as regras de segurança.

   - **Usar AWS Lambda (opcional):**
     - Criar uma função Lambda: Configure a função para rodar a API e faça o upload do código.
     - Configurar o API Gateway: Crie uma API no API Gateway para servir como endpoint para a função Lambda.

   - **Configurar o Banco de Dados (opcional):**
     - Usar Amazon RDS: Crie uma instância RDS para o banco de dados se necessário.

### Executar Frontend e API Simultaneamente

Para rodar tanto o frontend quanto a API ao mesmo tempo, você pode seguir dois métodos:

- **Método 1: Usando o concurrently**

  1. **Configurar Scripts**

     No diretório raiz do projeto, crie ou edite um `package.json` para incluir:

     ```json
     {
       "devDependencies": {
         "concurrently": "^8.2.2"
       },
       "scripts": {
         "start:api": "cd teste-tecnico-api && npm start",
         "start:frontend": "cd teste-tecnico-interface && ng serve",
         "start": "concurrently \"npm run start:api\" \"npm run start:frontend\""
       }
     }
     ```

  2. **Executar**

     Com todos os scripts configurados, inicie ambos os projetos com:

     ```bash
     npm start
     ```

- **Método 2: Executando Separadamente**

  1. **Navegar para o diretório da API e iniciar**

     No terminal, entre no diretório da API:

     ```bash
     cd teste-tecnico-api
     ```

     E inicie a API:

     ```bash
     npm start
     ```

  2. **Navegar para o diretório do frontend e iniciar**

     Em outro terminal, entre no diretório do frontend:

     ```bash
     cd teste-tecnico-interface
     ```

     E inicie o frontend:

     ```bash
     ng serve
     ```

     Navegue para [http://localhost:4200/](http://localhost:4200/) para visualizar o frontend, enquanto a API estará rodando na porta configurada.

### Ajuda Adicional

Para mais ajuda com o Angular CLI, utilize:

```bash
ng help
```

Ou consulte a Visão Geral do Angular CLI e Referência de Comandos.

Para mais ajuda com o Node.js e gerenciamento de pacotes, consulte a Documentação do Node.js e Documentação do npm.
