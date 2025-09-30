import { Injectable, Logger } from '@nestjs/common';
import { appendFile, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

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

interface ModuleStatus {
  name: string;
  status: 'planned' | 'in_progress' | 'implemented' | 'tested' | 'deployed';
  features: string[];
  dependencies?: string[];
  tests_coverage?: number;
}

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private readonly agentsPath = join(process.cwd(), '..', 'agents');
  private readonly logFile = join(this.agentsPath, 'agent_log.jsonl');
  private readonly stateFile = join(this.agentsPath, 'agent_state.json');

  /**
   * Registra um evento no log dos agentes
   */
  async logEvent(event: Omit<AgentLogEvent, 'timestamp'>): Promise<void> {
    try {
      const logEvent: AgentLogEvent = {
        timestamp: new Date().toISOString(),
        agent_id: 'nestjs-backend',
        ...event,
      };

      const logLine = JSON.stringify(logEvent) + '\n';
      await appendFile(this.logFile, logLine, 'utf8');
    } catch (error) {
      this.logger.error(`Failed to log agent event: ${error.message}`, error.stack);
    }
  }

  /**
   * Atualiza o status de um módulo backend
   */
  async updateBackendModuleStatus(moduleData: ModuleStatus): Promise<void> {
    try {
      const state = await this.getCurrentState();
      
      if (!state.development_status) {
        state.development_status = { backend_modules: [], frontend_modules: [] };
      }

      if (!state.development_status.backend_modules) {
        state.development_status.backend_modules = [];
      }

      // Encontra ou cria módulo
      const moduleIndex = state.development_status.backend_modules.findIndex(
        (m: ModuleStatus) => m.name === moduleData.name
      );

      if (moduleIndex >= 0) {
        state.development_status.backend_modules[moduleIndex] = moduleData;
      } else {
        state.development_status.backend_modules.push(moduleData);
      }

      await this.updateState(state);

      // Log da atualização
      await this.logEvent({
        event_type: 'system_event',
        action: 'backend_module_update',
        details: {
          message: `Updated backend module: ${moduleData.name} -> ${moduleData.status}`,
          components: ['backend', moduleData.name],
        },
        context: {
          project_phase: 'development',
          environment: process.env.NODE_ENV as any || 'development',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update module status: ${error.message}`, error.stack);
    }
  }

  /**
   * Registra erro do sistema
   */
  async logSystemError(error: Error, context?: Record<string, any>): Promise<void> {
    await this.logEvent({
      event_type: 'error_detected',
      action: 'system_error',
      details: {
        message: error.message,
        components: ['backend'],
        error: {
          message: error.message,
          stack_trace: error.stack,
        },
      },
      context: {
        environment: process.env.NODE_ENV as any || 'development',
        ...context,
      },
    });
  }

  /**
   * Registra execução de testes
   */
  async logTestExecution(
    testType: 'unit' | 'integration' | 'e2e',
    results: {
      total: number;
      passed: number;
      failed: number;
      coverage?: number;
      duration_ms: number;
    }
  ): Promise<void> {
    await this.logEvent({
      event_type: 'test_execution',
      action: `${testType}_tests`,
      details: {
        message: `${testType} tests: ${results.passed}/${results.total} passed`,
        components: ['backend', 'testing'],
        metrics: {
          test_type: testType,
          ...results,
        },
      },
      context: {
        environment: process.env.NODE_ENV as any || 'development',
      },
    });
  }

  /**
   * Registra métricas de performance
   */
  async logPerformanceMetrics(metrics: {
    endpoint?: string;
    response_time_ms: number;
    memory_usage_mb?: number;
    cpu_usage_percent?: number;
    database_query_time_ms?: number;
  }): Promise<void> {
    await this.logEvent({
      event_type: 'performance_metric',
      action: 'api_performance',
      details: {
        message: `Performance: ${metrics.endpoint || 'system'} - ${metrics.response_time_ms}ms`,
        components: ['backend', 'performance'],
        metrics,
      },
    });
  }

  /**
   * Registra deploy/release
   */
  async logDeployment(
    environment: 'development' | 'staging' | 'production',
    version: string,
    success: boolean
  ): Promise<void> {
    await this.logEvent({
      event_type: 'deployment',
      action: `deploy_${environment}`,
      details: {
        message: `Deployment to ${environment}: ${success ? 'SUCCESS' : 'FAILED'}`,
        components: ['backend', 'deployment'],
        metrics: {
          version,
          environment,
          success,
        },
      },
      context: {
        environment,
        project_phase: environment === 'production' ? 'deployment' : 'development',
      },
    });
  }

  /**
   * Obtém o estado atual dos agentes
   */
  private async getCurrentState(): Promise<any> {
    try {
      const stateContent = await readFile(this.stateFile, 'utf8');
      return JSON.parse(stateContent);
    } catch (error) {
      this.logger.warn('Could not read agent state, creating new one');
      return this.getDefaultState();
    }
  }

  /**
   * Atualiza o estado dos agentes
   */
  private async updateState(state: any): Promise<void> {
    try {
      state.last_updated = new Date().toISOString();
      await writeFile(this.stateFile, JSON.stringify(state, null, 2), 'utf8');
    } catch (error) {
      this.logger.error(`Failed to update agent state: ${error.message}`, error.stack);
    }
  }

  /**
   * Estado padrão quando não existe arquivo
   */
  private getDefaultState(): any {
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
      current_focus: 'Backend development',
      next_priorities: [],
      technical_decisions: {}
    };
  }
}