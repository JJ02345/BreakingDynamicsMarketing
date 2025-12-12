// EventBus - Cross-Squad Communication System
// Like military radio - squads can broadcast and listen to events

import type {
  CommandEventName,
  CommandEventPayload,
  EventCallback,
  EventBusInterface,
} from './types';

type Listeners = {
  [K in CommandEventName]?: Set<EventCallback<K>>;
};

class EventBusImpl implements EventBusInterface {
  private listeners: Listeners = {};
  private onceListeners: Listeners = {};

  emit<T extends CommandEventName>(
    event: T,
    payload: CommandEventPayload<T>
  ): void {
    // Regular listeners
    const callbacks = this.listeners[event] as Set<EventCallback<T>> | undefined;
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`[EventBus] Error in listener for "${event}":`, error);
        }
      });
    }

    // Once listeners (fire and remove)
    const onceCallbacks = this.onceListeners[event] as Set<EventCallback<T>> | undefined;
    if (onceCallbacks) {
      onceCallbacks.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`[EventBus] Error in once listener for "${event}":`, error);
        }
      });
      // Clear once listeners after firing
      delete this.onceListeners[event];
    }

    // Debug logging in development
    if (import.meta.env.DEV) {
      console.debug(`[EventBus] Event emitted: ${event}`, payload);
    }
  }

  subscribe<T extends CommandEventName>(
    event: T,
    callback: EventCallback<T>
  ): () => void {
    if (!this.listeners[event]) {
      (this.listeners[event] as Set<EventCallback<T>>) = new Set();
    }
    (this.listeners[event] as Set<EventCallback<T>>).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners[event] as Set<EventCallback<T>> | undefined;
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          delete this.listeners[event];
        }
      }
    };
  }

  subscribeOnce<T extends CommandEventName>(
    event: T,
    callback: EventCallback<T>
  ): () => void {
    if (!this.onceListeners[event]) {
      (this.onceListeners[event] as Set<EventCallback<T>>) = new Set();
    }
    (this.onceListeners[event] as Set<EventCallback<T>>).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.onceListeners[event] as Set<EventCallback<T>> | undefined;
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          delete this.onceListeners[event];
        }
      }
    };
  }

  // Clear all listeners (useful for testing)
  clear(): void {
    this.listeners = {};
    this.onceListeners = {};
  }
}

// Singleton instance
export const eventBus = new EventBusImpl();

// Factory for testing
export const createEventBus = (): EventBusInterface => new EventBusImpl();
