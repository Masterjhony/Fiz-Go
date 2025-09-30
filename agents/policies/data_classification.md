# Classificação de Dados - Fiz-Go

## Níveis de Classificação

### 1. PÚBLICO
**Definição**: Informações que podem ser divulgadas publicamente sem restrições.

**Exemplos**:
- Documentação de API pública
- Material de marketing aprovado
- Informações de contato da empresa
- Políticas de privacidade e termos de uso
- Tutoriais e guias de uso

**Proteção**: Nenhuma proteção especial necessária
**Retenção**: Indefinida
**Acesso**: Público irrestrito

### 2. INTERNO
**Definição**: Informações destinadas ao uso interno da organização.

**Exemplos**:
- Documentação técnica interna
- Procedimentos operacionais
- Métricas de performance não sensíveis
- Roadmaps de produto (não estratégicos)
- Comunicações internas gerais

**Proteção**: Controle de acesso básico
**Retenção**: Conforme política interna (3-7 anos)
**Acesso**: Funcionários e colaboradores autorizados

### 3. CONFIDENCIAL
**Definição**: Informações que, se divulgadas, podem causar danos ao negócio ou usuários.

**Exemplos**:
- Código-fonte proprietário
- Estratégias de negócio
- Contratos e acordos comerciais
- Dados financeiros da empresa
- Informações sobre vulnerabilidades de segurança
- Métricas de negócio sensíveis

**Proteção**: 
- Criptografia em trânsito e repouso
- Controle de acesso baseado em função (RBAC)
- Logs de auditoria obrigatórios
- Classificação clara em documentos

**Retenção**: 5-10 anos ou conforme exigência legal
**Acesso**: Apenas pessoal com necessidade específica

### 4. RESTRITO (Dados Pessoais)
**Definição**: Dados pessoais dos usuários sob proteção da LGPD.

#### 4.1 Dados Pessoais Básicos
- Nome, e-mail, telefone
- Endereço e dados de localização
- Preferências de serviços
- Histórico de interações

**Proteção**:
- Criptografia AES-256
- Tokenização quando possível
- Pseudonimização para analytics
- Controle granular de consentimento

#### 4.2 Dados Pessoais Sensíveis
- Dados biométricos (se implementados)
- Dados de saúde (se relevantes aos serviços)
- Dados de localização em tempo real
- Informações sobre orientação sexual/religiosa (se coletadas)

**Proteção**:
- Criptografia avançada
- Segregação de dados
- Consentimento explícito obrigatório
- Auditoria contínua de acesso

#### 4.3 Dados Financeiros
- Informações de cartão de crédito (tokenizadas)
- Dados bancários
- Histórico de transações
- Informações de PIX

**Proteção**:
- Tokenização completa
- Criptografia de ponta a ponta
- Segregação de ambiente
- Conformidade PCI-DSS

**Retenção**: Mínimo necessário, máximo 5 anos (requisito fiscal)
**Acesso**: Estritamente controlado e auditado

## Implementação Técnica

### Marcação de Dados
```typescript
// Exemplo de classificação em código
interface UserData {
  id: string;                    // INTERNO
  name: string;                  // RESTRITO - Dados Pessoais
  email: string;                 // RESTRITO - Dados Pessoais
  creditCard?: string;           // RESTRITO - Dados Financeiros (tokenizado)
  publicProfile: PublicProfile;  // PÚBLICO
}

// Marcação com decorators
class UserService {
  @DataClassification('RESTRITO')
  async getUserPersonalData(userId: string) {
    // Implementação
  }
  
  @DataClassification('PÚBLICO')
  async getPublicProfile(userId: string) {
    // Implementação
  }
}
```

### Controle de Acesso por Classificação
```yaml
access_control:
  PÚBLICO:
    read: ['*']
    write: ['admin', 'content_manager']
  
  INTERNO:
    read: ['employee', 'contractor']
    write: ['employee']
  
  CONFIDENCIAL:
    read: ['senior_employee', 'admin']
    write: ['admin', 'tech_lead']
  
  RESTRITO:
    read: ['data_processor', 'admin']
    write: ['data_controller', 'admin']
    audit: required
```

### Logs de Auditoria
```json
{
  "timestamp": "2025-09-30T10:00:00Z",
  "user_id": "user123",
  "action": "READ",
  "resource": "user_personal_data",
  "classification": "RESTRITO",
  "success": true,
  "ip_address": "192.168.1.1",
  "user_agent": "FizGo-Mobile/1.0",
  "legal_basis": "contract_execution"
}
```

## Fluxo de Trabalho

### Classificação de Novos Dados
1. **Identificação**: Determinar a natureza dos dados
2. **Análise de Impacto**: Avaliar riscos da divulgação
3. **Classificação**: Aplicar nível apropriado
4. **Implementação**: Aplicar controles de proteção
5. **Documentação**: Registrar classificação e justificativa
6. **Revisão**: Validação pela equipe de privacidade

### Reclassificação
- Revisão anual obrigatória
- Reclassificação por mudança de contexto
- Upgrade automático em caso de dúvida
- Downgrade apenas com aprovação formal

### Tratamento por Classificação

#### Para RESTRITO (Dados Pessoais):
- Base legal identificada e documentada
- Consentimento específico quando necessário
- Minimização de dados aplicada
- Pseudonimização/anonimização quando possível
- Controle de retenção automatizado
- Direitos dos titulares implementados

#### Para CONFIDENCIAL:
- Acordo de confidencialidade obrigatório
- Acesso baseado em necessidade
- Logs de auditoria detalhados
- Backup seguro com criptografia

#### Para INTERNO:
- Controle de acesso básico
- Proteção contra vazamento externo
- Política de clean desk

#### Para PÚBLICO:
- Aprovação para publicação
- Revisão de conteúdo sensível
- Controle de versão

## Responsabilidades

### Data Protection Officer (DPO)
- Definição de políticas de classificação
- Aprovação de reclassificações
- Auditoria de conformidade
- Treinamento da equipe

### Desenvolvedores
- Implementação de controles técnicos
- Marcação adequada de dados no código
- Testes de segurança por classificação
- Documentação técnica

### Administradores de Sistema
- Configuração de controles de acesso
- Monitoramento de logs de auditoria
- Implementação de backup seguro
- Gestão de incidentes

### Usuários do Sistema
- Respeitar classificações estabelecidas
- Reportar possíveis vazamentos
- Seguir procedimentos de segurança
- Participar de treinamentos

## Monitoramento e Compliance

### Métricas de Conformidade
- Porcentagem de dados classificados
- Tempo médio para classificação
- Número de incidentes por classificação
- Taxa de conformidade em auditorias

### Alertas Automáticos
- Acesso a dados RESTRITO fora do horário comercial
- Tentativas de acesso negadas
- Downloads em massa de dados CONFIDENCIAL
- Alterações em classificações

### Relatórios Periódicos
- Relatório mensal de acessos por classificação
- Análise trimestral de incidentes
- Revisão anual de políticas de classificação
- Relatório de conformidade para auditoria externa

**Aprovação**: Data Protection Officer
**Data de Vigência**: 30 de setembro de 2025
**Próxima Revisão**: 30 de setembro de 2026