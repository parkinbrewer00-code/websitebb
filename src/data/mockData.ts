import { TeacherProfile, OnlineCourse, PrivatePackage, VocabWord } from '../types';
import parkinAvatar from '../assets/images/IMG_5912.JPG';

export const TEACHER_PROFILE: TeacherProfile = {
  name: "Teacher Kym (ครูคิม)",
  nameTh: "ครูคิม (Teacher Kym)",
  titleEn: "University of Essex BA in TEFL • CELTA Qualified English Coach",
  titleTh: "จบ BA in TEFL จาก University of Essex • วุฒิบัตร CELTA Qualified",
  avatar: parkinAvatar,
  bioEn: "Graduated with a BA in TEFL from the University of Essex and CELTA qualified, Teacher Kym brings specialized coaching dedicated to Thai learners. Expert in accent modification, tone mechanics, and breaking the 'translating-in-your-head' barrier.",
  bioTh: "จบการศึกษาปริญญาตรี BA in TEFL จาก University of Essex และผ่านการรับรองวุฒิบัตรสากล CELTA Qualified มุ่งเน้นช่วยคนไทยแก้ปัญหาการออกเสียง การปรับสำเนียง และการฝึกให้พูดได้คล่องโดยไม่ต้องแปลในหัว",
  credentialsEn: [
    "University of Essex — BA in TEFL",
    "CELTA Qualified (Cambridge Teaching Certificate)",
    "Specialist in Thai linguistic tone transfer and natural speaking rhythm"
  ],
  credentialsTh: [
    "ปริญญาตรี BA in TEFL จาก University of Essex",
    "วุฒิบัตรครูสอนภาษาอังกฤษระดับสากล CELTA Qualified",
    "ผู้เชี่ยวชาญการปรับแก้จุดติดขัดเรื่องการออกเสียงและสัทศาสตร์สำหรับคนไทย"
  ],
  stats: {
    studentsTaught: 1850,
    hoursTaught: 4200,
    rating: 4.98,
    reviewCount: 430
  },
  teachingPhilosophyEn: "English fluency for Thai speakers isn't about memorizing thick grammar books; it's about relaxing the jaw, mastering natural rhythm, and building muscle memory in a friendly, zero-judgment environment.",
  teachingPhilosophyTh: "การพูดภาษาอังกฤษให้คล่องไม่ใช่การท่องตำราแกรมม่าหนาๆ แต่คือการเข้าใจจังหวะเสียง (Stress & Rhythm) และฝึกกล้ามเนื้อปากในบรรยากาศที่เป็นกันเอง สบายใจ และไม่มีการตัดสิน"
};

