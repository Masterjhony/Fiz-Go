# Sistema de Agentes de IA - Fiz-Go

## Visão Geral

Este diretório contém o núcleo do sistema de memória e logs dos agentes de IA que auxiliam no desenvolvimento do projeto Fiz-Go. O sistema foi projetado para manter contexto persistente, registrar todas as ações de desenvolvimento e facilitar a colaboração entre desenvolvedores humanos e agentes de IA.

## Estrutura de Arquivos

```
agents/
├── agent_state.json          # Estado atual do projeto (sempre sobrescrito)
├── agent_log.jsonl           # Log imutável de eventos (1 linha por evento)
├── prompts/                  # Prompts canônicos e diretrizes
│   ├── system_prompt.md      # Prompt principal do sistema
│   └── writing_guidelines.md # Diretrizes de escrita e documentação
├── tools/                    # Contratos das ferramentas disponíveis
│   ├── search.yaml          # Ferramenta de busca semântica/textual
│   └── repo_ops.yaml        # Operações de repositório
├── policies/                 # Políticas e compliance
│   ├── privacy.md           # LGPD e proteção de dados
│   └── data_classification.md # Classificação de dados
├── schemas/                  # Schemas JSON para validação
│   ├── agent_log.schema.json   # Schema do log de eventos
│   └── agent_state.schema.json # Schema do estado do agente
└── README.md                # Este arquivo
```

## Componentes Principais

### 1. Estado do Agente (`agent_state.json`)

Arquivo que mantém o **estado atual consolidado** do projeto, incluindo:
- Contexto do projeto e tecnologias utilizadas
- Status de desenvolvimento de cada módulo
- Foco atual e próximas prioridades
- Decisões técnicas importantes
- Métricas de qualidade e performance

**Características:**
- ✅ Sempre sobrescrito com o estado mais recente
- ✅ Fornece visão consolidada do projeto
- ✅ Validado pelo schema `agent_state.schema.json`

### 2. Log de Eventos (`agent_log.jsonl`)

Registro **imutável e apendado** de todos os eventos relevantes:
- Mudanças de código e arquivos
- Execução de testes e builds
- Erros detectados e resolvidos
- Interações com ferramentas
- Marcos do projeto

**Características:**
- ✅ Um evento JSON por linha (formato JSONL)
- ✅ Imutável - apenas append de novos eventos
- ✅ Rastreabilidade completa das ações
- ✅ Validado pelo schema `agent_log.schema.json`

### 3. Sistema de Prompts (`prompts/`)

Conjunto de prompts canônicos que definem:
- Comportamento dos agentes de IA
- Diretrizes de escrita e documentação
- Padrões de codificação específicos do projeto
- Princípios de desenvolvimento

### 4. Ferramentas (`tools/`)

Especificações das ferramentas disponíveis aos agentes:
- Contratos de entrada e saída
- Capacidades e limitações
- Exemplos de uso
- Integração com o sistema de logs

### 5. Políticas (`policies/`)

Documentação de compliance e governança:
- LGPD e proteção de dados pessoais
- Classificação de dados por sensibilidade
- Políticas de segurança
- Diretrizes de privacidade

### 6. Schemas (`schemas/`)

Validação estrutural dos dados:
- Schema JSON para eventos do log
- Schema JSON para estado do agente
- Garantia de consistência dos dados

## Como Usar

### Para Desenvolvedores

1. **Consultar Estado Atual**:
   ```bash
   # Ver o estado consolidado do projeto
   cat agents/agent_state.json | jq '.'
   ```

2. **Acompanhar Eventos Recentes**:
   ```bash
   # Ver últimos 10 eventos
   tail -10 agents/agent_log.jsonl | jq '.'
   ```

3. **Buscar Eventos Específicos**:
   ```bash
   # Buscar eventos de uma data específica
   grep "2025-09-30" agents/agent_log.jsonl | jq '.'
   ```

### Para Agentes de IA

1. **Atualizar Estado**: 
   - Sempre atualizar `agent_state.json` após mudanças significativas
   - Usar o schema para validação antes de escrever

