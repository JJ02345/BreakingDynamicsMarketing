import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Bug, Lightbulb, MessageSquare, ArrowLeft, RefreshCw, 
  Loader2, AlertCircle, CheckCircle2, Clock, XCircle, Trash2,
  ChevronDown, ExternalLink, Mail, Monitor, Calendar, Filter,
  BarChart3, TrendingUp, Search, X, FileText, Download
} from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { db, auth } from './lib/supabase';

// ============================================
// STATUS CONFIGURATION
// ============================================
const STATUS_CONFIG = {
  new: { label: 'Neu', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  in_progress: { label: 'In Bearbeitung', color: 'bg-amber-100 text-amber-700', icon: Clock },
  resolved: { label: 'Erledigt', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  closed: { label: 'Geschlossen', color: 'bg-gray-100 text-gray-600', icon: XCircle },
};

const TYPE_CONFIG = {
  bug: { label: 'Bug', color: 'bg-red-100 text-red-700', icon: Bug },
  feature: { label: 'Feature', color: 'bg-purple-100 text-purple-700', icon: Lightbulb },
  general: { label: 'Allgemein', color: 'bg-gray-100 text-gray-600', icon: MessageSquare },
};

// ============================================
// ADMIN DASHBOARD COMPONENT
// ============================================
const AdminDashboard = function({ nav }) {
  const { user, isAuthenticated } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(null);
  
  // Admin-Status aus Datenbank laden
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  // Admin-Check beim Laden
  useEffect(() => {
    const checkAdmin = async () => {
      if (!isAuthenticated || !user) {
        setIsAdmin(false);
        setAdminLoading(false);
        return;
      }
      
      try {
        const adminStatus = await auth.isAdmin(user);
        setIsAdmin(adminStatus);
      } catch (err) {
        console.error('Admin check failed:', err);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };
    
    checkAdmin();
  }, [isAuthenticated, user]);

  // Daten laden wenn Admin bestätigt
  useEffect(() => {
    if (isAuthenticated && isAdmin && !adminLoading) {
      loadData();
    }
  }, [isAuthenticated, isAdmin, adminLoading]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [feedbackData, statsData] = await Promise.all([
        db.getAllFeedback({ type: filterType, status: filterStatus }),
        db.getFeedbackStats(),
      ]);
      setFeedback(feedbackData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await db.updateFeedbackStatus(id, newStatus);
      setFeedback(prev => prev.map(f => 
        f.id === id ? { ...f, status: newStatus } : f
      ));
      // Update stats
      const newStats = await db.getFeedbackStats();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Status konnte nicht geändert werden: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Feedback wirklich löschen?')) return;
    
    setUpdating(id);
    try {
      await db.deleteFeedback(id);
      setFeedback(prev => prev.filter(f => f.id !== id));
      setSelectedFeedback(null);
      // Update stats
      const newStats = await db.getFeedbackStats();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      setError('Löschen fehlgeschlagen: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Typ', 'Status', 'Nachricht', 'E-Mail', 'Seite', 'Erstellt'];
    const rows = filteredFeedback.map(f => [
      f.id,
      TYPE_CONFIG[f.type]?.label || f.type,
      STATUS_CONFIG[f.status]?.label || f.status,
      `"${f.message.replace(/"/g, '""')}"`,
      f.email || '',
      f.pageUrl || '',
      new Date(f.createdAt).toLocaleString('de-DE'),
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    return feedback.filter(f => {
      const matchesSearch = searchQuery === '' || 
        f.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [feedback, searchQuery]);

  // Loading state
  if (adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600" />
          <p className="mt-4 text-sm text-gray-600">Berechtigungen werden geprüft...</p>
        </div>
      </div>
    );
  }

  // Access denied - not logged in
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Zugriff verweigert</h1>
          <p className="mt-2 text-gray-600">Bitte melde dich an.</p>
          <button 
            onClick={() => nav('landing')} 
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Zur Startseite
          </button>
        </div>
      </div>
    );
  }

  // Access denied - not admin
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-red-300" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Kein Admin-Zugriff</h1>
          <p className="mt-2 text-gray-600">Dein Account hat keine Admin-Rechte.</p>
          <p className="mt-1 text-sm text-gray-400">{user?.email}</p>
          <button 
            onClick={() => nav('dashboard')} 
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Zum Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => nav('dashboard')} 
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Admin Panel</p>
                <p className="text-xs text-purple-600">Feedback Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCsv}
              disabled={filteredFeedback.length === 0}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => { setError(null); loadData(); }} 
              className="ml-auto text-red-700 underline"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <StatCard 
              icon={BarChart3} 
              label="Gesamt" 
              value={stats.total} 
              color="blue" 
            />
            <StatCard 
              icon={TrendingUp} 
              label="Diese Woche" 
              value={stats.thisWeek} 
              color="green" 
            />
            <StatCard 
              icon={Bug} 
              label="Bugs" 
              value={stats.byType.bug} 
              color="red" 
            />
            <StatCard 
              icon={Lightbulb} 
              label="Features" 
              value={stats.byType.feature} 
              color="purple" 
            />
            <StatCard 
              icon={AlertCircle} 
              label="Neu" 
              value={stats.byStatus.new} 
              color="blue" 
            />
            <StatCard 
              icon={CheckCircle2} 
              label="Erledigt" 
              value={stats.byStatus.resolved} 
              color="green" 
            />
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suchen..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            >
              <option value="all">Alle Typen</option>
              <option value="bug">Bugs</option>
              <option value="feature">Features</option>
              <option value="general">Allgemein</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
            >
              <option value="all">Alle Status</option>
              <option value="new">Neu</option>
              <option value="in_progress">In Bearbeitung</option>
              <option value="resolved">Erledigt</option>
              <option value="closed">Geschlossen</option>
            </select>
            
            <button
              onClick={loadData}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Filter anwenden
            </button>
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-bold text-gray-900">Kein Feedback</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery ? 'Keine Ergebnisse für diese Suche.' : 'Noch kein Feedback eingegangen.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFeedback.map(f => (
              <FeedbackCard
                key={f.id}
                feedback={f}
                isSelected={selectedFeedback?.id === f.id}
                onSelect={() => setSelectedFeedback(selectedFeedback?.id === f.id ? null : f)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                updating={updating === f.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          updating={updating === selectedFeedback.id}
        />
      )}
    </div>
  );
};

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = function({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <div className={`rounded-lg p-1.5 ${colors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// ============================================
// FEEDBACK CARD COMPONENT
// ============================================
const FeedbackCard = function({ feedback, isSelected, onSelect, onStatusChange, onDelete, updating }) {
  const typeConfig = TYPE_CONFIG[feedback.type] || TYPE_CONFIG.general;
  const statusConfig = STATUS_CONFIG[feedback.status] || STATUS_CONFIG.new;
  const TypeIcon = typeConfig.icon;
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Gerade eben';
    if (diff < 3600000) return `vor ${Math.floor(diff / 60000)} Min.`;
    if (diff < 86400000) return `vor ${Math.floor(diff / 3600000)} Std.`;
    if (diff < 604800000) return `vor ${Math.floor(diff / 86400000)} Tagen`;
    
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <div 
      className={`rounded-xl border-2 bg-white transition-all cursor-pointer ${
        isSelected ? 'border-purple-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Type Icon */}
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${typeConfig.color}`}>
            <TypeIcon className="h-5 w-5" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(feedback.createdAt)}
              </span>
            </div>
            
            <p className="mt-2 text-sm text-gray-700 line-clamp-2">
              {feedback.message}
            </p>
            
            {feedback.email && (
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <Mail className="h-3 w-3" />
                <span>{feedback.email}</span>
              </div>
            )}
          </div>
          
          {/* Actions */}
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

// ============================================
// FEEDBACK DETAIL MODAL
// ============================================
const FeedbackDetailModal = function({ feedback, onClose, onStatusChange, onDelete, updating }) {
  const typeConfig = TYPE_CONFIG[feedback.type] || TYPE_CONFIG.general;
  const statusConfig = STATUS_CONFIG[feedback.status] || STATUS_CONFIG.new;
  const TypeIcon = typeConfig.icon;

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseUserAgent = (ua) => {
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
              <p className="mt-1 text-xs text-gray-500">
                {formatDateTime(feedback.createdAt)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <MessageSquare className="h-4 w-4" />
              Nachricht
            </h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-gray-700">{feedback.message}</p>
            </div>
          </div>
          
          {/* Contact */}
          {feedback.email && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Mail className="h-4 w-4" />
                Kontakt
              </h3>
              <a 
                href={`mailto:${feedback.email}?subject=Re: Dein Feedback bei Breaking Dynamics`}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100"
              >
                {feedback.email}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
          
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FileText className="h-4 w-4" />
                Seite
              </h3>
              <p className="text-sm text-gray-600 break-all">
                {feedback.pageUrl || '—'}
              </p>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Monitor className="h-4 w-4" />
                Browser / System
              </h3>
              <p className="text-sm text-gray-600">
                {parseUserAgent(feedback.userAgent)}
              </p>
            </div>
          </div>
          
          {/* Status Change */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Clock className="h-4 w-4" />
              Status ändern
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
                      isActive 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    {config.label}
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
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
