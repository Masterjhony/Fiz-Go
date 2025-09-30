# Diretrizes de Escrita - Fiz-Go

## Princípios Gerais

### Clareza e Objetividade
- Use linguagem clara e direta
- Evite jargões desnecessários
- Explique conceitos técnicos quando necessário
- Mantenha explicações concisas mas completas

### Estrutura da Documentação

#### 1. Cabeçalho e Contexto
- Sempre inicie com o propósito do documento
- Forneça contexto necessário para entendimento
- Use títulos hierárquicos (H1, H2, H3) apropriadamente

#### 2. Exemplos Práticos
- Inclua exemplos de código quando relevante
- Use casos de uso reais do projeto Fiz-Go
- Forneça snippets funcionais e testáveis

#### 3. Referências e Links
- Referencie documentação oficial quando apropriado
- Mantenha links atualizados
- Cite fontes confiáveis para decisões técnicas

## Padrões de Código

### Comentários
```typescript
// ✅ Bom: Explica o "porquê"
// Calculamos a distância usando a fórmula de Haversine
// para encontrar profissionais próximos ao cliente
const distance = calculateHaversineDistance(clientCoords, professionalCoords);

// ❌ Ruim: Explica o "o quê" (óbvio pelo código)
// Calcula a distância
const distance = calculateHaversineDistance(clientCoords, professionalCoords);
```

### Nomenclatura
- Use nomes descritivos e significativos
- Prefira verbos para funções e substantivos para variáveis
- Mantenha consistência com o padrão do projeto

### Estrutura de Commits
```
feat: adiciona autenticação via Google OAuth
fix: corrige erro de validação no cadastro de serviços
docs: atualiza documentação da API de pagamentos
refactor: reorganiza estrutura de módulos do backend
test: adiciona testes unitários para OrderService
```

## Documentação de API

### Formato de Endpoints
```markdown
### POST /api/auth/register

Registra um novo usuário na plataforma.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "userType": "client" | "professional"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "token": "jwt_token"
}
```
```

### Tratamento de Erros
- Sempre documente possíveis erros
- Use códigos HTTP apropriados
- Forneça mensagens de erro claras

## Documentação de Features

### Template Padrão
1. **Objetivo**: O que a feature resolve
2. **Escopo**: O que está incluído/excluído
3. **Implementação**: Como foi desenvolvida
4. **Uso**: Como usar a feature
5. **Limitações**: Restrições conhecidas
6. **Testes**: Como testar a funcionalidade

## Versionamento

### Semantic Versioning
- MAJOR: Mudanças incompatíveis na API
- MINOR: Funcionalidades adicionadas de forma compatível
- PATCH: Correções de bugs compatíveis

### Changelog
Mantenha um arquivo CHANGELOG.md atualizado com:
- Data de release
- Tipo de mudança (Added, Changed, Deprecated, Removed, Fixed, Security)
- Descrição clara das alterações

## Revisão e Qualidade

### Checklist de Qualidade
- [ ] Documentação está clara e completa?
- [ ] Exemplos de código funcionam corretamente?
- [ ] Links e referências estão atualizados?
- [ ] Ortografia e gramática estão corretas?
- [ ] Formatação markdown está consistente?

### Processo de Revisão
1. Auto-revisão antes de submeter
2. Revisão por pares quando possível
3. Teste de exemplos de código
4. Validação com usuários quando aplicável