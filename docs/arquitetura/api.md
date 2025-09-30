# API Documentation - Fiz-Go

Esta documentação descreve os endpoints da API REST do Fiz-Go.

## 🌐 Base URL

- **Desenvolvimento:** `http://localhost:3000`
- **Produção:** `https://api.fizgo.com`

## 📚 Documentação Interativa

A API possui documentação interativa Swagger disponível em:
- `http://localhost:3000/api/docs`

## 🔐 Autenticação

A API usa autenticação JWT Bearer Token.

### Obter Token
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Usar Token
```bash
Authorization: Bearer <token>
```

## 📋 Endpoints Principais

### 🔐 Autenticação (`/auth`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar novo usuário |
| POST | `/auth/login` | Login com email/senha |
| POST | `/auth/social-login` | Login social (Google/Facebook) |
| GET | `/auth/google` | Iniciar OAuth Google |
| GET | `/auth/facebook` | Iniciar OAuth Facebook |
| GET | `/auth/profile` | Obter perfil do usuário autenticado |

### 👥 Usuários (`/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Listar todos os usuários |
| GET | `/users/providers` | Listar prestadores próximos |
| GET | `/users/:id` | Obter usuário por ID |
| PUT | `/users/profile` | Atualizar perfil do usuário |
| PUT | `/users/location` | Atualizar localização |
| PUT | `/users/availability` | Atualizar disponibilidade |

### 🛠️ Serviços (`/services`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/services` | Listar serviços disponíveis |
| POST | `/services` | Criar novo serviço |
| GET | `/services/my-services` | Meus serviços |
| GET | `/services/:id` | Obter serviço por ID |
| PATCH | `/services/:id` | Atualizar serviço |
| DELETE | `/services/:id` | Deletar serviço |

### 📦 Pedidos (`/orders`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/orders` | Listar meus pedidos |
| POST | `/orders` | Criar novo pedido |
| GET | `/orders/status/:status` | Pedidos por status |
| GET | `/orders/:id` | Obter pedido por ID |
| PATCH | `/orders/:id/status` | Atualizar status do pedido |

### ⭐ Avaliações (`/reviews`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/reviews/my-reviews` | Minhas avaliações |
| POST | `/reviews` | Criar nova avaliação |
| GET | `/reviews/user/:userId` | Avaliações de um usuário |
| GET | `/reviews/user/:userId/rating` | Rating médio do usuário |
| GET | `/reviews/order/:orderId` | Avaliações de um pedido |
| GET | `/reviews/:id` | Obter avaliação por ID |

### 💳 Pagamentos (`/payments`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/payments/my-payments` | Meus pagamentos |
| POST | `/payments` | Criar novo pagamento |
| GET | `/payments/stats` | Estatísticas de pagamento |
| GET | `/payments/order/:orderId` | Pagamentos de um pedido |
| GET | `/payments/:id` | Obter pagamento por ID |
| PATCH | `/payments/:id/confirm` | Confirmar pagamento |
| PATCH | `/payments/:id/release` | Liberar pagamento |
| PATCH | `/payments/:id/refund` | Estornar pagamento |

### 💬 Chat (`/chat`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/chat` | Listar meus chats |
| POST | `/chat` | Criar novo chat |
| GET | `/chat/unread-count` | Contagem de não lidas |
| GET | `/chat/:id` | Obter chat por ID |
| GET | `/chat/:id/messages` | Mensagens do chat |
| POST | `/chat/:id/messages` | Enviar mensagem |
| PATCH | `/chat/:id/read` | Marcar como lida |

### 🛡️ Admin (`/admin`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/admin/dashboard` | Dashboard administrativo |
| GET | `/admin/users` | Gerenciar usuários |
| PATCH | `/admin/users/:id/status` | Atualizar status do usuário |
| GET | `/admin/orders` | Gerenciar pedidos |
| GET | `/admin/services` | Gerenciar serviços |
| GET | `/admin/payments` | Gerenciar pagamentos |
| GET | `/admin/reviews` | Gerenciar avaliações |

## 🌐 WebSocket Events

### Conectar ao Chat
```javascript
const socket = io('http://localhost:3000');

// Entrar como usuário
socket.emit('join', { userId: 'user-id' });

// Entrar em um chat
socket.emit('joinChat', { chatId: 'chat-id' });

// Enviar mensagem
socket.emit('sendMessage', {
  chatId: 'chat-id',
  message: {
    content: 'Olá!',
    type: 'text'
  },
  userId: 'user-id'
});

// Receber mensagem
socket.on('newMessage', (data) => {
  console.log('Nova mensagem:', data.message);
});

// Notificação de mensagem
socket.on('messageNotification', (data) => {
  console.log('Notificação:', data);
});
```

## 📊 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Não autorizado |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito de dados |
| 500 | Internal Server Error - Erro interno |

## 🎯 Filtros e Paginação

### Busca por Localização
```bash
GET /users/providers?latitude=-23.5505&longitude=-46.6333&radius=10
GET /services?latitude=-23.5505&longitude=-46.6333&radius=5&category=Limpeza
```

### Paginação
```bash
GET /admin/users?page=1&limit=20
GET /orders?page=2&limit=10
```

### Filtros
```bash
GET /admin/users?status=active&role=provider
GET /orders/status/completed
GET /reviews/my-reviews?type=received
```

## 🔍 Exemplos de Uso

### Registrar Usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@example.com",
    "password": "password123",
    "role": "provider"
  }'
```

### Criar Serviço
```bash
curl -X POST http://localhost:3000/services \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Limpeza Residencial",
    "description": "Serviço completo de limpeza",
    "category": "Limpeza",
    "basePrice": 150.00,
    "estimatedDuration": 180
  }'
```

### Fazer Pedido
```bash
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "service-uuid",
    "description": "Preciso de limpeza completa",
    "scheduledAt": "2024-01-15T10:00:00Z",
    "address": "Rua das Flores, 123"
  }'
```

## 🚨 Rate Limiting

A API possui limitação de taxa:
- **Geral:** 100 requisições por minuto por IP
- **Auth:** 10 tentativas de login por minuto por IP
- **Upload:** 5 uploads por minuto por usuário

## 🔒 Segurança

- Todas as senhas são criptografadas com bcrypt
- Tokens JWT expiram em 24 horas
- CORS configurado para origens permitidas
- Validação de entrada em todos os endpoints
- Rate limiting para prevenir abuso

## 📧 Webhooks

### PIX Payment Webhook
```bash
POST /payments/webhook/pix
Content-Type: application/json
X-Webhook-Signature: <signature>

{
  "transactionId": "FIZ-PAY-123456",
  "status": "paid",
  "amount": 150.00,
  "paidAt": "2024-01-15T10:30:00Z"
}
```

Para mais detalhes, acesse a documentação Swagger em `/api/docs`.