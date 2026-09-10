import { Injectable, signal, computed, effect } from '@angular/core';

export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'medlink_preferred_lang';

  // Language Signals
  currentLang = signal<Language>(this.getInitialLang());
  isRtl = computed(() => this.currentLang() === 'ar');
  dir = computed(() => (this.currentLang() === 'ar' ? 'rtl' : 'ltr'));

  private dictionary: Translations = {
    // Navigation & Common
    'app.title': { en: 'MEDLINK', ar: 'ميدلينك' },
    'app.tagline': { en: 'Clinical Healthcare Network', ar: 'شبكة الرعاية الصحية الإكلينيكية' },
    'nav.home': { en: 'Overview', ar: 'الرئيسية' },
    'nav.capabilities': { en: 'Platform', ar: 'المنظومة' },
    'nav.doctors': { en: 'Specialists', ar: 'الأطباء' },
    'nav.patient_exp': { en: 'For Patients', ar: 'للمرضى' },
    'nav.doctor_exp': { en: 'For Doctors', ar: 'للأطباء' },
    'nav.security': { en: 'Security & Trust', ar: 'الأمان والخصوصية' },
    'nav.signin': { en: 'Sign In', ar: 'تسجيل الدخول' },
    'nav.getstarted': { en: 'Create Account', ar: 'ابدأ الآن' },
    'nav.dashboard': { en: 'Open Dashboard', ar: 'لوحة التحكم' },
    'nav.logout': { en: 'Sign Out', ar: 'تسجيل الخروج' },
    'nav.switch_lang': { en: 'العربية', ar: 'English' },

    // Landing Page Hero
    'hero.badge': { en: 'Enterprise Digital Healthcare Infrastructure', ar: 'البنية التحتية الرقمية المعتمدة للرعاية الصحية' },
    'hero.title_part1': { en: 'Intelligent Healthcare Infrastructure for', ar: 'منظومة الرعاية الصحية الذكية للربط بين' },
    'hero.title_part2': { en: 'Patients & Clinicians.', ar: 'المرضى والأطباء المعتمدين.' },
    'hero.desc': {
      en: 'MEDLINK unifies patients, certified physicians, and clinical practices with enterprise-grade precision. Access lifetime electronic health records, schedule verified consultations, and manage tamper-proof digital prescriptions.',
      ar: 'تربط ميدلينك بين المرضى، والأطباء المعتمدين، والمراكز الطبية عبر منصة إكلينيكية متطورة وموحدة. وصول كامل للسجلات الطبية المشفرة، حجز الاستشارات الموثقة، وإدارة الروشتات الرقمية الآمنة.'
    },
    'hero.cta_patient': { en: 'Get Started as Patient', ar: 'إنشاء حساب مريض' },
    'hero.cta_doctors': { en: 'Explore Medical Specialists', ar: 'استكشف نخبة الأطباء' },
    'hero.cta_doctor_login': { en: 'Doctor Hub Login', ar: 'دخول بوابة الطبيب' },

    // Hero Floating Visuals
    'hero.stat_verified_doctors': { en: '100% Syndicate Verified', ar: 'أطباء معتمدون من النقابة ١٠٠٪' },
    'hero.stat_encryption': { en: 'AES-256 Encrypted EHR', ar: 'سجلات طبية مشفرة ٢٥٦-بت' },
    'hero.stat_fast_booking': { en: '< 60s Slot Allocation', ar: 'حجز موعد فوري في ثوانٍ' },
    'hero.doctor_preview_specialty': { en: 'Consultant Cardiologist • MD, PhD', ar: 'استشاري أمراض القلب والأوعية الدموية' },
    'hero.doctor_rating': { en: '4.98 (450+ verified reviews)', ar: '٤.٩٨ (أكثر من ٤٥٠ تقييم معتمد)' },

    // Trust & Standards Banner
    'trust.headline': { en: 'Built upon Gold-Standard Clinical Principles', ar: 'مصممة وفق أعلى المعايير الإكلينيكية المعتمدة' },
    'trust.standard1_title': { en: 'Syndicate Certified', ar: 'ترخيص نقابة الأطباء' },
    'trust.standard1_desc': { en: 'Strict credential verification for all practicing doctors', ar: 'توثيق دقيق لتراخيص مزاولة المهنة لجميع الأطباء' },
    'trust.standard2_title': { en: 'HIPAA & GDPR Standards', ar: 'معايير الخصوصية العالمية' },
    'trust.standard2_desc': { en: 'Full encryption in transit and at rest with role-based access', ar: 'تشفير كامل للبيانات وأذونات وصول محددة الصلاحية' },
    'trust.standard3_title': { en: '99.99% Clinical Uptime', ar: 'جاهزية المنظومة ٩٩.٩٩٪' },
    'trust.standard3_desc': { en: 'High-availability infrastructure for critical medical access', ar: 'بنية تحتية سحابية موثوقة لضمان استمرارية الخدمات' },
    'trust.standard4_title': { en: 'Zero Paper Prescriptions', ar: 'روشتات رقمية مؤمنة' },
    'trust.standard4_desc': { en: 'Tamper-proof digital regimens with verifiable barcodes', ar: 'منظومة وصفات إلكترونية رقمية لمنع التلاعب وتكرار الصرف' },

    // Core Platform Capabilities
    'caps.badge': { en: 'Core Platform Capabilities', ar: 'قدرات المنظومة الأساسية' },
    'caps.title': { en: 'Engineered for Complete Clinical Precision', ar: 'مصممة لدقة إكلينيكية متكاملة' },
    'caps.subtitle': { en: 'Every tool required to modernise patient-doctor interactions in one seamless ecosystem.', ar: 'كافة الأدوات التقنية المتطورة لتنظيم العلاقة بين المريض والطبيب في منصة واحدة.' },
    
    'caps.sched_title': { en: 'Precision Slot Scheduling', ar: 'جدولة دقيقة للمواعيد' },
    'caps.sched_desc': { en: 'Real-time appointment engine with automated queue management, instant slot booking, and zero double-booking.', ar: 'محرك حجز مواعيد فوري مع إدارة ذكية لطابور الانتظار وتحديث الأوقات المتاحة لحظياً.' },
    
    'caps.rx_title': { en: 'Digital E-Prescriptions', ar: 'روشتات إلكترونية مشفرة' },
    'caps.rx_desc': { en: 'Structured dosage guidelines, duration, frequency, and tamper-proof digital authorization barcodes.', ar: 'تعليمات الجرعات التفصيلية، مدة العلاج، وتوليد باركود رقمي مؤمن لصرف الدواء بدقة.' },
    
    'caps.ehr_title': { en: 'Unified Lifetime Health Records', ar: 'السجل الطبي الإلكتروني الموحد' },
    'caps.ehr_desc': { en: 'Encrypted storage for lab reports, radiology imaging, clinical summaries, and patient visit history.', ar: 'أرشفة سحابية مشفرة لنتائج التحاليل، الأشعة، تقارير الفحص، والتاريخ المرضي للمريض.' },
    
    'caps.soap_title': { en: 'SOAP Clinical Documentation', ar: 'توثيق الفحص الطبي الإكلينيكي' },
    'caps.soap_desc': { en: 'Standardized Subjective, Objective, Assessment, and Plan workflow for structured physician records.', ar: 'نموذج SOAP المعتمد لتوثيق شكوى المريض، الفحص الإكلينيكي، التشخيص، وخطة العلاج.' },

    // Patient Experience Section
    'patient_exp.badge': { en: 'Patient Experience', ar: 'تجربة المريض' },
    'patient_exp.title': { en: 'Effortless, Dignified Healthcare Management', ar: 'رعاية صحية سهلة ومريحة في متناول يدك' },
    'patient_exp.step1_title': { en: 'Discover Certified Specialists', ar: 'البحث عن الأطباء المعتمدين' },
    'patient_exp.step1_desc': { en: 'Filter doctors by specialty, syndicate verification, ratings, and consultation fees.', ar: 'فرز وبحث دقيق حسب التخصص، التقييمات، وتكلفة الاستشارة.' },
    'patient_exp.step2_title': { en: 'Instant Appointment Confirmation', ar: 'تأكيد فوري للحجز' },
    'patient_exp.step2_desc': { en: 'Select your preferred time slot and receive instant digital confirmation and reminders.', ar: 'اختيار الموعد المناسب وتأكيده فوراً مع استلام إشعارات التذكير.' },
    'patient_exp.step3_title': { en: 'Continuous Care & Records', ar: 'متابعة مستمرة وسجلات دائمة' },
    'patient_exp.step3_desc': { en: 'Access your prescriptions, diagnoses, and test results anytime from any device.', ar: 'الاطلاع على روشتاتك وتقاريرك الطبية في أي وقت ومن أي جهاز.' },

    // Doctor Experience Section
    'doctor_exp.badge': { en: 'Clinician Suite', ar: 'بوابة الطبيب الإكلينيكية' },
    'doctor_exp.title': { en: 'A Professional Cockpit for Modern Practice', ar: 'بيئة عمل متطورة لإدارة ممارستك الطبية' },
    'doctor_exp.feat1_title': { en: 'Rapid Patient Roster', ar: 'قائمة المرضى الإكلينيكية' },
    'doctor_exp.feat1_desc': { en: 'Instantly view verified patient history, allergies, and prior clinical encounters.', ar: 'اطلاع سريع على تاريخ المريض، الحساسيات الدوائية، والزيارات السابقة.' },
    'doctor_exp.feat2_title': { en: 'Dynamic Schedule Control', ar: 'التحكم المرن في أوقات العمل' },
    'doctor_exp.feat2_desc': { en: 'Configure consultation durations, active clinic days, and off-duty periods effortlessly.', ar: 'تحديد فترات الكشف، أيام العمل في العيادات، وأوقات الإجازات بسهولة.' },
    'doctor_exp.feat3_title': { en: 'Instant E-Prescribing', ar: 'إصدار وتوقيع الروشتات الرقمية' },
    'doctor_exp.feat3_desc': { en: 'Authorise digital prescriptions with dosage instructions in under 30 seconds.', ar: 'تحرير وتوقيع الروشتة الإلكترونية بجرعاتها الدقيقة في ثوانٍ معدودة.' },

    // Security & Privacy Blueprint
    'sec.badge': { en: 'Enterprise Security', ar: 'الأمان والخصوصية' },
    'sec.title': { en: 'Patient Privacy by Architecture, Not Afterthought', ar: 'الخصوصية مبدأ أصيل في تصميم النظام' },
    'sec.point1_title': { en: 'Consent-Governed Data Isolation', ar: 'مشاركة البيانات بموافقة المريض فقط' },
    'sec.point1_desc': { en: 'Physicians only access patient records when explicit, time-bound consent is granted by the patient.', ar: 'لا يمكن للطبيب الاطلاع على السجلات إلا بموافقة صريحة ومحددة بوقت من المريض.' },
    'sec.point2_title': { en: 'Multi-Device Session Tracking', ar: 'تتبع وإدارة جلسات الأجهزة' },
    'sec.point2_desc': { en: 'Live monitoring of active sessions with instant one-click remote revocation of untrusted devices.', ar: 'مراقبة الجلسات المفتوحة مع إمكانية إنهاء الجلسة لأي جهاز غير موثوق بضغطة زر.' },
    'sec.point3_title': { en: 'Immutable Audit Logging', ar: 'سجل تدقيق أمني غير قابل للتعديل' },
    'sec.point3_desc': { en: 'Every clinical interaction, login, and record view is permanently logged for complete accountability.', ar: 'تسجيل دقيق لكل عملية دخول أو اطلاع على السجلات لضمان المساءلة والامتثال.' },

    // Final CTA Banner
    'cta.title': { en: 'Experience the Next Standard in Digital Healthcare', ar: 'انضم إلى مستقبل الرعاية الصحية الرقمية اليوم' },
    'cta.subtitle': { en: 'Join thousands of patients and certified physicians building a healthier, more connected tomorrow.', ar: 'انضم إلى آلاف المرضى والأطباء المعتمدين في تجربة صحية رقمية موحدة.' },
    'cta.btn_patient': { en: 'Register as Patient', ar: 'تسجيل حساب مريض' },
    'cta.btn_doctor': { en: 'Doctor Access', ar: 'دخول الأطباء' },

    // Footer
    'footer.desc': {
      en: 'MEDLINK is the next-generation integrated healthcare infrastructure uniting patients, medical practitioners, and health institutions.',
      ar: 'ميدلينك هي البنية التحتية الرقمية الرائدة للرعاية الصحية، تجمع المرضى والأطباء والمراكز الطبية في منصة موحدة.'
    },
    'footer.portals': { en: 'Portals', ar: 'البوابات' },
    'footer.patient_portal': { en: 'Patient Portal', ar: 'بوابة المريض' },
    'footer.doctor_portal': { en: 'Doctor Hub', ar: 'بوابة الطبيب' },
    'footer.admin_portal': { en: 'Admin Central', ar: 'لوحة الإدارة' },
    'footer.standards': { en: 'Clinical Standards', ar: 'المعايير الإكلينيكية' },
    'footer.rights': { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },

    // Auth Pages
    'auth.welcome_back': { en: 'Welcome to MEDLINK', ar: 'مرحباً بك في ميدلينك' },
    'auth.signin_subtitle': { en: 'Sign in to access your secure clinical portal', ar: 'سجل الدخول للوصول إلى بوابتك الصحية الآمنة' },
    'auth.email': { en: 'Email Address', ar: 'البريد الإلكتروني' },
    'auth.password': { en: 'Password', ar: 'كلمة المرور' },
    'auth.forgot_pass': { en: 'Forgot Password?', ar: 'نسيت كلمة المرور؟' },
    'auth.signing_in': { en: 'Authenticating...', ar: 'جاري التحقق...' },
    'auth.signin_btn': { en: 'Sign In to Account', ar: 'تسجيل الدخول' },
    'auth.no_account': { en: "Don't have an account?", ar: 'ليس لديك حساب؟' },
    'auth.create_account': { en: 'Create Patient Account', ar: 'إنشاء حساب مريض' },
    'auth.already_have_account': { en: 'Already registered?', ar: 'لديك حساب بالفعل؟' },
    'auth.register_title': { en: 'Create Patient Account', ar: 'إنشاء حساب مريض جديد' },
    'auth.register_subtitle': { en: 'Register to access connected clinical care and records', ar: 'انضم إلى ميدلينك للاستفادة من خدمات الرعاية الصحية وسجلاتك الطبية' },
    'auth.fname': { en: 'First Name', ar: 'الاسم الأول' },
    'auth.lname': { en: 'Last Name', ar: 'اسم العائلة' },
    'auth.phone': { en: 'Phone Number (Egyptian)', ar: 'رقم الهاتف (مصر)' },
    'auth.gender': { en: 'Gender', ar: 'النوع' },
    'auth.gender_male': { en: 'Male', ar: 'ذكر' },
    'auth.gender_female': { en: 'Female', ar: 'أنثى' },
    'auth.gender_other': { en: 'Other', ar: 'آخر' },
    'auth.dob': { en: 'Date of Birth', ar: 'تاريخ الميلاد' },
    'auth.creating_account': { en: 'Creating Account...', ar: 'جاري إنشاء الحساب...' },
    'auth.register_btn': { en: 'Register Account', ar: 'تسجيل الحساب' },
    'auth.verify_title': { en: 'Verify Email', ar: 'تأكيد البريد الإلكتروني' },
    'auth.verify_subtitle': { en: 'Enter the 6-digit confirmation code sent to your email', ar: 'أدخل رمز التأكيد المكون من 6 أرقام المرسل إلى بريدك' },
    'auth.code': { en: '6-Digit Verification Code', ar: 'رمز التأكيد (6 أرقام)' },
    'auth.verify_btn': { en: 'Activate Account', ar: 'تفعيل الحساب' },
    'auth.resend_btn': { en: 'Resend 6-Digit Code', ar: 'إعادة إرسال الرمز' },
    'auth.forgot_title': { en: 'Reset Password', ar: 'استعادة كلمة المرور' },
    'auth.forgot_subtitle': { en: 'Enter your email to receive a password reset token', ar: 'أدخل بريدك الإلكتروني لاستلام رمز إعادة التعيين' },
    'auth.reset_title': { en: 'Set New Password', ar: 'تعيين كلمة مرور جديدة' },
    'auth.reset_token': { en: 'Reset Token', ar: 'رمز إعادة التعيين' },
    'auth.new_password': { en: 'New Password', ar: 'كلمة المرور الجديدة' },

    // Dashboards & Portals
    'portal.patient': { en: 'Patient Portal', ar: 'بوابة المريض' },
    'portal.doctor': { en: 'Doctor Hub', ar: 'بوابة الطبيب' },
    'portal.admin': { en: 'Admin Central', ar: 'مركز الإدارة' },
    'dash.welcome': { en: 'Welcome back', ar: 'مرحباً بعودتك' },
    'dash.welcome_doctor': { en: 'Dr.', ar: 'د.' },
    'dash.patient_desc': { en: 'Manage appointments, medical records, and digital prescriptions securely.', ar: 'أدر مواعيدك، سجلاتك الطبية، وروشتاتك الإلكترونية بكل أمان وسرية.' },
    'dash.doctor_desc': { en: 'Clinical Practice Cockpit. Manage queues, clinical encounters, and e-prescribing.', ar: 'بيئة العمل الإكلينيكية. أدر طابور المرضى، جلسات الفحص، والروشتات الرقمية.' },
    'dash.admin_desc': { en: 'Infrastructure oversight, physician verification queue, and user governance.', ar: 'إدارة المنظومة، طابور اعتماد الأطباء، وحوكمة أذونات المستخدمين.' },

    // Sidebar Items
    'menu.overview': { en: 'Overview', ar: 'نظرة عامة' },
    'menu.appointments': { en: 'Appointments', ar: 'المواعيد' },
    'menu.find_doctors': { en: 'Find Doctors', ar: 'البحث عن طبيب' },
    'menu.medical_records': { en: 'Medical Records', ar: 'السجلات الطبية' },
    'menu.prescriptions': { en: 'Prescriptions', ar: 'الروشتات' },
    'menu.documents': { en: 'Clinical Files', ar: 'الملفات والتقارير' },
    'menu.consent': { en: 'Data Consent', ar: 'موافقة البيانات' },
    'menu.notifications': { en: 'Notifications', ar: 'الإشعارات' },
    'menu.messages': { en: 'Messages', ar: 'الرسائل' },
    'menu.profile': { en: 'My Profile', ar: 'الملف الشخصي' },
    'menu.settings': { en: 'Security & Devices', ar: 'الأمان والأجهزة' },
    'menu.patients': { en: 'Patient Roster', ar: 'قائمة المرضى' },
    'menu.encounters': { en: 'SOAP Encounters', ar: 'جلسات الكشف' },
    'menu.schedule': { en: 'Schedule & Slots', ar: 'أوقات العمل' },
    'menu.follow_ups': { en: 'Follow-ups', ar: 'المتابعات' },
    'menu.users': { en: 'User Directory', ar: 'دليل المستخدمين' },
    'menu.doctor_verification': { en: 'Doctor Verification', ar: 'اعتماد الأطباء' },
    'menu.clinics': { en: 'Clinics Registry', ar: 'سجل العيادات' },
    'menu.audit_logs': { en: 'Audit Logs', ar: 'سجلات النشاط' },
    'menu.complaints': { en: 'Complaints', ar: 'الشكاوى' },
    'menu.statistics': { en: 'System Stats', ar: 'إحصائيات النظام' }
  };

  constructor() {
    effect(() => {
      const lang = this.currentLang();
      const isArabic = lang === 'ar';
      
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        
        if (isArabic) {
          document.body.classList.add('is-rtl');
          document.body.classList.remove('is-ltr');
        } else {
          document.body.classList.add('is-ltr');
          document.body.classList.remove('is-rtl');
        }
      }
    });
  }

  private getInitialLang(): Language {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Language;
      if (saved === 'en' || saved === 'ar') {
        return saved;
      }
    }
    return 'en';
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  toggleLanguage(): void {
    const nextLang: Language = this.currentLang() === 'en' ? 'ar' : 'en';
    this.setLanguage(nextLang);
  }

  translate(key: string, fallback?: string): string {
    const item = this.dictionary[key];
    if (item) {
      return item[this.currentLang()] || item.en;
    }
    return fallback !== undefined ? fallback : key;
  }

  t(key: string, fallback?: string): string {
    return this.translate(key, fallback);
  }
}
