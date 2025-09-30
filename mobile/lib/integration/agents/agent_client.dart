import 'dart:convert';
import 'dart:io';
import 'package:path/path.dart' as path;

/// Cliente para integração com o sistema de agentes de IA
/// Responsável por registrar eventos relevantes no log dos agentes
class AgentIntegrationClient {
  static const String _agentsPath = '../../../agents';
  static const String _logFile = 'agent_log.jsonl';
  static const String _stateFile = 'agent_state.json';

  /// Registra um evento no log dos agentes
  static Future<void> logEvent({
    required String eventType,
    required String action,
    String? message,
    List<String>? filesAffected,
    List<String>? components,
    Map<String, dynamic>? metrics,
    Map<String, dynamic>? context,
  }) async {
    try {
      final logPath = path.join(_agentsPath, _logFile);
      final logFile = File(logPath);
      
      final event = {
        'timestamp': DateTime.now().toUtc().toIso8601String(),
        'event_type': eventType,
        'action': action,
        'agent_id': 'flutter-mobile-client',
        'details': {
          if (message != null) 'message': message,
          if (filesAffected != null) 'files_affected': filesAffected,
          if (components != null) 'components': components,
          if (metrics != null) 'metrics': metrics,
        },
        if (context != null) 'context': context,
        'metadata': {
          'platform': Platform.operatingSystem,
          'app_version': await _getAppVersion(),
        }
      };

      await logFile.writeAsString(
        '${jsonEncode(event)}\n',
        mode: FileMode.append,
      );
    } catch (e) {
      // Falha silenciosa para não impactar a aplicação
      print('AgentIntegrationClient: Failed to log event - $e');
    }
  }

  /// Atualiza informações específicas do mobile no estado dos agentes
  static Future<void> updateMobileStatus({
    required String moduleName,
    required String status,
    required List<String> features,
    List<String>? components,
    Map<String, dynamic>? additionalInfo,
  }) async {
    try {
      final statePath = path.join(_agentsPath, _stateFile);
      final stateFile = File(statePath);
      
      if (!await stateFile.exists()) return;

      final stateContent = await stateFile.readAsString();
      final state = jsonDecode(stateContent) as Map<String, dynamic>;

      // Atualiza ou adiciona módulo mobile
      final frontendModules = state['development_status']['frontend_modules'] as List? ?? [];
      
      // Procura módulo existente
      int moduleIndex = frontendModules.indexWhere(
        (module) => module['name'] == moduleName
      );

      final moduleData = {
        'name': moduleName,
        'status': status,
        'features': features,
        if (components != null) 'components': components,
        if (additionalInfo != null) ...additionalInfo,
        'last_updated': DateTime.now().toUtc().toIso8601String(),
      };

      if (moduleIndex >= 0) {
        frontendModules[moduleIndex] = moduleData;
      } else {
        frontendModules.add(moduleData);
      }

      // Atualiza estado geral
      state['development_status']['frontend_modules'] = frontendModules;
      state['last_updated'] = DateTime.now().toUtc().toIso8601String();

      await stateFile.writeAsString(jsonEncode(state));

      // Log da atualização
      await logEvent(
        eventType: 'system_event',
        action: 'mobile_status_update',
        message: 'Updated mobile module status: $moduleName -> $status',
        components: ['mobile', moduleName],
      );
    } catch (e) {
      print('AgentIntegrationClient: Failed to update mobile status - $e');
    }
  }

  /// Registra erro ocorrido no mobile
  static Future<void> logError({
    required String errorType,
    required String message,
    String? stackTrace,
    String? screen,
    Map<String, dynamic>? additionalData,
  }) async {
    await logEvent(
      eventType: 'error_detected',
      action: 'mobile_error',
      message: message,
      components: ['mobile', if (screen != null) screen],
      context: {
        'error_type': errorType,
        if (stackTrace != null) 'stack_trace': stackTrace,
        if (screen != null) 'current_screen': screen,
        if (additionalData != null) ...additionalData,
      },
    );
  }

  /// Registra navegação/interação do usuário
  static Future<void> logUserInteraction({
    required String screen,
    required String action,
    Map<String, dynamic>? data,
  }) async {
    await logEvent(
      eventType: 'user_interaction',
      action: 'mobile_navigation',
      message: 'User $action on $screen',
      components: ['mobile', 'ui'],
      context: {
        'screen': screen,
        'user_action': action,
        if (data != null) 'interaction_data': data,
      },
    );
  }

  /// Registra métricas de performance
  static Future<void> logPerformanceMetric({
    required String metricName,
    required num value,
    String? unit,
    Map<String, dynamic>? additionalMetrics,
  }) async {
    await logEvent(
      eventType: 'performance_metric',
      action: 'mobile_performance',
      message: 'Performance metric: $metricName = $value${unit ?? ''}',
      components: ['mobile', 'performance'],
      context: {
        'metric_name': metricName,
        'value': value,
        if (unit != null) 'unit': unit,
        if (additionalMetrics != null) ...additionalMetrics,
      },
    );
  }

  static Future<String> _getAppVersion() async {
    // TODO: Implementar obtenção da versão real do app
    return '1.0.0-dev';
  }
}

/// Extension para facilitar logging de eventos em widgets
extension WidgetAgentLogging on Object {
  /// Log rápido de evento de widget
  Future<void> logWidgetEvent(String action, [String? message]) async {
    await AgentIntegrationClient.logEvent(
      eventType: 'code_change',
      action: action,
      message: message ?? '$runtimeType: $action',
      components: ['mobile', 'widget', '$runtimeType'],
    );
  }

  /// Log de erro de widget
  Future<void> logWidgetError(String error, [StackTrace? stackTrace]) async {
    await AgentIntegrationClient.logError(
      errorType: 'widget_error',
      message: '$runtimeType: $error',
      stackTrace: stackTrace?.toString(),
      screen: '$runtimeType',
    );
  }
}