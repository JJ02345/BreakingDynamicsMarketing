import React from 'react';
import { Mail, Trash2, Loader2 } from 'lucide-react';
import { TYPE_CONFIG, STATUS_CONFIG, formatDate } from './adminConfig';

const FeedbackCard = function({ feedback, isSelected, onSelect, onStatusChange, onDelete, updating }) {
  const typeConfig = TYPE_CONFIG[feedback.type] || TYPE_CONFIG.general;
  const statusConfig = STATUS_CONFIG[feedback.status] || STATUS_CONFIG.new;
  const TypeIcon = typeConfig.icon;

  return (
    <div
      className={`rounded-xl border-2 bg-white transition-all cursor-pointer ${
        isSelected ? 'border-purple-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${typeConfig.color}`}>
            <TypeIcon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              <span className="text-xs text-gray-400">{formatDate(feedback.createdAt)}</span>
            </div>

            <p className="mt-2 text-sm text-gray-700 line-clamp-2">{feedback.message}</p>

            {feedback.email && (
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <Mail className="h-3 w-3" />
                <span>{feedback.email}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <select
              value={feedback.status}
              onChange={(e) => onStatusChange(feedback.id, e.target.value)}
              disabled={updating}
              className="rounded-lg border border-gray-300 px-2 py-1 text-xs focus:border-purple-500 focus:outline-none disabled:opacity-50"
            >
              <option value="new">Neu</option>
              <option value="in_progress">In Bearbeitung</option>
              <option value="resolved">Erledigt</option>
              <option value="closed">Geschlossen</option>
            </select>

            <button
              onClick={() => onDelete(feedback.id)}
              disabled={updating}
              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
