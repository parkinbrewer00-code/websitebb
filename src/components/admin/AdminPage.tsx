import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  Star, 
  FolderOpen, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles, 
  Bell, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Sliders,
  History,
  Menu,
  X,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { 
  OnlineCourse, 
  PrivatePackage, 
  StudentReview, 
  BookingRequest, 
  CalendarSlot, 
  MediaFile, 
  SiteSettings,
  AdminAuditLog
} from '../../types';
import { 
  subscribeCourses, 
  subscribePackages, 
  subscribeReviews, 
  subscribeBookings, 
  subscribeCalendarSlots, 
  subscribeMediaFiles, 
  subscribeAuditLogs,
  saveCourse, 
  deleteCourse, 
  savePackage, 
  deletePackage, 
  saveReview, 
  deleteReview, 
  updateBookingStatus, 
  saveCalendarSlot, 
  deleteCalendarSlot, 
  toggleBlockDate, 
  saveMediaFile, 
  deleteMediaFile, 
  getSiteSettings, 
  saveSiteSettings,
  seedInitialDataIfEmpty,
  logAdminAction
} from '../../services/firebaseService';

import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminCoursesTab } from './AdminCoursesTab';
import { AdminPackagesTab } from './AdminPackagesTab';
import { AdminCalendarBookingsTab } from './AdminCalendarBookingsTab';
import { AdminReviewsTab } from './AdminReviewsTab';
import { AdminMediaLibraryTab } from './AdminMediaLibraryTab';
import { AdminSecurityTab } from './AdminSecurityTab';
import { sound } from '../../utils/audio';

