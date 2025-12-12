// Command Center - Public API
// Cross-Squad Communication Hub

export { CommandProvider, useEventBus, useEventSubscription } from './CommandProvider';
export { eventBus, createEventBus } from './EventBus';
export type {
  CommandEvents,
  CommandEventName,
  CommandEventPayload,
  EventCallback,
  EventBusInterface,
  CommandContextValue,
} from './types';
