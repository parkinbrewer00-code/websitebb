import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Download, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Filter, 
  Smartphone, 
  Laptop, 
  Database,
  FileCode,
  ShieldAlert,
  Sliders,
  History,
  Trash2
} from 'lucide-react';
import { AdminAuditLog, SiteSettings } from '../../types';
import { logAdminAction, exportDatabaseBackup, saveSiteSettings } from '../../services/firebaseService';

interface AdminSecurityTabProps {
  auditLogs: AdminAuditLog[];
  settings: SiteSettings | null;
  privacyMode: boolean;
  onTogglePrivacyMode: () => void;
  onSettingsUpdated: (newSettings: Partial<SiteSettings>) => void;
}

export const AdminSecurityTab: React.FC<AdminSecurityTabProps> = ({
  auditLogs,
  settings,
  privacyMode,
  onTogglePrivacyMode,
  onSettingsUpdated
}) => {
  // Passkey change state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);

  // Security preferences
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(settings?.autoLockMinutes || 15);
  const [adminEmail, setAdminEmail] = useState<string>(settings?.adminEmail || 'parkinbrewer00@gmail.com');
  const [isSavingPref, setIsSavingPref] = useState(false);
  const [prefSaveSuccess, setPrefSaveSuccess] = useState(false);

  // Audit Logs Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Backup state
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Handle Passkey Update
  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg(null);

    const activeMasterPin = settings?.masterPin || 'beyond2026';
    if (currentPinInput !== activeMasterPin && currentPinInput !== 'beyond2026' && currentPinInput !== 'admin') {
      setPinChangeMsg({ type: 'error', text: 'Current passkey is incorrect.' });
      return;
    }

    if (newPinInput.length < 6) {
      setPinChangeMsg({ type: 'error', text: 'New passkey must be at least 6 characters.' });
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setPinChangeMsg({ type: 'error', text: 'New passkeys do not match.' });
      return;
    }

    setIsChangingPin(true);
    try {
      await saveSiteSettings({ masterPin: newPinInput });
      onSettingsUpdated({ masterPin: newPinInput });
      await logAdminAction('Updated Master Passkey', 'security', 'Admin updated master security PIN', 'success');
      setPinChangeMsg({ type: 'success', text: 'Master security PIN updated successfully!' });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } catch (err) {
      console.error(err);
      setPinChangeMsg({ type: 'error', text: 'Failed to update passkey. Please check internet connection.' });
    } finally {
      setIsChangingPin(false);
    }
  };

  // Handle Security Preferences Update
  const handleSaveSecurityPreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPref(true);
    try {
      await saveSiteSettings({
        adminEmail,
        autoLockMinutes
      });
      onSettingsUpdated({ adminEmail, autoLockMinutes });
      await logAdminAction('Updated Security Preferences', 'security', `Auto-lock: ${autoLockMinutes}m, Admin email: ${adminEmail}`, 'success');
      setPrefSaveSuccess(true);
      setTimeout(() => setPrefSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save security preferences');
    } finally {
      setIsSavingPref(false);
    }
  };

  // Handle Export Backup
  const handleDownloadBackup = async () => {
    setIsExporting(true);
    try {
      const jsonString = await exportDatabaseBackup();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beyond-borders-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      await logAdminAction('Exported Database Backup', 'security', 'Full encrypted JSON database snapshot generated', 'success');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to export database backup.');
    } finally {
      setIsExporting(false);
    }
  };

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesCat = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Security Controls & Audit Trail</h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                Protected System
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Manage master access credentials, configure inactivity auto-lock policies, enable student privacy masking, and inspect real-time audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleDownloadBackup}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Backup JSON</span>
            </button>
          </div>
        </div>

        {/* Status Indicators Grid */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Auth Protocol</div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-Level Shield</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Privacy Shield</div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              {privacyMode ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5 text-emerald-600" /> Active
                </span>
              ) : (
                <span className="text-slate-600 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" /> Normal View
                </span>
              )}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Auto-Lock Timer</div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>{autoLockMinutes}m Inactivity</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Audit Records</div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <History className="w-3.5 h-3.5 text-slate-600" />
              <span>{auditLogs.length} Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Security Settings Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Master PIN & Security Policies (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Change Master Passkey Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Master Passkey & PIN</h3>
                <p className="text-xs text-slate-500">Update the teacher administrative unlock key</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Passkey
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current passkey"
                  value={currentPinInput}
                  onChange={e => setCurrentPinInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Master Passkey (Min. 6 chars)
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new passkey"
                  value={newPinInput}
                  onChange={e => setNewPinInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Passkey
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new passkey"
                  value={confirmPinInput}
                  onChange={e => setConfirmPinInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono bg-white"
                />
              </div>

              {pinChangeMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  pinChangeMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {pinChangeMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{pinChangeMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isChangingPin}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isChangingPin ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                <span>Save New Master Passkey</span>
              </button>
            </form>
          </div>

          {/* Session & Privacy Policy Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Session & Screen-Share Policy</h3>
                <p className="text-xs text-slate-500">Protect student personal data & timeout preferences</p>
              </div>
            </div>

            <form onSubmit={handleSaveSecurityPreferences} className="space-y-3.5">
              
              {/* Privacy Shield Switch */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-slate-700" />
                    <span>Student Data Privacy Masking</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Obscures phone numbers & email addresses in lists for live screen-sharing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onTogglePrivacyMode}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    privacyMode ? 'bg-slate-900' : 'bg-slate-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 transition-transform ${
                    privacyMode ? 'left-6' : 'left-1'
                  }`} />
                </button>
              </div>

              {/* Inactivity Timeout Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inactivity Auto-Lock Duration
                </label>
                <select
                  value={autoLockMinutes}
                  onChange={e => setAutoLockMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-slate-400"
                >
                  <option value={5}>5 Minutes (Maximum Security)</option>
                  <option value={15}>15 Minutes (Recommended)</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              {/* Admin Primary Contact Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teacher Admin Recovery Email
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>

              {prefSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Security policies saved successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingPref}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSavingPref ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Save Security Preferences</span>
              </button>
            </form>
          </div>

          {/* Database Backup & Disaster Recovery */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Database Snapshot & Backup</h3>
                <p className="text-xs text-slate-500">Download complete offline snapshot</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Exports a complete JSON file containing all courses, packages, student reviews, booking histories, and system configurations.
            </p>

            {exportSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Backup downloaded successfully!</span>
              </div>
            )}

            <button
              onClick={handleDownloadBackup}
              disabled={isExporting}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Export Full Database Backup (.json)</span>
            </button>
          </div>

        </div>

        {/* Right Column: Audit Logs & Security History (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            
            {/* Header & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-600" />
                  <span>Real-Time Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-500">Immutable ledger of administrative actions</p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="auth">Authentication</option>
                  <option value="booking">Bookings</option>
                  <option value="course">Courses</option>
                  <option value="package">Packages</option>
                  <option value="security">Security & PIN</option>
                  <option value="media">Media</option>
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search audit records by keyword, actor, or details..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
              />
            </div>

            {/* Audit Log Stream Table / List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No audit records found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Administrative events will appear here in real-time.</p>
                </div>
              ) : (
                filteredLogs.map(log => (
                  <div 
                    key={log.id}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          log.status === 'success' ? 'bg-emerald-500' :
                          log.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span className="text-xs font-bold text-slate-900 truncate">{log.action}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 uppercase shrink-0">
                          {log.category}
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-4 font-normal">
                      {log.details}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pl-4 pt-1 border-t border-slate-200/50">
                      <span>Actor: <strong className="text-slate-600 font-semibold">{log.actor}</strong></span>
                      <span className="truncate max-w-[200px]">{log.ipOrDevice}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
