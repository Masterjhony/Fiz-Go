# Fiz-Go

Plataforma mobile/web para conectar clientes e profissionais de serviços gerais.

## 🚀 Funcionalidades

### Para Clientes
- **Cadastro/Login Social**: Autenticação via Google, Facebook, Apple
- **Geolocalização**: Encontre profissionais próximos
- **Pedidos com Foto**: Envie fotos do serviço necessário
- **Chat em Tempo Real**: Comunicação direta com profissionais
- **Agenda**: Agendamento de serviços
- **Pagamentos Pix com Escrow**: Pagamentos seguros
- **Avaliações e Histórico**: Sistema completo de reviews

### Para Profissionais
- **Cadastro de Serviços**: Gerencie seus serviços oferecidos
- **Agenda**: Controle sua disponibilidade
- **Chat**: Comunicação com clientes
- **Histórico de Trabalhos**: Acompanhe seus serviços realizados
- **Avaliações**: Receba feedback dos clientes

### Painel Administrativo
- **Gestão de Usuários**: Gerenciamento completo de usuários
- **Gestão de Serviços**: Controle de categorias e serviços
- **Repasses**: Gestão de pagamentos e comissões

## 🏗️ Arquitetura

### Frontend
- **Flutter**: Aplicativo mobile multiplataforma
- **Flutter Web**: Interface web responsiva

### Backend
- **Node.js/NestJS**: API REST robusta e escalável
- **PostgreSQL**: Banco de dados principal
- **Redis**: Cache e sessões
- **JWT**: Autenticação e autorização

### Cloud & DevOps
- **AWS/GCP**: Infraestrutura em nuvem
- **Docker**: Containerização
- **CI/CD**: Integração e deploy contínuo
- **GitHub Actions**: Automação de workflows

## 📱 Estrutura do Projeto

```
Fiz-Go/
├── agents/                           # Núcleo de memória e logs dos agentes de IA
│   ├── agent_state.json              # Estado atual (contexto resumido)
│   ├── agent_log.jsonl               # Log de eventos (imutável)
│   ├── prompts/                      # Prompts canônicos dos agentes
│   ├── tools/                        # Contratos das ferramentas
│   ├── policies/                     # Regras LGPD e privacidade
│   └── schemas/                      # Schemas de validação JSON
│
├── docs/                             # Documentação estruturada
│   ├── requisitos/                   # Levantamento de requisitos
│   ├── arquitetura/                  # Documentação técnica e API
│   ├── cronograma/                   # Planejamento e marcos
│   └── atas/                         # Registros de reuniões
│
├── mobile/                           # Flutter app (Android/iOS/Web)
│   ├── lib/
│   │   └── integration/agents/       # Integração com sistema de agentes
│   └── assets/
│
├── backend/                          # NestJS API server
│   ├── src/
│   │   ├── modules/                  # Módulos funcionais
│   │   ├── common/                   # Utilitários compartilhados
│   │   └── integration/agents/       # Client para gravar logs/estado
│   └── database/
│
├── infra/                            # Infraestrutura e DevOps
│   ├── ci-cd/                        # Documentação de CI/CD
│   ├── docker/                       # Dockerfiles e configs
│   ├── terraform/                    # Infrastructure as Code
│   └── scripts/                      # Scripts utilitários
│
├── .env.example                      # Template de variáveis de ambiente
└── docker-compose.yml               # Ambiente de desenvolvimento
```

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Flutter 3.16+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Configuração de Desenvolvimento

1. **Clone o repositório**
```bash
git clone https://github.com/Masterjhony/Fiz-Go.git
cd Fiz-Go
```

2. **Inicie os serviços com Docker**
```bash
docker-compose up -d
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Configure o backend**
```bash
cd backend
npm install
npm run migration:run
npm run dev
```

5. **Configure o mobile**
```bash
cd mobile
flutter pub get
flutter run
```

## 🤖 Sistema de Agentes de IA

O projeto integra um sistema avançado de agentes de IA para:
- **Memória Persistente**: Mantém contexto e histórico completo do desenvolvimento
- **Logging Automático**: Registra todas as mudanças e eventos relevantes
- **Análise Inteligente**: Fornece insights sobre qualidade e progresso do código
- **Integração CI/CD**: Conecta com pipelines para visibilidade completa

### Estrutura dos Agentes
- `agents/agent_state.json` - Estado atual consolidado do projeto
- `agents/agent_log.jsonl` - Log imutável de eventos (um por linha)
- `agents/prompts/` - Diretrizes e comportamento dos agentes
- `agents/policies/` - Compliance LGPD e classificação de dados

## 📚 Documentação

- [Guia de Instalação](docs/requisitos/installation.md)
- [API Documentation](docs/arquitetura/api.md)
- [Sistema de Agentes](agents/README.md)
- [Diretrizes LGPD](agents/policies/privacy.md)
- [Guia de Contribuição](docs/contributing.md)

## 🤝 Metodologia

- **Agile/Scrum**: Desenvolvimento iterativo
- **CI/CD**: Deploy automatizado
- **Code Review**: Revisão de código obrigatória
- **Testes Automatizados**: Cobertura completa

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🧑‍💻 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

Para dúvidas e suporte, entre em contato através das issues do GitHub.
