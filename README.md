ThorcFit - Documentação do Projeto

Notion do trabalho( contém toda documentação ): https://grandiose-latency-d0d.notion.site/THORCFIT-TG-II-20ee392f4691809b94b7c78b94e2cbdb?pvs=73

Este repositório contém o código-fonte do aplicativo ThorcFit, uma plataforma para gerenciamento de atividades físicas e nutricionais. Este documento serve como um guia para entender a estrutura do projeto, como configurá-lo e executá-lo, além de fornecer a documentação técnica gerada.

Estrutura do Projeto

O projeto ThorcFit é dividido em duas partes principais:

•
thorcfit_backend/: Contém o código do servidor (backend) desenvolvido em Node.js.

•
raiz/frontend/: Contém o código do cliente (frontend) desenvolvido em React.

•
thorcfit.sql: Arquivo SQL com o schema do banco de dados e dados iniciais.

•
documentacao/: Diretório que contém os diagramas UML gerados e outros documentos técnicos. (está faltando diagramas entretanto se encontram no Notion do trabalho.)

Configuração e Execução

Para configurar e executar o projeto ThorcFit localmente, siga os passos abaixo:

Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

•
Node.js (versão 14 ou superior)

•
npm (gerenciador de pacotes do Node.js)

•
MySQL Server (versão 8.0 ou superior)

1. Clonar o Repositório



git clone https://github.com/lipeszl/ThorcFit
cd ThorcFit


2. Configurar o Banco de Dados

O projeto utiliza um banco de dados MySQL. Você precisará criar um banco de dados chamado thorcfit e importar o schema fornecido.



sudo mysql -u root -e "CREATE DATABASE IF NOT EXISTS thorcfit;"
sudo mysql -u root thorcfit < thorcfit.sql


Nota: Se você tiver problemas de acesso ao MySQL com o usuário root sem senha, pode ser necessário configurá-lo para permitir isso:



sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;"


3. Configurar e Iniciar o Backend

Navegue até o diretório do backend, instale as dependências e inicie o servidor:



cd thorcfit_backend
npm install
# Crie um arquivo .env na raiz do diretório thorcfit_backend com o seguinte conteúdo:
# DB_NAME=thorcfit
# DB_USER=root
# DB_PASSWORD=
# DB_HOST=localhost
# DB_PORT=3306
npm start


O servidor backend estará rodando na porta 3001 (http://localhost:3001).

4. Configurar e Iniciar o Frontend

Em um novo terminal, navegue até o diretório do frontend, instale as dependências e inicie a aplicação:



cd raiz/frontend
npm install
npm start


A aplicação frontend estará disponível na porta 3000 (http://localhost:3000).

Credenciais de Teste

Para acessar a aplicação, você pode usar as seguintes credenciais de usuário:

•
Email: diogo@teste.com

•
Senha: Abc123!@

