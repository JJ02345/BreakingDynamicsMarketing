// Command Center Types - Cross-Squad Communication

export interface CommandEvents {
  // Auth Events
  'auth:user-signed-in': { userId: string; email: string };
  'auth:user-signed-out': undefined;
  'auth:session-expired': undefined;
  'auth:admin-status-changed': { isAdmin: boolean };

  // Carousel Events
  'carousel:created': { carouselId: string; slideCount: number };
  'carousel:updated': { carouselId: string };
  'carousel:deleted': { carouselId: string };
  'carousel:exported': { carouselId: string; format: 'pdf' | 'png' };
  'carousel:ai-generated': { pattern: string; slideCount: number };

  // Survey Events
  'survey:created': { surveyId: string };
  'survey:updated': { surveyId: string };
  'survey:deleted': { surveyId: string };
  'survey:response-received': { surveyId: string; responseId: string };

  // AI Events
  'ai:generation-started': { type: 'carousel' | 'survey' | 'content' };
  'ai:generation-completed': { type: 'carousel' | 'survey' | 'content'; success: boolean };
  'ai:generation-failed': { type: 'carousel' | 'survey' | 'content'; error: string };
  'ai:health-changed': { isHealthy: boolean };

  // Analytics Events (generic tracker)
  'analytics:track': { event: string; data: Record<string, unknown> };

  // Feedback Events
  'feedback:submitted': { type: 'bug' | 'feature' | 'general' };

  // UI Events
  'ui:toast': { message: string; type: 'success' | 'error' | 'warning' | 'info' };
  'ui:modal-opened': { modalId: string };
  'ui:modal-closed': { modalId: string };
}

export type CommandEventName = keyof CommandEvents;
export type CommandEventPayload<T extends CommandEventName> = CommandEvents[T];

export type EventCallback<T extends CommandEventName> = (
  payload: CommandEventPayload<T>
) => void;

export interface EventBusInterface {
  emit<T extends CommandEventName>(
    event: T,
    payload: CommandEventPayload<T>
  ): void;
  subscribe<T extends CommandEventName>(
    event: T,
    callback: EventCallback<T>
  ): () => void;
  subscribeOnce<T extends CommandEventName>(
    event: T,
    callback: EventCallback<T>
  ): () => void;
}

export interface CommandContextValue {
  eventBus: EventBusInterface;
}
