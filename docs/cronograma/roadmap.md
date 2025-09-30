# Cronograma de Desenvolvimento - Fiz-Go

## Visão Geral

**Período Total**: 6 meses (Outubro 2025 - Março 2026)
**Metodologia**: Scrum com sprints de 2 semanas
**Equipe**: 3 desenvolvedores + 1 designer + 1 product owner

## Fase 1: Fundação (4 semanas - Out/2025)

### Sprint 1 (01-14 Out)
**Objetivo**: Estrutura base e autenticação

**Backend**:
- ✅ Setup inicial do NestJS
- ✅ Configuração do banco PostgreSQL
- ✅ Módulo de autenticação JWT
- ✅ Integração OAuth (Google, Facebook)
- ✅ Sistema de usuários básico

**Mobile**:
- ✅ Setup inicial Flutter
- 🔄 Telas de login/registro
- 🔄 Integração com backend de auth
- 🔄 Navegação básica

**Infraestrutura**:
- ✅ Docker Compose para desenvolvimento
- ✅ Sistema de agentes de IA
- 🔄 CI/CD básico com GitHub Actions

### Sprint 2 (15-28 Out)
**Objetivo**: Perfis de usuário e categorias

**Backend**:
- 📅 Módulo de perfis de usuário
- 📅 Sistema de categorias de serviços
- 📅 Upload de imagens (AWS S3)
- 📅 Validações e DTOs completos

**Mobile**:
- 📅 Tela de perfil do usuário
- 📅 Edição de perfil
- 📅 Upload de fotos
- 📅 Seleção de categorias (profissionais)

**Design**:
- 📅 Sistema de design completo
- 📅 Componentes reutilizáveis
- 📅 Guia de estilo

## Fase 2: Core Features (6 semanas - Nov/2025)

### Sprint 3 (29 Out - 11 Nov)
**Objetivo**: Geolocalização e busca

**Backend**:
- 📅 Integração com Google Maps API
- 📅 Cálculo de distâncias
- 📅 API de busca com filtros
- 📅 Indexação geoespacial

**Mobile**:
- 📅 Integração de mapas
- 📅 Geolocalização do usuário
- 📅 Tela de busca de profissionais
- 📅 Filtros avançados

### Sprint 4 (12-25 Nov)
**Objetivo**: Sistema de agendamento

**Backend**:
- 📅 Módulo de pedidos/agendamentos
- 📅 Sistema de status de pedidos
- 📅 Notificações push (FCM)
- 📅 API de disponibilidade

**Mobile**:
- 📅 Tela de solicitação de serviço
- 📅 Upload de fotos do problema
- 📅 Agendamento de data/hora
- 📅 Gerenciamento de pedidos

### Sprint 5 (26 Nov - 09 Dez)
**Objetivo**: Chat em tempo real

**Backend**:
- 📅 WebSocket Gateway
- 📅 Sistema de mensagens
- 📅 Histórico de conversas
- 📅 Upload de mídias no chat

**Mobile**:
- 📅 Interface de chat
- 📅 Mensagens em tempo real
- 📅 Envio de imagens
- 📅 Notificações de mensagens

## Fase 3: Pagamentos e Qualidade (4 semanas - Dez/2025)

### Sprint 6 (10-23 Dez)
**Objetivo**: Sistema de pagamentos PIX

**Backend**:
- 📅 Integração PIX com banco
- 📅 Sistema de escrow
- 📅 Webhooks de pagamento
- 📅 Cálculo de comissões

**Mobile**:
- 📅 Fluxo de pagamento
- 📅 QR Code PIX
- 📅 Confirmação de pagamentos
- 📅 Histórico financeiro

### Sprint 7 (24 Dez - 06 Jan)
**Objetivo**: Avaliações e reviews

**Backend**:
- 📅 Sistema de avaliações
- 📅 Cálculo de médias
- 📅 Moderação de conteúdo
- 📅 Relatórios de qualidade

**Mobile**:
- 📅 Tela de avaliação
- 📅 Exibição de reviews
- 📅 Sistema de denúncias
- 📅 Histórico de avaliações

