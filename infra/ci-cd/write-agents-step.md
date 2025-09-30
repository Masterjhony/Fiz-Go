# Integração de Agentes de IA com CI/CD

## Visão Geral

Este documento descreve como os pipelines de CI/CD devem integrar-se com o sistema de agentes de IA do projeto Fiz-Go. O objetivo é manter o contexto e histórico completo do desenvolvimento automaticamente.

## Eventos Relevantes para Log

### 1. Eventos de Build
- Início e fim do processo de build
- Sucesso/falha da compilação
- Métricas de build (tempo, tamanho dos artefatos)
- Dependências atualizadas

### 2. Eventos de Teste
- Execução de testes unitários
- Execução de testes de integração
- Execução de testes E2E
- Cobertura de código
- Performance dos testes

### 3. Eventos de Deploy
- Deploy para staging
- Deploy para produção  
- Rollback de versão
- Health checks pós-deploy

### 4. Eventos de Qualidade
- Análise de código (SonarQube, ESLint)
- Verificação de segurança
- Auditoria de dependências
- Métricas de performance

## Implementação nos Workflows

### GitHub Actions

#### 1. Setup do Agente
Adicione este step no início de workflows relevantes:

```yaml
- name: Setup Agent Integration
  id: agent-setup
  run: |
    echo "AGENT_SESSION_ID=$(uuidgen)" >> $GITHUB_ENV
    echo "WORKFLOW_START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $GITHUB_ENV
    
    # Registra início do workflow
    node infra/scripts/agents_update_state.ts \
      --event-type "system_event" \
      --action "workflow_start" \
      --message "Started ${{ github.workflow }} workflow" \
      --session-id "${{ env.AGENT_SESSION_ID }}" \
      --context '{
        "workflow": "${{ github.workflow }}",
        "trigger": "${{ github.event_name }}",
        "branch": "${{ github.ref_name }}",
        "commit": "${{ github.sha }}",
        "actor": "${{ github.actor }}"
      }'
```

#### 2. Build e Teste
```yaml
- name: Build Application
  id: build
  run: |
    BUILD_START=$(date +%s%3N)
    
    # Executar build
    npm run build
    BUILD_STATUS=$?
    
    BUILD_END=$(date +%s%3N)
    BUILD_DURATION=$((BUILD_END - BUILD_START))
    
    # Registrar resultado
    node infra/scripts/agents_update_state.ts \
      --event-type "system_event" \
      --action "build_complete" \
      --message "Build completed with status: $BUILD_STATUS" \
      --session-id "${{ env.AGENT_SESSION_ID }}" \
      --metrics '{
        "duration_ms": '$BUILD_DURATION',
        "success": '$([[ $BUILD_STATUS -eq 0 ]] && echo "true" || echo "false")',
        "bundle_size_mb": '$(du -m dist/ | cut -f1)'
      }'

- name: Run Tests
  id: test
  run: |
    # Executar testes e capturar resultados
    npm run test:coverage > test_results.txt 2>&1
    TEST_STATUS=$?
    
    # Extrair métricas (exemplo)
    COVERAGE=$(grep -o '[0-9]\+\.[0-9]\+%' test_results.txt | tail -1 | tr -d '%')
    
    node infra/scripts/agents_update_state.ts \
      --event-type "test_execution" \
      --action "unit_tests" \
      --message "Unit tests completed" \
      --session-id "${{ env.AGENT_SESSION_ID }}" \
      --metrics '{
        "success": '$([[ $TEST_STATUS -eq 0 ]] && echo "true" || echo "false")',
        "coverage_percent": '$COVERAGE'
      }'
```

#### 3. Deploy
```yaml
- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: |
    DEPLOY_START=$(date +%s%3N)
    
    # Executar deploy
    ./deploy.sh production
    DEPLOY_STATUS=$?
    
    DEPLOY_END=$(date +%s%3N)
    DEPLOY_DURATION=$((DEPLOY_END - DEPLOY_START))
    
    # Registrar deploy
    node infra/scripts/agents_update_state.ts \
      --event-type "deployment" \
      --action "production_deploy" \
      --message "Production deployment completed" \
      --session-id "${{ env.AGENT_SESSION_ID }}" \
      --metrics '{
        "duration_ms": '$DEPLOY_DURATION',
        "success": '$([[ $DEPLOY_STATUS -eq 0 ]] && echo "true" || echo "false")',
        "version": "${{ github.sha }}"
      }' \
      --context '{
        "environment": "production",
        "project_phase": "deployment"
      }'

    # Atualizar estado dos ambientes
    if [[ $DEPLOY_STATUS -eq 0 ]]; then
      node infra/scripts/agents_update_state.ts \
        --update-environment "production" \
        --environment-status "healthy" \
        --environment-version "${{ github.sha }}"
    fi
```

#### 4. Finalização
```yaml
- name: Workflow Completion
  if: always()
  run: |
    WORKFLOW_END_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    node infra/scripts/agents_update_state.ts \
      --event-type "system_event" \
      --action "workflow_complete" \
      --message "Workflow ${{ github.workflow }} completed" \
      --session-id "${{ env.AGENT_SESSION_ID }}" \
      --context '{
        "workflow": "${{ github.workflow }}",
        "conclusion": "${{ job.status }}",
        "duration": "$(date -d "$WORKFLOW_END_TIME" +%s) - $(date -d "${{ env.WORKFLOW_START_TIME }}" +%s)"
      }'
```

