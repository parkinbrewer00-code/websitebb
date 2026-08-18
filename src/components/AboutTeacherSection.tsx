import React from 'react';
import { TEACHER_PROFILE } from '../data/mockData';
import { Language } from '../types';
import { t } from '../data/translations';
import { sound } from '../utils/audio';
import { 
  GraduationCap, 
  CheckCircle2, 
  Star, 
  Calendar, 
  Heart
} from 'lucide-react';

interface AboutTeacherSectionProps {
  lang: Language;
  onBookSession: () => void;
}

export const AboutTeacherSection: React.FC<AboutTeacherSectionProps> = ({
  lang,
  onBookSession
}) => {
  const text = t(lang);
  const teacher = TEACHER_PROFILE;

  return (
    <section id="about-teacher" className="py-20 bg-white border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#dee5ff] text-[#383fab] text-xs font-extrabold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{text.aboutTeacherTag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {text.aboutTeacherTitle}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            {text.aboutTeacherSubtitle}
          </p>
        </div>

        {/* Teacher Profile Card & Story */}
        <div className="bg-[#f8faff] rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Photo of Parkin */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/5 max-w-sm mx-auto group">
                <img 
                  src={teacher.avatar} 
                  alt={teacher.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                />
              </div>
            </div>

            {/* Right: Biography, Credentials & Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#383fab] bg-[#dee5ff] px-2.5 py-0.5 rounded-full">
                    <GraduationCap className="w-3 h-3" />
                    University of Essex BA in TEFL
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    CELTA Qualified
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    5+ Yrs Thai Learners
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {lang === 'th' ? teacher.nameTh : teacher.name}
                </h3>
                
                <p className="text-xs sm:text-sm font-semibold text-[#383fab] mt-0.5">
                  {lang === 'th' ? teacher.titleTh : teacher.titleEn}
                </p>
              </div>

              <p className="text-slate-700 text-sm leading-relaxed">
                {lang === 'th' ? teacher.bioTh : teacher.bioEn}
              </p>

              {/* Verified Credentials Checklist */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  {lang === 'th' ? 'คุณสมบัติ & ประสบการณ์สอน:' : 'Verified Credentials & Background:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(lang === 'th' ? teacher.credentialsTh : teacher.credentialsEn).map((cred, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800 font-medium bg-white p-3 rounded-xl border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{cred}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teaching Philosophy Callout */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1">
                <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>{text.aboutTeacherQuote}</span>
                </div>
                <p className="text-xs text-amber-950 font-medium leading-relaxed italic">
                  "{lang === 'th' ? teacher.teachingPhilosophyTh : teacher.teachingPhilosophyEn}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    onBookSession();
                  }}
                  className="px-6 py-3.5 rounded-xl bg-[#383fab] hover:bg-[#373ea1] text-white text-xs font-extrabold shadow-md shadow-[#383fab]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#ff9800]" />
                  <span>{text.btnBookWithTeacher}</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
