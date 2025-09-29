# Guia de Instalação - Fiz-Go

Este guia irá ajudá-lo a configurar o ambiente de desenvolvimento completo para o Fiz-Go.

## 📋 Pré-requisitos

### Software Necessário
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Flutter** 3.16+ ([Guia de Instalação](https://flutter.dev/docs/get-started/install))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))
- **PostgreSQL** 15+ (opcional se usar Docker)
- **Redis** 7+ (opcional se usar Docker)
- **Git** ([Download](https://git-scm.com/))

### Contas Necessárias
- Conta Google Developer (para OAuth)
- Conta Facebook Developer (para OAuth)
- Conta Firebase (para notificações push)

## 🚀 Configuração do Projeto

### 1. Clone o Repositório

```bash
git clone https://github.com/Masterjhony/Fiz-Go.git
cd Fiz-Go
```

### 2. Configuração do Backend

#### 2.1. Instalar Dependências
```bash
cd backend
npm install
```

#### 2.2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL=postgresql://fizgo_user:fizgo_password@localhost:5432/fizgo

# JWT
JWT_SECRET=seu-jwt-secret-super-seguro

# OAuth
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
FACEBOOK_APP_ID=seu-facebook-app-id
FACEBOOK_APP_SECRET=seu-facebook-app-secret

# PIX (para produção)
PIX_API_KEY=sua-pix-api-key
```

#### 2.3. Iniciar Serviços com Docker
```bash
# Na raiz do projeto
docker-compose up -d postgres redis
```

#### 2.4. Executar Migrações
```bash
cd backend
npm run migration:run
```

#### 2.5. Iniciar o Servidor
```bash
npm run start:dev
```

O backend estará disponível em: `http://localhost:3000`
Documentação da API: `http://localhost:3000/api/docs`

### 3. Configuração do Frontend

#### 3.1. Instalar Dependências
```bash
cd frontend
flutter pub get
```

#### 3.2. Configurar Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Adicione um app Android e iOS
3. Baixe os arquivos de configuração:
   - `google-services.json` → `frontend/android/app/`
   - `GoogleService-Info.plist` → `frontend/ios/Runner/`

#### 3.3. Configurar OAuth

**Google Sign-In:**
1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie credenciais OAuth 2.0
3. Configure as URLs de callback

**Facebook Login:**
1. Vá para [Facebook Developers](https://developers.facebook.com/)
2. Crie um app e configure o Facebook Login
3. Adicione as configurações no arquivo `strings.xml` (Android) e `Info.plist` (iOS)

#### 3.4. Executar o App
```bash
# Para desenvolvimento (debug)
flutter run

# Para web
flutter run -d chrome

# Para build de produção
flutter build apk --release
flutter build web --release
```

## 🐳 Usando Docker (Recomendado)

### Backend + Banco de Dados
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Parar serviços
docker-compose down
```

### Acessar Banco de Dados
```bash
# Conectar ao PostgreSQL
docker exec -it fiz-go-postgres psql -U fizgo_user -d fizgo

# Conectar ao Redis
docker exec -it fiz-go-redis redis-cli
```

## 🧪 Executando Testes

### Backend
```bash
cd backend

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend
```bash
cd frontend

# Testes unitários
flutter test

# Testes de integração
flutter test integration_test/
```

### Deploy Frontend no GitHub Pages
O projeto está configurado para fazer deploy automático no GitHub Pages quando código é enviado para a branch main.

A aplicação web estará disponível em: `https://masterjhony.github.io/Fiz-Go/`

## 📞 Suporte

Se encontrar problemas durante a instalação:

1. Verifique a documentação oficial do Flutter e Node.js
2. Consulte os logs de erro completos
3. Abra uma issue no GitHub com detalhes do problema
4. Entre em contato através das issues do repositório