2. **Registrar Eventos**:
   - Adicionar linha ao `agent_log.jsonl` para cada ação relevante
   - Incluir contexto suficiente para rastreabilidade

3. **Seguir Prompts**:
   - Consultar `prompts/system_prompt.md` para comportamento
   - Aplicar `prompts/writing_guidelines.md` na documentação

### Para Scripts de Automação

```typescript
// Exemplo: Atualizar estado após deploy
import { readFileSync, writeFileSync } from 'fs';

const state = JSON.parse(readFileSync('agents/agent_state.json', 'utf8'));
state.environments.production.status = 'healthy';
state.environments.production.last_deployment = new Date().toISOString();
state.last_updated = new Date().toISOString();

writeFileSync('agents/agent_state.json', JSON.stringify(state, null, 2));

// Registrar evento no log
const logEvent = {
  timestamp: new Date().toISOString(),
  event_type: 'deployment',
  action: 'production_deploy',
  details: {
    message: 'Successfully deployed to production',
    version: '1.2.3'
  }
};

appendFileSync('agents/agent_log.jsonl', JSON.stringify(logEvent) + '\n');
```

## Integração com CI/CD

### GitHub Actions

Adicione steps nos workflows para atualizar o sistema de agentes:

```yaml
- name: Update Agent State
  run: |
    node infra/scripts/agents_update_state.ts \
      --event-type deployment \
      --action github_actions_deploy \
      --environment production \
      --version ${{ github.sha }}
```

### Hooks de Desenvolvimento

Configure hooks para registrar eventos automaticamente:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "node scripts/log_commit_event.js",
      "post-merge": "node scripts/update_agent_state.js"
    }
  }
}
```

## Padrões de Escrita

### Eventos de Log
- Use timestamps ISO 8601
- Categorize eventos corretamente
- Inclua contexto suficiente
- Mantenha consistência na estrutura

### Atualizações de Estado
- Sempre valide contra o schema
- Atualize `last_updated` 
- Mantenha histórico quando relevante
- Use dados estruturados

### Documentação
- Siga as diretrizes em `writing_guidelines.md`
- Mantenha exemplos atualizados
- Use linguagem clara e objetiva
- Inclua contexto do projeto Fiz-Go

## Manutenção

### Rotinas Regulares
- **Diária**: Verificar crescimento do log
- **Semanal**: Validar schemas e consistência
- **Mensal**: Arquivar logs antigos se necessário
- **Trimestral**: Revisar e atualizar prompts

### Monitoramento
- Tamanho dos arquivos de log
- Frequência de atualizações de estado
- Conformidade com schemas
- Performance de consultas

## Troubleshooting

### Problemas Comuns

1. **Log muito grande**:
   ```bash
   # Arquivar logs antigos
   head -1000 agents/agent_log.jsonl > agents/agent_log_recent.jsonl
   mv agents/agent_log.jsonl agents/archive/agent_log_$(date +%Y%m%d).jsonl
   mv agents/agent_log_recent.jsonl agents/agent_log.jsonl
   ```

2. **Estado inconsistente**:
   ```bash
   # Validar contra schema
   ajv validate -s agents/schemas/agent_state.schema.json -d agents/agent_state.json
   ```

3. **Eventos malformados**:
   ```bash
   # Verificar formato JSONL
   jq empty agents/agent_log.jsonl
   ```

## Contribuindo

1. Sempre valide mudanças contra os schemas
2. Teste scripts de atualização em ambiente de desenvolvimento
3. Mantenha documentação atualizada
4. Siga as diretrizes de escrita estabelecidas
5. Considere impacto na performance ao adicionar logs

## Versioning

- **Schema**: Semantic versioning para schemas
- **Estado**: Timestamp de última atualização
- **Log**: Imutável, apenas append
- **Documentação**: Versionada com o projeto

---

**Maintainers**: Equipe de Desenvolvimento Fiz-Go
**Última Atualização**: 30 de setembro de 2025
**Versão dos Schemas**: 1.0.0