import React from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { t } from '../data/translations';
import { Globe, MapPin, Mail, Phone, Wifi, Heart, MessageCircle } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onToggleLang: () => void;
  dataSaver: boolean;
  onToggleDataSaver: () => void;
  onSelectTab: (tab: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onToggleLang,
  dataSaver,
  onToggleDataSaver,
  onSelectTab,
  onOpenAdmin
}) => {
  const text = t(lang);

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Overview */}
          <div className="space-y-4">
            <Logo size="md" isDark showTagline />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {text.footerAbout}
            </p>

            <div className="pt-2 space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff9800] shrink-0" />
                <span>{text.footerOffice}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1fdbef] shrink-0" />
                <a href="mailto:hello@beyondborders.ac" className="hover:text-white transition-colors">hello@beyondborders.ac</a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href="https://wa.me/447351264979" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +447351264979
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
              {text.footerQuickLinks}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onSelectTab('courses')} className="hover:text-white transition-colors cursor-pointer">
                  {text.navCourses}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('private')} className="hover:text-white transition-colors cursor-pointer">
                  {text.navPrivate}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-white transition-colors cursor-pointer">
                  {text.navAboutTeacher}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('reviews')} className="hover:text-white transition-colors cursor-pointer">
                  {text.navReviews}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Online Courses Offered */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
              {lang === 'th' ? 'คอร์สเรียนยอดนิยม' : 'Featured Courses'}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>• ปลดล็อกสำเนียง & โฟเนติกส์สำหรับคนไทย</li>
              <li>• ภาษาอังกฤษธุรกิจ & การประชุมสากล</li>
              <li>• พูดอังกฤษคล่องในชีวิตประจำวัน ไม่ต้องแปลในหัว</li>
              <li>• ติวตัวต่อตัวเตรียมสัมภาษณ์งานสากล</li>
            </ul>
          </div>

          {/* Col 4: Language & Data Mode */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
              {lang === 'th' ? 'ตั้งค่าการแสดงผล' : 'Preferences'}
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={onToggleLang}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#383fab]" />
                  <span>Language</span>
                </span>
                <span className="text-xs text-[#ff9800]">{lang === 'th' ? '🇹🇭 ภาษาไทย' : '🇬🇧 English'}</span>
              </button>

              <button
                onClick={onToggleDataSaver}
                className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                  dataSaver 
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  <span>{lang === 'th' ? 'ประหยัดเน็ต' : 'Data Saver'}</span>
                </span>
                <span className="font-bold">{dataSaver ? 'ON' : 'OFF'}</span>
              </button>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Teacher Admin Portal</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">จัดการระบบ →</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>{text.footerCopyright}</div>
          <div className="flex items-center gap-1">
            <span>Designed for Thai English learners</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
