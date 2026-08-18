import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Radio, 
  MessageSquare, 
  Mail, 
  Phone, 
  Plus, 
  Trash2, 
  Edit, 
  ChevronLeft, 
  ChevronRight, 
  Link as LinkIcon, 
  Sparkles,
  Search,
  Filter,
  Check,
  RefreshCw,
  Sliders,
  CalendarDays,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { BookingRequest, CalendarSlot } from '../../types';
import { bulkSaveCalendarSlots, logAdminAction } from '../../services/firebaseService';
import { sendBookingNotificationEmail, PRIMARY_NOTIFICATION_EMAIL } from '../../services/notificationService';
import { sound } from '../../utils/audio';

interface AdminCalendarBookingsTabProps {
  bookings: BookingRequest[];
  calendarSlots: CalendarSlot[];
  onUpdateBookingStatus: (
    bookingId: string, 
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
    updates?: { meetingLink?: string; adminNotes?: string; preferredDate?: string; preferredTimeSlot?: string }
  ) => Promise<void>;
  onSaveCalendarSlot: (slot: CalendarSlot) => Promise<void>;
  onDeleteCalendarSlot: (slotId: string) => Promise<void>;
  onToggleBlockDate: (dateStr: string, isBlocked: boolean) => Promise<void>;
}

