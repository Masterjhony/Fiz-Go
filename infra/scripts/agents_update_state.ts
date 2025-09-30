#!/usr/bin/env node

/**
 * Script utilitário para atualizar o estado dos agentes
 * Usado por pipelines CI/CD e outros sistemas automatizados
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

interface AgentLogEvent {
  timestamp: string;
  event_type: string;
  action: string;
  agent_id?: string;
  session_id?: string;
  details?: {
    message?: string;
    files_affected?: string[];
    components?: string[];
    metrics?: Record<string, any>;
    error?: {
      code?: string;
      message: string;
      stack_trace?: string;
    };
  };
  context?: {
    user_request?: string;
    project_phase?: 'planning' | 'development' | 'testing' | 'deployment' | 'maintenance';
    environment?: 'development' | 'staging' | 'production';
    related_events?: string[];
  };
  metadata?: Record<string, any>;
}

interface AgentState {
  version: string;
  last_updated: string;
  project_context: {
    name: string;
    description: string;
    current_phase: string;
    tech_stack: Record<string, string>;
  };
  development_status: {
    backend_modules: Array<{
      name: string;
      status: string;
      features: string[];
      dependencies?: string[];
      tests_coverage?: number;
    }>;
    frontend_modules: Array<{
      name: string;
      status: string;
      features: string[];
      components?: string[];
    }>;
  };
  current_focus: string;
  next_priorities: string[];
  technical_decisions: Record<string, string>;
  environments?: {
    development?: EnvironmentInfo;
    staging?: EnvironmentInfo;
    production?: EnvironmentInfo;
  };
}

interface EnvironmentInfo {
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  last_deployment: string;
  version: string;
  health_checks: {
    api: boolean;
    database: boolean;
    cache: boolean;
  };
}

class AgentStateManager {
  private readonly agentsPath: string;
  private readonly logFile: string;
  private readonly stateFile: string;

  constructor() {
    // Determinar path baseado no contexto
    const currentDir = process.cwd();
    if (currentDir.includes('infra')) {
      this.agentsPath = join(currentDir, '..', 'agents');
    } else {
      this.agentsPath = join(currentDir, 'agents');
    }
    
    this.logFile = join(this.agentsPath, 'agent_log.jsonl');
    this.stateFile = join(this.agentsPath, 'agent_state.json');
  }

  /**
   * Registra um evento no log
   */
  logEvent(event: Omit<AgentLogEvent, 'timestamp'>): void {
    try {
      const logEvent: AgentLogEvent = {
        timestamp: new Date().toISOString(),
        agent_id: 'ci-cd-automation',
        ...event,
      };

      const logLine = JSON.stringify(logEvent) + '\n';
      appendFileSync(this.logFile, logLine, 'utf8');
      
      console.log(`✅ Event logged: ${event.event_type}/${event.action}`);
    } catch (error) {
      console.error(`❌ Failed to log event: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Atualiza informações específicas no estado
   */
  updateState(updates: Partial<AgentState>): void {
    try {
      let state = this.getCurrentState();
      
      // Merge das atualizações
      state = { ...state, ...updates };
      state.last_updated = new Date().toISOString();

      writeFileSync(this.stateFile, JSON.stringify(state, null, 2), 'utf8');
      
      console.log(`✅ State updated successfully`);
    } catch (error) {
      console.error(`❌ Failed to update state: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Atualiza status de um ambiente
   */
  updateEnvironmentStatus(
    environment: 'development' | 'staging' | 'production',
    status: 'healthy' | 'degraded' | 'down' | 'maintenance',
    version?: string
  ): void {
    try {
      const state = this.getCurrentState();
      
      if (!state.environments) {
        state.environments = {};
      }

      if (!state.environments[environment]) {
        state.environments[environment] = {
          status: 'down',
          last_deployment: new Date().toISOString(),
          version: 'unknown',
          health_checks: { api: false, database: false, cache: false }
        };
      }

      state.environments[environment].status = status;
      state.environments[environment].last_deployment = new Date().toISOString();
      
      if (version) {
        state.environments[environment].version = version;
      }

      // Health checks simples baseados no status
      const isHealthy = status === 'healthy';
      state.environments[environment].health_checks = {
        api: isHealthy,
        database: isHealthy,
        cache: isHealthy
      };

      this.updateState(state);
      
      console.log(`✅ Environment ${environment} updated: ${status}`);
    } catch (error) {
      console.error(`❌ Failed to update environment: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Obtém o estado atual
   */
  private getCurrentState(): AgentState {
    try {
      if (!existsSync(this.stateFile)) {
        return this.getDefaultState();
      }

      const stateContent = readFileSync(this.stateFile, 'utf8');
      return JSON.parse(stateContent);
    } catch (error) {
      console.warn('⚠️  Could not read existing state, using default');
      return this.getDefaultState();
    }
  }

  /**
   * Estado padrão
   */
  private getDefaultState(): AgentState {
    return {
      version: '1.0.0',
      last_updated: new Date().toISOString(),
      project_context: {
        name: 'Fiz-Go',
        description: 'Plataforma mobile/web para conectar clientes e profissionais de serviços gerais',
        current_phase: 'development',
        tech_stack: {
          frontend: 'Flutter',
          backend: 'NestJS/Node.js',
          database: 'PostgreSQL',
          cache: 'Redis',
          deployment: 'Docker'
        }
      },
      development_status: {
        backend_modules: [],
        frontend_modules: []
      },
      current_focus: 'Automated CI/CD setup',
      next_priorities: [
        'Complete backend implementation',
        'Develop mobile application',
        'Setup production deployment'
      ],
      technical_decisions: {
        'ci_cd': 'GitHub Actions',
        'containerization': 'Docker with multi-stage builds',
        'deployment': 'Container orchestration'
      }
    };
  }
}

// CLI Interface
function parseArgs(): any {
  const args = process.argv.slice(2);
  const parsed: any = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.substring(2).replace(/-/g, '_');
      const value = args[i + 1];
      
      if (value && !value.startsWith('--')) {
        // Tentar parsear JSON se começar com { ou [
        if (value.startsWith('{') || value.startsWith('[')) {
          try {
            parsed[key] = JSON.parse(value);
          } catch {
            parsed[key] = value;
          }
        } else {
          parsed[key] = value;
        }
        i++; // Skip next argument
      } else {
        parsed[key] = true;
      }
    }
  }
  
  return parsed;
}

function main(): void {
  const args = parseArgs();
  const manager = new AgentStateManager();

  // Comando para logging de eventos
  if (args.event_type && args.action) {
    manager.logEvent({
      event_type: args.event_type,
      action: args.action,
      session_id: args.session_id || randomUUID(),
      details: {
        message: args.message,
        files_affected: args.files_affected,
        components: args.components,
        metrics: args.metrics,
      },
      context: args.context,
      metadata: args.metadata,
    });
    return;
  }

  // Comando para atualizar ambiente
  if (args.update_environment) {
    manager.updateEnvironmentStatus(
      args.update_environment,
      args.environment_status || 'healthy',
      args.environment_version
    );
    return;
  }

  // Comando para atualização geral de estado
  if (args.update_state) {
    try {
      const updates = JSON.parse(args.update_state);
      manager.updateState(updates);
    } catch (error) {
      console.error('❌ Invalid JSON for --update-state');
      process.exit(1);
    }
    return;
  }

  // Mostrar ajuda se nenhum comando válido
  console.log(`
🤖 Agent State Manager - Fiz-Go

Usage Examples:

# Log an event
node agents_update_state.ts \\
  --event-type "deployment" \\
  --action "production_deploy" \\
  --message "Deployed version 1.2.3" \\
  --session-id "workflow-123" \\
  --metrics '{"version": "1.2.3", "duration_ms": 30000}' \\
  --context '{"environment": "production"}'

# Update environment status
node agents_update_state.ts \\
  --update-environment "production" \\
  --environment-status "healthy" \\
  --environment-version "1.2.3"

# Update state directly
node agents_update_state.ts \\
  --update-state '{"current_focus": "Production deployment"}'

Available event types:
- code_change
- file_operation  
- search_query
- error_detected
- test_execution
- deployment
- security_event
- performance_metric
- user_interaction
- system_event
- project_init
- config_change
- dependency_update
- documentation_update
`);
}

// Execute se chamado diretamente
if (require.main === module) {
  main();
}

export { AgentStateManager };