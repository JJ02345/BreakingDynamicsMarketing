// CommandProvider - Global Command Center for Cross-Squad Coordination
// Supreme Commander that orchestrates all squad communication

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { eventBus } from './EventBus';
import type {
  CommandContextValue,
  CommandEventName,
  CommandEventPayload,
  EventCallback,
} from './types';

const CommandContext = createContext<CommandContextValue | null>(null);

interface CommandProviderProps {
  children: React.ReactNode;
}

export function CommandProvider({ children }: CommandProviderProps) {
  const value = useMemo<CommandContextValue>(
    () => ({
      eventBus,
    }),
    []
  );

  return (
    <CommandContext.Provider value={value}>
      {children}
    </CommandContext.Provider>
  );
}

// Hook to access the event bus
export function useEventBus() {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useEventBus must be used within a CommandProvider');
  }

  const emit = useCallback(
    <T extends CommandEventName>(event: T, payload: CommandEventPayload<T>) => {
      context.eventBus.emit(event, payload);
    },
    [context.eventBus]
  );

  const subscribe = useCallback(
    <T extends CommandEventName>(event: T, callback: EventCallback<T>) => {
      return context.eventBus.subscribe(event, callback);
    },
    [context.eventBus]
  );

  const subscribeOnce = useCallback(
    <T extends CommandEventName>(event: T, callback: EventCallback<T>) => {
      return context.eventBus.subscribeOnce(event, callback);
    },
    [context.eventBus]
  );

  return {
    emit,
    subscribe,
    subscribeOnce,
  };
}

// Hook to subscribe to a specific event (auto-cleanup)
export function useEventSubscription<T extends CommandEventName>(
  event: T,
  callback: EventCallback<T>,
  deps: React.DependencyList = []
) {
  const { subscribe } = useEventBus();

  React.useEffect(() => {
    const unsubscribe = subscribe(event, callback);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, subscribe, ...deps]);
}