export const AdminCalendarBookingsTab: React.FC<AdminCalendarBookingsTabProps> = ({
  bookings,
  calendarSlots,
  onUpdateBookingStatus,
  onSaveCalendarSlot,
  onDeleteCalendarSlot,
  onToggleBlockDate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'schedule'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected booking for detail/action modal
  const [actionBooking, setActionBooking] = useState<BookingRequest | null>(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState<string>('');
  const [adminNotesInput, setAdminNotesInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);

  // Calendar slot creation state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newSlotTime, setNewSlotTime] = useState<string>('19:00 - 20:00');
  const [newSlotNote, setNewSlotNote] = useState<string>('Available 1-on-1 slot');

  // Auto-generator state & options
  const [isGeneratingBulk, setIsGeneratingBulk] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [generateDaysCount, setGenerateDaysCount] = useState<number>(14);
  const [includeWeekends, setIncludeWeekends] = useState<boolean>(true);
  const [preserveExistingBooked, setPreserveExistingBooked] = useState<boolean>(true);
  const [generatorSuccessBanner, setGeneratorSuccessBanner] = useState<{ text: string; count: number } | null>(null);

  // Default daily teaching hours to generate
  const [selectedPresetTimes, setSelectedPresetTimes] = useState<string[]>([
    '10:00 - 11:00',
    '14:00 - 15:00',
    '16:00 - 17:00',
    '19:00 - 20:00',
    '20:30 - 21:30'
  ]);

  const togglePresetTime = (time: string) => {
    if (selectedPresetTimes.includes(time)) {
      if (selectedPresetTimes.length > 1) {
        setSelectedPresetTimes(selectedPresetTimes.filter(t => t !== time));
      }
    } else {
      setSelectedPresetTimes([...selectedPresetTimes, time]);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch = !searchQuery || 
      b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.studentLineId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenConfirmModal = (b: BookingRequest) => {
    setActionBooking(b);
    setMeetingLinkInput(b.meetingLink || `https://meet.google.com/byb-${Math.random().toString(36).substring(2, 7)}`);
    setAdminNotesInput(b.adminNotes || '');
    setEmailSentStatus(null);
  };

  const handleSendEmailNotification = async (b: BookingRequest) => {
    setIsSendingEmail(true);
    setEmailSentStatus(null);
    try {
      await sendBookingNotificationEmail(b, PRIMARY_NOTIFICATION_EMAIL);
      setEmailSentStatus(`Notification sent to ${PRIMARY_NOTIFICATION_EMAIL}`);
      sound.playClick();
    } catch (err) {
      console.error(err);
      setEmailSentStatus('Failed to send notification email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSaveBookingConfirmation = async () => {
    if (!actionBooking) return;
    setIsSubmitting(true);
    try {
      await onUpdateBookingStatus(actionBooking.id, 'confirmed', {
        meetingLink: meetingLinkInput,
        adminNotes: adminNotesInput
      });
      setActionBooking(null);
      sound.playClick();
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await onUpdateBookingStatus(bookingId, status);
      sound.playClick();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleAddSlot = async () => {
    if (!selectedDate || !newSlotTime.trim()) return;
    const slotId = `${selectedDate}_${newSlotTime.replace(/[^0-9]/g, '')}`;
    await onSaveCalendarSlot({
      id: slotId,
      date: selectedDate,
      timeSlot: newSlotTime.trim(),
      isBooked: false,
      isBlocked: false,
      note: newSlotNote.trim() || 'Available 1-on-1 slot'
    });
    sound.playClick();
  };

  // Quick Generate for Currently Selected Date
  const handleGenerateSlotsForSelectedDate = async () => {
    if (!selectedDate) return;
    setIsGeneratingBulk(true);
    try {
      const slotsToSave: CalendarSlot[] = selectedPresetTimes.map(time => {
        const slotId = `${selectedDate}_${time.replace(/[^0-9]/g, '')}`;
        // Check if existing slot is booked
        const existing = calendarSlots.find(s => s.id === slotId);
        if (existing && existing.isBooked) return existing;

        return {
          id: slotId,
          date: selectedDate,
          timeSlot: time,
          isBooked: false,
          isBlocked: false,
          note: 'Standard Teaching Slot'
        };
      });

      const count = await bulkSaveCalendarSlots(slotsToSave);
      await logAdminAction('Populated Date Slots', 'booking', `Generated ${count} slots for ${selectedDate}`, 'success');
      sound.playCorrect();
      setGeneratorSuccessBanner({
        text: `Successfully added ${count} available slots for ${selectedDate}!`,
        count
      });
      setTimeout(() => setGeneratorSuccessBanner(null), 4000);
    } catch (err) {
      console.error('Failed to generate slots for date:', err);
      alert('Failed to generate slots. Please check internet connection.');
    } finally {
      setIsGeneratingBulk(false);
    }
  };

  // High-Performance Bulk Slot Generator (14 Days or Custom Range)
  const handleExecuteBulkGenerate = async (daysOverride?: number) => {
    const days = daysOverride || generateDaysCount;
    setIsGeneratingBulk(true);
    setGeneratorSuccessBanner(null);

    try {
      const today = new Date();
      const slotsToCreate: CalendarSlot[] = [];
      const bookedSlotMap = new Map<string, CalendarSlot>();

      // Index existing booked slots so we NEVER overwrite a student's booked session
      if (preserveExistingBooked) {
        calendarSlots.forEach(s => {
          if (s.isBooked) {
            bookedSlotMap.set(s.id, s);
          }
        });
      }

      // Generate slots for each day in range
      for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        
        // Check weekend filter
        const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        if (!includeWeekends && isWeekend) {
          continue;
        }

        const dateStr = d.toISOString().split('T')[0];

        for (const time of selectedPresetTimes) {
          const slotId = `${dateStr}_${time.replace(/[^0-9]/g, '')}`;

          // If slot exists and is booked, skip or preserve it
          if (bookedSlotMap.has(slotId)) {
            continue;
          }

          slotsToCreate.push({
            id: slotId,
            date: dateStr,
            timeSlot: time,
            isBooked: false,
            isBlocked: false,
            note: 'Standard Teaching Slot'
          });
        }
      }

      // Atomically write all slots to Firestore via batch
      const totalCreated = await bulkSaveCalendarSlots(slotsToCreate);

      // Record in immutable audit trail
      await logAdminAction(
        'Auto-Generated Calendar Slots',
        'booking',
        `Generated ${totalCreated} slots across ${days} days (${slotsToCreate.length} slots batch-synced)`,
        'success'
      );

      sound.playCorrect();
      setShowConfigModal(false);
      setGeneratorSuccessBanner({
        text: `Successfully auto-generated and synchronized ${totalCreated} teaching slots across the next ${days} days!`,
        count: totalCreated
      });

      setTimeout(() => {
        setGeneratorSuccessBanner(null);
      }, 5000);

    } catch (err) {
      console.error('Error bulk generating slots:', err);
      sound.playWrong();
      alert('Failed to generate slots. Please verify Firestore connection.');
    } finally {
      setIsGeneratingBulk(false);
    }
  };

  // Slots for the selected date
  const slotsForSelectedDate = calendarSlots.filter(s => s.date === selectedDate);
  const isDateBlocked = slotsForSelectedDate.length > 0 && slotsForSelectedDate.every(s => s.isBlocked);

  return (
    <div className="space-y-6 antialiased">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-slate-700" />
            <span>1-on-1 Coaching Bookings & Schedule</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept appointment requests, manage meeting links, and customize teaching availability.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => { setActiveSubTab('bookings'); sound.playClick(); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'bookings'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Requests ({bookings.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('schedule'); sound.playClick(); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'schedule'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Calendar & Availability</span>
          </button>
        </div>
      </div>

      {/* Real-time Success Notification Banner */}
      {generatorSuccessBanner && (
        <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Schedule Updated</div>
              <div className="text-xs font-medium text-slate-100">{generatorSuccessBanner.text}</div>
            </div>
          </div>
          <button
            onClick={() => setGeneratorSuccessBanner(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Confirmation Modal for Booking */}
      {actionBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  Confirm 1-on-1 Lesson
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {actionBooking.studentName} ({actionBooking.packageName})
                </h3>
              </div>
              <button
                onClick={() => setActionBooking(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-semibold text-slate-800">{actionBooking.preferredDate} ({actionBooking.preferredTimeSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp / Contact:</span>
                  <span className="font-semibold text-slate-800">{actionBooking.studentLineId || actionBooking.studentPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-800">{actionBooking.studentEmail}</span>
                </div>
                {actionBooking.learningGoals && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-0.5">Student Focus Goal:</span>
                    <p className="text-slate-700 italic">"{actionBooking.learningGoals}"</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span>Google Meet / Zoom Classroom Link</span>
                </label>
                <input
                  type="url"
                  value={meetingLinkInput}
                  onChange={e => setMeetingLinkInput(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Private Teacher Notes (Internal)
                </label>
                <textarea
                  rows={2}
                  value={adminNotesInput}
                  onChange={e => setAdminNotesInput(e.target.value)}
                  placeholder="Notes about student focus, homework assigned, or scheduling requests..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500"
                />
              </div>

              {emailSentStatus && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{emailSentStatus}</span>
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSendingEmail}
                  onClick={() => handleSendEmailNotification(actionBooking)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Resend email notification to hello@beyondborders.ac"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isSendingEmail ? 'Sending...' : 'Send Alert Email'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActionBooking(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSaveBookingConfirmation}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : 'Confirm & Save Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Custom Slot Generator Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Custom Schedule Generator</h3>
                  <p className="text-xs text-slate-500">Configure batch slots across upcoming dates</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Days Range Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1. How many days forward to generate?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 14, 21, 30].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setGenerateDaysCount(days)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        generateDaysCount === days
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>2. Daily Time Slots to Create</span>
                  <span className="text-[10px] text-slate-400 font-normal">Click to toggle</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '10:00 - 11:00',
                    '14:00 - 15:00',
                    '16:00 - 17:00',
                    '19:00 - 20:00',
                    '20:30 - 21:30'
                  ].map(time => {
                    const isSelected = selectedPresetTimes.includes(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => togglePresetTime(time)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{time}</span>
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 opacity-40" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Options Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeWeekends}
                    onChange={e => setIncludeWeekends(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-0"
                  />
                  <span>Include Saturdays & Sundays (7 days/week)</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preserveExistingBooked}
                    onChange={e => setPreserveExistingBooked(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-0"
                  />
                  <span className="text-emerald-700 font-semibold">Safeguard: Never overwrite already booked student slots</span>
                </label>
              </div>

              {/* Calculation Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Total slots to sync to database:</span>
                <span className="font-bold text-slate-900 text-xs">
                  ~{generateDaysCount * selectedPresetTimes.length} slots
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGeneratingBulk}
                onClick={() => handleExecuteBulkGenerate()}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {isGeneratingBulk ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{isGeneratingBulk ? 'Writing...' : `Generate ${generateDaysCount} Days`}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 1: BOOKINGS LIST */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-4">
          
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student, email, WhatsApp..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => { setStatusFilter(st); sound.playClick(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st} ({st === 'all' ? bookings.length : bookings.filter(b => b.status === st).length})
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table / List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/90 shadow-2xs">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-700">No booking requests found</h3>
              <p className="text-xs text-slate-400 mt-1">Try changing filters or search keywords.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((b) => {
                const isPending = b.status === 'pending';
                const isConfirmed = b.status === 'confirmed';
                const isCompleted = b.status === 'completed';
                const isCancelled = b.status === 'cancelled';

                const whatsappUrl = b.studentLineId?.startsWith('+')
                  ? `https://wa.me/${b.studentLineId.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${b.studentName}! This is Teacher Kym from Beyond Borders regarding your 1-on-1 English session on ${b.preferredDate} (${b.preferredTimeSlot}).`)}`
                  : null;

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-colors space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                          {b.studentName.charAt(0) || 'S'}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{b.studentName}</h3>
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                              isPending ? 'bg-amber-100 text-amber-800' :
                              isConfirmed ? 'bg-emerald-100 text-emerald-800' :
                              isCompleted ? 'bg-indigo-100 text-indigo-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {b.status}
                            </span>
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              ฿{(b.priceThb || 0).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="text-slate-800 font-medium">
                              {b.packageName}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              📅 {b.preferredDate} ({b.preferredTimeSlot})
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {b.studentEmail}
                            </span>
                            {b.studentPhone && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {b.studentPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        {isPending && (
                          <button
                            onClick={() => handleOpenConfirmModal(b)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm & Link</span>
                          </button>
                        )}

                        {isConfirmed && (
                          <button
                            onClick={() => handleQuickStatusChange(b.id, 'completed')}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        )}

                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Message on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}

                        {!isCancelled && (
                          <button
                            onClick={() => handleQuickStatusChange(b.id, 'cancelled')}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Extended notes/link info */}
                    {(b.meetingLink || b.adminNotes || b.learningGoals) && (
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {b.learningGoals && (
                          <div className="bg-slate-50 p-2.5 rounded-xl text-slate-700 border border-slate-100">
                            <span className="font-semibold text-slate-500 block mb-0.5">Focus Goal:</span>
                            "{b.learningGoals}"
                          </div>
                        )}
                        {b.meetingLink && (
                          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-800 block mb-0.5 flex items-center gap-1">
                                <LinkIcon className="w-3 h-3 text-slate-500" /> Live Meeting Link:
                              </span>
                              <a
                                href={b.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-700 hover:underline font-mono text-[11px] truncate block"
                              >
                                {b.meetingLink}
                              </a>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(b.meetingLink || '');
                                alert('Meeting link copied to clipboard!');
                              }}
                              className="px-2 py-1 bg-white border border-slate-200 text-slate-700 rounded text-[10px] font-semibold shrink-0 hover:bg-slate-100 cursor-pointer"
                            >
                              Copy Link
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: TEACHER AVAILABILITY CALENDAR & SLOT MANAGER */}
      {activeSubTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 4 Cols: Date Selector & Quick Auto-Generator Controls */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Quick 14-Days Auto-Generator Highlight Card */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-slate-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Smart Slot Generator</h3>
                  <p className="text-[11px] text-slate-400">Fast batch synchronization</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Populates daily teaching hours (10:00, 14:00, 16:00, 19:00, 20:30) for the next 14 days with 1 click.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={isGeneratingBulk}
                  onClick={() => handleExecuteBulkGenerate(14)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingBulk ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 text-amber-500" />
                  )}
                  <span>{isGeneratingBulk ? 'Synchronizing...' : 'Auto-Generate 14 Days'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfigModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-300" />
                  <span>Customize Days & Time Presets...</span>
                </button>
              </div>
            </div>

            {/* Date Picker & Day Management Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>Select Calendar Date</span>
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Target Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-500 bg-white"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onToggleBlockDate(selectedDate, !isDateBlocked)}
                  className={`w-full py-2 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isDateBlocked
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isDateBlocked ? 'Unblock Date (Make Available)' : 'Block Selected Date (Day Off)'}
                </button>

                <button
                  type="button"
                  disabled={isGeneratingBulk}
                  onClick={handleGenerateSlotsForSelectedDate}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                  <span>Populate 5 Standard Slots for This Date</span>
                </button>
              </div>

              {/* Quick Status Info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Total System Slots:</span>
                  <strong className="text-slate-800">{calendarSlots.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Booked by Students:</span>
                  <strong className="text-emerald-600">{calendarSlots.filter(s => s.isBooked).length}</strong>
                </div>
              </div>

            </div>
          </div>

          {/* Right 8 Cols: Slots Manager for the Selected Date */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5 shadow-2xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-700" />
                  <span>Available Time Slots for {selectedDate}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {slotsForSelectedDate.length} slot(s) configured for this date.
                </p>
              </div>

              {isDateBlocked && (
                <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 text-xs font-semibold rounded-md">
                  Date Blocked (Day Off)
                </span>
              )}
            </div>

            {/* Add Custom Slot Input */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-semibold text-slate-800 block flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-slate-700" />
                <span>Add Single Custom Slot for {selectedDate}</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <input
                    type="text"
                    placeholder="e.g. 19:00 - 20:00"
                    value={newSlotTime}
                    onChange={e => setNewSlotTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Slot note / description"
                    value={newSlotNote}
                    onChange={e => setNewSlotNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Slot</span>
                </button>
              </div>
            </div>

            {/* List of slots */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {slotsForSelectedDate.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-3">
                  <CalendarDays className="w-8 h-8 text-slate-300 mx-auto" />
                  <div>
                    <p className="font-semibold text-slate-700">No slots configured for {selectedDate}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click below to auto-populate standard teaching hours for this date.</p>
                  </div>
                  <button
                    onClick={handleGenerateSlotsForSelectedDate}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Populate 5 Slots for {selectedDate}</span>
                  </button>
                </div>
              ) : (
                slotsForSelectedDate.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      slot.isBooked
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : slot.isBlocked
                        ? 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                        : 'bg-white hover:border-slate-300 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        slot.isBooked 
                          ? 'bg-amber-500 text-white' 
                          : slot.isBlocked 
                          ? 'bg-slate-200 text-slate-600' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold font-mono">{slot.timeSlot}</span>
                          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                            slot.isBooked
                              ? 'bg-amber-100 text-amber-800'
                              : slot.isBlocked
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {slot.isBooked ? 'Booked by Student' : slot.isBlocked ? 'Blocked' : 'Available'}
                          </span>
                        </div>

                        {slot.note && (
                          <div className="text-[11px] text-slate-500 mt-0.5 font-normal">
                            {slot.note}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onDeleteCalendarSlot(slot.id);
                          sound.playClick();
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete Time Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
