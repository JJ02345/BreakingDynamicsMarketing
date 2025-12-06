import { Bug, Lightbulb, MessageSquare, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const STATUS_CONFIG = {
  new: { label: 'Neu', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  in_progress: { label: 'In Bearbeitung', color: 'bg-amber-100 text-amber-700', icon: Clock },
  resolved: { label: 'Erledigt', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  closed: { label: 'Geschlossen', color: 'bg-gray-100 text-gray-600', icon: XCircle },
};

export const TYPE_CONFIG = {
  bug: { label: 'Bug', color: 'bg-red-100 text-red-700', icon: Bug },
  feature: { label: 'Feature', color: 'bg-purple-100 text-purple-700', icon: Lightbulb },
  general: { label: 'Allgemein', color: 'bg-gray-100 text-gray-600', icon: MessageSquare },
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Gerade eben';
  if (diff < 3600000) return `vor ${Math.floor(diff / 60000)} Min.`;
  if (diff < 86400000) return `vor ${Math.floor(diff / 3600000)} Std.`;
  if (diff < 604800000) return `vor ${Math.floor(diff / 86400000)} Tagen`;

  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

export const formatDateTime = (dateStr) => {
  return new Date(dateStr).toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export const parseUserAgent = (ua) => {
  if (!ua) return 'Unbekannt';
  let browser = 'Unbekannt';
  let os = 'Unbekannt';

  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return `${browser} / ${os}`;
};
