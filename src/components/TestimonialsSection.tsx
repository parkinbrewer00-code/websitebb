import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { StudentReview, Language } from '../types';
import { t } from '../data/translations';
import { Star, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  lang: Language;
  reviews?: StudentReview[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang, reviews }) => {
  const text = t(lang);

  const displayReviews = reviews && reviews.length > 0 
    ? reviews.filter(r => r.isApproved !== false)
    : TESTIMONIALS.map(t => ({
        id: t.id,
        studentName: t.name,
        roleEn: t.roleEn,
        roleTh: t.roleTh,
        avatar: t.avatar,
        rating: 5,
        quoteEn: t.quoteEn,
        quoteTh: t.quoteTh,
        courseTakenEn: t.courseTakenEn,
        courseTakenTh: t.courseTakenTh,
        isFeatured: true,
        isApproved: true
      }));

  return (
    <section id="reviews" className="py-20 bg-[#f8faff] border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#dee5ff] text-[#383fab] text-xs font-extrabold uppercase tracking-wider">
            <Quote className="w-3.5 h-3.5" />
            <span>Student Feedback</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {text.testimonialTitle}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            {text.testimonialSubtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#383fab]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center gap-3">
                  <img 
                    src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                    alt={item.studentName} 
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#dee5ff]" 
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{item.studentName}</h4>
                    <p className="text-[11px] text-slate-500">{lang === 'th' ? item.roleTh : item.roleEn}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic">
                  "{lang === 'th' ? item.quoteTh : item.quoteEn}"
                </p>
              </div>

              {/* Course Tag */}
              {(item.courseTakenTh || item.courseTakenEn) && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="inline-block px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-[#383fab]">
                    📚 {lang === 'th' ? item.courseTakenTh : item.courseTakenEn}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