export const ONLINE_COURSES: OnlineCourse[] = [
  {
    id: "course-a1",
    titleEn: "A1 - Beginner",
    titleTh: "A1 - Beginner",
    subtitleEn: "Build a strong foundation. Learn basic greetings, essential grammar, and daily life survival English.",
    subtitleTh: "วางพื้นฐานให้แน่น ตั้งแต่การทักทาย แกรมม่าพื้นฐาน และประโยคใช้จริงในชีวิตประจำวัน",
    descriptionEn: "The perfect starting point for anyone who wants to build confidence from zero. Focus on pronunciation and essential vocabulary.",
    descriptionTh: "จุดเริ่มต้นที่สมบูรณ์แบบสำหรับผู้ที่ต้องการเริ่มจากศูนย์ เน้นการออกเสียงและคำศัพท์ที่จำเป็นที่สุด",
    coverImage: "https://images.unsplash.com/photo-1546410531-bb4caa1b424d?w=600&auto=format&fit=crop&q=80",
    level: "A1 - Beginner",
    lessonsCount: 20,
    durationHours: "8 ชั่วโมง",
    priceThb: 1490,
    originalPriceThb: 2900,
    isComingSoon: true,
    studentsCount: 0,
    rating: 5.0,
    highlightsEn: [
      "Foundational Grammar for Thai Speakers",
      "Basic Daily Conversation Scenarios",
      "Phonetic Alphabet Introduction",
      "Essential 500 Vocabulary Words"
    ],
    highlightsTh: [
      "แกรมม่าพื้นฐานที่ออกแบบมาเพื่อคนไทยโดยเฉพาะ",
      "สถานการณ์จำลองการคุยในชีวิตประจำวัน",
      "ปูพื้นฐานการออกเสียง (Phonetics)",
      "คลังคำศัพท์จำเป็น 500 คำแรก"
    ],
    handoutPdfName: "A1_Beginner_Grammar_and_Vocab_Handbook.pdf",
    handoutPdfSize: "2.8 MB",
    syllabus: []
  },
  {
    id: "course-a2",
    titleEn: "A2 - Pre Intermediate",
    titleTh: "A2 - Pre Intermediate",
    subtitleEn: "Expand your vocabulary, speak in full sentences, and express opinions with ease.",
    subtitleTh: "เพิ่มคลังคำศัพท์ เชื่อมประโยคให้ยาวขึ้น และเริ่มแสดงความคิดเห็นได้อย่างเป็นธรรมชาติ",
    descriptionEn: "Step beyond basic memorization. Learn conversational connectors, past and future tenses, and natural conversation flow.",
    descriptionTh: "ก้าวข้ามการท่องจำแบบเดิมๆ ฝึกใช้คำเชื่อม และการเล่าเรื่องในอดีต-อนาคตได้อย่างเป็นธรรมชาติ",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    level: "A2 - Pre Intermediate",
    lessonsCount: 25,
    durationHours: "10 ชั่วโมง",
    priceThb: 1890,
    originalPriceThb: 3500,
    isComingSoon: true,
    studentsCount: 0,
    rating: 5.0,
    highlightsEn: [
      "Past & Future Tense Speaking Practice",
      "Natural Conversational Connectors",
      "Asking Follow-up Questions Politely",
      "Everyday Social English"
    ],
    highlightsTh: [
      "ฝึกเล่าเรื่องในอดีตและอนาคตอย่างมั่นใจ",
      "คำเชื่อมประโยคให้พูดได้ลื่นไหลเหมือนเจ้าของภาษา",
      "เทคนิคการถามคำถามต่อบทสนทนาอย่างสุภาพ",
      "ภาษาอังกฤษสำหรับการเข้าสังคม"
    ],
    handoutPdfName: "A2_Pre_Intermediate_Workbook.pdf",
    handoutPdfSize: "3.4 MB",
    syllabus: []
  },
  {
    id: "course-b1",
    titleEn: "B1 - Intermediate",
    titleTh: "B1 - Intermediate",
    subtitleEn: "Master workplace communication, discuss abstract ideas, and eliminate Thai-English speech patterns.",
    subtitleTh: "สื่อสารในการทำงานได้อย่างมืออาชีพ ถกประเด็นต่างๆ และแก้ปัญหาสำเนียงไทยติดขัด",
    descriptionEn: "Designed for professionals and university students who want to speak confidently in meetings, presentations, and social events.",
    descriptionTh: "ออกแบบเพื่อคนทำงานและนักศึกษาที่ต้องการพรีเซนต์งานและประชุมกับชาวต่างชาติได้อย่างคล่องแคล่ว",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
    level: "B1 - Intermediate",
    lessonsCount: 30,
    durationHours: "12 ชั่วโมง",
    priceThb: 2290,
    originalPriceThb: 4200,
    isComingSoon: true,
    studentsCount: 0,
    rating: 5.0,
    highlightsEn: [
      "Business Meetings & Email Phrasing",
      "Expressing Nuanced Opinions",
      "Overcoming the Translating Barrier",
      "Advanced Pronunciation Linking"
    ],
    highlightsTh: [
      "ประโยคใช้จริงในการประชุมและเขียนอีเมลธุรกิจ",
      "การแสดงความคิดเห็นและเสนอแนะอย่างสุภาพ",
      "เทคนิคการคิดเป็นภาษาอังกฤษโดยไม่ต้องแปลในหัว",
      "การเชื่อมเสียง (Connected Speech) แบบมือโปร"
    ],
    handoutPdfName: "B1_Intermediate_Professional_Guide.pdf",
    handoutPdfSize: "4.1 MB",
    syllabus: []
  },
  {
    id: "course-b2",
    titleEn: "B2 - Upper Intermediate",
    titleTh: "B2 - Upper Intermediate",
    subtitleEn: "Fluency without translation. Debate, persuade, and express complex professional viewpoints effortlessly.",
    subtitleTh: "พูดคล่องระดับสากล นำเสนอ ถกประเด็นเชิงลึก และโน้มน้าวใจในที่ทำงานได้อย่างมั่นใจ",
    descriptionEn: "Reach international fluency. Polish your accent, expand your business vocabulary, and express sophisticated concepts.",
    descriptionTh: "ยกระดับสู่ความคล่องแคล่วระดับสากล ปรับสำเนียงให้ชัดเป๊ะ พร้อมคลังคำศัพท์ระดับสูงสำหรับผู้บริหารและผู้นำ",
    coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    level: "B2 - Upper Intermediate",
    lessonsCount: 35,
    durationHours: "14 ชั่วโมง",
    priceThb: 2790,
    originalPriceThb: 5200,
    isComingSoon: true,
    studentsCount: 0,
    rating: 5.0,
    highlightsEn: [
      "Executive Presentation & Pitching",
      "Idiomatic & Colloquial Mastery",
      "Negotiation & Conflict Resolution",
      "Accent Reduction & Speech Rhythm"
    ],
    highlightsTh: [
      "เทคนิคการพรีเซนต์ระดับผู้บริหารและการ Pitching",
      "การใช้สำนวนและแสลงอย่างถูกต้องถูกกาลเทศะ",
      "การเจรจาต่อรองและแก้ปัญหาเฉพาะหน้าในการทำงาน",
      "การปรับจังหวะการพูด (Speech Rhythm & Intonation)"
    ],
    handoutPdfName: "B2_Upper_Intermediate_Mastery_Pack.pdf",
    handoutPdfSize: "5.0 MB",
    syllabus: []
  }
];

