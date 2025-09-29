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
fiz-go/
├── frontend/          # Flutter mobile/web app
├── backend/           # NestJS API server
├── database/          # PostgreSQL schemas e migrations
├── docs/              # Documentação
├── .github/           # GitHub Actions workflows
└── docker-compose.yml # Configuração de desenvolvimento
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

3. **Configure o backend**
```bash
cd backend
npm install
npm run migration:run
npm run dev
```

4. **Configure o frontend**
```bash
cd frontend
flutter pub get
flutter run
```

## 📚 Documentação

- [Guia de Instalação](docs/installation.md)
- [API Documentation](docs/api.md)
- [Guia de Contribuição](docs/contributing.md)
- [Arquitetura do Sistema](docs/architecture.md)

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
