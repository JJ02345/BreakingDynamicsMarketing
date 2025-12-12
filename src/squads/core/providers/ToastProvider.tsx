// Toast Provider - Global Toast Notifications
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import type { Toast, ToastType, ToastContextValue } from '../types';

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 flex-shrink-0" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 flex-shrink-0" />;
    }
  };

  const getStyles = (type: ToastType): string => {
    switch (type) {
      case 'error':
        return 'bg-red-500/90 border-red-400/30 text-white';
      case 'success':
        return 'bg-[#00E676]/90 border-[#00E676]/30 text-[#0A0A0B]';
      case 'warning':
        return 'bg-[#FFAB00]/90 border-[#FFAB00]/30 text-[#0A0A0B]';
      case 'info':
      default:
        return 'bg-[#1A1A1D]/95 border-white/10 text-white';
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl animate-slide-in backdrop-blur-sm border ${getStyles(
            toast.type
          )}`}
          role="alert"
          aria-live="polite"
        >
          {getIcon(toast.type)}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 rounded-lg p-1 hover:bg-white/20 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000): number => {
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastProvider;
