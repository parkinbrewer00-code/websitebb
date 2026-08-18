import React, { useState } from 'react';
import { ONLINE_COURSES } from '../data/mockData';
import { OnlineCourse, Language } from '../types';
import { t } from '../data/translations';
import { sound } from '../utils/audio';
import { 
  BookOpen, 
  PlayCircle, 
  Clock, 
  Star, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Users,
  ChevronRight,
  FileText
} from 'lucide-react';

interface OnlineCoursesSectionProps {
  lang: Language;
  courses?: OnlineCourse[];
  onSelectCourse: (course: OnlineCourse) => void;
  onEnrollCourse: (course: OnlineCourse) => void;
}

export const OnlineCoursesSection: React.FC<OnlineCoursesSectionProps> = ({
  lang,
  courses,
  onSelectCourse,
  onEnrollCourse
}) => {
  const text = t(lang);
  const displayCourses = courses && courses.length > 0 ? courses : ONLINE_COURSES;

  return (
    <section id="online-courses" className="py-20 bg-[#f8faff] border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {text.coursesTitle}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            {text.coursesSubtitle}
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-xl ${
                course.popular 
                  ? 'border-2 border-[#383fab] shadow-lg ring-4 ring-[#dee5ff]/50' 
                  : 'border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div>
                {/* Course Cover Image */}
                <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                  <img 
                    src={course.coverImage} 
                    alt={course.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {course.badge && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#ff9800] text-slate-950 text-[11px] font-extrabold shadow-sm">
                      {course.badge}
                    </div>
                  )}
                </div>

                {/* Course Content Info */}
                <div className="p-6 sm:p-7 space-y-4">
                  
                  {/* Rating & Students */}
                  <div className="flex items-center justify-between text-xs">
                    {course.isComingSoon ? (
                      <div className="flex items-center gap-1 text-[#383fab] font-bold">
                        <Sparkles className="w-3.5 h-3.5 fill-[#dee5ff]" />
                        <span>{lang === 'th' ? 'เตรียมพบกันเร็วๆ นี้' : 'Launching Soon'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{course.rating}</span>
                        <span className="text-slate-400 font-normal">({course.studentsCount} {lang === 'th' ? 'คนเรียน' : 'students'})</span>
                      </div>
                    )}

                    <span className="px-2.5 py-0.5 rounded-md bg-[#dee5ff] text-[#383fab] font-bold text-[11px]">
                      {course.level}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#383fab] transition-colors line-clamp-2">
                      {lang === 'th' ? course.titleTh : course.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {lang === 'th' ? course.subtitleTh : course.subtitleEn}
                    </p>
                  </div>

                  {/* Course Highlights */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {(lang === 'th' ? course.highlightsTh : course.highlightsEn).slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}

                    {/* PDF Handout Included Badge */}
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-[#383fab]">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {lang === 'th' ? 'แถมฟรี! เอกสารสรุปบทเรียน PDF' : 'Includes PDF Course Workbook'}
                        {course.handoutPdfSize ? ` (${course.handoutPdfSize})` : ''}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Bottom Bar */}
              <div className="p-6 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                  <button
                    disabled={course.isComingSoon}
                    onClick={() => {
                      if (!course.isComingSoon) {
                        sound.playClick();
                        onSelectCourse(course);
                      }
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                      course.isComingSoon 
                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer'
                    }`}
                  >
                    {lang === 'th' ? 'ดูรายละเอียดคอร์ส' : 'View Details'}
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onEnrollCourse(course);
                    }}
                    className="py-3 px-2 rounded-xl bg-[#383fab] hover:bg-[#373ea1] text-white text-xs font-extrabold shadow-md shadow-[#383fab]/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{course.isComingSoon ? (lang === 'th' ? 'แจ้งความสนใจ' : 'Register Interest') : (lang === 'th' ? 'สมัครเรียนทันที' : 'Enroll Now')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#ff9800]" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Lifetime Guarantee Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                {lang === 'th' ? 'เข้าถึงได้ตลอดชีพ ไม่มีวันหมดอายุ' : 'Lifetime Access with Free Future Updates'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'th' ? 'สมัครครั้งเดียว ดูซ้ำได้ทุกที่ทุกเวลาบนมือถือ แท็บเล็ต และคอมพิวเตอร์' : 'Learn at your own pace from any device, anytime.'}
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-[#383fab] bg-[#dee5ff] px-4 py-2 rounded-xl whitespace-nowrap">
            ✓ 100% Satisfaction Guarantee
          </div>
        </div>

      </div>
    </section>
  );
};