export const PRIVATE_PACKAGES: PrivatePackage[] = [
  {
    id: "pkg-1",
    nameEn: "Single Session (Trial / Urgent Prep)",
    nameTh: "แพ็กเกจ 1 คาบ (ทดลองเรียน / เตรียมตัวด่วน)",
    subtitleEn: "Perfect for a single interview prep or getting a diagnostic assessment from Teacher Kym.",
    subtitleTh: "เหมาะสำหรับเตรียมสอบสัมภาษณ์งานเร่งด่วน หรือต้องการประเมินระดับภาษาแบบตัวต่อตัว",
    sessionsCount: 1,
    sessionDuration: "60 นาที / คาบ",
    priceThb: 650,
    pricePerSessionThb: 650,
    originalPriceThb: 950,
    popular: false,
    badgeTh: "ทดลองเรียน",
    badgeEn: "Trial / Single",
    featuresEn: [
      "1 full 60-minute private 1-on-1 live coaching session",
      "Customized lesson tailored directly to your immediate goals",
      "Real-time pronunciation and accent correction",
      "Classroom notes & tailored vocabulary summary sheet"
    ],
    featuresTh: [
      "เรียนสดตัวต่อตัว 1 คาบ คาบละ 60 นาทีเต็ม",
      "เนื้อหาออกแบบเฉพาะตามเป้าหมายของผู้เรียน (เช่น ซ้อมสัมภาษณ์, ซ้อมพรีเซนต์)",
      "แก้ไขการออกเสียงและข้อผิดพลาดแบบสดๆ ตรงจุด",
      "รับสรุปคำศัพท์และจุดที่ต้องปรับปรุงหลังจบคลาส"
    ],
    targetAudienceEn: "Best for urgent interview practice, presentation rehearsals, or testing 1-on-1 coaching.",
    targetAudienceTh: "เหมาะสำหรับผู้ที่ต้องการซ้อมด่วน หรือทดลองเรียนก่อนลงคอร์สยาว"
  },
  {
    id: "pkg-5",
    nameEn: "5-Session Fluency Booster",
    nameTh: "แพ็กเกจ 5 คาบ (Fluency Booster)",
    subtitleEn: "Our most popular coaching pack. Enough time to break the translating habit and build natural speaking rhythm.",
    subtitleTh: "แพ็กเกจยอดนิยมสูงสุด ช่วยปรับสำเนียงและฝึกพูดให้เป็นธรรมชาติโดยไม่ต้องแปลในหัว",
    sessionsCount: 5,
    sessionDuration: "60 นาที / คาบ",
    priceThb: 2950,
    pricePerSessionThb: 590,
    originalPriceThb: 4500,
    popular: true,
    badgeTh: "ยอดนิยม 🔥",
    badgeEn: "Most Popular",
    featuresEn: [
      "5 full 60-minute private 1-on-1 live coaching sessions",
      "Personalized speaking syllabus created by Teacher Kym",
      "Pronunciation & rhythm training for Thai native speakers",
      "Detailed session notes & homework feedback via LINE",
      "Flexible rescheduling up to 12 hours in advance"
    ],
    featuresTh: [
      "เรียนสดตัวต่อตัว 5 คาบ คาบละ 60 นาทีเต็ม (จัดตารางได้ยืดหยุ่น)",
      "ครูคิมจัดทำแผนการเรียนเฉพาะบุคคลตามระดับและเป้าหมาย",
      "เน้นแก้จุดติดขัดของการออกเสียงคนไทยอย่างตรงจุด",
      "ส่งสรุปคำศัพท์และข้อปรับปรุงหลังเลิกเรียนทุกครั้งทาง LINE",
      "เลื่อนเวลาเรียนได้ล่วงหน้า 12 ชั่วโมง"
    ],
    targetAudienceEn: "Recommended for working professionals aiming for measurable speaking improvement within 1 month.",
    targetAudienceTh: "แนะนำสำหรับคนทำงานที่ต้องการเห็นผลการพูดคล่องขึ้นอย่างชัดเจนใน 1 เดือน"
  },
  {
    id: "pkg-10",
    nameEn: "10-Session Complete Mastery",
    nameTh: "แพ็กเกจ 10 คาบ (Complete Mastery)",
    subtitleEn: "Complete English transformation for long-term career growth, study abroad, and international confidence.",
    subtitleTh: "แพ็กเกจคุ้มค่าที่สุด ปรับเปลี่ยนทักษะภาษาอังกฤษรอบด้านเพื่อความก้าวหน้าในอาชีพ",
    sessionsCount: 10,
    sessionDuration: "60 นาที / คาบ",
    priceThb: 5400,
    pricePerSessionThb: 540,
    originalPriceThb: 8900,
    popular: false,
    badgeTh: "คุ้มค่าที่สุด (ลดพิเศษ)",
    badgeEn: "Best Value",
    featuresEn: [
      "10 full 60-minute private 1-on-1 live coaching sessions",
      "End-to-end fluency transformation covering business, casual & pronunciation",
      "Mock interview / presentation simulations with detailed scoring",
      "Priority booking slots (evenings & weekends available)",
      "Free access to Beyond Borders Online Course Materials"
    ],
    featuresTh: [
      "เรียนสดตัวต่อตัว 10 คาบ คาบละ 60 นาทีเต็ม (เรียนได้ยาวนาน 6 เดือน)",
      "ครอบคลุมทุกมิติ: ภาษาอังกฤษธุรกิจ การออกเสียง และการคุยอย่างมั่นใจ",
      "จำลองสถานการณ์จริง (Mock Interview / Pitching) พร้อมเกรดประเมิน",
      "สิทธิ์เลือกเวลาเรียนรอบไพรม์ไทม์ (ช่วงเย็นและวันหยุด) ก่อนใคร",
      "รับเอกสารประกอบการเรียนและคลังความรู้ฟรีตลอดชีพ"
    ],
    targetAudienceEn: "The ultimate program for long-term career advancement and complete fluency.",
    targetAudienceTh: "เหมาะสำหรับผู้ที่ต้องการเปลี่ยนทักษะภาษาอังกฤษอย่างถาวรเพื่อความก้าวหน้าในอาชีพ"
  }
];

