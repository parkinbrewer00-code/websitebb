import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm, ValidationError } from '@formspree/react';
import { X, User, Mail, Phone, Check, BellRing, CheckCircle2 } from 'lucide-react';
import { OnlineCourse, Language } from '../types';
import { t as getTranslations } from '../data/translations';
import { sound } from '../utils/audio';
import { FORMSPREE_FORM_ID } from '../config/formspree';

interface RegisterInterestModalProps {
  course: OnlineCourse;
  lang: Language;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

export const RegisterInterestModal: React.FC<RegisterInterestModalProps> = ({
  course,
  lang,
  onClose,
  onSubmit
}) => {
  const t = getTranslations(lang);
  
  // Connect with Formspree React hook using shared form ID ('mwlerabr')
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID, {
    data: {
      courseId: course.id,
      courseTitle: `${course.titleEn} (${course.titleTh})`,
      courseLevel: course.level,
      _subject: `[Beyond Borders Waitlist] ${course.titleEn}`
    }
  });

  const courseTitle = lang === 'th' ? course.titleTh : course.titleEn;
  const subtitle = t.interestModalSubtitle.replace('{courseName}', courseTitle);

  // When form submission succeeds via Formspree, notify parent and play audio feedback
  useEffect(() => {
    if (state.succeeded) {
      sound.playClick();
      // Inform parent component of the registration
      const formElement = document.getElementById('waitlist-form') as HTMLFormElement | null;
      if (formElement) {
        const formData = new FormData(formElement);
        onSubmit({
          name: (formData.get('name') as string) || '',
          email: (formData.get('email') as string) || '',
          phone: (formData.get('phone') as string) || ''
        });
      }
    }
  }, [state.succeeded, onSubmit]);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    sound.playClick();
    handleSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
      />

      {/* Sleek, Minimal, Zero-Scroll Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 my-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {!state.succeeded ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Header */}
                <div className="pr-8 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#383fab] bg-[#dee5ff] px-2.5 py-0.5 rounded-full">
                      <BellRing className="w-3 h-3" />
                      {t.interestBadge || 'Waitlist'}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                    {courseTitle}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {subtitle}
                  </p>
                </div>

                {/* Form Fields integrated with @formspree/react */}
                <form id="waitlist-form" onSubmit={onFormSubmit} className="space-y-3 pt-1">
                  {/* Hidden metadata fields for Formspree */}
                  <input type="hidden" name="course_id" value={course.id} />
                  <input type="hidden" name="course_title" value={`${course.titleEn} (${course.titleTh})`} />
                  <input type="hidden" name="course_level" value={course.level} />

                  {/* Name field */}
                  <div className="space-y-1">
                    <label htmlFor="formspree-name" className="text-xs font-bold text-slate-700 block">
                      {t.interestLabelName}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="formspree-name"
                        required
                        type="text"
                        name="name"
                        placeholder={t.interestPlaceholderName}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#383fab]/20 focus:border-[#383fab] transition-all"
                      />
                    </div>
                    <ValidationError prefix="Name" field="name" errors={state.errors} className="text-rose-600 text-xs mt-1 block" />
                  </div>

                  {/* Email & Phone side-by-side on tablet/desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Email field */}
                    <div className="space-y-1">
                      <label htmlFor="formspree-email" className="text-xs font-bold text-slate-700 block">
                        {t.interestLabelEmail}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="formspree-email"
                          required
                          type="email"
                          name="email"
                          placeholder={t.interestPlaceholderEmail}
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#383fab]/20 focus:border-[#383fab] transition-all"
                        />
                      </div>
                      <ValidationError prefix="Email" field="email" errors={state.errors} className="text-rose-600 text-xs mt-1 block" />
                    </div>

                    {/* Phone field */}
                    <div className="space-y-1">
                      <label htmlFor="formspree-phone" className="text-xs font-bold text-slate-700 block">
                        {t.interestLabelPhone}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="formspree-phone"
                          required
                          type="tel"
                          name="phone"
                          placeholder={t.interestPlaceholderPhone}
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#383fab]/20 focus:border-[#383fab] transition-all"
                        />
                      </div>
                      <ValidationError prefix="Phone" field="phone" errors={state.errors} className="text-rose-600 text-xs mt-1 block" />
                    </div>
                  </div>

                  {/* GDPR Consent */}
                  <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      name="consent"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-all border bg-slate-50 border-slate-300 peer-checked:bg-[#383fab] peer-checked:border-[#383fab] peer-checked:text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>

                    <div className="text-[11px] text-slate-600 leading-tight">
                      <span className="font-medium">{t.interestConsentText}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {t.interestConsentSub}
                      </span>
                    </div>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className={`w-full mt-2 py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      state.submitting
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-[#383fab] hover:bg-[#32399c] active:scale-[0.99] shadow-[#383fab]/20'
                    }`}
                  >
                    {state.submitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>{t.interestBtnSubmit}</span>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              /* Clean Success Screen */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5 max-w-xs mx-auto">
                  <h3 className="text-xl font-black text-slate-900">
                    {lang === 'th' ? 'ลงทะเบียนเรียบร้อย' : 'Added to Waitlist'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {t.interestSuccessMsg}
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
