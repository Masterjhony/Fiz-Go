# Requisitos Funcionais - Fiz-Go

## 1. Autenticação e Cadastro

### 1.1 Cadastro de Usuários
- **RF-001**: O sistema deve permitir cadastro de clientes via e-mail/senha
- **RF-002**: O sistema deve permitir cadastro de profissionais via e-mail/senha
- **RF-003**: O sistema deve validar CPF para profissionais
- **RF-004**: O sistema deve permitir login social (Google, Facebook, Apple)
- **RF-005**: O sistema deve implementar verificação de e-mail

### 1.2 Perfis de Usuário
- **RF-006**: Clientes devem poder gerenciar perfil pessoal
- **RF-007**: Profissionais devem poder gerenciar perfil profissional
- **RF-008**: Sistema deve permitir upload de foto de perfil
- **RF-009**: Profissionais devem poder adicionar portfólio de trabalhos

## 2. Geolocalização e Busca

### 2.1 Localização
- **RF-010**: Sistema deve capturar localização atual do usuário
- **RF-011**: Sistema deve permitir busca por endereço
- **RF-012**: Sistema deve calcular distância entre cliente e profissional
- **RF-013**: Sistema deve exibir profissionais em mapa

### 2.2 Busca de Serviços
- **RF-014**: Sistema deve permitir busca por categoria de serviço
- **RF-015**: Sistema deve permitir filtros por preço, distância, avaliação
- **RF-016**: Sistema deve mostrar disponibilidade do profissional
- **RF-017**: Sistema deve permitir busca por texto livre

## 3. Agendamento de Serviços

### 3.1 Solicitação de Serviço
- **RF-018**: Cliente deve poder solicitar serviço com descrição
- **RF-019**: Cliente deve poder anexar fotos do problema/local
- **RF-020**: Sistema deve permitir agendamento com data/hora
- **RF-021**: Sistema deve calcular estimativa de preço

### 3.2 Gestão de Pedidos
- **RF-022**: Profissional deve receber notificação de novo pedido
- **RF-023**: Profissional deve poder aceitar/recusar pedido
- **RF-024**: Sistema deve permitir contrapropostas de preço
- **RF-025**: Sistema deve gerenciar status do pedido (solicitado, aceito, em andamento, concluído, cancelado)

## 4. Chat em Tempo Real

### 4.1 Comunicação
- **RF-026**: Sistema deve permitir chat entre cliente e profissional
- **RF-027**: Chat deve funcionar em tempo real (WebSocket)
- **RF-028**: Sistema deve permitir envio de imagens no chat
- **RF-029**: Sistema deve manter histórico de conversas
- **RF-030**: Sistema deve enviar notificações push para mensagens

## 5. Sistema de Pagamentos

### 5.1 PIX com Escrow
- **RF-031**: Sistema deve integrar pagamentos PIX
- **RF-032**: Sistema deve implementar escrow (retenção de pagamento)
- **RF-033**: Pagamento deve ser liberado após confirmação do serviço
- **RF-034**: Sistema deve permitir estorno/reembolso
- **RF-035**: Sistema deve calcular e reter comissão da plataforma

### 5.2 Gestão Financeira
- **RF-036**: Profissional deve poder configurar dados bancários
- **RF-037**: Sistema deve gerar relatórios financeiros
- **RF-038**: Sistema deve processar repasses periódicos
- **RF-039**: Sistema deve emitir comprovantes de pagamento

## 6. Avaliações e Reviews

### 6.1 Sistema de Avaliação
- **RF-040**: Cliente deve poder avaliar profissional (1-5 estrelas)
- **RF-041**: Cliente deve poder deixar comentário sobre serviço
- **RF-042**: Profissional deve poder avaliar cliente
- **RF-043**: Sistema deve calcular nota média do profissional
- **RF-044**: Sistema deve exibir reviews na busca

## 7. Painel Administrativo

### 7.1 Gestão de Usuários
- **RF-045**: Admin deve poder visualizar todos os usuários
- **RF-046**: Admin deve poder suspender/ativar usuários
- **RF-047**: Admin deve poder resetar senhas
- **RF-048**: Admin deve poder gerenciar denúncias

### 7.2 Gestão de Serviços
- **RF-049**: Admin deve poder criar/editar categorias de serviços
- **RF-050**: Admin deve poder moderar conteúdo
- **RF-051**: Admin deve poder configurar comissões
- **RF-052**: Admin deve poder gerar relatórios

### 7.3 Gestão Financeira
- **RF-053**: Admin deve poder visualizar transações
- **RF-054**: Admin deve poder processar reembolsos
- **RF-055**: Admin deve poder configurar taxas
- **RF-056**: Admin deve poder gerar relatórios financeiros

## 8. Notificações

### 8.1 Push Notifications
- **RF-057**: Sistema deve enviar notificação para novo pedido
- **RF-058**: Sistema deve notificar mudanças de status
- **RF-059**: Sistema deve notificar mensagens do chat
- **RF-060**: Sistema deve notificar pagamentos processados

### 8.2 Notificações por E-mail
- **RF-061**: Sistema deve enviar confirmação de cadastro
- **RF-062**: Sistema deve enviar recuperação de senha
- **RF-063**: Sistema deve enviar resumos periódicos
- **RF-064**: Sistema deve enviar alertas de segurança

## 9. Requisitos de Segurança

### 9.1 Proteção de Dados (LGPD)
- **RF-065**: Sistema deve implementar consentimentos granulares
- **RF-066**: Sistema deve permitir portabilidade de dados
- **RF-067**: Sistema deve permitir exclusão de dados
- **RF-068**: Sistema deve criptografar dados sensíveis
- **RF-069**: Sistema deve manter logs de auditoria

### 9.2 Autenticação e Autorização
- **RF-070**: Sistema deve usar tokens JWT
- **RF-071**: Sistema deve implementar refresh tokens
- **RF-072**: Sistema deve ter rate limiting
- **RF-073**: Sistema deve detectar tentativas de fraude
- **RF-074**: Sistema deve implementar 2FA (opcional)

## 10. Performance e Escalabilidade

### 10.1 Performance
- **RF-075**: API deve responder em menos de 500ms
- **RF-076**: App deve carregar em menos de 3 segundos
- **RF-077**: Imagens devem ser otimizadas automaticamente
- **RF-078**: Sistema deve implementar cache inteligente

### 10.2 Disponibilidade
- **RF-079**: Sistema deve ter uptime mínimo de 99.5%
- **RF-080**: Sistema deve ter backup automático diário
- **RF-081**: Sistema deve implementar monitoramento 24/7
- **RF-082**: Sistema deve ter plano de disaster recovery

---

**Versão**: 1.0  
**Data**: 30/09/2025  
**Responsável**: Equipe de Produto Fiz-Go