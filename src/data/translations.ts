import { Language } from '../types';

export const t = (lang: Language) => {
  const dict = {
    th: {
      brandName: "Beyond Borders",
      brandSlogan: "ก้าวข้ามทุกขีดจำกัด ปลดล็อกภาษาอังกฤษอย่างมั่นใจ",
      tagline: "คอร์สออนไลน์ & เรียนส่วนตัว 1 ต่อ 1 สำหรับคนไทย",
      
      // Navigation
      navHome: "หน้าแรก",
      navCourses: "คอร์สออนไลน์",
      navPrivate: "เรียนสด 1-1",
      navAboutTeacher: "ครูผู้สอน",
      navVocab: "แล็บคำศัพท์",
      navReviews: "รีวิว",
      btnBookPrivateNav: "จองเรียนสด 1-1",
      btnEnrollCourse: "ดูคอร์สทั้งหมด",
      langSwitch: "English",
      lowBandwidthMode: "โหมดประหยัดเน็ต",
      
      // Hero
      heroBadge: "🇹🇭 สอนโดยครูผู้เชี่ยวชาญการแก้ปัญหาคนไทยโดยเฉพาะ",
      heroTitle1: "เก่งอังกฤษเพื่อโลกแห่งความเป็นจริง",
      heroTitle2: "ไม่ใช่แค่ในห้องเรียน",
      heroSubtitle: "หลักสูตรที่ออกแบบมาเพื่อนิสิต นักศึกษา และคนทำงานรุ่นใหม่ที่ต้องการก้าวสู่ระดับ B2-C2 เพื่อความก้าวหน้าในอาชีพและการเรียนต่อต่างประเทศ—ไม่ว่าพื้นฐานของคุณจะอยู่ระดับไหน ผมพร้อมช่วยให้คุณสื่อสารได้อย่างมั่นใจในทุกสถานการณ์",
      heroCtaCourses: "เลือกดูคอร์สออนไลน์",
      heroCtaPrivate: "จองคลาสเรียนส่วนตัว 1-1",
      heroTrustText: "คนไทยกว่า 1,800+ คน พัฒนาการพูดอย่างเห็นผลจริง",
      heroStatStudents: "1,800+ นักเรียนที่สอนแล้ว",
      heroStatRating: "4.98/5.0 ดาวความพึงพอใจ",
      heroStatHours: "4,200+ ชั่วโมงการสอนสด",
      
      // About Teacher Section
      aboutTeacherTag: "Meet Your Lead Coach",
      aboutTeacherTitle: "รู้จักกับครูผู้สอนของคุณ",
      aboutTeacherSubtitle: "ผู้เชี่ยวชาญด้านสัทศาสตร์และการแก้จุดติดขัดของการพูดภาษาอังกฤษสำหรับคนไทย",
      aboutTeacherStatsLessons: "ชั่วโมงสอนสดตัวต่อตัว",
      aboutTeacherStatsStudents: "ผู้เรียนสำเร็จการอบรม",
      aboutTeacherStatsRating: "คะแนนรีวิวเฉลี่ย",
      aboutTeacherQuote: "คำสอนจากครู:",
      btnBookWithTeacher: "จองเวลาเรียนสดกับครูคิม",
      
      // Online Courses Section
      coursesTag: "Coming Soon: Self-Paced Online Courses & Workbooks",
      coursesTitle: "คอร์สเรียนออนไลน์ (เร็วๆ นี้)",
      coursesSubtitle: "เตรียมพบกับหลักสูตรที่ออกแบบตามมาตรฐาน CEFR ตั้งแต่ระดับเริ่มต้นจนถึงระดับสูง ลงทะเบียนแจ้งเตือนเพื่อรับสิทธิพิเศษก่อนใคร",
      courseDuration: "ความยาวโดยประมาณ",
      courseLessons: "บทเรียน",
      courseLifetime: "เข้าถึงได้ตลอดชีพ",
      btnViewSyllabus: "ดูรายละเอียดคอร์ส",
      btnEnrollNow: "ลงทะเบียนแจ้งความสนใจ",
      courseComingSoon: "เร็วๆ นี้",
      courseRegisterInterest: "ลงทะเบียนแจ้งความสนใจ",
      courseIncludedTitle: "สิ่งที่คุณจะได้รับในคอร์ส:",

      // Register Interest Modal
      interestModalTitle: "ลงชื่อรับการแจ้งเตือน",
      interestModalSubtitle: "ลงทะเบียนเพื่อรับการแจ้งเตือนเมื่อคอร์ส {courseName} เปิดให้เข้าเรียน",
      interestBadge: "Waitlist",
      interestLabelName: "ชื่อ-นามสกุล",
      interestLabelEmail: "อีเมล",
      interestLabelPhone: "เบอร์โทรศัพท์",
      interestConsentText: "ยินยอมให้ติดต่อเพื่อแจ้งเตือนเมื่อคอร์สนี้พร้อมเปิดสอน",
      interestConsentSub: "ข้อมูลของคุณจะถูกเก็บเป็นความลับ (GDPR Compliant)",
      interestBtnSubmit: "ลงชื่อเข้า Waitlist",
      interestSuccessMsg: "เราบันทึกข้อมูลของคุณเรียบร้อยแล้ว จะส่งอีเมลแจ้งเตือนทันทีที่คอร์สพร้อมเปิดสอนครับ",
      interestPlaceholderName: "กรอกชื่อ-นามสกุล",
      interestPlaceholderEmail: "name@example.com",
      interestPlaceholderPhone: "08X-XXX-XXXX",
      
      // Private 1-on-1 Section
      privateTag: "1-on-1 Personalized Live Coaching",
      privateTitle: "แพ็กเกจเรียนสดส่วนตัว 1 ต่อ 1",
      privateSubtitle: "ปรับเนื้อหาและตารางเรียนตามเป้าหมายของคุณโดยเฉพาะ ซ้อมสัมภาษณ์งาน พรีเซนต์ หรือแก้สำเนียงแบบตรงจุด",
      privatePerSession: "เฉลี่ยคาบละ",
      btnBookPackage: "จองแพ็กเกจนี้",
      privateIncludedTitle: "จุดเด่นของแพ็กเกจ:",
      
      // Interactive Vocab & Pronunciation Lab
      vocabTitle: "แบบฝึกหัดคำศัพท์ & ห้องแล็บออกเสียง",
      vocabSubtitle: "ฝึกฝนคำศัพท์ที่คนไทยมักออกเสียงหรือใช้สับสน พร้อมคำอ่านเทียบเสียงไทยและระบบตรวจจับสำเนียง",
      vocabTabFlashcards: "🗂️ การ์ดคำศัพท์",
      vocabTabSpeaking: "🎙️ ห้องแล็บฝึกออกเสียง",
      vocabTabQuiz: "⚡ แบบทดสอบความจำ",
      
      // Modal Booking
      modalBookTitle: "จองคลาสเรียนสดส่วนตัว 1 ต่อ 1",
      modalBookSub: "กรอกข้อมูลและเลือกเวลาที่สะดวก เพื่อเริ่มเรียนกับครูคิม",
      formName: "ชื่อ-นามสกุล (Name)",
      formEmail: "อีเมล (Email)",
      formPhone: "เบอร์โทรศัพท์ (Phone)",
      formLine: "WhatsApp / Line (สำหรับส่งลิงก์ห้องเรียน)",
      formDate: "วันที่สะดวกเรียน",
      formTime: "ช่วงเวลาที่ต้องการ",
      formGoal: "เป้าหมายที่ต้องการเน้น (เช่น สัมภาษณ์งาน, แก้สำเนียง, ภาษาอังกฤษธุรกิจ)",
      formLevel: "ระดับภาษาอังกฤษปัจจุบัน",
      btnConfirmBooking: "ยืนยันการจองคลาส",
      bookingSuccessTitle: "ส่งคำขอจองคลาสเรียนเรียบร้อยแล้ว!",
      bookingSuccessDesc: "ทาง Beyond Borders จะติดต่อกลับผ่าน WhatsApp / อีเมล ภายใน 2 ชั่วโมง เพื่อยืนยันลิงก์ห้องเรียน",
      
      // Testimonials
      testimonialTitle: "เสียงตอบรับจริงจากผู้เรียน",
      testimonialSubtitle: "จากคนที่ไม่มั่นใจ สู่การสื่อสารภาษาอังกฤษอย่างคล่องแคล่วในการทำงานและชีวิตประจำวัน",
      
      // Footer
      footerAbout: "Beyond Borders มุ่งมั่นพัฒนาทักษะการพูดภาษาอังกฤษของคนไทยให้ก้าวสู่ระดับสากล ผ่านคอร์สออนไลน์และคลาสเรียนตัวต่อตัวที่มีประสิทธิภาพสูงสุด",
      footerOffice: "Beyond Borders Education กรุงเทพมหานคร",
      footerCopyright: "© 2026 Beyond Borders. All rights reserved.",
      footerQuickLinks: "เมนูลัด",
      footerContact: "ติดต่อสอบถาม"
    },
    en: {
      brandName: "Beyond Borders",
      brandSlogan: "Break boundaries. Speak English with true confidence.",
      tagline: "Online Courses & Private 1-on-1 Coaching for Thai Speakers",
      
      // Navigation
      navHome: "Home",
      navCourses: "Courses",
      navPrivate: "1-on-1",
      navAboutTeacher: "Teacher",
      navVocab: "Vocab Lab",
      navReviews: "Reviews",
      btnBookPrivateNav: "Book 1-on-1",
      btnEnrollCourse: "Explore Courses",
      langSwitch: "ภาษาไทย",
      lowBandwidthMode: "Data Saver Mode",
      
      // Hero
      heroBadge: "🇹🇭 Specialized English Speaking Coaching for Thai Speakers",
      heroTitle1: "English for the Real World,",
      heroTitle2: "Not Just the Classroom.",
      heroSubtitle: "A specialized coaching system for university students and young professionals aiming for B2-C2 fluency. Master the advanced communication skills needed to advance your career and study abroad—no matter your current level, I'm here to help.",
      heroCtaCourses: "Explore Online Courses",
      heroCtaPrivate: "Book 1-on-1 Coaching",
      heroTrustText: "Over 1,800+ Thai professionals & students trained",
      heroStatStudents: "1,800+ Students Coached",
      heroStatRating: "4.98/5.0 Average Rating",
      heroStatHours: "4,200+ Live Hours Taught",
      
      // About Teacher Section
      aboutTeacherTag: "Meet Your Lead Coach",
      aboutTeacherTitle: "Meet Your Teacher & Founder",
      aboutTeacherSubtitle: "Dedicated expert in phonetic correction, syllable stress, and confident communication for Thai learners.",
      aboutTeacherStatsLessons: "Private Live Hours",
      aboutTeacherStatsStudents: "Students Trained",
      aboutTeacherStatsRating: "Average Rating",
      aboutTeacherQuote: "Teaching Philosophy:",
      btnBookWithTeacher: "Book a Session with Teacher Kym",
      
      // Online Courses Section
      coursesTag: "Coming Soon: Self-Paced Online Courses & Workbooks",
      coursesTitle: "Online Courses (Coming Soon)",
      coursesSubtitle: "Our comprehensive CEFR-aligned curriculum is launching soon. Register your interest now to get early-bird discounts and exclusive updates.",
      courseDuration: "Est. Duration",
      courseLessons: "Lessons",
      courseLifetime: "Lifetime Access",
      btnViewSyllabus: "View Course Details",
      btnEnrollNow: "Register Your Interest",
      courseComingSoon: "Coming Soon",
      courseRegisterInterest: "Register Interest",
      courseIncludedTitle: "What is included:",

      // Register Interest Modal
      interestModalTitle: "Join the Waitlist",
      interestModalSubtitle: "Enter your details to be notified as soon as {courseName} becomes available.",
      interestBadge: "Waitlist",
      interestLabelName: "Full Name",
      interestLabelEmail: "Email Address",
      interestLabelPhone: "Phone Number",
      interestConsentText: "I agree to be contacted when this course launches.",
      interestConsentSub: "Your details will remain strictly confidential (GDPR Compliant).",
      interestBtnSubmit: "Join Waitlist",
      interestSuccessMsg: "You've been added to the waitlist. We'll send you an email as soon as this course is ready.",
      interestPlaceholderName: "Enter your full name",
      interestPlaceholderEmail: "name@example.com",
      interestPlaceholderPhone: "08X-XXX-XXXX",
      
      // Private 1-on-1 Section
      privateTag: "1-on-1 Personalized Live Coaching",
      privateTitle: "Private 1-on-1 Online Coaching Packages",
      privateSubtitle: "Customized strictly to your specific professional goals—accent reduction, job interviews, or executive presentations.",
      privatePerSession: "Per Session",
      btnBookPackage: "Book Package",
      privateIncludedTitle: "Package Highlights:",
      
      // Interactive Vocab & Pronunciation Lab
      vocabTitle: "Interactive Vocabulary & Pronunciation Lab",
      vocabSubtitle: "Practice tricky words Thai speakers often mispronounce with phonetic guides and audio evaluation.",
      vocabTabFlashcards: "🗂️ Flashcards",
      vocabTabSpeaking: "🎙️ Pronunciation Lab",
      vocabTabQuiz: "⚡ Memory Quiz",
      
      // Modal Booking
      modalBookTitle: "Book Private 1-on-1 Coaching Session",
      modalBookSub: "Select your preferred package and time slot to start learning with Teacher Kym.",
      formName: "Full Name",
      formEmail: "Email Address",
      formPhone: "Phone Number",
      formLine: "WhatsApp / Line (for classroom link delivery)",
      formDate: "Preferred Date",
      formTime: "Preferred Time Slot",
      formGoal: "Primary Focus / Goal (e.g. Job Interview, Accent, Workplace English)",
      formLevel: "Current English Level",
      btnConfirmBooking: "Confirm Booking Request",
      bookingSuccessTitle: "Booking Request Received!",
      bookingSuccessDesc: "Our team will reach out via WhatsApp / Email within 2 hours to confirm your scheduled meeting link.",
      
      // Testimonials
      testimonialTitle: "Real Student Transformations",
      testimonialSubtitle: "From hesitation in Zoom meetings to effortless, natural communication on global stages.",
      
      // Footer
      footerAbout: "Beyond Borders empowers Thai speakers to communicate with global authority and confidence through high-impact online courses and 1-on-1 coaching.",
      footerOffice: "Beyond Borders Education, Bangkok, Thailand",
      footerCopyright: "© 2026 Beyond Borders. All rights reserved.",
      footerQuickLinks: "Quick Navigation",
      footerContact: "Get in Touch"
    }
  };

  return dict[lang];
};
