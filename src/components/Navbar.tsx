import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import { t } from '../data/translations';
import { sound } from '../utils/audio';
import { 
  Globe, 
  Wifi, 
  Menu, 
  X, 
  BookOpen, 
  UserCheck, 
  Calendar,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Star
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  dataSaver: boolean;
  onToggleDataSaver: () => void;
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  activeTab,
  onSelectTab,
  dataSaver,
  onToggleDataSaver,
  onOpenBooking,
  onOpenAdmin,
}) => {
  const text = t(lang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'courses', label: text.navCourses, icon: BookOpen },
    { id: 'private', label: text.navPrivate, icon: Calendar },
    { id: 'about', label: text.navAboutTeacher, icon: UserCheck },
    { id: 'reviews', label: text.navReviews, icon: Star },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]' 
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { onSelectTab('home'); sound.playClick(); }}
            className="cursor-pointer flex items-center shrink-0 transition-transform active:scale-98"
            role="button"
            tabIndex={0}
            aria-label="Beyond Borders Home"
          >
            <Logo size="sm" showTagline={false} />
          </div>

          {/* Desktop Navigation Links - Centered & Uncluttered */}
          <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/50 backdrop-blur-xs">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    sound.playClick();
                  }}
                  className={`px-2.5 lg:px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#383fab] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 shrink-0 hidden lg:inline-block ${isActive ? 'text-[#383fab]' : 'text-slate-400'}`} />}
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities Cluster */}
          <div className="hidden sm:flex items-center space-x-2 shrink-0">
            
            {/* Combined Minimalist Utility Controls */}
            <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-full p-0.5">
              
              {/* Language Switcher Button */}
              <button
                onClick={() => {
                  onToggleLang();
                }}
                className="px-2.5 py-1 rounded-full hover:bg-white text-slate-700 hover:text-[#383fab] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                title={lang === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-[#383fab] shrink-0" />
                <span className="text-[11px] font-bold tracking-tight">
                  {lang === 'th' ? 'TH' : 'EN'}
                </span>
              </button>

              {/* Thin Divider */}
              <div className="h-3.5 w-px bg-slate-200" />

              {/* Data Saver Mode Minimalist Indicator Button */}
              <button
                onClick={onToggleDataSaver}
                className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                  dataSaver
                    ? 'bg-emerald-500 text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                }`}
                title={dataSaver ? 'Data Saver is ON (Lite mode)' : 'Toggle Data Saver Mode'}
                aria-label="Toggle Data Saver"
              >
                <Wifi className="w-3 h-3 shrink-0" />
                <span className="text-[11px] font-semibold">
                  {dataSaver ? 'Lite' : 'Lite'}
                </span>
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                onOpenBooking();
                sound.playClick();
              }}
              className="px-3.5 lg:px-4.5 py-1.5 lg:py-2 rounded-full bg-[#383fab] hover:bg-[#2e3494] active:scale-95 text-white font-bold text-xs shadow-sm shadow-[#383fab]/20 hover:shadow-md hover:shadow-[#383fab]/30 transition-all duration-150 flex items-center gap-1.5 cursor-pointer group whitespace-nowrap shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 text-[#ff9800] group-hover:scale-110 transition-transform shrink-0" />
              <span className="whitespace-nowrap">{text.btnBookPrivateNav}</span>
              <ArrowRight className="w-3 h-3 text-white/70 group-hover:translate-x-0.5 transition-transform shrink-0 hidden sm:inline-block" />
            </button>

            {/* Teacher Admin Button */}
            {onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  sound.playClick();
                }}
                className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Teacher Kym Admin Panel"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Admin</span>
              </button>
            )}

          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center space-x-1.5">
            {/* Quick Language Toggle on Mobile */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 active:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3 text-[#383fab]" />
              <span>{lang === 'th' ? 'TH' : 'EN'}</span>
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                    sound.playClick();
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'text-[#383fab] bg-[#dee5ff]/70'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-[#383fab]' : 'text-slate-400'}`} />}
                    <span>{item.label}</span>
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#383fab]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-full bg-[#383fab] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#383fab]/25"
            >
              <Calendar className="w-4 h-4 text-[#ff9800]" />
              <span>{text.btnBookPrivateNav}</span>
            </button>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Teacher Admin Panel</span>
              </button>
            )}

            <button
              onClick={onToggleDataSaver}
              className={`w-full py-2.5 rounded-full border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                dataSaver 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>
                {lang === 'th'
                  ? (dataSaver ? 'โหมดประหยัดเน็ต: เปิดอยู่ (Lite ON)' : 'โหมดประหยัดเน็ต: ปิดอยู่ (Lite OFF)')
                  : (dataSaver ? 'Data Saver: ON (Lite Mode)' : 'Data Saver: OFF (Standard Mode)')}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