### Exemplo de Workflow Completo

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Agent Integration
      id: agent-setup
      run: |
        echo "AGENT_SESSION_ID=$(uuidgen)" >> $GITHUB_ENV
        echo "WORKFLOW_START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $GITHUB_ENV
        node infra/scripts/agents_update_state.ts \
          --event-type "system_event" \
          --action "ci_start" \
          --message "Started CI pipeline for ${{ github.ref_name }}" \
          --session-id "${{ env.AGENT_SESSION_ID }}"
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install Backend Dependencies
      working-directory: backend
      run: |
        npm ci
        node ../infra/scripts/agents_update_state.ts \
          --event-type "dependency_update" \
          --action "npm_install" \
          --message "Installed backend dependencies" \
          --session-id "${{ env.AGENT_SESSION_ID }}"
    
    - name: Build Backend
      working-directory: backend
      run: |
        BUILD_START=$(date +%s%3N)
        npm run build
        BUILD_STATUS=$?
        BUILD_END=$(date +%s%3N)
        
        node ../infra/scripts/agents_update_state.ts \
          --event-type "system_event" \
          --action "backend_build" \
          --message "Backend build completed" \
          --session-id "${{ env.AGENT_SESSION_ID }}" \
          --metrics '{
            "duration_ms": '$((BUILD_END - BUILD_START))',
            "success": '$([[ $BUILD_STATUS -eq 0 ]] && echo "true" || echo "false")'
          }'
    
    - name: Run Backend Tests
      working-directory: backend
      run: |
        npm run test:cov
        node ../infra/scripts/agents_update_state.ts \
          --event-type "test_execution" \
          --action "backend_tests" \
          --message "Backend tests completed" \
          --session-id "${{ env.AGENT_SESSION_ID }}"
    
    - name: Setup Flutter
      if: github.ref == 'refs/heads/main'
      uses: subosito/flutter-action@v2
      with:
        flutter-version: '3.16.0'
    
    - name: Build Mobile App
      if: github.ref == 'refs/heads/main'
      working-directory: mobile
      run: |
        flutter pub get
        flutter build apk --release
        
        node ../infra/scripts/agents_update_state.ts \
          --event-type "system_event" \
          --action "mobile_build" \
          --message "Mobile app build completed" \
          --session-id "${{ env.AGENT_SESSION_ID }}" \
          --components '["mobile", "flutter"]'

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to Production
      run: |
        # Deploy logic here
        
        node infra/scripts/agents_update_state.ts \
          --event-type "deployment" \
          --action "production_release" \
          --message "Released version ${{ github.sha }} to production" \
          --context '{
            "environment": "production",
            "version": "${{ github.sha }}",
            "project_phase": "deployment"
          }'
```

## Métricas Importantes

### 1. Performance
- Tempo de build
- Tempo de testes
- Tempo de deploy
- Tamanho dos artefatos

### 2. Qualidade
- Cobertura de testes
- Número de issues de lint
- Vulnerabilidades de segurança
- Duplicação de código

### 3. Confiabilidade
- Taxa de sucesso de builds
- Taxa de sucesso de deploys
- Frequência de rollbacks
- Tempo médio de recuperação

## Alertas e Notificações

Configure alertas baseados nos logs dos agentes:

```yaml
- name: Check for Critical Issues
  if: always()
  run: |
    # Verificar logs recentes por problemas críticos
    CRITICAL_ISSUES=$(grep -c '"severity":"critical"' agents/agent_log.jsonl || echo 0)
    
    if [[ $CRITICAL_ISSUES -gt 0 ]]; then
      echo "::warning::Critical issues detected in agent logs"
      # Notificar equipe
    fi
```

## Scripts de Utilidade

Os scripts em `infra/scripts/` devem facilitar a integração:

- `agents_update_state.ts` - Script principal para logging
- `check_agent_health.ts` - Verificação de integridade dos logs
- `extract_metrics.ts` - Extração de métricas para dashboards
- `archive_old_logs.ts` - Arquivamento de logs antigos

## Melhores Práticas

1. **Sempre registre eventos significativos**
2. **Use session_id consistente por workflow**
3. **Inclua métricas mensuráveis**
4. **Categorize eventos corretamente**
5. **Mantenha contexto suficiente**
6. **Falhe silenciosamente se logging falhar**
7. **Use timestamps UTC consistently**
8. **Validate JSON antes de escrever**

## Troubleshooting

### Problemas Comuns

1. **Script de logging falha**:
   - Verificar permissões de arquivo
   - Validar formato JSON
   - Verificar espaço em disco

2. **Logs não aparecem**:
   - Verificar paths relativos
   - Confirmar que diretório agents/ existe
   - Verificar sintaxe dos comandos

3. **Performance degradada**:
   - Considerar logging assíncrono
   - Implementar rate limiting
   - Arquivar logs antigos

## Monitoramento

Configure dashboards para visualizar:
- Frequência de deploys
- Taxa de sucesso de builds
- Métricas de performance ao longo do tempo
- Tendências de qualidade de código

---

**Versão**: 1.0
**Última Atualização**: 30 de setembro de 2025
**Próxima Revisão**: Trimestral