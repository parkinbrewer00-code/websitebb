import React, { useState } from 'react';
import { PRIVATE_PACKAGES } from '../data/mockData';
import { PrivatePackage, Language, BookingRequest } from '../types';
import { saveBookingRequest } from '../services/firebaseService';
import { sendBookingNotificationEmail, PRIMARY_NOTIFICATION_EMAIL } from '../services/notificationService';
import { t } from '../data/translations';
import { sound } from '../utils/audio';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  ArrowRight,
  Loader2,
  Send
} from 'lucide-react';

interface BookingModalProps {
  initialPackage?: PrivatePackage | null;
  packages?: PrivatePackage[];
  lang: Language;
  onClose: () => void;
  onSubmitBooking: (booking: BookingRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  initialPackage,
  packages,
  lang,
  onClose,
  onSubmitBooking
}) => {
  const text = t(lang);
  const availablePackages = packages && packages.length > 0 ? packages : PRIVATE_PACKAGES;

  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    initialPackage ? initialPackage.id : (availablePackages[1]?.id || availablePackages[0]?.id)
  );
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentLineId, setStudentLineId] = useState('');
  const [preferredDate, setPreferredDate] = useState('วันธรรมดาช่วงค่ำ (Weekday Evenings 18:00 - 21:00)');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('19:00 - 20:00 น.');
  const [learningGoals, setLearningGoals] = useState('ปรับสำเนียง & เพิ่มความมั่นใจในการพูด');
  const [currentLevel, setCurrentLevel] = useState('Intermediate (พอสื่อสารได้ แต่ยังติดขัด/แปลในหัว)');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPkg = availablePackages.find(p => p.id === selectedPkgId) || availablePackages[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !studentPhone || isSubmitting) return;

    setIsSubmitting(true);

    const newBooking: BookingRequest = {
      id: `req-${Date.now()}`,
      packageId: currentPkg.id,
      packageName: lang === 'th' ? currentPkg.nameTh : currentPkg.nameEn,
      studentName,
      studentEmail,
      studentPhone,
      studentLineId,
      preferredDate,
      preferredTimeSlot,
      learningGoals,
      currentEnglishLevel: currentLevel,
      priceThb: currentPkg.priceThb,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save booking to Firestore database
      await saveBookingRequest(newBooking);
    } catch (err) {
      console.warn('Saved booking locally:', err);
    }

    try {
      // 2. Dispatch automated email notification to hello@beyondborders.ac
      await sendBookingNotificationEmail(newBooking, PRIMARY_NOTIFICATION_EMAIL);
    } catch (err) {
      console.warn('Notification service caught:', err);
    }

    sound.playFanfare();
    setIsSubmitting(false);
    setSubmitted(true);
    onSubmitBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 relative my-auto animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 space-y-1 bg-white shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-[#dee5ff] text-[#383fab] text-[11px] font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>1-on-1 Private Live Coaching</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {text.modalBookTitle}
              </h3>

              <p className="text-xs text-slate-500">
                {text.modalBookSub}
              </p>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 pt-4 space-y-6 custom-scrollbar">
              {/* Package Selector */}
              <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {lang === 'th' ? '1. เลือกแพ็กเกจเรียนที่ต้องการ:' : '1. Select Package:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {availablePackages.map((pkg) => (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPkgId === pkg.id
                        ? 'bg-[#dee5ff]/60 border-[#383fab] ring-2 ring-[#383fab]/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-500">
                      {pkg.sessionsCount} {lang === 'th' ? 'คาบ' : 'Sessions'}
                    </div>
                    <div className="text-xs font-black text-slate-900 line-clamp-1">
                      {lang === 'th' ? pkg.nameTh : pkg.nameEn}
                    </div>
                    <div className="text-sm font-extrabold text-[#383fab] mt-1">
                      ฿{pkg.priceThb.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                {lang === 'th' ? '2. ข้อมูลผู้เรียน:' : '2. Student Details:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={text.formName + ' *'}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-[#383fab]"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder={text.formEmail + ' *'}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-[#383fab]"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder={text.formPhone + ' *'}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-[#383fab]"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={studentLineId}
                    onChange={(e) => setStudentLineId(e.target.value)}
                    placeholder={text.formLine}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-[#383fab]"
                  />
                </div>
              </div>
            </div>

            {/* Goals & Time Preferences */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                {lang === 'th' ? '3. เป้าหมายและช่วงเวลาที่สะดวก:' : '3. Goals & Availability:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-[#383fab]"
                >
                  <option value="ปรับสำเนียง & เพิ่มความมั่นใจในการพูด">ปรับสำเนียง & เพิ่มความมั่นใจในการพูด</option>
                  <option value="ซ้อมสัมภาษณ์งานสากล (Job Interview)">ซ้อมสัมภาษณ์งานสากล (Job Interview)</option>
                  <option value="ภาษาอังกฤษเพื่อการทำงาน & ประชุม Zoom">ภาษาอังกฤษเพื่อการทำงาน & ประชุม Zoom</option>
                  <option value="เตรียมสอบ IELTS / TOEIC Speaking">เตรียมสอบ IELTS / TOEIC Speaking</option>
                  <option value="สนทนาชีวิตประจำวัน & ท่องเที่ยว">สนทนาชีวิตประจำวัน & ท่องเที่ยว</option>
                </select>

                <select
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-[#383fab]"
                >
                  <option value="วันธรรมดาช่วงค่ำ (Weekday Evenings 18:00 - 21:00)">วันธรรมดาช่วงค่ำ (18:00 - 21:00)</option>
                  <option value="วันเสาร์-อาทิตย์ช่วงเช้า (Weekend Morning 09:00 - 12:00)">วันเสาร์-อาทิตย์ช่วงเช้า (09:00 - 12:00)</option>
                  <option value="วันเสาร์-อาทิตย์ช่วงบ่าย (Weekend Afternoon 13:00 - 17:00)">วันเสาร์-อาทิตย์ช่วงบ่าย (13:00 - 17:00)</option>
                  <option value="เวลาอื่นๆ (ตามตกลงกับครูผู้สอน)">เวลาอื่นๆ (ตามตกลงกับครูผู้สอน)</option>
                </select>
              </div>
              </div>
            </div>

            {/* Price Summary & Submit Button */}
            <div className="p-6 sm:px-8 sm:py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div>
                <div className="text-xs text-slate-500 font-medium">
                  {lang === 'th' ? 'ยอดชำระของแพ็กเกจ:' : 'Package Investment:'}
                </div>
                <div className="text-2xl font-black text-[#383fab]">
                  ฿{currentPkg.priceThb.toLocaleString()}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#383fab] hover:bg-[#373ea1] disabled:opacity-75 text-white font-extrabold text-xs shadow-md shadow-[#383fab]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{lang === 'th' ? 'กำลังส่งคำขอ...' : 'Sending Request...'}</span>
                  </>
                ) : (
                  <>
                    <span>{text.btnConfirmBooking}</span>
                    <ArrowRight className="w-4 h-4 text-[#ff9800]" />
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Confirmation State */
          <div className="text-center p-8 sm:p-12 space-y-5 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">
                {text.bookingSuccessTitle}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {text.bookingSuccessDesc}
              </p>
            </div>

            {/* Email Notification Notice */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-left text-xs space-y-1 max-w-md mx-auto flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>{lang === 'th' ? 'แจ้งเตือนไปยังครูผู้สอนทางอีเมลแล้ว' : 'Email Notification Sent'}</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                  {lang === 'th'
                    ? 'ระบบได้ส่งรายละเอียดคำขอจองไปยัง hello@beyondborders.ac เรียบร้อยแล้ว ครูคิมจะติดต่อกลับเพื่อยืนยันตารางเรียนครับ'
                    : 'A detailed booking notification has been dispatched to hello@beyondborders.ac. Teacher Kym will confirm your schedule shortly.'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f8faff] rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Package:</span>
                <span className="font-bold text-[#383fab]">{lang === 'th' ? currentPkg.nameTh : currentPkg.nameEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="font-semibold text-slate-800">{studentPhone} {studentLineId ? `(WhatsApp: ${studentLineId})` : ''}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full max-w-md py-3.5 rounded-xl bg-[#383fab] hover:bg-[#373ea1] text-white font-extrabold text-xs shadow-md cursor-pointer transition-colors"
            >
              {lang === 'th' ? 'เสร็จสิ้น' : 'Done'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
