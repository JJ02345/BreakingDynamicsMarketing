import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Bug, Lightbulb, ArrowLeft, RefreshCw, Loader2, AlertCircle, CheckCircle2, MessageSquare, Search, Filter, BarChart3, TrendingUp, Download } from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { db, auth } from './lib/supabase';
import { StatCard, FeedbackCard, FeedbackDetailModal, TYPE_CONFIG } from './components/admin';

const AdminDashboard = function() {
  const navigate = useNavigate();
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!isAuthenticated || !user) { setIsAdmin(false); setAdminLoading(false); return; }
      try { setIsAdmin(await auth.isAdmin(user)); }
      catch { setIsAdmin(false); }
      finally { setAdminLoading(false); }
    };
    checkAdmin();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && isAdmin && !adminLoading) loadData();
  }, [isAuthenticated, isAdmin, adminLoading]);

  const loadData = async () => {
    setLoading(true); setError(null);
    try {
      const [feedbackData, statsData] = await Promise.all([
        db.getAllFeedback({ type: filterType, status: filterStatus }),
        db.getFeedbackStats(),
      ]);
      setFeedback(feedbackData); setStats(statsData);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await db.updateFeedbackStatus(id, newStatus);
      setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
      setStats(await db.getFeedbackStats());
    } catch (err) { setError('Status konnte nicht geändert werden: ' + err.message); }
    finally { setUpdating(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Feedback wirklich löschen?')) return;
    setUpdating(id);
    try {
      await db.deleteFeedback(id);
      setFeedback(prev => prev.filter(f => f.id !== id));
      setSelectedFeedback(null);
      setStats(await db.getFeedbackStats());
    } catch (err) { setError('Löschen fehlgeschlagen: ' + err.message); }
    finally { setUpdating(null); }
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Typ', 'Status', 'Nachricht', 'E-Mail', 'Seite', 'Erstellt'];
    const rows = filteredFeedback.map(f => [f.id, TYPE_CONFIG[f.type]?.label || f.type, f.status, `"${f.message.replace(/"/g, '""')}"`, f.email || '', f.pageUrl || '', new Date(f.createdAt).toLocaleString('de-DE')]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredFeedback = useMemo(() => {
    return feedback.filter(f => searchQuery === '' || f.message.toLowerCase().includes(searchQuery.toLowerCase()) || f.email?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [feedback, searchQuery]);

  if (adminLoading) return <div className="flex min-h-screen items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /><p className="mt-4 text-sm text-gray-600">Berechtigungen werden geprüft...</p></div>;
  if (!isAuthenticated) return <div className="flex min-h-screen items-center justify-center bg-gray-50 flex-col"><Shield className="h-16 w-16 text-gray-300" /><h1 className="mt-4 text-xl font-bold">Zugriff verweigert</h1><button onClick={() => navigate('/')} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Zur Startseite</button></div>;
  if (!isAdmin) return <div className="flex min-h-screen items-center justify-center bg-gray-50 flex-col"><Shield className="h-16 w-16 text-red-300" /><h1 className="mt-4 text-xl font-bold">Kein Admin-Zugriff</h1><p className="text-sm text-gray-400">{user?.email}</p><button onClick={() => navigate('/dashboard')} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Zum Dashboard</button></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600"><Shield className="h-5 w-5 text-white" /></div>
              <div><p className="text-sm font-bold text-gray-900">Admin Panel</p><p className="text-xs text-purple-600">Feedback Management</p></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportToCsv} disabled={filteredFeedback.length === 0} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"><Download className="h-4 w-4" />Export CSV</button>
            <button onClick={loadData} disabled={loading} className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Aktualisieren</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {error && <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"><AlertCircle className="h-4 w-4" />{error}<button onClick={() => { setError(null); loadData(); }} className="ml-auto underline">Erneut versuchen</button></div>}

        {stats && (
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <StatCard icon={BarChart3} label="Gesamt" value={stats.total} color="blue" />
            <StatCard icon={TrendingUp} label="Diese Woche" value={stats.thisWeek} color="green" />
            <StatCard icon={Bug} label="Bugs" value={stats.byType.bug} color="red" />
            <StatCard icon={Lightbulb} label="Features" value={stats.byType.feature} color="purple" />
            <StatCard icon={AlertCircle} label="Neu" value={stats.byStatus.new} color="blue" />
            <StatCard icon={CheckCircle2} label="Erledigt" value={stats.byStatus.resolved} color="green" />
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Suchen..." className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="all">Alle Typen</option><option value="bug">Bugs</option><option value="feature">Features</option><option value="general">Allgemein</option></select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="all">Alle Status</option><option value="new">Neu</option><option value="in_progress">In Bearbeitung</option><option value="resolved">Erledigt</option><option value="closed">Geschlossen</option></select>
            <button onClick={loadData} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Filter anwenden</button>
          </div>
        </div>

        {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>
          : filteredFeedback.length === 0 ? <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center"><MessageSquare className="mx-auto h-12 w-12 text-gray-300" /><h3 className="mt-4 text-lg font-bold text-gray-900">Kein Feedback</h3><p className="mt-2 text-sm text-gray-500">{searchQuery ? 'Keine Ergebnisse für diese Suche.' : 'Noch kein Feedback eingegangen.'}</p></div>
          : <div className="space-y-3">{filteredFeedback.map(f => <FeedbackCard key={f.id} feedback={f} isSelected={selectedFeedback?.id === f.id} onSelect={() => setSelectedFeedback(selectedFeedback?.id === f.id ? null : f)} onStatusChange={handleStatusChange} onDelete={handleDelete} updating={updating === f.id} />)}</div>}
      </div>

      {selectedFeedback && <FeedbackDetailModal feedback={selectedFeedback} onClose={() => setSelectedFeedback(null)} onStatusChange={handleStatusChange} onDelete={handleDelete} updating={updating === selectedFeedback.id} />}
    </div>
  );
};

export default AdminDashboard;
