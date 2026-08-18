import React, { useState } from 'react';
import { OnlineCourse, Language } from '../types';
import { t } from '../data/translations';
import { sound } from '../utils/audio';
import { 
  X, 
  BookOpen, 
  Clock, 
  Check, 
  PlayCircle, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  CreditCard,
  QrCode,
  FileText,
  Download,
  ExternalLink,
  Gift,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { downloadCoursePdf, previewCoursePdf } from '../utils/pdfHelper';

interface CourseModalProps {
  course: OnlineCourse;
  lang: Language;
  onClose: () => void;
  onConfirmEnroll: (course: OnlineCourse) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  lang,
  onClose,
  onConfirmEnroll
}) => {
  const text = t(lang);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'checkout'>('syllabus');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);
  const [hasDownloadedPdf, setHasDownloadedPdf] = useState(false);

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !studentPhone) return;

    sound.playFanfare();
    setPaymentDone(true);
    onConfirmEnroll(course);
  };

  const handleDownloadPdf = () => {
    sound.playClick();
    downloadCoursePdf(course);
    setHasDownloadedPdf(true);
  };

  const handlePreviewPdf = () => {
    sound.playClick();
    previewCoursePdf(course);
  };

  const pdfFileName = course.handoutPdfName || `${course.titleEn.replace(/[^a-zA-Z0-9]/g, '_')}_Official_Handbook.pdf`;
  const pdfFileSize = course.handoutPdfSize || 'Official PDF Guide';

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

        {!paymentDone ? (
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Header / Course Overview */}
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:items-center border-b border-slate-100 shrink-0 bg-white">
              <img 
                src={course.coverImage} 
                alt={course.titleEn} 
                className="w-24 h-20 sm:w-28 sm:h-24 rounded-2xl object-cover shrink-0" 
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#dee5ff] text-[#383fab] text-[11px] font-bold">
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {lang === 'th' ? course.titleTh : course.titleEn}
                </h3>

                <div className="text-xs text-slate-500 font-medium">
                  {course.lessonsCount} {lang === 'th' ? 'บทเรียน' : 'Lessons'} • {course.durationHours} • {lang === 'th' ? 'ดูซ้ำได้ตลอดชีพ' : 'Lifetime Access'}
                </div>
              </div>
            </div>

            {/* Tab Switcher - Now fixed below header */}
            <div className="px-6 sm:px-8 py-3 bg-slate-50/50 border-b border-slate-100 shrink-0">
              <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('syllabus')}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    activeTab === 'syllabus' ? 'bg-white text-[#383fab] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  📖 {lang === 'th' ? 'เนื้อหาบทเรียน' : 'Course Syllabus'}
                </button>
                <button
                  onClick={() => setActiveTab('checkout')}
                  className={`flex-1 py-2 rounded-xl transition-all ${
                    activeTab === 'checkout' ? 'bg-white text-[#383fab] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  💳 {lang === 'th' ? `สมัครเรียน` : `Enroll`}
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 pt-4 custom-scrollbar">
              {/* TAB 1: Course Syllabus */}
              {activeTab === 'syllabus' && (
                <div className="space-y-4 pr-1">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {lang === 'th' ? course.descriptionTh : course.descriptionEn}
                  </p>

                  {/* PDF Handout Bonus Banner */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#f0f3ff] to-[#e6f9fc] border border-[#383fab]/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#383fab]/10 text-[#383fab] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{lang === 'th' ? 'เอกสารประกอบการเรียน & PDF Workbook' : 'Course PDF Handout & Study Workbook'}</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">Free</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {course.handoutPdfName || (lang === 'th' ? 'ดาวน์โหลดได้ทันทีหลังสมัครเรียน' : 'Instant download upon enrollment')}
                        </p>
                      </div>
                    </div>
                  </div>

                <div className="space-y-3">
                  {course.syllabus.map((mod, modIdx) => (
                    <div key={modIdx} className="p-4 rounded-2xl bg-[#f8faff] border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900">
                          {lang === 'th' ? mod.titleTh : mod.titleEn}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">{mod.duration}</span>
                      </div>

                      <div className="space-y-2">
                        {mod.lessons.map((les, lesIdx) => (
                          <div 
                            key={lesIdx} 
                            className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-slate-100"
                          >
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-4 h-4 text-[#383fab] shrink-0" />
                              <span className="font-medium text-slate-800">
                                {lang === 'th' ? les.titleTh : les.titleEn}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {les.isFreePreview && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                                  {lang === 'th' ? 'ดูฟรี' : 'Free Preview'}
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400">{les.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setActiveTab('checkout')}
                    className="w-full py-3.5 rounded-xl bg-[#383fab] hover:bg-[#373ea1] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'th' ? `ดำเนินการสมัครเรียน (฿${course.priceThb.toLocaleString()})` : `Proceed to Enroll (฿${course.priceThb.toLocaleString()})`}</span>
                    <ArrowRight className="w-4 h-4 text-[#ff9800]" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Checkout Form */}
            {activeTab === 'checkout' && (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#dee5ff]/60 border border-[#383fab]/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {lang === 'th' ? course.titleTh : course.titleEn}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{lang === 'th' ? 'เข้าถึงตลอดชีพ + ดาวน์โหลด PDF ทันที' : 'Lifetime Access + Instant PDF Workbook'}</span>
                    </div>
                  </div>
                  <div className="text-xl font-black text-[#383fab]">
                    ฿{course.priceThb.toLocaleString()}
                  </div>
                </div>

                {/* PDF Included Badge in Checkout */}
                <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">
                    {lang === 'th' 
                      ? 'ปลดล็อกเอกสาร PDF ประกอบการเรียนและไฟล์ชีทสรุปบทเรียนทันทีหลังยืนยัน' 
                      : 'Course PDF Handout & Study Materials unlocked immediately upon enrollment.'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {text.formName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="เช่น ธนภัทร สุขสมบูรณ์"
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-[#383fab]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {text.formEmail} *
                      </label>
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-[#383fab]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {text.formPhone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="081-xxx-xxxx"
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-[#383fab]"
                      />
                    </div>
                  </div>
                </div>

                {/* Simulated Payment Methods */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'th' ? 'ช่องทางการชำระเงิน (สะดวกและปลอดภัย):' : 'Payment Methods:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl border border-[#383fab] bg-[#f8faff] text-xs font-bold text-[#383fab] flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#ff9800]" />
                      <span>Thai QR PromptPay</span>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span>Credit / Debit Card</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#383fab] hover:bg-[#373ea1] text-white font-extrabold text-xs shadow-md shadow-[#383fab]/25 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{lang === 'th' ? `ยืนยันการสมัครเรียน (฿${course.priceThb.toLocaleString()})` : `Complete Enrollment (฿${course.priceThb.toLocaleString()})`}</span>
                    <ArrowRight className="w-4 h-4 text-[#ff9800]" />
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        ) : (
          /* Enrollment Success State */
          <div className="text-center p-8 sm:p-12 space-y-5 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">
                {lang === 'th' ? 'สมัครเรียนคอร์สสำเร็จเรียบร้อย!' : 'Enrollment Successful!'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'th' 
                  ? `ยินดีต้อนรับคุณ ${studentName} เข้าสู่คอร์ส ${course.titleTh}`
                  : `Welcome ${studentName} to ${course.titleEn}`}
              </p>
            </div>

            {/* Enrollment Summary */}
            <div className="p-4 bg-[#f8faff] rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Course:</span>
                <span className="font-bold text-slate-900">{lang === 'th' ? course.titleTh : course.titleEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800">{studentEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Access:</span>
                <span className="font-bold text-emerald-600">Lifetime Access (Unlocked)</span>
              </div>
            </div>

            {/* Unlocked Course Handout & PDF Workbook Download Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#383fab]/5 via-indigo-50/50 to-emerald-50/40 border border-[#383fab]/20 text-left space-y-3.5 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#383fab] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>{lang === 'th' ? 'เอกสารประกอบการเรียนพร้อมให้ดาวน์โหลดแล้ว' : 'Course PDF Handout & Workbook Ready'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {lang === 'th' ? 'ปลดล็อกแล้ว' : 'Unlocked'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-600 truncate max-w-xs mt-0.5 font-medium">
                      {pdfFileName} • {pdfFileSize}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {lang === 'th'
                  ? 'ดาวน์โหลดไฟล์ PDF เก็บไว้ในอุปกรณ์ของคุณ หรือเปิดอ่านควบคู่ไปกับบทเรียนได้ทันที'
                  : 'Download this official PDF study guide to your device or review it alongside your lessons.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    hasDownloadedPdf 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-[#383fab] hover:bg-[#2e3494] text-white'
                  }`}
                >
                  {hasDownloadedPdf ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{lang === 'th' ? 'ดาวน์โหลดแล้ว (คลิกเพื่อโหลดซ้ำ)' : 'Downloaded (Click to Download Again)'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-[#ff9800]" />
                      <span>{lang === 'th' ? '📥 ดาวน์โหลดเอกสาร PDF (Download PDF)' : '📥 Download Course PDF'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePreviewPdf}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Open PDF in new tab"
                >
                  <ExternalLink className="w-4 h-4 text-[#383fab]" />
                  <span>{lang === 'th' ? 'เปิดดูในแท็บใหม่' : 'Open in New Tab'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md cursor-pointer transition-colors"
            >
              {lang === 'th' ? 'ปิดหน้าต่าง / เริ่มเรียนบทแรก' : 'Done / Start First Lesson'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
