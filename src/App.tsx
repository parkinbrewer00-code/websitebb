import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutTeacherSection } from './components/AboutTeacherSection';
import { OnlineCoursesSection } from './components/OnlineCoursesSection';
import { PrivateCoachingSection } from './components/PrivateCoachingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CourseModal } from './components/CourseModal';
import { RegisterInterestModal } from './components/RegisterInterestModal';
import { Footer } from './components/Footer';

import { Language, OnlineCourse, PrivatePackage, BookingRequest, StudentReview } from './types';
import { PRIVATE_PACKAGES, ONLINE_COURSES, TESTIMONIALS } from './data/mockData';
import { 
  subscribeCourses, 
  subscribePackages, 
  subscribeReviews,
  seedInitialDataIfEmpty 
} from './services/firebaseService';
import { AdminPage } from './components/admin/AdminPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { sound } from './utils/audio';

export default function App() {
  const [lang, setLang] = useState<Language>('th');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [dataSaver, setDataSaver] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<'public' | 'admin' | 'onboarding'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash.startsWith('#admin')) return 'admin';
      if (window.location.hash.startsWith('#onboarding') || window.location.hash.startsWith('#book')) return 'onboarding';
    }
    return 'public';
  });

  // Live Firebase Data
  const [courses, setCourses] = useState<OnlineCourse[]>([]);
  const [packages, setPackages] = useState<PrivatePackage[]>([]);
  const [reviews, setReviews] = useState<StudentReview[]>([]);

  // Modals & Selected items
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<OnlineCourse | null>(null);
  const [selectedCourseForInterest, setSelectedCourseForInterest] = useState<OnlineCourse | null>(null);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<PrivatePackage | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' } | null>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#admin')) {
        setCurrentRoute('admin');
      } else if (window.location.hash.startsWith('#onboarding') || window.location.hash.startsWith('#book')) {
        setCurrentRoute('onboarding');
      } else {
        setCurrentRoute('public');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Subscribe to live Firestore updates
  useEffect(() => {
    seedInitialDataIfEmpty();
    const unsubCourses = subscribeCourses(setCourses);
    const unsubPackages = subscribePackages(setPackages);
    const unsubReviews = subscribeReviews(setReviews);

    return () => {
      unsubCourses();
      unsubPackages();
      unsubReviews();
    };
  }, []);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('bb_lang') as Language;
      if (savedLang === 'th' || savedLang === 'en') {
        setLang(savedLang);
      }
      const savedDataSaver = localStorage.getItem('bb_datasaver');
      if (savedDataSaver !== null) {
        setDataSaver(savedDataSaver === 'true');
      }
    } catch {}
  }, []);

  const handleToggleLang = () => {
    const nextLang = lang === 'th' ? 'en' : 'th';
    setLang(nextLang);
    sound.playClick();
    try {
      localStorage.setItem('bb_lang', nextLang);
    } catch {}
    showToast(nextLang === 'th' ? '🇹🇭 เปลี่ยนภาษาเป็นภาษาไทย' : '🇬🇧 Switched language to English');
  };

  const handleToggleDataSaver = () => {
    const nextVal = !dataSaver;
    setDataSaver(nextVal);
    sound.playClick();
    try {
      localStorage.setItem('bb_datasaver', String(nextVal));
    } catch {}
    showToast(nextVal ? '⚡ เปิดโหมดประหยัดเน็ต' : '🌐 ปิดโหมดประหยัดเน็ต');
  };

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const activePackages = packages.length > 0 ? packages : PRIVATE_PACKAGES;

  const handleOpenBooking = (pkg?: PrivatePackage) => {
    setSelectedPackageForBooking(pkg || activePackages[1] || activePackages[0]);
    setCurrentRoute('onboarding');
    window.location.hash = '#onboarding';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    sound.playClick();
  };

  const handleConfirmEnrollCourse = (course: OnlineCourse) => {
    showToast(lang === 'th' ? `🎉 สมัครคอร์ส ${course.titleTh} สำเร็จ!` : `🎉 Enrolled in ${course.titleEn}!`, 'success');
  };

  const handleSubmitBookingRequest = (booking: BookingRequest) => {
    showToast(lang === 'th' ? `✅ บันทึกคำขอจองคลาส ${booking.packageName} แล้ว!` : `✅ Booking request received!`, 'success');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavTabSelect = (tab: string) => {
    setActiveTab(tab);
    sound.playClick();

    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'courses') {
      scrollToSection('online-courses');
    } else if (tab === 'private') {
      scrollToSection('private-coaching');
    } else if (tab === 'about') {
      scrollToSection('about-teacher');
    } else if (tab === 'reviews') {
      scrollToSection('reviews');
    }
  };

  const handleNavigateToAdmin = () => {
    setCurrentRoute('admin');
    window.location.hash = '#admin';
    sound.playClick();
  };

  const handleNavigateToHome = () => {
    setCurrentRoute('public');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    sound.playClick();
  };

  // If on dedicated Admin Page, render AdminPage component exclusively
  if (currentRoute === 'admin') {
    return <AdminPage onNavigateHome={handleNavigateToHome} />;
  }

  // If on dedicated 1-on-1 Onboarding Flow page, render OnboardingFlow component
  if (currentRoute === 'onboarding') {
    return (
      <OnboardingFlow
        initialPackage={selectedPackageForBooking}
        packages={packages}
        lang={lang}
        onBackToHome={handleNavigateToHome}
        onBookingComplete={handleSubmitBookingRequest}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-white text-slate-900 ${dataSaver ? 'data-saver' : ''}`}>
      
      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="bg-slate-950 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2">
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        activeTab={activeTab}
        onSelectTab={handleNavTabSelect}
        dataSaver={dataSaver}
        onToggleDataSaver={handleToggleDataSaver}
        onOpenBooking={() => handleOpenBooking(activePackages[0])}
        onOpenAdmin={handleNavigateToAdmin}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        
        {/* 1. Hero Section */}
        <Hero
          lang={lang}
          onExploreCourses={() => scrollToSection('online-courses')}
          onBookPrivate={() => scrollToSection('private-coaching')}
        />

        {/* 2. Online Masterclasses Section */}
        <OnlineCoursesSection
          lang={lang}
          courses={courses}
          onSelectCourse={(course) => setSelectedCourseForModal(course)}
          onEnrollCourse={(course) => {
            if (course.isComingSoon) {
              setSelectedCourseForInterest(course);
            } else {
              setSelectedCourseForModal(course);
            }
          }}
        />

        {/* 3. Private 1-on-1 Coaching Section */}
        <PrivateCoachingSection
          lang={lang}
          packages={packages}
          onBookPackage={(pkg) => handleOpenBooking(pkg)}
        />

        {/* 4. About Teacher Spotlight */}
        <AboutTeacherSection
          lang={lang}
          onBookSession={() => handleOpenBooking(activePackages[0])}
        />

        {/* 5. Student Reviews & Transformations */}
        <TestimonialsSection lang={lang} reviews={reviews} />

      </main>

      {/* Course Syllabus & Enrollment Modal */}
      {selectedCourseForModal && (
        <CourseModal
          course={selectedCourseForModal}
          lang={lang}
          onClose={() => setSelectedCourseForModal(null)}
          onConfirmEnroll={handleConfirmEnrollCourse}
        />
      )}

      {/* Register Interest Modal for Coming Soon Courses */}
      <AnimatePresence>
        {selectedCourseForInterest && (
          <RegisterInterestModal
            course={selectedCourseForInterest}
            lang={lang}
            onClose={() => setSelectedCourseForInterest(null)}
            onSubmit={(data) => {
              console.log('Interest Registered:', data);
              setSelectedCourseForInterest(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer
        lang={lang}
        onToggleLang={handleToggleLang}
        dataSaver={dataSaver}
        onToggleDataSaver={handleToggleDataSaver}
        onSelectTab={handleNavTabSelect}
        onOpenAdmin={handleNavigateToAdmin}
      />

    </div>
  );
}
