import React from 'react';
import { PRIVATE_PACKAGES } from '../data/mockData';
import { PrivatePackage, Language } from '../types';
import { t } from '../data/translations';
import { sound } from '../utils/audio';
import { 
  Calendar, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  UserCheck, 
  MessageSquare,
  ShieldCheck,
  Headphones
} from 'lucide-react';

interface PrivateCoachingSectionProps {
  lang: Language;
  packages?: PrivatePackage[];
  onBookPackage: (pkg: PrivatePackage) => void;
}

export const PrivateCoachingSection: React.FC<PrivateCoachingSectionProps> = ({
  lang,
  packages,
  onBookPackage
}) => {
  const text = t(lang);
  const displayPackages = packages && packages.length > 0 ? packages : PRIVATE_PACKAGES;

  return (
    <section id="private-coaching" className="py-20 bg-white border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#dee5ff] text-[#383fab] text-xs font-extrabold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>{text.privateTag}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {text.privateTitle}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            {text.privateSubtitle}
          </p>
        </div>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {displayPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                pkg.popular
                  ? 'bg-gradient-to-b from-[#f8faff] to-white border-2 border-[#383fab] shadow-xl ring-4 ring-[#dee5ff]/40 lg:-translate-y-2'
                  : 'bg-white border border-slate-200/90 shadow-sm hover:border-slate-300'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#ff9800] text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? pkg.badgeTh : pkg.badgeEn}</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                    <span>{pkg.sessionsCount} {lang === 'th' ? 'คาบเรียนสด' : 'Live Sessions'}</span>
                    <span className="text-[#383fab]">{pkg.sessionDuration}</span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    {lang === 'th' ? pkg.nameTh : pkg.nameEn}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                    {lang === 'th' ? pkg.subtitleTh : pkg.subtitleEn}
                  </p>
                </div>

                {/* Price Display */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">
                      ฿{pkg.priceThb.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ฿{pkg.originalPriceThb.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs text-emerald-600 font-bold">
                    {lang === 'th' 
                      ? `เฉลี่ยเพียง ฿${pkg.pricePerSessionThb} / คาบ` 
                      : `Only ฿${pkg.pricePerSessionThb} / session`}
                  </div>
                </div>

                {/* Target Audience */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 font-medium">
                  <span className="font-bold text-slate-900">🎯 {lang === 'th' ? 'เหมาะสำหรับ:' : 'Target:'} </span>
                  {lang === 'th' ? pkg.targetAudienceTh : pkg.targetAudienceEn}
                </div>

                {/* Included Features */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {text.privateIncludedTitle}
                  </div>
                  <ul className="space-y-2">
                    {(lang === 'th' ? pkg.featuresTh : pkg.featuresEn).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    sound.playClick();
                    onBookPackage(pkg);
                  }}
                  className={`w-full py-4 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    pkg.popular
                      ? 'bg-[#383fab] hover:bg-[#373ea1] text-white shadow-[#383fab]/30 hover:shadow-lg'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#ff9800]" />
                  <span>{lang === 'th' ? `จองแพ็กเกจนี้ (฿${pkg.priceThb.toLocaleString()})` : `Book Package (฿${pkg.priceThb.toLocaleString()})`}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Private Lesson Details Box */}
        <div className="mt-12 bg-[#f8faff] rounded-3xl p-6 sm:p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-[#383fab] uppercase tracking-wider">
              1. {lang === 'th' ? 'จัดตารางเรียนยืดหยุ่น' : 'Flexible Scheduling'}
            </div>
            <p className="text-xs text-slate-600">
              {lang === 'th' ? 'เลือกวันและเวลาเรียนได้ตามที่คุณสะดวก ทั้งช่วงเย็นและวันเสาร์-อาทิตย์' : 'Choose time slots that fit your work schedule, including evenings and weekends.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-extrabold text-[#383fab] uppercase tracking-wider">
              2. {lang === 'th' ? 'ปรับหลักสูตรตามผู้เรียน' : '100% Tailored Curriculum'}
            </div>
            <p className="text-xs text-slate-600">
              {lang === 'th' ? 'นำสไลด์งานจริง อีเมล หรือสคริปต์สัมภาษณ์ของคุณมาซ้อมในคลาสได้โดยตรง' : 'Bring your actual presentation slides, emails, or interview briefs to practice.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-extrabold text-[#383fab] uppercase tracking-wider">
              3. {lang === 'th' ? 'บันทึกเสียงบทเรียน & สรุปโน้ต' : 'Audio Recording & Notes'}
            </div>
            <p className="text-xs text-slate-600">
              {lang === 'th' ? 'รับไฟล์เสียงบันทึกบทเรียนและเอกสารคำศัพท์ที่ครูสรุปให้หลังเลิกเรียนทุกครั้ง' : 'Receive lesson audio recordings and detailed review notes after every single class.'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