## Fase 4: Administração e Polish (6 semanas - Jan-Fev/2026)

### Sprint 8 (07-20 Jan)
**Objetivo**: Painel administrativo

**Backend**:
- 📅 APIs administrativas
- 📅 Relatórios e analytics
- 📅 Gestão de usuários
- 📅 Configurações do sistema

**Web Admin**:
- 📅 Dashboard principal
- 📅 Gestão de usuários
- 📅 Relatórios financeiros
- 📅 Moderação de conteúdo

### Sprint 9 (21 Jan - 03 Fev)
**Objetivo**: Otimizações e segurança

**Backend**:
- 📅 Otimizações de performance
- 📅 Implementação LGPD completa
- 📅 Auditoria de segurança
- 📅 Rate limiting avançado

**Mobile**:
- 📅 Otimizações de UI/UX
- 📅 Tratamento de erros
- 📅 Modo offline básico
- 📅 Acessibilidade

### Sprint 10 (04-17 Fev)
**Objetivo**: Testes e correções

**Geral**:
- 📅 Testes automatizados completos
- 📅 Testes de carga e stress
- 📅 Correção de bugs críticos
- 📅 Documentação completa

## Fase 5: Deploy e Lançamento (4 semanas - Mar/2026)

### Sprint 11 (18 Fev - 03 Mar)
**Objetivo**: Preparação para produção

**DevOps**:
- 📅 Infraestrutura de produção
- 📅 Monitoramento e logs
- 📅 Backup e disaster recovery
- 📅 SSL e segurança

**QA**:
- 📅 Testes em ambiente de produção
- 📅 Testes de integração completos
- 📅 Validação de performance
- 📅 Teste de usabilidade

### Sprint 12 (04-17 Mar)
**Objetivo**: Lançamento beta

**Lançamento**:
- 📅 Deploy em produção
- 📅 Publicação na App Store/Play Store
- 📅 Campanha de marketing
- 📅 Suporte ao usuário

**Monitoramento**:
- 📅 Acompanhamento de métricas
- 📅 Correções de bugs críticos
- 📅 Feedback dos usuários
- 📅 Iterações rápidas

## Marcos Importantes

| Data | Marco | Status |
|------|--------|---------|
| 14/10/2025 | Autenticação completa | ✅ |
| 28/10/2025 | Perfis e categorias | 🔄 |
| 25/11/2025 | Sistema de agendamento | 📅 |
| 09/12/2025 | Chat em tempo real | 📅 |
| 23/12/2025 | Pagamentos PIX | 📅 |
| 06/01/2026 | Sistema de avaliações | 📅 |
| 03/02/2026 | Painel administrativo | 📅 |
| 17/02/2026 | Testes completos | 📅 |
| 17/03/2026 | Lançamento beta | 📅 |

## Riscos e Mitigações

### Riscos Técnicos
1. **Integração PIX complexa**
   - Mitigação: Começar integração cedo, ter plano B
   
2. **Performance com geolocalização**
   - Mitigação: Implementar cache e otimizações

3. **Escalabilidade do WebSocket**
   - Mitigação: Usar Redis para múltiplas instâncias

### Riscos de Negócio
1. **Regulamentações de pagamento**
   - Mitigação: Consultoria jurídica especializada

2. **Competição no mercado**
   - Mitigação: Diferenciação técnica e UX superior

3. **Adoção pelos profissionais**
   - Mitigação: Programa de incentivos iniciais

## Métricas de Sucesso

### Técnicas
- **Uptime**: >99.5%
- **Response time**: <500ms
- **Code coverage**: >80%
- **Bug rate**: <1 bug crítico/sprint

### Produto
- **NPS**: >70
- **Retention rate**: >60% (30 dias)
- **Conversion rate**: >5% (cadastro→primeiro pedido)
- **GMV**: R$ 10k no primeiro mês

---

**Legenda**:
- ✅ Concluído
- 🔄 Em andamento  
- 📅 Planejado

**Última atualização**: 30/09/2025
**Responsável**: Product Owner Fiz-Go