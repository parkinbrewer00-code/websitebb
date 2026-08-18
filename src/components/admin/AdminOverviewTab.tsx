import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  Star, 
  DollarSign, 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight,
  Plus,
  Headphones,
  User,
  MessageSquare
} from 'lucide-react';
import { OnlineCourse, PrivatePackage, StudentReview, BookingRequest, CalendarSlot, MediaFile } from '../../types';

interface AdminOverviewTabProps {
  courses: OnlineCourse[];
  packages: PrivatePackage[];
  reviews: StudentReview[];
  bookings: BookingRequest[];
  calendarSlots: CalendarSlot[];
  mediaFiles: MediaFile[];
  onNavigateTab: (tabId: string) => void;
  onOpenNewCourse: () => void;
  onOpenNewReview: () => void;
  onOpenNewPackage: () => void;
  onOpenNewSlot: () => void;
  onConfirmBooking: (bookingId: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  courses,
  packages,
  reviews,
  bookings,
  calendarSlots,
  mediaFiles,
  onNavigateTab,
  onOpenNewCourse,
  onOpenNewReview,
  onOpenNewPackage,
  onOpenNewSlot,
  onConfirmBooking
}) => {
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, curr) => acc + (curr.priceThb || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings.filter(b => b.preferredDate >= todayStr && b.status !== 'cancelled');

  return (
    <div className="space-y-6 antialiased">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Teacher Kym Workspace • Realtime Sync Active
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Academy Management Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Live overview of online courses, student 1-on-1 private bookings, ratings, handouts, and teaching schedule.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenNewCourse}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Online Course</span>
          </button>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Manage Calendar</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Bookings */}
        <div 
          onClick={() => onNavigateTab('bookings')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
              pendingBookings.length > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              {pendingBookings.length > 0 ? `${pendingBookings.length} Pending` : 'All Reviewed'}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {pendingBookings.length}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
              <span>Pending 1-on-1 Requests</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
          </div>
        </div>

        {/* Metric 2: Active Courses */}
        <div 
          onClick={() => onNavigateTab('courses')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 text-[#383fab] flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
              Self-Paced
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {courses.length}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
              <span>Online Courses</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
          </div>
        </div>

        {/* Metric 3: Student Reviews */}
        <div 
          onClick={() => onNavigateTab('reviews')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
              ★ 5.0 Rating
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {reviews.length}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
              <span>Student Testimonials</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
          </div>
        </div>

        {/* Metric 4: Media & Files */}
        <div 
          onClick={() => onNavigateTab('media')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-400 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200/60 text-cyan-700 flex items-center justify-center font-bold">
              <FolderOpen className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200/60 px-2 py-0.5 rounded-md">
              Media Hub
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {mediaFiles.length}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
              <span>PDF Workbooks & Media</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Bookings & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Incoming 1-on-1 Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-700" />
                <span>Recent 1-on-1 Session Requests</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Students awaiting private class confirmation</p>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              View All ({bookings.length}) →
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No booking requests yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Student booking submissions will appear here in real-time.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookings.slice(0, 4).map((booking) => {
                const isPending = booking.status === 'pending';
                const isConfirmed = booking.status === 'confirmed';

                return (
                  <div 
                    key={booking.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/30 hover:bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {booking.studentName.charAt(0) || 'S'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">{booking.studentName}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            isPending ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            isConfirmed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span>📦 {booking.packageName}</span>
                          <span>📅 {booking.preferredDate} ({booking.preferredTimeSlot})</span>
                          <span>💬 {booking.studentLineId || booking.studentPhone}</span>
                        </div>
                        {booking.learningGoals && (
                          <div className="text-[11px] text-slate-600 mt-1.5 italic bg-white p-1.5 rounded-md border border-slate-100 line-clamp-1">
                            "{booking.learningGoals}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      {isPending && (
                        <button
                          onClick={() => onConfirmBooking(booking.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                      )}
                      <a
                        href={booking.studentLineId?.startsWith('+') ? `https://wa.me/${booking.studentLineId.replace(/[^0-9]/g, '')}` : `mailto:${booking.studentEmail}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>Chat</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Links & Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick Management
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={onOpenNewCourse}
                className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-[#383fab] flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Add Online Course</div>
                    <div className="text-[10px] text-slate-400">Curriculum & study files</div>
                  </div>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              </button>

              <button
                onClick={onOpenNewPackage}
                className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Update Pricing & Packs</div>
                    <div className="text-[10px] text-slate-400">1-on-1 rates & discounts</div>
                  </div>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              </button>

              <button
                onClick={onOpenNewReview}
                className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Add Student Review</div>
                    <div className="text-[10px] text-slate-400">Quotes & ratings</div>
                  </div>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              </button>

              <button
                onClick={() => onNavigateTab('media')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-700 flex items-center justify-center">
                    <FolderOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Upload Media & Files</div>
                    <div className="text-[10px] text-slate-400">Workbooks, PDFs & audio</div>
                  </div>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Live Teaching Schedule</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Available calendar slots sync in real-time with the student booking modal on the live website.
            </p>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="mt-2 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors text-center cursor-pointer"
            >
              Open Calendar Schedule →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
