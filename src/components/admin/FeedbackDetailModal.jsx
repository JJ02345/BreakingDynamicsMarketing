import React from 'react';
import { X, MessageSquare, Mail, ExternalLink, FileText, Monitor, Clock, Trash2, Loader2 } from 'lucide-react';
import { TYPE_CONFIG, STATUS_CONFIG, formatDateTime, parseUserAgent } from './adminConfig';

const FeedbackDetailModal = function({ feedback, onClose, onStatusChange, onDelete, updating }) {
  const typeConfig = TYPE_CONFIG[feedback.type] || TYPE_CONFIG.general;
  const statusConfig = STATUS_CONFIG[feedback.status] || STATUS_CONFIG.new;
  const TypeIcon = typeConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeConfig.color}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{formatDateTime(feedback.createdAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <MessageSquare className="h-4 w-4" />Nachricht
            </h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-gray-700">{feedback.message}</p>
            </div>
          </div>

          {feedback.email && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Mail className="h-4 w-4" />Kontakt
              </h3>
              <a
                href={`mailto:${feedback.email}?subject=Re: Dein Feedback bei Breaking Dynamics`}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100"
              >
                {feedback.email}<ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FileText className="h-4 w-4" />Seite
              </h3>
              <p className="text-sm text-gray-600 break-all">{feedback.pageUrl || '—'}</p>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Monitor className="h-4 w-4" />Browser / System
              </h3>
              <p className="text-sm text-gray-600">{parseUserAgent(feedback.userAgent)}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Clock className="h-4 w-4" />Status ändern
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const StatusIcon = config.icon;
                const isActive = feedback.status === key;
                return (
                  <button
                    key={key}
                    onClick={() => onStatusChange(feedback.id, key)}
                    disabled={updating}
                    className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                      isActive ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <StatusIcon className="h-4 w-4" />{config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between">
            <button
              onClick={() => onDelete(feedback.id)}
              disabled={updating}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Löschen
            </button>
            <button onClick={onClose} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailModal;