export const VOCABULARY_LIST: VocabWord[] = [
  {
    id: "v-1",
    word: "comfortable",
    phonetic: "/ˈkʌm.fə.tə.bəl/ or /ˈkʌmf.tə.bəl/",
    thaiPhonetic: "คั้มฟ์-เทอะ-เบิ้ล",
    partOfSpeech: "adjective",
    meaningEn: "Providing physical ease and relaxation",
    meaningTh: "สะดวกสบาย ผ่อนคลาย สบายตัว",
    exampleEn: "This chair is extremely comfortable to work in all day.",
    exampleTh: "เก้าอี้ตัวนี้นั่งทำงานสบายมากๆ ทั้งวัน",
    category: "mistakes",
    difficulty: "easy",
    thaiTip: "คนไทยมักออก 4 พยางค์ 'คอม-ฟอร์-เท-เบิล' แต่ฝรั่งออกเสียงเพียง 3 พยางค์คือ 'คั้มฟ์-เทอะ-เบิ้ล' เน้นหนักที่พยางค์แรก",
    isSaved: true
  },
  {
    id: "v-2",
    word: "appreciate",
    phonetic: "/əˈpriː.ʃi.eɪt/",
    thaiPhonetic: "เออะ-พรี-ชิ-เอท",
    partOfSpeech: "verb",
    meaningEn: "To recognize the full worth of something or be grateful for",
    meaningTh: "ซาบซึ้ง ขอบคุณ เห็นคุณค่า",
    exampleEn: "I really appreciate your quick turnaround on this task.",
    exampleTh: "ฉันซาบซึ้งและขอบคุณมากที่คุณส่งงานกลับมาอย่างรวดเร็ว",
    category: "work",
    difficulty: "medium",
    thaiTip: "เสียง 'sh' ตรงกลางให้ออกเสียงคล้าย ช.ช้าง นุ่มๆ ไม่ใช่ 'เอพ-พริ-ซี-เอท' ใช้แทน Thank you เพื่อเพิ่มความเป็นมืออาชีพ",
    isSaved: true
  },
  {
    id: "v-3",
    word: "borrow vs lend",
    phonetic: "/ˈbɒr.əʊ/ vs /lend/",
    thaiPhonetic: "บอ-โรว (ยืม) vs เลนด์ (ให้ยืม)",
    partOfSpeech: "verb",
    meaningEn: "Borrow = to take temporarily; Lend = to give temporarily",
    meaningTh: "Borrow = ขอยืมจากคนอื่น, Lend = ให้คนอื่นยืม (คนไทยมักใช้สลับกัน)",
    exampleEn: "Can I borrow your charger? vs Could you lend me your charger?",
    exampleTh: "ฉันขอยืมสายชาร์จคุณได้ไหม? vs คุณช่วยให้ฉันยืมสายชาร์จได้ไหม?",
    category: "mistakes",
    difficulty: "easy",
    thaiTip: "จำง่ายๆ: Borrow คือรับเข้ามา (ขอยืม), Lend คือส่งออกไป (ให้ยืม)",
    isSaved: false
  },
  {
    id: "v-4",
    word: "actionable",
    phonetic: "/ˈæk.ʃən.ə.bəl/",
    thaiPhonetic: "แอค-เชิน-เนอะ-เบิ้ล",
    partOfSpeech: "adjective",
    meaningEn: "Giving sufficient information to be put into concrete action",
    meaningTh: "ที่นำไปลงมือปฏิบัติจริงได้ มีขั้นตอนชัดเจน",
    exampleEn: "Please provide three actionable steps we can execute this week.",
    exampleTh: "กรุณาระบุ 3 ขั้นตอนที่สามารถนำไปลงมือทำได้จริงในสัปดาห์นี้",
    category: "work",
    difficulty: "medium",
    thaiTip: "คำยอดนิยมในการประชุมสายเทคและการตลาดสากล มักใช้คู่กับ feedback หรือ steps",
    isSaved: true
  },
  {
    id: "v-5",
    word: "under the weather",
    phonetic: "/ˈʌn.də ðə ˈweð.ər/",
    thaiPhonetic: "อัน-เดอะ-เวธ-เธอร์",
    partOfSpeech: "idiom",
    meaningEn: "Slightly unwell, sick, or tired",
    meaningTh: "รู้สึกไม่ค่อยสบาย ครั่นเนื้อครั่นตัว",
    exampleEn: "I'm feeling a bit under the weather today, so I will join remotely.",
    exampleTh: "วันนี้ฉันรู้สึกครั่นเนื้อครั่นตัวนิดหน่อย เลยขอร่วมประชุมทางออนไลน์นะคะ",
    category: "idioms",
    difficulty: "medium",
    thaiTip: "ใช้แทน 'I am sick' จะฟังดูเป็นธรรมชาติและมีความสุภาพอย่างมาก",
    isSaved: false
  }
];

