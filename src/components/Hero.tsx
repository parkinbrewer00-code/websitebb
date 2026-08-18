import React from 'react';
import { Language } from '../types';
import { t } from '../data/translations';
import { TEACHER_PROFILE } from '../data/mockData';
import { sound } from '../utils/audio';
import { 
  BookOpen, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Target,
  MessageSquare,
  FileCheck2,
  GraduationCap
} from 'lucide-react';

interface HeroProps {
  lang: Language;
  onExploreCourses: () => void;
  onBookPrivate: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onExploreCourses,
  onBookPrivate
}) => {
  const text = t(lang);

  const learningPillars = [
    {
      id: 'targeted',
      icon: Target,
      titleEn: 'Tailored for Thai Native Speakers',
      titleTh: 'แก้จุดติดขัดเฉพาะคนไทยโดยตรง',
      descEn: 'Stop translating word-for-word in your head. Master stress mechanics, linking sounds, and natural phrasing.',
      descTh: 'หยุดแปลไทยเป็นอังกฤษในหัว ปรับจังหวะเน้นเสียง (Stress) และการเชื่อมคำให้พูดได้ลื่นไหลเป็นธรรมชาติ'
    },
    {
      id: 'workplace',
      icon: MessageSquare,
      titleEn: 'Real-World Workplace & Daily Fluency',
      titleTh: 'ภาษาอังกฤษใช้งานจริง & บริบททำงาน',
      descEn: 'Practical conversation, meeting discussions, email etiquette, and interview preparation that build genuine confidence.',
      descTh: 'เน้นพูดจริงในการประชุม สัมภาษณ์งาน การเขียนอีเมลอย่างสุภาพ และการคุยกับชาวต่างชาติอย่างมั่นใจ'
    },
    {
      id: 'feedback',
      icon: FileCheck2,
      titleEn: 'Personalized Coaching & Session Notes',
      titleTh: 'แผนการเรียนเฉพาะบุคคล & สรุปบทเรียน',
      descEn: 'Custom study path suited to your current level, with detailed feedback summaries provided after every class.',
      descTh: 'ปรับหลักสูตรตามเป้าหมายของแต่ละคน พร้อมเอกสารสรุปคำศัพท์และจุดที่ต้องปรับปรุงหลังจบคลาสทุกครั้ง'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f8faff] to-[#dee5ff]/30 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-100">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-12 left-10 w-96 h-96 bg-[#dee5ff]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#1fdbef]/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Text & Main Conversion CTAs) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {text.heroTitle1}{' '}
              <span className="text-[#383fab] block sm:inline">
                {text.heroTitle2}
              </span>
            </h1>

            {/* Value Proposition Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              {text.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  onExploreCourses();
                  sound.playClick();
                }}
                className="px-7 py-4 rounded-2xl bg-[#383fab] hover:bg-[#373ea1] active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-[#383fab]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#1fdbef]" />
                <span>{text.heroCtaCourses}</span>
                <ArrowRight className="w-4 h-4 text-[#ff9800]" />
              </button>

              <button
                onClick={() => {
                  onBookPrivate();
                  sound.playClick();
                }}
                className="px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm border-2 border-slate-200 hover:border-[#383fab] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#ff9800]" />
                <span>{text.heroCtaPrivate}</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{lang === 'th' ? 'สอนสดตัวต่อตัว & คอร์สเรียนออนไลน์' : 'Live 1-on-1 & Online Courses'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#383fab]" />
                <span>{lang === 'th' ? 'แก้ไขจุดติดขัดเฉพาะคนไทย' : 'Tailored specifically for Thai native speakers'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Teacher Spotlight Card & Methodology Highlights (Non-Interactive) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Spotlight Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl space-y-5 relative overflow-hidden">
              
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img 
                    src={TEACHER_PROFILE.avatar} 
                    alt="Teacher Parkin"
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover ring-4 ring-[#dee5ff]" 
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#ff9800] text-slate-950 p-1 rounded-full text-xs shadow-xs" title="Lead Coach">
                    🎓
                  </div>
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#383fab] uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#383fab]" />
                    <span>Lead Coach & Founder</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 truncate">
                    Teacher Kym (ครูคิม)
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {lang === 'th'
                      ? 'Univ. of Essex BA in TEFL • CELTA • 5+ ปี'
                      : 'Univ. of Essex BA in TEFL • CELTA • 5+ Yrs Exp.'}
                  </p>
                </div>
              </div>

              {/* Quote / Mission */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium bg-[#f8faff] p-3 rounded-2xl border border-slate-100 italic">
                "{lang === 'th' 
                  ? 'ภาษาอังกฤษของคนไทยไม่ได้แย่เลยครับ เราแค่ติดนิสัยแปลตรงตัวและวรรณยุกต์ เมื่อเข้าใจสัทศาสตร์ คุณจะพูดได้อย่างเป็นธรรมชาติทันที'
                  : 'Thai learners have immense potential. You just need proper stress mechanics and confidence to unlock your true voice.'}"
              </p>

              {/* Core Learning Pillars (Clean, Non-Interactive List) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ff9800]" />
                  <span className="text-xs font-extrabold text-slate-900">
                    {lang === 'th' ? 'ทำไมต้องเรียนกับ Beyond Borders:' : 'Why Learn with Beyond Borders:'}
                  </span>
                </div>

                {/* 3 Pillars List */}
                <div className="space-y-2.5">
                  {learningPillars.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="bg-[#f8faff] rounded-2xl p-3.5 border border-slate-200/80 flex items-start gap-3 hover:border-[#383fab]/40 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#383fab] shrink-0 mt-0.5 shadow-2xs">
                          <ItemIcon className="w-4 h-4 text-[#383fab]" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900">
                            {lang === 'th' ? item.titleTh : item.titleEn}
                          </h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                            {lang === 'th' ? item.descTh : item.descEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Verified Guarantee Pill */}
                <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-[#383fab]" />
                    <span>{lang === 'th' ? 'มาตรฐาน Native British TEFL' : 'Native British TEFL Standards'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'th' ? 'สอนสดทุกคลาส' : '100% Live Coaching'}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