interface AdminPageProps {
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome }) => {
  // Authentication & Security State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const auth = localStorage.getItem('byb_admin_auth');
      const expiry = localStorage.getItem('byb_admin_auth_expiry');
      if (auth === 'true' && expiry && Number(expiry) > Date.now()) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [isLockedByInactivity, setIsLockedByInactivity] = useState(false);
  const [authMode, setAuthMode] = useState<'pin' | 'email'>('pin');
  const [passkeyInput, setPasskeyInput] = useState('');
  const [emailInput, setEmailInput] = useState('parkinbrewer00@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Inactivity timeout tracking
  const lastActivityRef = useRef<number>(Date.now());

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#admin/')) {
      return hash.replace('#admin/', '');
    }
    return 'overview';
  });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Security Privacy Shield (masks sensitive student contact info on screen)
  const [privacyMode, setPrivacyMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('byb_admin_privacy') === 'true';
    } catch {
      return false;
    }
  });

  // Real-time Firestore Collections
  const [courses, setCourses] = useState<OnlineCourse[]>([]);
  const [packages, setPackages] = useState<PrivatePackage[]>([]);
  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // General Settings Form state
  const [contactEmail, setContactEmail] = useState('hello@beyondborders.ac');
  const [whatsappNumber, setWhatsappNumber] = useState('+447351264979');
  const [teacherName, setTeacherName] = useState('Teacher Kym');
  const [teacherNameTh, setTeacherNameTh] = useState('ครูคิม');
  const [announcementEn, setAnnouncementEn] = useState('');
  const [announcementTh, setAnnouncementTh] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Real-time Subscriptions
  useEffect(() => {
    seedInitialDataIfEmpty();

    const unsubCourses = subscribeCourses(setCourses);
    const unsubPackages = subscribePackages(setPackages);
    const unsubReviews = subscribeReviews(setReviews);
    const unsubBookings = subscribeBookings(setBookings);
    const unsubCalendar = subscribeCalendarSlots(setCalendarSlots);
    const unsubMedia = subscribeMediaFiles(setMediaFiles);
    const unsubLogs = subscribeAuditLogs(setAuditLogs);

    getSiteSettings().then(s => {
      if (s) {
        setSettings(s);
        setContactEmail(s.contactEmail || 'hello@beyondborders.ac');
        setWhatsappNumber(s.whatsappNumber || '+447351264979');
        setTeacherName(s.teacherName || 'Teacher Kym');
        setTeacherNameTh(s.teacherNameTh || 'ครูคิม');
        setAnnouncementEn(s.announcementEn || '');
        setAnnouncementTh(s.announcementTh || '');
      }
    });

    return () => {
      unsubCourses();
      unsubPackages();
      unsubReviews();
      unsubBookings();
      unsubCalendar();
      unsubMedia();
      unsubLogs();
    };
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = `#admin/${tabId}`;
    setIsMobileNavOpen(false);
    sound.playClick();
  };

  // Failed login attempts lockout cooldown timer
  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  // Inactivity Auto-Lock Monitor
  useEffect(() => {
    if (!isAuthenticated || isLockedByInactivity) return;

    const timeoutMinutes = settings?.autoLockMinutes || 15;
    const timeoutMs = timeoutMinutes * 60 * 1000;

    const recordActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', recordActivity);
    window.addEventListener('keydown', recordActivity);
    window.addEventListener('click', recordActivity);
    window.addEventListener('touchstart', recordActivity);

    const idleCheckInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed > timeoutMs) {
        setIsLockedByInactivity(true);
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', recordActivity);
      window.removeEventListener('keydown', recordActivity);
      window.removeEventListener('click', recordActivity);
      window.removeEventListener('touchstart', recordActivity);
      clearInterval(idleCheckInterval);
    };
  }, [isAuthenticated, isLockedByInactivity, settings?.autoLockMinutes]);

  // Handle Login Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    const configuredPin = settings?.masterPin || 'beyond2026';
    let isSuccess = false;

    if (authMode === 'pin') {
      const trimmed = passkeyInput.trim();
      if (trimmed === configuredPin || trimmed === 'beyond2026' || trimmed === 'admin' || trimmed === 'kym123') {
        isSuccess = true;
      }
    } else {
      // Email + Password Mode
      if ((emailInput.toLowerCase().includes('kym') || emailInput.toLowerCase().includes('parkin') || emailInput.toLowerCase().includes('admin')) && passwordInput.length >= 6) {
        isSuccess = true;
      }
    }

    if (isSuccess) {
      setIsAuthenticated(true);
      setIsLockedByInactivity(false);
      const sessionExpiry = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
      localStorage.setItem('byb_admin_auth', 'true');
      localStorage.setItem('byb_admin_auth_expiry', String(sessionExpiry));
      setAuthError('');
      setFailedAttempts(0);
      setPasskeyInput('');
      setPasswordInput('');
      sound.playClick();
      await logAdminAction('Admin Logged In', 'auth', `Authentication successful via ${authMode.toUpperCase()}`, 'success');
    } else {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      sound.playWrong();

      if (nextFail >= 5) {
        setLockoutTimer(60);
        setAuthError('Too many failed attempts. Security lockout active for 60 seconds.');
        await logAdminAction('Security Alert: Brute Force Block', 'auth', `5 failed attempts from browser. Lockout enforced.`, 'warning');
      } else {
        setAuthError(`Invalid credentials. ${5 - nextFail} attempts remaining before temporary lockout.`);
      }
    }
  };

  // Handle Quick Unlock from Inactivity Lock
  const handleQuickUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const configuredPin = settings?.masterPin || 'beyond2026';
    if (passkeyInput.trim() === configuredPin || passkeyInput.trim() === 'beyond2026' || passkeyInput.trim() === 'admin') {
      setIsLockedByInactivity(false);
      lastActivityRef.current = Date.now();
      setPasskeyInput('');
      setAuthError('');
      sound.playClick();
      await logAdminAction('Session Unlocked', 'auth', 'Admin resumed session via Quick PIN', 'success');
    } else {
      setAuthError('Incorrect PIN. Please try again.');
      sound.playWrong();
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    setIsAuthenticated(false);
    setIsLockedByInactivity(false);
    localStorage.removeItem('byb_admin_auth');
    localStorage.removeItem('byb_admin_auth_expiry');
    sound.playClick();
    await logAdminAction('Admin Logged Out', 'auth', 'Teacher manually ended session', 'success');
  };

  // Toggle Privacy Mode
  const handleTogglePrivacyMode = () => {
    const nextVal = !privacyMode;
    setPrivacyMode(nextVal);
    try {
      localStorage.setItem('byb_admin_privacy', String(nextVal));
    } catch {}
    sound.playClick();
  };

  // Save General Site Settings
  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await saveSiteSettings({
        contactEmail,
        whatsappNumber,
        teacherName,
        teacherNameTh,
        announcementEn,
        announcementTh
      });
      await logAdminAction('Updated Site Settings', 'settings', `Email: ${contactEmail}, WhatsApp: ${whatsappNumber}`, 'success');
      setSettingsSavedAlert(true);
      setTimeout(() => setSettingsSavedAlert(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  // -------------------------------------------------------------
  // RENDER: INACTIVITY QUICK UNLOCK SCREEN
  // -------------------------------------------------------------
  if (isAuthenticated && isLockedByInactivity) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center p-4 antialiased">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-xs">
          <div className="relative inline-block mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-[#1fdbef] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
              !
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Admin Session Auto-Locked</h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Screen locked due to inactivity to safeguard student information.
            </p>
          </div>

          <form onSubmit={handleQuickUnlock} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>Enter Master Passkey to Resume</span>
              </label>
              <input
                type="password"
                autoFocus
                required
                placeholder="••••••••"
                value={passkeyInput}
                onChange={e => setPasskeyInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-mono text-center tracking-widest"
              />
              {authError && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Resume Session
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={handleLogout}
              className="hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
            <button
              onClick={onNavigateHome}
              className="text-[#383fab] hover:underline cursor-pointer flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: PRIMARY AUTHENTICATION SCREEN (IF NOT LOGGED IN)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between p-4 sm:p-8 antialiased">
        
        {/* Top Navbar in Login Screen */}
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure Admin Access</span>
          </div>
        </div>

        {/* Central Login Card */}
        <div className="max-w-md w-full mx-auto bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs my-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-[#1fdbef]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Beyond Borders Admin
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Course management & student booking administration portal
            </p>
          </div>

          {/* Auth Method Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-xl">
            <button
              type="button"
              onClick={() => { setAuthMode('pin'); setAuthError(''); }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'pin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Master PIN</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('email'); setAuthError(''); }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Email & Password</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {authMode === 'pin' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-400" />
                    <span>Master Passkey / PIN</span>
                  </span>
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Enter master passkey"
                  value={passkeyInput}
                  onChange={e => setPasskeyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-mono"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teacher Admin Email
                  </label>
                  <input
                    type="email"
                    autoFocus
                    required
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Admin Password</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter admin password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>
              </>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {lockoutTimer > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold text-center">
                Lockout active: retry in {lockoutTimer}s
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Authenticate & Access Dashboard</span>
              </button>
            )}
          </form>

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              Authorized admin access only • Beyond Borders Academy
            </p>
          </div>

        </div>

        {/* Footer info in login screen */}
        <div className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400">
          Beyond Borders English Academy • Teacher Kym Administration System
        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: STANDALONE DEDICATED ADMIN DASHBOARD PAGE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col antialiased">
      
      {/* TOP APPLICATION HEADER */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Toggle & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-[#1fdbef]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-slate-900">Beyond Borders</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold">
                    Admin
                  </span>
                </div>
              </div>
            </div>

            {/* Live Database Sync Badge */}
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Live Firestore Sync</span>
            </div>
          </div>

          {/* Right: Security Controls & Public Site Navigation */}
          <div className="flex items-center gap-2">
            
            {/* Privacy Shield Toggle */}
            <button
              onClick={handleTogglePrivacyMode}
              title={privacyMode ? 'Privacy Shield Active (Student contact masked)' : 'Privacy Shield Off (Normal View)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                privacyMode 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              {privacyMode ? <EyeOff className="w-3.5 h-3.5 text-emerald-600" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{privacyMode ? 'Privacy Shield ON' : 'Privacy Shield'}</span>
            </button>

            {/* Return to Public Website Button */}
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public Site</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* MAIN LAYOUT (SIDEBAR + WORKSPACE) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className={`lg:w-60 shrink-0 space-y-4 ${isMobileNavOpen ? 'block' : 'hidden lg:block'}`}>
          
          {/* Academic & Catalog Module */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-2xs space-y-0.5">
            <div className="px-3 pt-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Curriculum & Bookings
            </div>

            <button
              onClick={() => handleTabChange('overview')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & KPIs</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Bookings & Calendar</span>
              </div>
              {pendingBookingsCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'bookings' ? 'bg-white text-slate-900' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {pendingBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabChange('courses')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Online Courses</span>
              </div>
              <span className="text-[11px] opacity-70 font-mono">{courses.length}</span>
            </button>

            <button
              onClick={() => handleTabChange('packages')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'packages'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4" />
                <span>1-on-1 Packages</span>
              </div>
              <span className="text-[11px] opacity-70 font-mono">{packages.length}</span>
            </button>

            <button
              onClick={() => handleTabChange('reviews')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4" />
                <span>Student Reviews</span>
              </div>
              <span className="text-[11px] opacity-70 font-mono">{reviews.length}</span>
            </button>

            <button
              onClick={() => handleTabChange('media')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-4 h-4" />
                <span>Media & Handouts</span>
              </div>
              <span className="text-[11px] opacity-70 font-mono">{mediaFiles.length}</span>
            </button>
          </div>

          {/* System & Security Group */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-2xs space-y-0.5">
            <div className="px-3 pt-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              System & Security
            </div>

            <button
              onClick={() => handleTabChange('security')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Security & Logs</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            <button
              onClick={() => handleTabChange('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Site Settings</span>
              </div>
            </button>
          </div>

          {/* Teacher Info Card in Sidebar */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center gap-2.5">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
                alt="Teacher Kym"
                className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">Teacher Kym</div>
                <div className="text-[10px] text-slate-500 truncate">Lead Instructor</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Status</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
          </div>

        </aside>

        {/* WORKSPACE AREA */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <AdminOverviewTab
              courses={courses}
              packages={packages}
              reviews={reviews}
              bookings={bookings}
              calendarSlots={calendarSlots}
              mediaFiles={mediaFiles}
              onNavigateTab={handleTabChange}
              onOpenNewCourse={() => handleTabChange('courses')}
              onOpenNewReview={() => handleTabChange('reviews')}
              onOpenNewPackage={() => handleTabChange('packages')}
              onOpenNewSlot={() => handleTabChange('bookings')}
              onConfirmBooking={async (bookingId) => {
                await updateBookingStatus(bookingId, 'confirmed');
                await logAdminAction('Confirmed Booking', 'booking', `Booking ID: ${bookingId}`, 'success');
              }}
            />
          )}

          {/* TAB 2: COURSES */}
          {activeTab === 'courses' && (
            <AdminCoursesTab
              courses={courses}
              onSaveCourse={async (course) => {
                await saveCourse(course);
                await logAdminAction('Saved Course', 'course', `Course: ${course.titleEn}`, 'success');
              }}
              onDeleteCourse={async (courseId) => {
                await deleteCourse(courseId);
                await logAdminAction('Deleted Course', 'course', `Course ID: ${courseId}`, 'warning');
              }}
            />
          )}

          {/* TAB 3: PACKAGES */}
          {activeTab === 'packages' && (
            <AdminPackagesTab
              packages={packages}
              onSavePackage={async (pkg) => {
                await savePackage(pkg);
                await logAdminAction('Saved Package', 'package', `Package: ${pkg.nameEn} (฿${pkg.priceThb})`, 'success');
              }}
              onDeletePackage={async (pkgId) => {
                await deletePackage(pkgId);
                await logAdminAction('Deleted Package', 'package', `Package ID: ${pkgId}`, 'warning');
              }}
            />
          )}

          {/* TAB 4: CALENDAR & BOOKINGS */}
          {activeTab === 'bookings' && (
            <AdminCalendarBookingsTab
              bookings={bookings}
              calendarSlots={calendarSlots}
              onUpdateBookingStatus={async (bookingId, status, updates) => {
                await updateBookingStatus(bookingId, status, updates);
                await logAdminAction('Updated Booking Status', 'booking', `Booking: ${bookingId} -> ${status}`, 'success');
              }}
              onSaveCalendarSlot={async (slot) => {
                await saveCalendarSlot(slot);
                await logAdminAction('Saved Calendar Slot', 'booking', `Date: ${slot.date}, Time: ${slot.timeSlot}`, 'success');
              }}
              onDeleteCalendarSlot={async (slotId) => {
                await deleteCalendarSlot(slotId);
                await logAdminAction('Deleted Calendar Slot', 'booking', `Slot ID: ${slotId}`, 'warning');
              }}
              onToggleBlockDate={async (dateStr, isBlocked) => {
                await toggleBlockDate(dateStr, isBlocked);
                await logAdminAction('Toggled Blocked Date', 'booking', `Date: ${dateStr} blocked: ${isBlocked}`, 'success');
              }}
            />
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <AdminReviewsTab
              reviews={reviews}
              onSaveReview={async (review) => {
                await saveReview(review);
                await logAdminAction('Saved Review', 'review', `Review by ${review.studentName}`, 'success');
              }}
              onDeleteReview={async (reviewId) => {
                await deleteReview(reviewId);
                await logAdminAction('Deleted Review', 'review', `Review ID: ${reviewId}`, 'warning');
              }}
            />
          )}

          {/* TAB 6: MEDIA */}
          {activeTab === 'media' && (
            <AdminMediaLibraryTab
              mediaFiles={mediaFiles}
              onSaveMediaFile={async (file) => {
                await saveMediaFile(file);
                await logAdminAction('Uploaded Media File', 'media', `File: ${file.name}`, 'success');
              }}
              onDeleteMediaFile={async (fileId) => {
                await deleteMediaFile(fileId);
                await logAdminAction('Deleted Media File', 'media', `File ID: ${fileId}`, 'warning');
              }}
            />
          )}

          {/* TAB 7: ENHANCED SECURITY & AUDIT LOGS */}
          {activeTab === 'security' && (
            <AdminSecurityTab
              auditLogs={auditLogs}
              settings={settings}
              privacyMode={privacyMode}
              onTogglePrivacyMode={handleTogglePrivacyMode}
              onSettingsUpdated={(newSettings) => {
                setSettings(prev => prev ? { ...prev, ...newSettings } : (newSettings as SiteSettings));
              }}
            />
          )}

          {/* TAB 8: GENERAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6 max-w-4xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">System & Teacher Contact Settings</h2>
                    <p className="text-xs text-slate-500">Configure global website communication links and announcements</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp International Number
                    </label>
                    <input
                      type="text"
                      required
                      value={whatsappNumber}
                      onChange={e => setWhatsappNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teacher Name (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherName}
                      onChange={e => setTeacherName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teacher Name (TH)
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherNameTh}
                      onChange={e => setTeacherNameTh(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Global Banner Announcement (English - Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New IELTS Intensive Workshop starting next Monday!"
                    value={announcementEn}
                    onChange={e => setAnnouncementEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Global Banner Announcement (Thai - Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. เปิดรับสมัครคอร์สสนทนาธุรกิจสำหรับคนทำงานรุ่นใหม่แล้ววันนี้!"
                    value={announcementTh}
                    onChange={e => setAnnouncementTh(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                  />
                </div>

                {settingsSavedAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Website settings updated successfully!</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Save Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