export const TESTIMONIALS = [
  {
    id: "test-1",
    name: "คุณธนภัทร (ภัทร)",
    roleTh: "Senior Software Engineer",
    roleEn: "Senior Software Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    courseTakenTh: "คอร์สภาษาอังกฤษธุรกิจ + เรียนตัวต่อตัว 5 คาบ",
    courseTakenEn: "Workplace English Course + 5 Private 1-on-1 Sessions",
    quoteTh: "เรียนตัวต่อตัวกับครูคิมตรงจุดมากครับ ครูเข้าใจเลยว่าทำไมคนไทยถึงพูดติดขัดหรือกลัวพูดผิดในที่ประชุม หลังเรียน 5 คาบ ตอนนี้ผมพรีเซนต์กับทีมต่างชาติได้อย่างมั่นใจ ไหลลื่นขึ้นเยอะมากครับ",
    quoteEn: "1-on-1 coaching with Teacher Kym was directly on point. He understands exactly why Thais hesitate in international meetings. Now I lead presentations with our global team effortlessly."
  },
  {
    id: "test-2",
    name: "คุณนลินรัตน์ (แพรว)",
    roleTh: "Flight Attendant Candidate",
    roleEn: "Flight Attendant Candidate",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    courseTakenTh: "คอร์สปรับสำเนียง & การออกเสียง + ติวตัวต่อตัว 10 คาบ",
    courseTakenEn: "Pronunciation Mastery + 10 Private 1-on-1 Sessions",
    quoteTh: "คอร์สออนไลน์ของครูช่วยปูพื้นฐานการออกเสียงให้เข้าใจง่ายมากๆ พอมารวมกับการซ้อมสัมภาษณ์สด 1 ต่อ 1 ครูช่วยปรับแก้คำเชื่อมและบุคลิกการพูดจนผ่านการคัดเลือกรอบสัมภาษณ์สายการบินได้สำเร็จค่ะ!",
    quoteEn: "The course gave me crystal clear pronunciation rules. Combined with 1-on-1 mock interviews, Teacher Kym polished my tone and phrasing until I passed my airline interview!"
  },
  {
    id: "test-3",
    name: "คุณกิตติศักดิ์ (เบนซ์)",
    roleTh: "เจ้าของธุรกิจนำเข้า-ส่งออก (Chiang Mai)",
    roleEn: "Import/Export Business Owner (Chiang Mai)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    courseTakenTh: "แพ็กเกจเรียนส่วนตัว 10 คาบ",
    courseTakenEn: "10-Session Private 1-on-1 Package",
    quoteTh: "เดิมทีผมคิดว่าคนวัย 40+ คงฝึกพูดอังกฤษยากแล้ว แต่ครูคิมใจเย็นมาก อธิบายด้วยวิธีที่เข้าถึงง่าย ไม่เครียด ปัจจุบันสามารถเดินทางไปเจรจาคู่ค้าที่ต่างประเทศได้เองอย่างมั่นใจครับ",
    quoteEn: "At 40+, I thought it was too late to learn speaking. Teacher Kym is extremely patient and makes everything simple. I now negotiate with overseas suppliers myself with confidence."
  }
];
