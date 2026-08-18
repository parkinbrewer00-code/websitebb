import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  Star, 
  FolderOpen, 
  Settings, 
  LogOut, 
  X, 
  Lock, 
  Key, 
  CheckCircle, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Bell
} from 'lucide-react';
import { 
  OnlineCourse, 
  PrivatePackage, 
  StudentReview, 
  BookingRequest, 
  CalendarSlot, 
  MediaFile, 
  SiteSettings 
} from '../../types';
import { 
  subscribeCourses, 
  subscribePackages, 
  subscribeReviews, 
  subscribeBookings, 
  subscribeCalendarSlots, 
  subscribeMediaFiles, 
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
  seedInitialDataIfEmpty
} from '../../services/firebaseService';

import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminCoursesTab } from './AdminCoursesTab';
import { AdminPackagesTab } from './AdminPackagesTab';
import { AdminCalendarBookingsTab } from './AdminCalendarBookingsTab';
import { AdminReviewsTab } from './AdminReviewsTab';
import { AdminMediaLibraryTab } from './AdminMediaLibraryTab';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  // Authentication State (Admin session)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('byb_admin_auth') === 'true';
  });
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Real-time Firestore Data
  const [courses, setCourses] = useState<OnlineCourse[]>([]);
  const [packages, setPackages] = useState<PrivatePackage[]>([]);
  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Settings form state
  const [contactEmail, setContactEmail] = useState('hello@beyondborders.ac');
  const [whatsappNumber, setWhatsappNumber] = useState('+447351264979');
  const [announcementEn, setAnnouncementEn] = useState('');
  const [announcementTh, setAnnouncementTh] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Trigger initial seed if Firestore is clean
    seedInitialDataIfEmpty();

    // Subscribe to all live collections
    const unsubCourses = subscribeCourses(setCourses);
    const unsubPackages = subscribePackages(setPackages);
    const unsubReviews = subscribeReviews(setReviews);
    const unsubBookings = subscribeBookings(setBookings);
    const unsubCalendar = subscribeCalendarSlots(setCalendarSlots);
    const unsubMedia = subscribeMediaFiles(setMediaFiles);

    getSiteSettings().then(s => {
      if (s) {
        setSettings(s);
        setContactEmail(s.contactEmail || 'hello@beyondborders.ac');
        setWhatsappNumber(s.whatsappNumber || '+447351264979');
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
    };
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master passkey: 'beyond2026' or 'admin' or teacher pin
    if (passkeyInput.trim() === 'beyond2026' || passkeyInput.trim() === 'admin' || passkeyInput.trim() === 'kym123') {
      setIsAuthenticated(true);
      localStorage.setItem('byb_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect passkey. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('byb_admin_auth');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await saveSiteSettings({
        contactEmail,
        whatsappNumber,
        teacherName: 'Teacher Kym',
        teacherNameTh: 'ครูคิม',
        notificationEnabled: true,
        announcementEn,
        announcementTh
      });
      alert('Site settings updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-[#f8faff] rounded-t-3xl sm:rounded-3xl w-full h-[95vh] sm:h-[90vh] max-w-7xl mx-auto shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Top Navigation Bar */}
        <header className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200 border border-slate-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight">Beyond Borders</h1>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
                  Admin System
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Teacher Kym Management Backend</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* AUTHENTICATION SHIELD */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">Teacher Kym Admin Access</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your master passkey to manage courses, pricing, reviews, files, and student bookings.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    <span>Master Passkey</span>
                  </label>
                  <input
                    type="password"
                    autoFocus
                    required
                    placeholder="Enter master passkey"
                    value={passkeyInput}
                    onChange={e => setPasskeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-400 font-mono bg-white"
                  />
                  {authError && (
                    <p className="text-xs text-rose-600 mt-1.5 font-semibold">
                      {authError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Unlock Admin Portal
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-3 md:p-4 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-y-auto">
              <div className="flex md:flex-col gap-1 w-full">
                {[
                  { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard, count: null },
                  { id: 'calendar', label: '1-on-1 Calendar', icon: Calendar, count: bookings.filter(b => b.status === 'pending').length },
                  { id: 'courses', label: 'Online Courses', icon: BookOpen, count: courses.length },
                  { id: 'packages', label: '1-on-1 Packages', icon: DollarSign, count: packages.length },
                  { id: 'reviews', label: 'Student Reviews', icon: Star, count: reviews.length },
                  { id: 'media', label: 'Media & Files', icon: FolderOpen, count: mediaFiles.length },
                  { id: 'settings', label: 'Site Settings', icon: Settings, count: null }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== null && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 ${
                          isActive 
                            ? 'bg-slate-800 text-slate-200' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom quick help */}
              <div className="hidden md:block pt-4 border-t border-slate-100 text-slate-400 text-[11px] space-y-1">
                <div className="text-slate-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Cloud Firestore Sync</span>
                </div>
                <p>Changes update live instantly on the main website.</p>
              </div>
            </aside>

            {/* Main Tab Content View */}
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50">
              {activeTab === 'overview' && (
                <AdminOverviewTab
                  courses={courses}
                  packages={packages}
                  reviews={reviews}
                  bookings={bookings}
                  calendarSlots={calendarSlots}
                  mediaFiles={mediaFiles}
                  onNavigateTab={setActiveTab}
                  onOpenNewCourse={() => setActiveTab('courses')}
                  onOpenNewReview={() => setActiveTab('reviews')}
                  onOpenNewPackage={() => setActiveTab('packages')}
                  onOpenNewSlot={() => setActiveTab('calendar')}
                  onConfirmBooking={(bId) => {
                    setActiveTab('calendar');
                  }}
                />
              )}

              {activeTab === 'courses' && (
                <AdminCoursesTab
                  courses={courses}
                  onSaveCourse={saveCourse}
                  onDeleteCourse={deleteCourse}
                />
              )}

              {activeTab === 'packages' && (
                <AdminPackagesTab
                  packages={packages}
                  onSavePackage={savePackage}
                  onDeletePackage={deletePackage}
                />
              )}

              {activeTab === 'calendar' && (
                <AdminCalendarBookingsTab
                  bookings={bookings}
                  calendarSlots={calendarSlots}
                  onUpdateBookingStatus={updateBookingStatus}
                  onSaveCalendarSlot={saveCalendarSlot}
                  onDeleteCalendarSlot={deleteCalendarSlot}
                  onToggleBlockDate={toggleBlockDate}
                />
              )}

              {activeTab === 'reviews' && (
                <AdminReviewsTab
                  reviews={reviews}
                  onSaveReview={saveReview}
                  onDeleteReview={deleteReview}
                />
              )}

              {activeTab === 'media' && (
                <AdminMediaLibraryTab
                  mediaFiles={mediaFiles}
                  onUploadMediaFile={saveMediaFile}
                  onDeleteMediaFile={deleteMediaFile}
                />
              )}

              {activeTab === 'settings' && (
                <div className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-slate-700" />
                      <span>Website & Contact Configuration</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Update official contact channels, WhatsApp connection, and top announcements.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Official Contact Email
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="hello@beyondborders.ac"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp Number (with country code e.g. +447351264979)
                      </label>
                      <input
                        type="text"
                        required
                        value={whatsappNumber}
                        onChange={e => setWhatsappNumber(e.target.value)}
                        placeholder="+447351264979"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Announcement Bar (English)
                        </label>
                        <textarea
                          rows={2}
                          value={announcementEn}
                          onChange={e => setAnnouncementEn(e.target.value)}
                          placeholder="Special promotion or notice in English"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Announcement Bar (Thai)
                        </label>
                        <textarea
                          rows={2}
                          value={announcementTh}
                          onChange={e => setAnnouncementTh(e.target.value)}
                          placeholder="ข้อความโปรโมชั่นภาษาไทย"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingSettings}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{isSavingSettings ? 'Saving...' : 'Save Settings'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
