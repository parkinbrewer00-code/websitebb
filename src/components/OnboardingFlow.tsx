import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  CalendarCheck,
  Send,
  Loader2,
  Lock,
  Star,
  Globe
} from 'lucide-react';
import { PrivatePackage, Language, BookingRequest, CalendarSlot } from '../types';
import { PRIVATE_PACKAGES } from '../data/mockData';
import { saveBookingRequest, subscribeCalendarSlots } from '../services/firebaseService';
import { sendBookingNotificationEmail, PRIMARY_NOTIFICATION_EMAIL } from '../services/notificationService';
import { sound } from '../utils/audio';

interface OnboardingFlowProps {
  initialPackage?: PrivatePackage | null;
  packages?: PrivatePackage[];
  lang: Language;
  onBackToHome: () => void;
  onBookingComplete?: (booking: BookingRequest) => void;
}

// 4 distinct progressive steps
type OnboardingStep = 'package' | 'calendar' | 'details' | 'confirmation';

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialPackage,
  packages,
  lang,
  onBackToHome,
  onBookingComplete
}) => {
  const availablePackages = packages && packages.length > 0 ? packages : PRIVATE_PACKAGES;

  // Current progressive step
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(() => {
    return initialPackage ? 'calendar' : 'package';
  });

  // Selected package
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    initialPackage ? initialPackage.id : (availablePackages[1]?.id || availablePackages[0]?.id)
  );
  const selectedPkg = availablePackages.find(p => p.id === selectedPkgId) || availablePackages[0];

  // Live availability slots from Firestore
  const [liveSlots, setLiveSlots] = useState<CalendarSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(true);

  // Calendar Selection State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    // Default to tomorrow
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('19:00 - 20:00 (Evening Prime)');

  // Form Student Details
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentLineId, setStudentLineId] = useState('');
  const [learningGoals, setLearningGoals] = useState('ปรับสำเนียง & เพิ่มความมั่นใจในการพูด');
  const [currentLevel, setCurrentLevel] = useState('Intermediate (พอสื่อสารได้ แต่ยังติดขัด/แปลในหัว)');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingRequest | null>(null);

  // Subscribe to live slots
  useEffect(() => {
    setLoadingSlots(true);
    const unsubscribe = subscribeCalendarSlots((slots) => {
      setLiveSlots(slots);
      setLoadingSlots(false);
    });
    return () => unsubscribe();
  }, []);

  // Generate next 14 interactive calendar days
  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayName: string; dayNumber: number; monthName: string; isToday: boolean; isWeekend: boolean }[] = [];
    const now = new Date();
    
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      
      const dayName = d.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { month: 'short' });
      
      days.push({
        dateStr,
        dayName,
        dayNumber: d.getDate(),
        monthName,
        isToday: i === 0,
        isWeekend
      });
    }
    return days;
  }, [lang]);

  // Standard time slots available with Teacher Kym
  const defaultSlots = [
    { time: '10:00 - 11:00', labelEn: 'Morning Focus', labelTh: 'ช่วงเช้า' },
    { time: '13:00 - 14:00', labelEn: 'Early Afternoon', labelTh: 'บ่ายต้น' },
    { time: '15:30 - 16:30', labelEn: 'Afternoon Practice', labelTh: 'บ่ายแก่' },
    { time: '17:30 - 18:30', labelEn: 'Early Evening', labelTh: 'เย็นหัวค่ำ' },
    { time: '19:00 - 20:00', labelEn: 'Evening Prime', labelTh: 'ช่วงค่ำยอดนิยม' },
    { time: '20:30 - 21:30', labelEn: 'Night Class', labelTh: 'ดึก (หลังเลิกงาน)' },
  ];

  // Calculate slot status for the currently selected date
  const timeSlotsForSelectedDate = useMemo(() => {
    return defaultSlots.map(slot => {
      const fullLabel = `${slot.time} (${slot.labelEn})`;
      // Check if blocked or booked in Firestore live slots
      const matchingLive = liveSlots.find(
        s => s.date === selectedDate && (s.timeSlot.includes(slot.time) || s.timeSlot === slot.time)
      );

      const isBooked = matchingLive ? matchingLive.isBooked : false;
      const isBlocked = matchingLive ? matchingLive.isBlocked : false;
      const isAvailable = !isBooked && !isBlocked;

      return {
        ...slot,
        fullLabel,
        isAvailable,
        isBooked,
        isBlocked
      };
    });
  }, [selectedDate, liveSlots]);

  // Handle final submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !studentPhone || isSubmitting) return;

    setIsSubmitting(true);
    sound.playClick();

    const newBooking: BookingRequest = {
      id: `req-${Date.now()}`,
      studentName,
      studentEmail,
      studentPhone,
      studentLineId,
      packageId: selectedPkg.id,
      packageName: lang === 'th' ? selectedPkg.nameTh : selectedPkg.nameEn,
      priceThb: selectedPkg.priceThb,
      sessionsCount: selectedPkg.sessionsCount,
      preferredDate: selectedDate,
      preferredTimeSlot: selectedTimeSlot,
      currentEnglishLevel: currentLevel,
      learningGoals,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save to Firestore
      await saveBookingRequest(newBooking);
    } catch (err) {
      console.warn('Saved booking locally:', err);
    }

    try {
      // 2. Dispatch Formspree notification to hello@beyondborders.ac
      await sendBookingNotificationEmail(newBooking, PRIMARY_NOTIFICATION_EMAIL);
    } catch (err) {
      console.warn('Notification service error:', err);
    }

    sound.playFanfare();
    setIsSubmitting(false);
    setCreatedBooking(newBooking);
    setCurrentStep('confirmation');

    if (onBookingComplete) {
      onBookingComplete(newBooking);
    }
  };

  const stepsList = [
    { id: 'package', titleEn: '1. Select Package', titleTh: '1. เลือกแพ็กเกจ', icon: Sparkles },
    { id: 'calendar', titleEn: '2. Teacher Kym Availability', titleTh: '2. ตรวจสอบตารางสอนครูคิม', icon: CalendarIcon },
    { id: 'details', titleEn: '3. Student Goals & Contact', titleTh: '3. ข้อมูลผู้เรียนและเป้าหมาย', icon: User },
    { id: 'confirmation', titleEn: '4. Confirmation', titleTh: '4. ยืนยันการจอง', icon: CheckCircle2 }
  ];

  const currentStepIndex = stepsList.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">

        {/* Top Breadcrumbs / Back navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <button
            onClick={() => {
              sound.playClick();
              if (currentStep === 'confirmation') {
                onBackToHome();
              } else if (currentStep === 'details') {
                setCurrentStep('calendar');
              } else if (currentStep === 'calendar') {
                setCurrentStep('package');
              } else {
                onBackToHome();
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'th' ? 'กลับสู่หน้าหลัก Beyond Borders' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-[#383fab]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === 'th' ? 'ระบบลงทะเบียนเรียนตัวต่อตัว' : '1-on-1 Student Onboarding'}</span>
          </div>
        </div>

        {/* Progress Stepper Header */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-extrabold text-[#383fab] uppercase tracking-wider">
                {lang === 'th' ? 'ขั้นตอนการจองเรียนสด' : 'Step-by-Step Onboarding'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {currentStep === 'package' && (lang === 'th' ? 'เลือกแพ็กเกจเรียนตัวต่อตัว' : 'Select Your 1-on-1 Coaching Package')}
                {currentStep === 'calendar' && (lang === 'th' ? 'เลือกวันและเวลาว่างกับครูคิม' : 'Choose Availability with Teacher Kym')}
                {currentStep === 'details' && (lang === 'th' ? 'กรอกข้อมูลผู้เรียน & เป้าหมายการฝึก' : 'Student Contact & Goals')}
                {currentStep === 'confirmation' && (lang === 'th' ? 'ส่งคำขอจองสำเร็จ!' : 'Booking Request Confirmed!')}
              </h1>
            </div>

            {/* Quick summary badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#dee5ff]/60 text-[#383fab] text-xs font-bold self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? selectedPkg.nameTh : selectedPkg.nameEn} (฿{selectedPkg.priceThb.toLocaleString()})</span>
            </div>
          </div>

          {/* Stepper Dots Bar */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100">
            {stepsList.map((stepItem, idx) => {
              const isActive = stepItem.id === currentStep;
              const isPast = idx < currentStepIndex;
              const Icon = stepItem.icon;
              return (
                <div
                  key={stepItem.id}
                  className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-[#383fab] text-white font-bold shadow-xs' 
                      : isPast 
                      ? 'text-emerald-700 bg-emerald-50 font-semibold' 
                      : 'text-slate-400 bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                    isActive ? 'bg-white/20 text-white' : isPast ? 'bg-emerald-200/60 text-emerald-800' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPast ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className="text-[11px] truncate hidden sm:inline">
                    {lang === 'th' ? stepItem.titleTh : stepItem.titleEn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: PACKAGE SELECTION */}
        {/* ========================================================================= */}
        {currentStep === 'package' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {availablePackages.map((pkg) => {
                const isSelected = pkg.id === selectedPkgId;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      setSelectedPkgId(pkg.id);
                      sound.playClick();
                    }}
                    className={`rounded-3xl p-6 flex flex-col justify-between border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-[#383fab] shadow-lg ring-4 ring-[#dee5ff]/50 -translate-y-1'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#ff9800] text-slate-950 text-[10px] font-black uppercase tracking-wider">
                        {lang === 'th' ? pkg.badgeTh : pkg.badgeEn}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#383fab]">
                          {pkg.sessionsCount} {lang === 'th' ? 'คาบเรียนสด' : 'Live Sessions'}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#383fab] bg-[#383fab] text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900 text-base">
                          {lang === 'th' ? pkg.nameTh : pkg.nameEn}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                          {lang === 'th' ? pkg.subtitleTh : pkg.subtitleEn}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-2xl font-black text-slate-900">
                          ฿{pkg.priceThb.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-bold">
                          {lang === 'th' ? `เฉลี่ย ฿${pkg.pricePerSessionThb} / คาบ` : `฿${pkg.pricePerSessionThb} / session`}
                        </div>
                      </div>

                      <ul className="space-y-1.5 pt-2 text-[11px] text-slate-600">
                        {(lang === 'th' ? pkg.featuresTh : pkg.featuresEn).slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      className={`w-full mt-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#383fab] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? (lang === 'th' ? '✓ เลือกแพ็กเกจนี้แล้ว' : '✓ Selected') : (lang === 'th' ? 'เลือกแพ็กเกจนี้' : 'Select Package')}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Step 1 Footer CTA */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200">
              <button
                type="button"
                onClick={onBackToHome}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentStep('calendar');
                }}
                className="px-6 py-3 rounded-xl bg-[#383fab] hover:bg-[#2e3494] text-white font-extrabold text-xs shadow-md shadow-[#383fab]/20 flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'th' ? 'ถัดไป: เช็กตารางว่างครูคิม' : 'Next: Check Availability Calendar'}</span>
                <ArrowRight className="w-4 h-4 text-[#ff9800]" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: INTERACTIVE CALENDAR & TEACHER AVAILABILITY */}
        {/* ========================================================================= */}
        {currentStep === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Calendar Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#383fab]" />
                    <span>{lang === 'th' ? 'ตารางสอนสดครูคิม (Teacher Kym Availability)' : 'Live Availability with Teacher Kym'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'th' 
                      ? 'คลิกเลือกวันที่ที่คุณสะดวกเรียน และเลือกช่วงเวลาที่ว่างด้านล่าง (เวลาประเทศไทย GMT+7)'
                      : 'Select your preferred date from the 14-day calendar below, then pick an open teaching slot (Bangkok Time GMT+7).'}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>{lang === 'th' ? 'ว่าง (Available)' : 'Available'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span>{lang === 'th' ? 'เต็ม (Booked)' : 'Booked'}</span>
                  </div>
                </div>
              </div>

              {/* 14-Day Horizontal Scroller / Picker */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2.5">
                  📅 {lang === 'th' ? '1. เลือกวันที่สะดวกเริ่มเรียน:' : '1. Select Preferred Date:'}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {calendarDays.map((day) => {
                    const isSelected = day.dateStr === selectedDate;
                    return (
                      <button
                        key={day.dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(day.dateStr);
                          sound.playClick();
                        }}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-[#383fab] text-white border-[#383fab] shadow-md shadow-[#383fab]/25 scale-102'
                            : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <span className={`text-[10px] font-extrabold uppercase ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                          {day.dayName}
                        </span>
                        <span className="text-lg font-black leading-tight">
                          {day.dayNumber}
                        </span>
                        <span className={`text-[10px] font-semibold ${isSelected ? 'text-[#ff9800]' : 'text-slate-500'}`}>
                          {day.monthName}
                        </span>
                        {day.isToday && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full mt-0.5 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {lang === 'th' ? 'วันนี้' : 'Today'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Open Time Slots Grid for Selected Date */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    ⏰ {lang === 'th' ? `2. เลือกรอบเวลาว่างสำหรับวันที่ ${selectedDate}:` : `2. Select Available Time Slot for ${selectedDate}:`}
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">
                    60 {lang === 'th' ? 'นาที / คาบ' : 'mins / session'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlotsForSelectedDate.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.fullLabel;
                    const isDisabled = !slot.isAvailable;

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedTimeSlot(slot.fullLabel);
                            sound.playClick();
                          }
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                          isDisabled
                            ? 'bg-slate-100/80 border-slate-200/80 opacity-55 cursor-not-allowed text-slate-400'
                            : isSelected
                            ? 'bg-[#dee5ff]/40 border-[#383fab] text-slate-900 ring-2 ring-[#383fab]/20 cursor-pointer shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-black text-sm">
                            <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#383fab]' : 'text-slate-400'}`} />
                            <span>{slot.time}</span>
                          </div>

                          {isDisabled ? (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              {lang === 'th' ? 'ติดสอน' : 'Booked'}
                            </span>
                          ) : (
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'bg-[#383fab] border-[#383fab] text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          )}
                        </div>

                        <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-between">
                          <span>{lang === 'th' ? slot.labelTh : slot.labelEn}</span>
                          {!isDisabled && (
                            <span className="text-[10px] font-bold text-emerald-600">
                              ✓ {lang === 'th' ? 'ว่าง' : 'Open'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Classroom Platform Note */}
              <div className="p-4 bg-[#f8faff] rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#dee5ff] text-[#383fab] flex items-center justify-center shrink-0 font-bold text-sm">
                  G
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {lang === 'th' ? 'ห้องเรียนออนไลน์ผ่าน Google Meet & Miro Board' : 'Live Class via Google Meet & Miro Interactive Whiteboard'}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {lang === 'th'
                      ? 'หลังจากยืนยัน ครูคิมจะส่งลิงก์ห้องเรียน Google Meet และเอกสารฝึกพูดเตรียมตัวทางอีเมลและ LINE ID ของคุณครับ'
                      : 'Upon booking confirmation, Teacher Kym will send your dedicated Google Meet classroom link and prep study guide directly to your email and LINE.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Step 2 Navigation Actions */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentStep('package');
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{lang === 'th' ? 'ย้อนกลับ' : 'Back'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentStep('details');
                }}
                className="px-6 py-3 rounded-xl bg-[#383fab] hover:bg-[#2e3494] text-white font-extrabold text-xs shadow-md shadow-[#383fab]/20 flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'th' ? 'ถัดไป: ข้อมูลผู้เรียน & เป้าหมาย' : 'Next: Student Contact & Goals'}</span>
                <ArrowRight className="w-4 h-4 text-[#ff9800]" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: STUDENT DETAILS & GOALS FORM */}
        {/* ========================================================================= */}
        {currentStep === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                
                {/* Summary banner of selections */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-extrabold text-[#ff9800] uppercase tracking-wider">
                      {lang === 'th' ? 'สรุปแพ็กเกจและตารางเรียนของคุณ' : 'Your Selected Package & Schedule'}
                    </div>
                    <div className="text-sm sm:text-base font-black">
                      {lang === 'th' ? selectedPkg.nameTh : selectedPkg.nameEn}
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span>📅 {selectedDate}</span>
                      <span>•</span>
                      <span>⏰ {selectedTimeSlot}</span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="text-lg sm:text-xl font-black text-[#ff9800]">
                      ฿{selectedPkg.priceThb.toLocaleString()} THB
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {selectedPkg.sessionsCount} {lang === 'th' ? 'คาบเรียนสด 60 นาที' : 'x 60-min live sessions'}
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === 'th' ? 'ชื่อ-นามสกุล / ชื่อเล่น' : 'Full Name / Nickname'} *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder={lang === 'th' ? 'เช่น คุณเมย์ (May)' : 'e.g. May Supaporn'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#383fab] focus:ring-2 focus:ring-[#dee5ff]"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === 'th' ? 'อีเมลสำหรับรับลิงก์ Google Meet' : 'Email Address'} *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#383fab] focus:ring-2 focus:ring-[#dee5ff]"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === 'th' ? 'เบอร์โทรศัพท์ติดต่อ' : 'Phone Number'} *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="081-234-5678"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#383fab] focus:ring-2 focus:ring-[#dee5ff]"
                    />
                  </div>

                  {/* LINE ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === 'th' ? 'LINE ID / WhatsApp (สำหรับส่งสรุปหลังเรียน)' : 'LINE ID / WhatsApp'}</span>
                    </label>
                    <input
                      type="text"
                      value={studentLineId}
                      onChange={(e) => setStudentLineId(e.target.value)}
                      placeholder={lang === 'th' ? 'เช่น @kym_english' : 'e.g. line_id'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#383fab] focus:ring-2 focus:ring-[#dee5ff]"
                    />
                  </div>
                </div>

                {/* Current English Level */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">
                    🎯 {lang === 'th' ? 'ระดับภาษาอังกฤษปัจจุบันของคุณ:' : 'Current English Level:'}
                  </label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#383fab] focus:ring-2 focus:ring-[#dee5ff] bg-white"
                  >
                    <option value="Beginner (พื้นฐานน้อย / ไม่กล้าพูด)">Beginner - พื้นฐานน้อย / ไม่กล้าพูด</option>
                    <option value="Elementary (พอพูดคำสั้นๆ ได้ แกรมม่าไม่แม่น)">Elementary - พอพูดคำสั้นๆ ได้ แกรมม่าไม่แม่น</option>
                    <option value="Intermediate (พอสื่อสารได้ แต่ยังติดขัด/แปลในหัว)">Intermediate - พอสื่อสารได้ แต่ยังติดขัด/แปลในหัว</option>
                    <option value="Upper Intermediate (พูดได้คล่อง แต่อยากเป๊ะเรื่องสำเนียง & ศัพท์สูง)">Upper Intermediate - พูดได้คล่อง แต่อยากเป๊ะเรื่องสำเนียง & ศัพท์สูง</option>
                    <option value="Advanced / Professional (เตรียมสอบสัมภาษณ์งานระดับสากล / พรีเซนต์บอร์ดบริหาร)">Advanced / Professional - เตรียมสอบสัมภาษณ์งาน / พรีเซนต์บอร์ดบริหาร</option>
                  </select>
                </div>

                {/* Learning Goals */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    📝 {lang === 'th' ? 'เป้าหมายหลักที่คุณอยากให้ครูคิมช่วยโฟกัสในคลาสสด:' : 'Specific Focus / Goals for 1-on-1 Sessions:'}
                  </label>
                  <textarea
                    rows={3}
                    value={learningGoals}
                    onChange={(e) => setLearningGoals(e.target.value)}
                    placeholder={lang === 'th' ? 'เช่น ซ้อมสัมภาษณ์งานสายการบิน / ปรับสำเนียงพูดเร็ว / เตรียมพรีเซนต์งานลูกค้าต่างชาติ...' : 'e.g. Preparing for multinational job interview, reducing Thai accent, leading meetings...'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#383fab] focus:ring-2 focus:ring-[#dee5ff]"
                  />
                </div>

                {/* Privacy & Notification Notice */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {lang === 'th'
                      ? 'เมื่อกดยืนยัน ระบบจะส่งการแจ้งเตือนไปยัง hello@beyondborders.ac และบันทึกตารางเรียนของคุณทันที'
                      : 'Upon submission, a notification will be dispatched to hello@beyondborders.ac and your booking will be confirmed.'}
                  </span>
                </div>

              </div>

              {/* Step 3 Form Submit Bar */}
              <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep('calendar');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{lang === 'th' ? 'ย้อนกลับ' : 'Back'}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-[#383fab] hover:bg-[#2e3494] text-white font-extrabold text-xs shadow-lg shadow-[#383fab]/25 flex items-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{lang === 'th' ? 'กำลังส่งคำขอจอง...' : 'Submitting Booking...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#ff9800]" />
                      <span>{lang === 'th' ? 'ยืนยันคำขอจองเรียนสด' : 'Confirm 1-on-1 Booking'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: CONFIRMATION & SUCCESS SCREEN */}
        {/* ========================================================================= */}
        {currentStep === 'confirmation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {lang === 'th' ? 'ส่งคำขอจองเรียนสำเร็จ!' : 'Booking Confirmed!'}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {lang === 'th'
                    ? 'ขอบคุณที่ไว้วางใจ Beyond Borders ครับ ครูคิมได้รับคำขอจองตารางเรียนของคุณแล้ว และจะติดต่อกลับเพื่อยืนยันคลาสทางอีเมลหรือ LINE ID'
                    : 'Thank you for choosing Beyond Borders. Teacher Kym has received your booking request and will follow up with your Google Meet link.'}
                </p>
              </div>

              {/* Dispatched notification card */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-left text-xs max-w-lg mx-auto flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>{lang === 'th' ? 'ส่งการแจ้งเตือนไปยังครูผู้สอนเรียบร้อยแล้ว' : 'Email Notification Sent'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                    {lang === 'th'
                      ? `ระบบได้ส่งสรุปคำขอและข้อมูลการติดต่อของคุณไปยัง hello@beyondborders.ac เรียบร้อยแล้ว`
                      : `A full notification has been dispatched to hello@beyondborders.ac with your schedule and goals.`}
                  </div>
                </div>
              </div>

              {/* Booking Summary Box */}
              {createdBooking && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2.5 max-w-lg mx-auto">
                  <div className="text-[11px] font-extrabold text-[#383fab] uppercase tracking-wider">
                    {lang === 'th' ? 'รายละเอียดการจองของคุณ' : 'Booking Summary'}
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{lang === 'th' ? 'ผู้เรียน:' : 'Student:'}</span>
                    <span className="font-bold text-slate-900">{createdBooking.studentName}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{lang === 'th' ? 'แพ็กเกจ:' : 'Package:'}</span>
                    <span className="font-bold text-slate-900">{createdBooking.packageName}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{lang === 'th' ? 'วันที่เริ่มเรียน:' : 'First Session Date:'}</span>
                    <span className="font-bold text-slate-900">{createdBooking.preferredDate}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{lang === 'th' ? 'ช่วงเวลา:' : 'Time Slot:'}</span>
                    <span className="font-bold text-slate-900">{createdBooking.preferredTimeSlot}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">{lang === 'th' ? 'ยอดชำระ:' : 'Total Investment:'}</span>
                    <span className="font-black text-emerald-700 text-sm">฿{createdBooking.priceThb ? createdBooking.priceThb.toLocaleString() : '0'} THB</span>
                  </div>
                </div>
              )}

              {/* Done / Return to Homepage CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="w-full max-w-lg py-3.5 rounded-xl bg-[#383fab] hover:bg-[#2e3494] text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {lang === 'th' ? 'เสร็จสิ้น - กลับสู่หน้าหลัก' : 'Done - Return to Home'}
                </button>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
