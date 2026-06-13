/**
 * Official Portal of Seetharampuram Thanda Gram Panchayat
 * Application Logic & Civic Services Portals
 * Year: 2026
 */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  setTimeout(initAll, 0);
}

function initAll() {
  initSplashScreen();
  initLanguageSelector();
  initHeroTextReveal();
  initModals();
  initMobileNav();
  initMenuDropdown();
  initWelfareEligibility();
  initGrievanceRedressal();
  initInteractiveMap();
  initCropAdvisory();
  initRationSearch();
  initCertificatesPortal();
  initHeroSlider();
  initScrollReveal();
  initScrollHeader();
  initScrollProgress();
  initFaqAccordion();
  initThemeSwitcher();
  initHouseholdUpdates();
  initVoiceAssistant();
  initMainPageDynamicContent();
  initEChoupal();
  initDisasterWarning();
  initTelemedicine();
  initELearning();
  initGovernance();
  initVillageDashboard();

  // Handle opening modal on page load from query param
  const urlParams = new URLSearchParams(window.location.search);
  const modalToOpen = urlParams.get('openModal');
  if (modalToOpen) {
    openModal(modalToOpen);
  }
}

/* ==========================================
   WELCOME SPLASH SCREEN
   ========================================== */
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) {
    initParticles();
    return;
  }

  // Split splash title into staggered characters
  const splashTitle = splash.querySelector('.splash-title');
  if (splashTitle) {
    const text = splashTitle.textContent.trim();
    splashTitle.textContent = '';
    const segmenter = typeof Intl.Segmenter !== 'undefined'
      ? new Intl.Segmenter('en', { granularity: 'grapheme' })
      : null;
    const chars = segmenter
      ? Array.from(segmenter.segment(text)).map(s => s.segment)
      : [...text];
    chars.forEach((char, idx) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'splash-char';
      span.style.animationDelay = `${idx * 60}ms`;
      splashTitle.appendChild(span);
    });
  }

  let transitionTriggered = false;

  const triggerTransition = () => {
    if (transitionTriggered) return;
    transitionTriggered = true;

    splash.classList.add('fade-out');
    document.body.classList.remove('splash-active');
    document.body.classList.add('ready');

    // Initialize background particles when splash transition starts
    initParticles();

    // Trigger staggered letters reveal on main page
    triggerHeroReveal();

    // Clean up splash overlay DOM element after transition completes
    setTimeout(() => {
      splash.remove();
    }, 1200); // 1.2s matches the door-splitting animation transition duration in CSS
  };

  // Premium transition: auto-skip splash after 5.0 seconds
  const autoTimer = setTimeout(triggerTransition, 5000);

  // Allow immediate skipping by clicking anywhere on the splash screen
  splash.addEventListener('click', () => {
    clearTimeout(autoTimer);
    triggerTransition();
  });
}

/* ==========================================
   TOAST NOTIFICATION SYSTEM
   ========================================== */
function showToast(message, type = 'success') {
  const toast = document.getElementById('alert-toast');
  const msgText = document.getElementById('toast-message');
  
  if (!toast || !msgText) return;
  
  // Set class based on type
  toast.className = 'alert-popup';
  toast.classList.add(type);
  msgText.textContent = message;
  
  // Activate
  toast.classList.add('active');
  
  // Hide after 3.5s
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

/* ==========================================
   MOBILE NAVIGATION MENU
   ========================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('navigation-links');
  const MOBILE_BREAKPOINT = 950;

  if (!toggleBtn || !navLinks) return;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function closeMobileNav() {
    navLinks.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.textContent = '☰';
  }

  toggleBtn.textContent = '☰';

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('active');
    toggleBtn.textContent = !isExpanded ? '✕' : '☰';
  });

  // Close mobile nav when clicking any link or button inside it
  navLinks.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!isMobile()) return;
    if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
      closeMobileNav();
    }
  });

  // Auto-close and reset on resize to desktop
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeMobileNav();
    }
  });
}

/* ==========================================
   DESKTOP MENU DROPDOWN
   ========================================== */
function initMenuDropdown() {
  const dropdownWrapper = document.querySelector('.menu-dropdown-wrapper');
  const dropdownBtn = document.getElementById('menu-dropdown-btn');
  
  if (!dropdownWrapper || !dropdownBtn) return;
  
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = dropdownBtn.getAttribute('aria-expanded') === 'true';
    dropdownBtn.setAttribute('aria-expanded', !isExpanded);
    dropdownWrapper.classList.toggle('active');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownWrapper.contains(e.target)) {
      dropdownWrapper.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownWrapper.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown when a link is clicked
  const dropdownLinks = dropdownWrapper.querySelectorAll('.menu-dropdown-links-list a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
      dropdownWrapper.classList.remove('active');
      dropdownBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================
   MODAL CONTROLLER (UNIVERSAL OPEN/CLOSE)
   ========================================== */
const activeModals = new Set();

function initModals() {
  // Modal IDs and their respective trigger button configurations
  const modalTriggers = [
    { trigger: 'hero-btn-welfare', modal: 'modal-welfare' },
    { trigger: 'footer-link-services', modal: 'modal-welfare' },
    { trigger: 'hero-btn-grievance', modal: 'modal-grievance' },
    { trigger: 'quick-btn-agri', modal: 'modal-agri' },
    { trigger: 'service-btn-agri', modal: 'modal-agri' },
    { trigger: 'quick-btn-water', modal: 'modal-water' },
    { trigger: 'init-btn-water', modal: 'modal-water' },
    { trigger: 'quick-btn-ration', modal: 'modal-ration' },
    { trigger: 'service-btn-certificates', modal: 'modal-certificates' },
    { trigger: 'init-btn-employment', modal: 'modal-employment' },
    { trigger: 'init-btn-education', modal: 'modal-education' },
    { trigger: 'nav-btn-contact', modal: 'modal-about' },
    { trigger: 'footer-link-about', modal: 'modal-about' },
    { trigger: 'btn-trigger-facility-update', modal: 'modal-household-update' },
    { trigger: 'service-btn-health', modal: 'modal-health' },
    { trigger: 'btn-login-trigger', modal: 'modal-login' },
    { trigger: 'smart-btn-echoupal', modal: 'modal-echoupal' },
    { trigger: 'smart-btn-disaster', modal: 'modal-disaster' },
    { trigger: 'smart-btn-telehealth', modal: 'modal-telemedicine' },
    { trigger: 'smart-btn-education', modal: 'modal-elearning' },
    { trigger: 'smart-btn-governance', modal: 'modal-governance' },
    { trigger: 'smart-btn-village-dashboard', modal: 'modal-village-dashboard' }
  ];

  modalTriggers.forEach(config => {
    const btn = document.getElementById(config.trigger);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(config.modal);
      });
    }
  });

  // Add click events to all close buttons
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });

  // Close modal when clicking outside content (on the overlay backdrop)
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModals.size > 0) {
      const mostRecentModal = Array.from(activeModals).pop();
      closeModal(mostRecentModal);
    }
  });

  // Extra triggers for other buttons
  const rtiBtn = document.getElementById('footer-link-rti');
  if (rtiBtn) {
    rtiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('ℹ️ RTI Act 2005: Public Information Officer contact detail is on the Contact page.', 'info');
    });
  }

  const privacyBtn = document.getElementById('footer-link-privacy');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('🔒 Privacy: Citizen data is protected by the Gram Panchayat Privacy Act.', 'info');
    });
  }

  // Health button trigger is handled automatically via modalTriggers list config

}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    // Dynamically refresh page configuration when opening dashboard modals
    if (['modal-water', 'modal-agri', 'modal-health'].includes(modalId)) {
      fetch('/api/main-page-config')
        .then(res => res.json())
        .then(config => {
          mainPageConfig = config;
          renderDynamicMainPageContent();
        })
        .catch(err => console.error('Error refreshing modal dashboard config:', err));
    }

    modal.classList.add('active');
    activeModals.add(modalId);
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    if (modalId === 'modal-village-dashboard') {
      triggerGenderBarAnimation();
    }
    
    // Focus first focusable element inside the modal
    const focusable = modal.querySelectorAll('input, select, textarea, button, a');
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 100);
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    activeModals.delete(modalId);
    
    if (activeModals.size === 0) {
      document.body.style.overflow = ''; // Restore scroll
    }
  }
}

/* ==========================================
   AUTHENTICATION SUBMISSION
   ========================================== */
window.handleLoginSubmit = function(event) {
  event.preventDefault();
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const errorMsg = document.getElementById('login-error-message');
  
  if (!usernameInput || !passwordInput) return;
  
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  
  if (errorMsg) errorMsg.style.display = 'none';
  
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(async res => {
    if (!res.ok) {
      let errMsg = 'Invalid credentials. Please try again.';
      try {
        const data = await res.json();
        if (data && data.error) {
          errMsg = data.error;
        }
      } catch (e) {}
      throw new Error(errMsg);
    }
    return res.json();
  })
  .then(data => {
    showToast('🔑 Login successful! Redirecting...', 'success');
    sessionStorage.setItem('panchayat-role', data.role);
    sessionStorage.setItem('panchayat-userId', data.userId || '');
    
    setTimeout(() => {
      window.location.href = data.dest;
    }, 1000);
  })
  .catch(err => {
    console.error('Login error:', err);
    if (errorMsg) {
      errorMsg.textContent = err.message || 'Invalid credentials. Please try again.';
      errorMsg.style.display = 'block';
    }
    showToast('❌ ' + (err.message || 'Invalid credentials. Please try again.'), 'error');
  });
};

/* ==========================================
   WELFARE SCHEMES & ELIGIBILITY
   ========================================== */
const welfareSchemesData = [
  {
    category: {
      en: 'Farmers',
      hi: 'किसान',
      te: 'రైతులు'
    },
    en: {
      name: 'Rythu Bandhu (Farmer Investment Support)',
      desc: 'Provides seasonal input support grants of ₹5,000 per acre per season directly to farmers for buying seeds, fertilizer, and labor inputs.',
      criteria: 'Land-owning farming families in the village land register.',
      docs: 'Aadhaar Card, Land Pattadar Passbook, Bank Account Details.',
      apply: 'Submit passbook & bank copies to the Agricultural Extension Officer (AEO) at the Panchayat Office.'
    },
    hi: {
      name: 'रैथु बंधु (किसान निवेश सहायता)',
      desc: 'बीज, उर्वरक और श्रम इनपुट खरीदने के लिए किसानों को सीधे प्रति सीजन ₹5,000 प्रति एकड़ की दर से मौसमी निवेश सहायता अनुदान प्रदान करता है।',
      criteria: 'ग्राम भूमि रजिस्टर में पंजीकृत भूमि स्वामी किसान परिवार।',
      docs: 'आधार कार्ड, भूमि पट्टादार पासबुक, बैंक खाता विवरण।',
      apply: 'पंचायत कार्यालय में कृषि विस्तार अधिकारी (AEO) को पासबुक और बैंक विवरण की प्रतियां जमा करें।'
    },
    te: {
      name: 'రైతు బంధు (వ్యవసాయ పెట్టుబడి మద్దతు)',
      desc: 'విత్తనాలు, ఎరువులు మరియు కార్మిక ఖర్చుల కొరకు రైతులకు నేరుగా ఎకరానికి ఒక సీజన్‌కు ₹5,000 చొప్పున పెట్టుబడి సహాయాన్ని అందిస్తుంది.',
      criteria: 'గ్రామ భూమి రికార్డులలో నమోదైన భూయజమాన్య రైతు కుటుంబాలు.',
      docs: 'ఆధార్ కార్డ్, పట్టాదార్ పాస్ బుక్, బ్యాంక్ ఖాతా వివరాలు.',
      apply: 'పాస్ బుక్ మరియు బ్యాంక్ ఖాతా నకళ్ళను పంచాయతీ కార్యాలయంలోని వ్యవసాయ విస్తరణ అధికారి (AEO) కి సమర్పించండి.'
    }
  },
  {
    category: {
      en: 'Students',
      hi: 'छात्र',
      te: 'విద్యార్థులు'
    },
    en: {
      name: 'Post-Matric Scholarship & Fee Reimbursement',
      desc: 'Provides full tuition fee reimbursement and monthly maintenance allowances for students pursuing higher education.',
      criteria: 'SC/ST/BC/Minority students pursuing Intermediate/Degree/Engineering with annual family income under ₹2 Lakhs.',
      docs: 'SSC Memo, Aadhaar Card, Caste & Income Certificates, College Study Certificate.',
      apply: 'Apply online via the Jnanabhumi Portal and submit hard copies to the College Principal.'
    },
    hi: {
      name: 'पोस्ट-मैट्रिक छात्रवृत्ति और शुल्क प्रतिपूर्ति',
      desc: 'उच्च शिक्षा प्राप्त करने वाले छात्रों के लिए पूर्ण ट्यूशन शुल्क प्रतिपूर्ति और मासिक रखरखाव भत्ता प्रदान करता है।',
      criteria: '₹2 लाख से कम वार्षिक पारिवारिक आय वाले अनुसूचित जाति/अनुसूचित जनजाति/पिछड़ा वर्ग/अल्पसंख्यक छात्र जो इंटरमीडिएट/डिग्री/इंजीनियरिंग की पढ़ाई कर रहे हैं।',
      docs: 'एसएससी मेमो, आधार कार्ड, जाति और आय प्रमाण पत्र, कॉलेज अध्ययन प्रमाण पत्र।',
      apply: 'ज्ञानभूमि पोर्टल के माध्यम से ऑनलाइन आवेदन करें और कॉलेज के प्रिंसिपल को हार्ड कॉपी जमा करें।'
    },
    te: {
      name: 'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ & ఫీజు రీయింబర్స్మెంట్',
      desc: 'ఉన్నత విద్యను అభ్యసిస్తున్న విద్యార్థుల కోసం పూర్తి ట్యూషన్ ఫీజు రీయింబర్స్మెంట్ మరియు నెలవారీ అలవెన్సులను అందిస్తుంది.',
      criteria: 'రూ. 2 లక్షల లోపు వార్షిక కుటుంబ ఆదాయం కలిగి, ఇంటర్/డిగ్రీ/ఇంజనీరింగ్ చదువుతున్న ఎస్సీ/ఎస్టీ/బీసీ/మైనారిటీ విద్యార్థులు.',
      docs: 'ఆధార్ కార్డ్, ఎస్ఎస్సీ మెమో, కుల & ఆదాయ ధృవీకరణ పత్రాలు, కాలేజీ స్టడీ సర్టిఫికేట్.',
      apply: 'జ్ఞానభూమి పోర్టల్ ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేసుకుని, హార్డ్ కాపీలను కాలేజీ ప్రిన్సిపాల్‌కు సమర్పించండి.'
    }
  },
  {
    category: {
      en: 'Women',
      hi: 'महिलाएं',
      te: 'మహిళలు'
    },
    en: {
      name: 'YSR Aasara (Self-Help Group Support)',
      desc: 'Reimburses outstanding bank loans of rural Self-Help Groups (SHGs) in installments to empower women and promote small enterprise.',
      criteria: 'Female members of registered rural Self-Help Groups (SHGs) under DRDA.',
      docs: 'SHG Loan Book, Aadhaar Cards of SHG members, Bank Passbook.',
      apply: 'Apply through the Village Organization (VO) Assistant at the Panchayat Secretariat.'
    },
    hi: {
      name: 'वाईएसआर आसरा (स्वयं सहायता समूह सहायता)',
      desc: 'महिलाओं को सशक्त बनाने और लघु उद्यम को बढ़ावा देने के लिए ग्रामीण स्वयं सहायता समूहों (SHGs) के बकाया बैंक ऋणों को किश्तों में प्रतिपूर्ति करता है।',
      criteria: 'डीआरडीए के तहत पंजीकृत ग्रामीण स्वयं सहायता समूहों (SHG) की महिला सदस्य।',
      docs: 'एसएचजी ऋण पुस्तिका, एसएचजी सदस्यों के आधार कार्ड, बैंक पासबुक।',
      apply: 'पंचायत सचिवालय में ग्राम संगठन (VO) सहायक के माध्यम से आवेदन करें।'
    },
    te: {
      name: 'వైఎస్ఆర్ ఆసరా (SHG రుణ సహాయ పథకం)',
      desc: 'మహిళా సాధికారత మరియు చిన్న వ్యాపారాల ప్రోత్సాహం కొరకు గ్రామీణ స్వయం సహాయక సంఘాల (SHG) పాత బ్యాంకు రుణాలను విడతల వారీగా చెల్లిస్తుంది.',
      criteria: 'DRDA పరిధిలో నమోదైన గ్రామీణ స్వయం సహాయక సంఘాల (SHG) మహిళా సభ్యులు.',
      docs: 'SHG రుణ పుస్తకం, సభ్యుల ఆధార్ కార్డులు, బ్యాంక్ పాస్ బుక్.',
      apply: 'పంచాయతీ సెక్రటేరియట్‌లోని విలేజ్ ఆర్గనైజేషన్ (VO) అసిస్టెంట్ ద్వారా దరఖాస్తు చేసుకోండి.'
    }
  },
  {
    category: {
      en: 'Senior Citizens',
      hi: 'वरिष्ठ नागरिक',
      te: 'వృద్ధులు'
    },
    en: {
      name: 'YSR Pension Kanuka (Old Age Pension)',
      desc: 'Provides secure monthly financial aid directly at the doorstep to elderly and vulnerable villagers to ensure dignified living.',
      criteria: 'Elderly citizens aged 60 years or above with monthly family income under ₹10,000 (rural) and landholding under 3 acres wet / 10 acres dry.',
      docs: 'Aadhaar Card (for age proof), Ration Card / Income Certificate, Bank Passbook, Photo.',
      apply: 'Submit the physical application form to the Ward/Village Volunteer or register at the Panchayat Secretariat.'
    },
    hi: {
      name: 'वाईएसआर पेंशन कनुका (वृद्धावस्था पेंशन)',
      desc: 'सम्मानजनक जीवन सुनिश्चित करने के लिए बुजुर्ग और कमजोर ग्रामीणों को सीधे दरवाजे पर सुरक्षित मासिक वित्तीय सहायता प्रदान करता है।',
      criteria: '60 वर्ष या उससे अधिक आयु के बुजुर्ग नागरिक जिनकी मासिक पारिवारिक आय ₹10,000 (ग्रामीण) से कम है और भूमि जोत 3 एकड़ गीली / 10 एकड़ सूखी से कम है।',
      docs: 'आधार कार्ड (आयु प्रमाण के लिए), राशन कार्ड / आय प्रमाण पत्र, बैंक पासबुक, फोटो।',
      apply: 'वार्ड/ग्राम स्वयंसेवक को भौतिक आवेदन पत्र जमा करें या पंचायत सचिवालय में पंजीकरण करें।'
    },
    te: {
      name: 'వైఎస్ఆర్ పెన్షన్ కానుక (వృద్ధాప్య పెన్షన్)',
      desc: 'గౌరవప్రదమైన జీవితాన్ని గడపడం కోసం వృద్ధులకు మరియు వెనుకబడిన గ్రామస్థులకు నేరుగా ఇంటి వద్దకే నెలవారీ ఆర్థిక సహాయాన్ని అందిస్తుంది.',
      criteria: '60 సంవత్సరాలు లేదా అంతకంటే ఎక్కువ వయస్సు ఉండి, నెలవారీ కుటుంబ ఆదాయం రూ.10,000 లోపు మరియు 3 ఎకరాల మాగాణి/10 ఎకరాల మెట్ట లోపు భూమి ఉన్న వృద్ధులు.',
      docs: 'ఆధార్ కార్డ్ (వయస్సు రుజువు కోసం), రేషన్ కార్డ్ / ఆదాయ ధృవీకరణ పత్రం, బ్యాంక్ పాస్ బుక్, ఫోటో.',
      apply: 'వార్డు/గ్రామ వాలంటీర్‌కు దరఖాస్తును సమర్పించండి లేదా పంచాయతీ సెక్రటేరియట్‌లో నమోదు చేసుకోండి.'
    }
  },
  {
    category: {
      en: 'Housing',
      hi: 'आवास',
      te: 'గృహ నిర్మాణం'
    },
    en: {
      name: 'PM Awas Yojana (PMAY-G Housing)',
      desc: 'Provides financial assistance and construction subsidies for building permanent pucca houses with basic amenities for shelterless families.',
      criteria: 'Families without shelter or living in kutcha/dilapidated mud houses in rural areas.',
      docs: 'Aadhaar Card, Ration Card, Bank Passbook, Land Possession Document / NOC, current house photo.',
      apply: 'Register details during the Gram Sabha housing survey or submit the form to the Panchayat Secretary.'
    },
    hi: {
      name: 'पीएम आवास योजना (ग्रामीण आवास)',
      desc: 'बेघर परिवारों के लिए बुनियादी सुविधाओं के साथ स्थायी पक्के मकान बनाने के लिए वित्तीय सहायता और निर्माण सब्सिडी प्रदान करता है।',
      criteria: 'ग्रामीण क्षेत्रों में बेघर या कच्चे/जर्जर मिट्टी के घरों में रहने वाले परिवार।',
      docs: 'आधार कार्ड, राशन कार्ड, बैंक पासबुक, भूमि कब्जा दस्तावेज / एनओसी, वर्तमान घर की फोटो।',
      apply: 'ग्राम सभा आवास सर्वेक्षण के दौरान विवरण दर्ज करें या पंचायत सचिव को फॉर्म जमा करें।'
    },
    te: {
      name: 'పీఎం ఆవాస్ యోజన (గ్రామీణ గృహ నిర్మాణ పథకం)',
      desc: 'ఇల్లు లేని నిరుపేద కుటుంబాలకు కనీస సదుపాయాలతో శాశ్వత పక్కా ఇళ్ళ నిర్మాణానికి ఆర్థిక సహాయం మరియు సబ్సిడీని అందిస్తుంది.',
      criteria: 'గ్రామీణ ప్రాంతాలలో ఇల్లు లేని లేదా మట్టి ఇళ్ళు/శిథిలావస్థకు చేరిన ఇళ్ళలో నివసిస్తున్న కుటుంబాలు.',
      docs: 'ఆధార్ కార్డ్, రేషన్ కార్డ్, బ్యాంక్ పాస్ బుక్, భూమి యాజమాన్య పత్రం / NOC, ప్రస్తుత ఇల్లు ఫోటో.',
      apply: 'గ్రామసభ గృహ సర్వే సమయంలో వివరాలను నమోదు చేయండి లేదా పంచాయతీ కార్యదర్శికి దరఖాస్తును సమర్పించండి.'
    }
  },
  {
    category: {
      en: 'Employment',
      hi: 'रोजगार',
      te: 'ఉపాధి'
    },
    en: {
      name: 'MGNREGS (National Rural Employment Guarantee)',
      desc: 'Guarantees at least 100 days of paid manual labor per financial year to rural households to enhance livelihood security.',
      criteria: 'Adult members of rural households willing to perform unskilled physical manual labor.',
      docs: 'Aadhaar Card, Voter ID, Bank Passbook, Passport Size Photograph.',
      apply: 'Submit a job card application form at the Panchayat Office; jobs are assigned by the Field Assistant within 15 days.'
    },
    hi: {
      name: 'मनरेगा (राष्ट्रीय ग्रामीण रोजगार गारंटी)',
      desc: 'आजीविका सुरक्षा बढ़ाने के लिए ग्रामीण परिवारों को प्रति वित्तीय वर्ष कम से कम 100 दिनों के सवैतनिक शारीरिक श्रम की गारंटी देता है।',
      criteria: 'ग्रामीण परिवारों के वयस्क सदस्य जो अकुशल शारीरिक श्रम करने के इच्छुक हैं।',
      docs: 'आधार कार्ड, वोटर आईडी, बैंक पासबुक, पासपोर्ट साइज फोटो।',
      apply: 'पंचायत कार्यालय में जॉब कार्ड आवेदन पत्र जमा करें; 15 दिनों के भीतर फील्ड सहायक द्वारा काम आवंटित किया जाता है।'
    },
    te: {
      name: 'ఉపాధి హామీ పథకం (MGNREGS)',
      desc: 'జీవనోపాధి భద్రతను పెంచడం కోసం గ్రామీణ కుటుంబాలలోని వయోజనులకు ప్రతి ఆర్థిక సంవత్సరంలో కనీసం 100 రోజుల వేతనంతో కూడిన శారీరక శ్రమకు హామీ ఇస్తుంది.',
      criteria: 'నైపుణ్యం లేని శారీరక శ్రమ చేయడానికి సిద్ధంగా ఉన్న గ్రామీణ కుటుంబాలలోని వయోజన సభ్యులు.',
      docs: 'ఆధార్ కార్డ్, ఓటర్ ఐడీ, బ్యాంక్ పాస్ బుక్, పాస్‌పోర్ట్ సైజ్ ఫోటో.',
      apply: 'పంచాయతీ కార్యాలయంలో జాబ్ కార్డ్ దరఖాస్తును సమర్పించండి; ఫీల్డ్ అసిస్టెంట్ 15 రోజుల్లోగా పనిని కేటాయిస్తారు.'
    }
  }
];

function initWelfareEligibility() {
  const tabBrowse = document.getElementById('welfare-tab-browse');
  const tabChecker = document.getElementById('welfare-tab-checker');
  const contentBrowse = document.getElementById('welfare-content-browse');
  const contentChecker = document.getElementById('welfare-content-checker');
  
  if (!tabBrowse || !tabChecker || !contentBrowse || !contentChecker) return;

  // Tab switching
  tabBrowse.addEventListener('click', () => {
    tabBrowse.classList.add('active');
    tabChecker.classList.remove('active');
    contentBrowse.style.display = 'block';
    contentChecker.style.display = 'none';
  });

  tabChecker.addEventListener('click', () => {
    tabChecker.classList.add('active');
    tabBrowse.classList.remove('active');
    contentBrowse.style.display = 'none';
    contentChecker.style.display = 'block';
  });

  // Eligibility evaluation logic
  const form = document.getElementById('eligibility-form');
  const resultsPanel = document.getElementById('eligibility-results-panel');
  const resultsList = document.getElementById('eligibility-results-list');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const age = parseInt(document.getElementById('eligibility-age').value);
      const occupation = document.getElementById('eligibility-occupation').value;
      const land = parseFloat(document.getElementById('eligibility-land').value);
      const income = parseInt(document.getElementById('eligibility-income').value);
      
      let eligibleList = [];
      const lang = currentLanguage || 'en';

      // 1. Rythu Bandhu (Farmer): landowner and land size > 0
      if (occupation === 'farmer' && land > 0) {
        eligibleList.push(welfareSchemesData[0]);
      }
      
      // 2. Post-Matric Scholarship (Student): age <= 25, and low income
      if (age <= 25 && income <= 200000) {
        eligibleList.push(welfareSchemesData[1]);
      }

      // 3. YSR Aasara (SHG Women): income <= 150000
      if (income <= 150000) {
        eligibleList.push(welfareSchemesData[2]);
      }

      // 4. YSR Pension Kanuka (Senior Citizen): age >= 60, or retired and low income
      if ((age >= 60 || occupation === 'retired') && income <= 120000) {
        eligibleList.push(welfareSchemesData[3]);
      }

      // 5. PM Awas Yojana (Housing): low income and land <= 2
      if (income <= 180000 && land <= 2) {
        eligibleList.push(welfareSchemesData[4]);
      }

      // 6. MGNREGS (Employment): willing to work (low/medium income, and not retired)
      if (occupation !== 'retired' && income <= 250000) {
        eligibleList.push(welfareSchemesData[5]);
      }

      // Render results
      resultsList.innerHTML = '';
      if (eligibleList.length > 0) {
        eligibleList.forEach(scheme => {
          const data = scheme[lang] || scheme['en'];
          const categoryText = scheme.category[lang] || scheme.category['en'];
          
          const labelCriteria = lang === 'te' ? 'సరిపోలిన అర్హత' : lang === 'hi' ? 'पात्रता मानदंड' : 'Criteria Met';
          const labelDocs = lang === 'te' ? 'అవసరమైన పత్రాలు' : lang === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents';
          const labelApply = lang === 'te' ? 'దరఖాస్తు విధానం' : lang === 'hi' ? 'आवेदन कैसे करें' : 'How to Apply';
          const labelEligible = lang === 'te' ? 'అర్హులు ✓' : lang === 'hi' ? 'पात्र ✓' : 'Eligible ✓';

          const item = document.createElement('div');
          item.className = 'welfare-scheme-item';
          item.innerHTML = `
            <div class="welfare-scheme-header">
              <h4>${data.name}</h4>
              <span class="scheme-tag eligible">${labelEligible}</span>
            </div>
            <p>${data.desc}</p>
            <div class="scheme-detail-block">
              <div class="scheme-detail-item"><strong>${labelCriteria}:</strong> ${data.criteria}</div>
              <div class="scheme-detail-item"><strong>${labelDocs}:</strong> ${data.docs}</div>
              <div class="scheme-detail-item"><strong>${labelApply}:</strong> ${data.apply}</div>
            </div>
          `;
          resultsList.appendChild(item);
        });
        
        const toastMsg = lang === 'hi' ? `🎉 सत्यापन पूर्ण: आप ${eligibleList.length} योजना(ओं) के लिए पात्र हैं!` : lang === 'te' ? `🎉 పరిశీలన పూర్తయింది: మీరు ${eligibleList.length} పథకానికి అర్హులు!` : `🎉 Verified: You match ${eligibleList.length} welfare scheme(s)!`;
        showToast(toastMsg, 'success');
      } else {
        const noMatchTitle = lang === 'hi' ? 'कोई मेल खाती योजना नहीं मिली' : lang === 'te' ? 'సరిపోలే పథకాలు లేవు' : 'No Matching Schemes Found';
        const noMatchDesc = lang === 'hi' ? 'आपके विवरण वर्तमान पात्रता मानदंडों से मेल नहीं खाते हैं। कृपया पंचायत कार्यालय में संपर्क करें।' : lang === 'te' ? 'మీ వివరాలు ప్రస్తుత అర్హత ప్రమాణాలతో సరిపోలడం లేదు. దయచేసి పంచాయతీ కార్యాలయంలో సంప్రదించండి.' : 'Your details do not match current eligibility thresholds. Please visit the Panchayat office for manual review.';
        
        resultsList.innerHTML = `
          <div style="text-align:center; padding: 20px; color: var(--color-text-muted);">
            <p style="font-weight: 600; margin-bottom: 6px;">${noMatchTitle}</p>
            <p style="font-size: 0.8rem;">${noMatchDesc}</p>
          </div>
        `;
        
        const toastMsgInfo = lang === 'hi' ? 'ℹ️ समीक्षा पूर्ण: कोई मेल खाती योजना नहीं मिली।' : lang === 'te' ? 'ℹ️ సమీక్ష పూర్తయింది: సరిపోలే పథకాలు ఏవీ లేవు.' : 'ℹ️ Review completed: No eligible schemes matched.';
        showToast(toastMsgInfo, 'info');
      }
      
      resultsPanel.style.display = 'block';
    });
  }

  // Initial render of browse list
  renderBrowseSchemes();
}

function renderBrowseSchemes() {
  const browseList = document.getElementById('welfare-browse-list');
  if (!browseList) return;

  browseList.innerHTML = '';
  const lang = currentLanguage || 'en';

  welfareSchemesData.forEach(scheme => {
    const data = scheme[lang] || scheme['en'];
    const categoryText = scheme.category[lang] || scheme.category['en'];
    
    const labelEligibility = lang === 'te' ? 'అర్హత' : lang === 'hi' ? 'पात्रता' : 'Eligibility';
    const labelDocs = lang === 'te' ? 'అవసరమైన పత్రాలు' : lang === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents';
    const labelApply = lang === 'te' ? 'దరఖాస్తు విధానం' : lang === 'hi' ? 'आवेदन कैसे करें' : 'How to Apply';

    const item = document.createElement('div');
    item.className = 'welfare-scheme-item';
    item.innerHTML = `
      <div class="welfare-scheme-header">
        <h4>${data.name}</h4>
        <span class="scheme-tag">${categoryText}</span>
      </div>
      <p>${data.desc}</p>
      <div class="scheme-detail-block">
        <div class="scheme-detail-item"><strong>${labelEligibility}:</strong> ${data.criteria}</div>
        <div class="scheme-detail-item"><strong>${labelDocs}:</strong> ${data.docs}</div>
        <div class="scheme-detail-item"><strong>${labelApply}:</strong> ${data.apply}</div>
      </div>
    `;
    browseList.appendChild(item);
  });
}

/* ==========================================
   GRIEVANCE REDRESSAL TIMELINE
   ========================================== */
function initGrievanceRedressal() {
  const tabFile = document.getElementById('grievance-tab-file');
  const tabTrack = document.getElementById('grievance-tab-track');
  const contentFile = document.getElementById('grievance-content-file');
  const contentTrack = document.getElementById('grievance-content-track');

  if (!tabFile || !tabTrack || !contentFile || !contentTrack) return;

  tabFile.addEventListener('click', () => {
    tabFile.classList.add('active');
    tabTrack.classList.remove('active');
    contentFile.style.display = 'block';
    contentTrack.style.display = 'none';
  });

  tabTrack.addEventListener('click', () => {
    tabTrack.classList.add('active');
    tabFile.classList.remove('active');
    contentFile.style.display = 'none';
    contentTrack.style.display = 'block';
  });

  // File Grievance Form Submission
  const fileForm = document.getElementById('grievance-file-form');
  const trackIdInput = document.getElementById('grievance-track-id');
  const trackForm = document.getElementById('grievance-track-form');

  if (fileForm) {
    fileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('grievance-name').value;
      const phone = document.getElementById('grievance-phone').value;
      const category = document.getElementById('grievance-category').value;
      const desc = document.getElementById('grievance-desc').value;
      
      fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, category, desc })
      })
      .then(res => {
        if (!res.ok) throw new Error('API failure');
        return res.json();
      })
      .then(newTicket => {
        showToast(`📝 Grievance Filed! ID: ${newTicket.id}. Switched to Tracking Tab.`, 'success');
        fileForm.reset();
        
        // Switched to Track Tab
        trackIdInput.value = newTicket.id;
        tabTrack.click();
        
        // Trigger search automatically
        trackForm.dispatchEvent(new Event('submit'));
      })
      .catch(err => {
        console.error('Error filing grievance:', err);
        showToast('❌ Failed to file grievance on server. Please try again.', 'error');
      });
    });
  }

  // Search/Track Grievance Submission
  const timelineContainer = document.getElementById('grievance-timeline-container');
  const timelineFlow = document.getElementById('tracking-timeline-flow');
  const ticketLabel = document.getElementById('track-ticket-label');
  const statusBadge = document.getElementById('track-status-badge');
  const descParagraph = document.getElementById('track-desc-paragraph');

  if (trackForm) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchId = trackIdInput.value.trim().toUpperCase();

      fetch(`/api/grievances?id=${encodeURIComponent(searchId)}`)
      .then(res => {
        if (!res.ok) throw new Error('Ticket not found');
        return res.json();
      })
      .then(ticket => {
        ticketLabel.innerHTML = `<strong>Ticket ID:</strong> ${ticket.id}`;
        statusBadge.textContent = ticket.status;
        
        statusBadge.className = 'scheme-tag';
        if (ticket.status === 'Resolved') statusBadge.classList.add('eligible');
        else if (ticket.status === 'Submitted') statusBadge.style.backgroundColor = 'hsl(200, 80%, 92%)';
        
        descParagraph.innerHTML = `<strong>Category:</strong> ${ticket.category.toUpperCase()}<br><strong>Details:</strong> ${ticket.desc}`;
        
        // Render timeline
        timelineFlow.innerHTML = '';
        ticket.history.forEach((step, idx) => {
          const stepDiv = document.createElement('div');
          stepDiv.className = 'timeline-step completed';
          if (idx === ticket.history.length - 1 && ticket.status !== 'Resolved') {
            stepDiv.className = 'timeline-step active';
          }
          
          stepDiv.innerHTML = `
            <div class="timeline-marker">${idx + 1}</div>
            <div class="timeline-details">
              <h4>${step.status}</h4>
              <p>${step.detail}</p>
              <div class="timeline-time">${step.time}</div>
            </div>
          `;
          timelineFlow.appendChild(stepDiv);
        });

        if (ticket.status === 'Submitted') {
          appendPendingStep(2, 'Under Verification', 'Panchayat officials will verify details on ground.', timelineFlow);
          appendPendingStep(3, 'Officer Investigation', 'Investigation by allocated ward representatives.', timelineFlow);
          appendPendingStep(4, 'Resolution Implementation', 'Field works or administrative corrections.', timelineFlow);
        } else if (ticket.status === 'In Progress') {
          appendPendingStep(ticket.history.length + 1, 'Resolution Implementation', 'Rectification works in progress.', timelineFlow);
          appendPendingStep(ticket.history.length + 2, 'Resolved & Finalised', 'Resolution sign-off by Gram Sabha representative.', timelineFlow);
        }

        timelineContainer.style.display = 'block';
        showToast('🔍 Ticket record located successfully.', 'success');
      })
      .catch(err => {
        console.error('Error tracking grievance:', err);
        timelineContainer.style.display = 'none';
        showToast('❌ Ticket ID not found. Try GP-2026-X1Y2 or file a new concern.', 'error');
      });
    });
  }
}

function appendPendingStep(num, name, desc, container) {
  const stepDiv = document.createElement('div');
  stepDiv.className = 'timeline-step';
  stepDiv.innerHTML = `
    <div class="timeline-marker">${num}</div>
    <div class="timeline-details">
      <h4 style="color:var(--color-text-muted);">${name}</h4>
      <p style="font-size:0.75rem;">${desc}</p>
    </div>
  `;
  container.appendChild(stepDiv);
}

/* ==========================================
   INTERACTIVE ASSET MAP (PINS)
   ========================================== */
function initInteractiveMap() {
  const mapNodes = document.querySelectorAll('.map-node');
  const popup = document.getElementById('map-info-card');
  const popupTitle = document.getElementById('map-popup-title');
  const popupDetails = document.getElementById('map-popup-details');
  let popupTimeout = null;

  if (!popup || mapNodes.length === 0) return;

  mapNodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      
      let species = node.getAttribute('data-species');
      let count = node.getAttribute('data-count');
      const lat = node.getAttribute('data-lat');
      const lon = node.getAttribute('data-lon');
      let date = node.getAttribute('data-date');
      let status = node.getAttribute('data-status');

      // Localized mapping for new infrastructure nodes
      if (currentLanguage === 'hi') {
        if (node.classList.contains('school')) {
          species = "जिला परिषद हाई स्कूल (डिजिटल लैब परियोजना)";
          count = "1 सुविधा (निर्माण और डिजिटल लैब अपग्रेड)";
          date = "जून २०२६ लेखापरीक्षा";
          status = "प्रगति पर है (८५% पूर्ण)";
        } else if (node.classList.contains('bus-stand')) {
          species = "पंचायत बस स्टैंड और पारगमन आश्रय";
          count = "1 मुख्य जंक्शन स्टॉप (सौर छत और बैठने का अपग्रेड)";
          date = "जून २०२६ लेखापरीक्षा";
          status = "निर्माणाधीन (६०% पूर्ण)";
        }
      } else if (currentLanguage === 'te') {
        if (node.classList.contains('school')) {
          species = "జిల్లా పరిషత్ ఉన్నత పాఠశాల (డిజిటల్ ల్యాబ్ ప్రాజెక్ట్)";
          count = "1 సదుపాయం (నిర్మాణం & డిజిటల్ ల్యాబ్ అప్‌గ్రేడ్)";
          date = "జూన్ 2026 ఆడిట్";
          status = "పురోగతిలో ఉంది (85% పూర్తయింది)";
        } else if (node.classList.contains('bus-stand')) {
          species = "గ్రామ పంచాయతీ బస్ స్టాండ్ & ట్రాన్సిట్ షెల్టర్";
          count = "1 ప్రధాన జంక్షన్ స్టాప్ (సోలార్ రూఫ్ & సీటింగ్ అప్‌గ్రేడ్)";
          date = "జూన్ 2026 ఆడిట్";
          status = "నిర్మాణంలో ఉంది (60% పూర్తయింది)";
        }
      }

      popupTitle.textContent = species;

      const labelCoords = currentLanguage === 'hi' ? 'टैग निर्देशांक' : currentLanguage === 'te' ? 'ట్యాగ్ కోఆర్డినేట్స్' : 'Tag Coordinates';
      const labelInventory = currentLanguage === 'hi' ? 'परिसंपत्ति सूची' : currentLanguage === 'te' ? 'ఆస్తి ఇన్వెంటరీ' : 'Asset Inventory';
      const labelAudit = currentLanguage === 'hi' ? 'लेखापरीक्षा तिथि' : currentLanguage === 'te' ? 'ఆడిట్ తేదీ' : 'Audit Date';
      const labelStatus = currentLanguage === 'hi' ? 'स्थिति' : currentLanguage === 'te' ? 'స్థితి' : 'Status';

      popupDetails.innerHTML = `
        <strong>${labelCoords}:</strong> ${lat}, ${lon}<br>
        <strong>${labelInventory}:</strong> ${count}<br>
        <strong>${labelAudit}:</strong> ${date} | <strong>${labelStatus}:</strong> <span style="color: var(--color-success); font-weight:700;">${status}</span>
      `;

      popup.classList.add('active');
      const toastPrefix = currentLanguage === 'hi' ? '📍 चयनित परिसंपत्ति' : currentLanguage === 'te' ? '📍 ఎంచుకున్న ఆస్తి' : '📍 Selected Asset';
      showToast(`${toastPrefix}: ${species}`, 'info');

      // Clear existing auto-hide timers
      if (popupTimeout) clearTimeout(popupTimeout);
      
      // Auto-hide popup after 10 seconds of inactivity
      popupTimeout = setTimeout(() => {
        popup.classList.remove('active');
      }, 10000);
    });
  });

  // Hide popup if clicking elsewhere in map wrapper
  const wrapper = document.getElementById('village-map-wrapper');
  if (wrapper) {
    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper || e.target.classList.contains('map-svg-bg')) {
        popup.classList.remove('active');
      }
    });
  }
}

/* ==========================================
   AGRICULTURE CROP ADVISORY PLANNER
   ========================================== */
const cropAdvisoryData = {
  paddy: {
    name: 'Paddy Crop Sowing Advisory',
    type: 'Wet Crop / Grains',
    period: 'June - July (Kharif Monsoon)',
    water: 'High (Monsoon + Reservoir)',
    subsidy: '40% Seed Grant & Fertilizer subsidy',
    msp: '₹2,183 / Quintal',
    notes: 'Paddy crops require sustained moisture. Due to expected early-season rainfall peaks, transplanting should ideally conclude by mid-July. Apply nitrogen fertilizer in three split doses (basal, tillering, and panicle initiation) for optimal yield. Seed subsidy requests can be filed at the Panchayat Center.'
  },
  maize: {
    name: 'Maize Crop Sowing Advisory',
    type: 'Semi-Dry / Coarse Grain',
    period: 'June - Mid July (Kharif)',
    water: 'Moderate (Rain-fed)',
    subsidy: '30% Hybrid Seed Grant',
    msp: '₹2,090 / Quintal',
    notes: 'Maize requires good drainage. Avoid sowing in clayey waterlogged zones. Plant on ridges to prevent root-drown from sudden rain bursts. Zinc sulfate applications are highly recommended. Subsidy claims for hybrid seeds are open this week.'
  },
  chili: {
    name: 'Red Chili Crop Advisory',
    type: 'Cash Crop / Spice',
    period: 'July - August (Nursery)',
    water: 'Moderate (Micro-irrigation)',
    subsidy: 'Drip system installation 80%',
    msp: '₹7,000 - ₹18,000 / Quintal (Market)',
    notes: 'Chili nursery plants should be raised under light shade nets. Safeguard against sucking pests using bio-pesticides. Excellent crop for drip systems; panchayats offer 80% subsidy for micro-irrigation layout installation.'
  },
  pulses: {
    name: 'Black Gram / Pulses Sowing Advisory',
    type: 'Dry Crop / Legumes',
    period: 'September - October (Rabi)',
    water: 'Low (Residual moisture)',
    subsidy: 'Free seed mini-kits allocation',
    msp: '₹6,950 / Quintal',
    notes: 'Pulses fix nitrogen in the soil, making them perfect for crop rotation following Paddy harvest. Requires minimal water. Keep fields free of weeds for the first 30 days. Mini-kits with free seeds are available under central dryland initiatives.'
  }
};

function updateCropAdvisoryDisplay(cropKey, lang) {
  let advisory = null;
  if (mainPageConfig && mainPageConfig.agriDashboard && mainPageConfig.agriDashboard.crops && mainPageConfig.agriDashboard.crops[cropKey]) {
    const dbCrop = mainPageConfig.agriDashboard.crops[cropKey];
    advisory = {
      name: dbCrop.name[lang] || dbCrop.name['en'] || '',
      type: dbCrop.type[lang] || dbCrop.type['en'] || '',
      period: dbCrop.period[lang] || dbCrop.period['en'] || '',
      water: dbCrop.water[lang] || dbCrop.water['en'] || '',
      subsidy: dbCrop.subsidy[lang] || dbCrop.subsidy['en'] || '',
      msp: dbCrop.msp[lang] || dbCrop.msp['en'] || '',
      notes: dbCrop.notes[lang] || dbCrop.notes['en'] || ''
    };
  } else if (cropAdvisoryData && cropAdvisoryData[cropKey]) {
    advisory = cropAdvisoryData[cropKey];
  }

  if (advisory) {
    const nameEl = document.getElementById('advisory-crop-name');
    if (nameEl) nameEl.textContent = advisory.name;

    const periodEl = document.getElementById('advisory-sowing-period');
    if (periodEl) periodEl.textContent = advisory.period;

    const waterEl = document.getElementById('advisory-water-need');
    if (waterEl) waterEl.textContent = advisory.water;

    const subsidyEl = document.getElementById('advisory-subsidy');
    if (subsidyEl) subsidyEl.textContent = advisory.subsidy;

    const mspEl = document.getElementById('advisory-msp');
    if (mspEl) mspEl.textContent = advisory.msp;

    const notesEl = document.getElementById('advisory-notes');
    if (notesEl) notesEl.textContent = advisory.notes;
    
    // Category Badge Update
    const badge = document.getElementById('advisory-crop-type');
    if (badge) {
      badge.textContent = advisory.type;
    }
  }
  return advisory;
}

function initCropAdvisory() {
  const cropBtns = document.querySelectorAll('.crop-select-btn');
  
  if (cropBtns.length === 0) return;

  cropBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      cropBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      // Update contents
      const cropKey = btn.id.replace('crop-btn-', '');
      const lang = currentLanguage || 'en';
      const advisory = updateCropAdvisoryDisplay(cropKey, lang);

      if (advisory) {
        const toastPrefix = lang === 'hi' ? '🌱 बुवाई सलाह लोड की गई' : lang === 'te' ? '🌱 సాగు సలహా లోడ్ చేయబడింది' : '🌱 Sowing advisory loaded';
        showToast(`${toastPrefix}: ${advisory.name}`, 'success');
      }
    });
  });
}

/* ==========================================
   CIVIL RATION CARD QUERY SYSTEM
   ========================================== */
function initRationSearch() {
  const form = document.getElementById('ration-search-form');
  const input = document.getElementById('ration-number-input');
  const resultPanel = document.getElementById('ration-result-panel');

  if (!form || !input || !resultPanel) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rationNum = input.value.trim();

    fetch(`/api/ration?id=${encodeURIComponent(rationNum)}`)
    .then(res => {
      if (!res.ok) throw new Error('Ration card record not found');
      return res.json();
    })
    .then(record => {
      document.getElementById('ration-card-owner').innerHTML = `Cardholder: <strong>${record.owner}</strong>`;
      document.getElementById('ration-card-type').textContent = record.type;
      
      const metrics = resultPanel.querySelectorAll('.water-metric-row span');
      metrics[1].textContent = record.status; // Card Status
      metrics[3].textContent = record.shop;   // FP Shop No
      metrics[5].textContent = record.members; // Members count

      const allocations = resultPanel.querySelectorAll('.water-info-panel:last-child .water-metric-row span');
      allocations[1].textContent = record.rice;
      allocations[3].textContent = record.wheat;
      allocations[5].textContent = record.kerosene;

      resultPanel.style.display = 'block';
      showToast('📋 Ration card allocation found.', 'success');
    })
    .catch(err => {
      console.error('Error fetching ration card:', err);
      resultPanel.style.display = 'none';
      showToast('❌ Record not found. Try: 369805471203 or 450123984501', 'error');
    });
  });
}

/* ==========================================
   VITAL CERTIFICATES APPLICATION & DOWNLOADS
   ========================================== */
function initCertificatesPortal() {
  const form = document.getElementById('certificates-apply-form');
  const downloadBox = document.getElementById('certificate-download-box');
  const boxTitle = document.getElementById('cert-box-title');
  const btnDownload = document.getElementById('btn-download-pdf');
  
  let currentDocData = null;

  if (!form || !downloadBox || !btnDownload) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const docType = document.getElementById('certificate-type').value;
    const name = document.getElementById('certificate-applicant').value;
    const num = document.getElementById('certificate-id-num').value;
    const reason = document.getElementById('certificate-reason').value;

    fetch('/api/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: docType, name, idNum: num, reason })
    })
    .then(res => {
      if (!res.ok) throw new Error('API failure');
      return res.json();
    })
    .then(cert => {
      boxTitle.textContent = `${cert.title} Draft Ready`;
      currentDocData = cert;
      downloadBox.style.display = 'block';
      showToast(`📜 Draft compiled: ${cert.title}. Download activated!`, 'success');
    })
    .catch(err => {
      console.error('Error compiling certificate:', err);
      showToast('❌ Error generating certificate. Please try again.', 'error');
    });
  });

  btnDownload.addEventListener('click', () => {
    if (!currentDocData) return;

    const docContent = `
========================================================================
  GOVERNMENT OF ANDHRA PRADESH STATE | DEPARTMENT OF PANCHAYAT RAJ
             SEETHARAMPURAM THANDA GRAM PANCHAYAT CIVIC PORTAL
========================================================================
DOCUMENT TITLE: ${currentDocData.title.toUpperCase()}
VERIFICATION SERIAL: ${currentDocData.serial}
ISSUE DATE: ${currentDocData.date}
------------------------------------------------------------------------
APPLICANT NAME  : ${currentDocData.name}
IDENTIFIER CODE : ${currentDocData.idNum}
INTENDED USE    : ${currentDocData.reason.toUpperCase()}
------------------------------------------------------------------------
VERIFICATION STATUS: VERIFIED (SECURE BACKEND LOG)
This document is prepared based on Panchayat Local Asset registries and
digitized land surveys. Secure signature is simulated below.

Panchayat Signatory:
Shri Narasimha, Panchayat Secretary
Seetharampuram Thanda Gram Panchayat Office
========================================================================
    * THIS IS A SYSTEM GENERATED SECURE MOCK CIVIC DOCUMENT DRAFT *
    `;

    const blob = new Blob([docContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDocData.type}_${currentDocData.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('📥 Certificate text draft downloaded to local storage.', 'success');
  });
}

/* ==========================================
   HERO BACKGROUND SLIDER
   ========================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;
  // Prevent double-init
  if (window._heroSliderInterval) clearInterval(window._heroSliderInterval);
  
  let currentSlide = 0;
  
  window._heroSliderInterval = setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5500); // slightly longer = less frequent repaints
}

/* ==========================================
   SCROLL REVEAL EFFECT
   ========================================== */
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.service-card, .culture-card, .initiative-item, .stat-card, .section-header, .notices-board, .map-container'
  );
  
  const observerOptions = {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  revealTargets.forEach(target => {
    target.classList.add('scroll-reveal');
    observer.observe(target);
  });
}

/* ==========================================
   DYNAMIC HEADER SCROLL EFFECT
   ========================================== */
function initScrollHeader() {
  const header = document.getElementById('main-header');
  const sentinel = document.getElementById('scroll-sentinel');
  if (!header || !sentinel) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        header.classList.remove('scrolled');
      } else {
        header.classList.add('scrolled');
      }
    });
  }, {
    root: null,
    threshold: 0
  });

  observer.observe(sentinel);
}

/* ==========================================
   SCROLL PROGRESS BAR
   ========================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-bar');
  if (!progressBar) return;
  
  let ticking = false;
  
  const updateProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================
   CITIZEN FAQ ACCORDION
   ========================================== */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const answer = document.getElementById(trigger.getAttribute('aria-controls'));
      
      // Close other open FAQ items for a clean accordion behavior
      document.querySelectorAll('.faq-trigger').forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherAnswer = document.getElementById(otherTrigger.getAttribute('aria-controls'));
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
            otherAnswer.setAttribute('aria-hidden', 'true');
          }
          const icon = otherTrigger.querySelector('.faq-icon');
          if (icon) icon.textContent = '+';
        }
      });
      
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        if (answer) {
          answer.style.maxHeight = null;
          answer.setAttribute('aria-hidden', 'true');
        }
        const icon = trigger.querySelector('.faq-icon');
        if (icon) icon.textContent = '+';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.setAttribute('aria-hidden', 'false');
        }
        const icon = trigger.querySelector('.faq-icon');
        if (icon) icon.textContent = '−';
      }
    });
  });
}

/* ==========================================
   INTERACTIVE BACKGROUND PARTICLES SYSTEM
   ========================================== */
function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;

  // Disable particle canvas on mobile/tablet to eliminate lags, stutters, and hangs
  const isMobile = window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    canvas.style.display = 'none';
    return;
  } else {
    canvas.style.display = 'block';
  }

  // Prevent double-init and clean up previous event listeners
  if (canvas._animId) cancelAnimationFrame(canvas._animId);
  if (canvas._cleanup) canvas._cleanup();

  const ctx = canvas.getContext('2d');
  
  // Set and handle canvas sizing
  let resizeTimer = null;
  let auroraGrad = null;

  const createAuroraGradient = () => {
    const auroraY = canvas.height * 0.12;
    const auroraH = canvas.height * 0.25;
    auroraGrad = ctx.createLinearGradient(0, auroraY, 0, auroraY + auroraH);
    auroraGrad.addColorStop(0, 'rgba(80, 200, 120, 0)');
    auroraGrad.addColorStop(0.5, 'rgba(80, 200, 120, 1)');
    auroraGrad.addColorStop(1, 'rgba(80, 200, 120, 0)');
  };

  const setCanvasSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createAuroraGradient();
  };
  setCanvasSize();
  
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setCanvasSize, 150);
  };
  window.addEventListener('resize', handleResize);

  // Dynamic Theme Colors
  let primaryColor = 'hsl(145, 55%, 42%)';
  let accentColor  = 'hsl(38, 92%, 50%)';
  let lineColorPrimary = 'hsla(145, 55%, 42%, 0.08)';
  let lineColorAccent  = 'hsla(38, 92%, 50%, 0.12)';

  const updateColors = () => {
    const style = getComputedStyle(document.body);
    primaryColor = style.getPropertyValue('--color-secondary').trim() || 'hsl(145, 55%, 42%)';
    accentColor  = style.getPropertyValue('--color-accent').trim()    || 'hsl(38, 92%, 50%)';
    
    // Convert HSL to HSLA for alpha line drawing
    lineColorPrimary = primaryColor.replace('hsl(', 'hsla(').replace(')', ', 0.08)');
    lineColorAccent  = accentColor.replace('hsl(', 'hsla(').replace(')', ', 0.12)');
  };
  updateColors();

  // Watch for theme button clicks to update color scheme
  const toggleBtn = document.getElementById('btn-theme-toggle');
  let themeListener = null;
  if (toggleBtn) {
    themeListener = () => {
      setTimeout(updateColors, 60);
    };
    toggleBtn.addEventListener('click', themeListener);
  }

  // Mouse interactivity state
  let mouse = { x: -9999, y: -9999, active: false };
  let mouseTick = 0;
  
  const handleMouseMove = (e) => {
    mouseTick++;
    if (mouseTick % 2 === 0) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
  };
  const handleMouseLeave = () => {
    mouse.active = false;
  };
  
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  // 1. Sparkles from Click Burst
  let sparkles = [];
  const handleWindowClick = (e) => {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
      const speed = Math.random() * 2.5 + 1.5;
      sparkles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        size: Math.random() * 2 + 1.5
      });
    }
  };
  window.addEventListener('click', handleWindowClick, { passive: true });

  // 2. Star class (Twinkling stars)
  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.2 + 0.6;
      this.twinkleSpeed = Math.random() * 0.02 + 0.008;
      this.phase = Math.random() * Math.PI * 2;
      this.maxAlpha = Math.random() * 0.6 + 0.3;
      this.minAlpha = Math.random() * 0.15;
      this.isCross = Math.random() > 0.75;
    }
    draw(frame) {
      const alpha = this.minAlpha + (this.maxAlpha - this.minAlpha) * ((Math.sin(frame * this.twinkleSpeed + this.phase) + 1) / 2);
      ctx.globalAlpha = alpha;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();

      if (this.isCross && alpha > 0.45) {
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 3.5, this.y);
        ctx.lineTo(this.x + this.size * 3.5, this.y);
        ctx.moveTo(this.x, this.y - this.size * 3.5);
        ctx.lineTo(this.x, this.y + this.size * 3.5);
        
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  }

  // 3. ShootingStar class
  class ShootingStar {
    constructor() {
      this.active = false;
    }
    reset() {
      this.x = Math.random() * canvas.width * 0.8 + canvas.width * 0.2;
      this.y = Math.random() * canvas.height * 0.3;
      this.dx = -(Math.random() * 4 + 4);
      this.dy = Math.random() * 2 + 2;
      this.length = Math.random() * 80 + 50;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.015;
      this.active = true;
    }
    update() {
      if (!this.active) return;
      this.x += this.dx;
      this.y += this.dy;
      this.life -= this.decay;
      if (this.life <= 0 || this.x < 0 || this.y > canvas.height) {
        this.active = false;
      }
    }
    draw() {
      if (!this.active) return;
      ctx.globalAlpha = this.life;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.dx * (this.length / 10), this.y - this.dy * (this.length / 10));
      ctx.stroke();
    }
  }

  // 4. Interactive network particles
  class NetworkParticle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.5 + 0.8;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.01 + 0.003;
    }
    update() {
      this.angle += this.speed;
      this.x += this.vx + Math.sin(this.angle) * 0.06;
      this.y += this.vy + Math.cos(this.angle) * 0.06;
      
      if (this.x < 0) this.x = canvas.width;
      else if (this.x > canvas.width) this.x = 0;
      
      if (this.y < 0) this.y = canvas.height;
      else if (this.y > canvas.height) this.y = 0;
    }
  }

  // Instantiation
  const stars = [];
  const totalStars = 30; // Optimized from 50 to reduce CPU rendering load
  for (let i = 0; i < totalStars; i++) {
    stars.push(new Star());
  }

  const networkParticles = [];
  const totalNetParticles = Math.min(15, Math.floor((canvas.width * canvas.height) / 60000)); // Optimized from 30 / 32000 to improve math performance
  for (let i = 0; i < totalNetParticles; i++) {
    networkParticles.push(new NetworkParticle());
  }

  const shooters = [new ShootingStar(), new ShootingStar()];
  let nextShootTime = Date.now() + Math.random() * 4000 + 2000;

  const MOUSE_SQ = 130 * 130;
  const NET_SQ = 90 * 90;
  const MAX_CONN_PER_PARTICLE = 3;

  // Scroll tracking to pause repaints and optimize scrolling
  let isScrolling = false;
  let scrollTimeout = null;
  const handleScroll = () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 150);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  let frame = 0;
  let lastFrameTime = 0;
  const fpsInterval = 1000 / 30; // Throttle to 30fps

  const animate = (timestamp) => {
    // Stop loop if tab/page is hidden to save GPU cycles
    if (document.visibilityState === 'hidden') {
      canvas._animId = null;
      return;
    }

    canvas._animId = requestAnimationFrame(animate);

    // Skip repaint frame if user is active scrolling to prevent stutters
    if (isScrolling) {
      return;
    }

    // Throttle to 30fps
    const now = timestamp || (window.performance && window.performance.now ? window.performance.now() : Date.now());
    const elapsed = now - lastFrameTime;
    if (elapsed < fpsInterval) {
      return;
    }
    lastFrameTime = now - (elapsed % fpsInterval);

    frame++;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Shimmer/Aurora Band in the background (uses cached gradient)
    if (auroraGrad) {
      const auroraY = canvas.height * 0.12;
      const auroraH = canvas.height * 0.25;
      const wave = (Math.sin(frame * 0.005) + 1) / 2;
      ctx.globalAlpha = 0.015 + wave * 0.012;
      ctx.fillStyle = auroraGrad;
      ctx.fillRect(0, auroraY, canvas.width, auroraH);
    }

    // 2. Draw stars (without calling save/restore 50 times)
    for (let star of stars) {
      star.draw(frame);
    }
    ctx.globalAlpha = 1.0;

    // 3. Update & Draw Shooting Stars
    const nowTime = Date.now();
    if (nowTime > nextShootTime) {
      const idleShooter = shooters.find(s => !s.active);
      if (idleShooter) {
        idleShooter.reset();
      }
      nextShootTime = nowTime + Math.random() * 6000 + 4000;
    }
    for (let shooter of shooters) {
      if (shooter.active) {
        shooter.update();
        shooter.draw();
      }
    }
    ctx.globalAlpha = 1.0;

    // 4. Update & Draw Sparkles
    sparkles = sparkles.filter(sp => sp.life > 0);
    for (let sp of sparkles) {
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vy += 0.05;
      sp.vx *= 0.95;
      sp.vy *= 0.95;
      sp.life -= sp.decay;
      
      ctx.globalAlpha = sp.life;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // 5. Batched Draw: Connections
    ctx.lineWidth = 0.55;
    ctx.beginPath();
    ctx.strokeStyle = lineColorPrimary;
    for (let i = 0; i < networkParticles.length; i++) {
      const p1 = networkParticles[i];
      let connCount = 0;
      for (let j = i + 1; j < networkParticles.length; j++) {
        if (connCount >= MAX_CONN_PER_PARTICLE) break;
        const p2 = networkParticles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < NET_SQ) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          connCount++;
        }
      }
    }
    ctx.stroke();

    // 6. Batched Draw: Mouse connections
    if (mouse.active) {
      ctx.beginPath();
      ctx.strokeStyle = lineColorAccent;
      for (let i = 0; i < networkParticles.length; i++) {
        const p1 = networkParticles[i];
        const dx = mouse.x - p1.x;
        const dy = mouse.y - p1.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_SQ) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
        }
      }
      ctx.stroke();
    }

    // 7. Batched Draw: Network particles
    ctx.beginPath();
    ctx.fillStyle = primaryColor;
    for (let p of networkParticles) {
      p.update();
      ctx.moveTo(p.x + p.radius, p.y);
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    }
    ctx.fill();
  };

  canvas._animId = requestAnimationFrame(animate);

  // Visibility state event listener to pause/resume animation loop
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      if (canvas._animId) {
        cancelAnimationFrame(canvas._animId);
        canvas._animId = null;
      }
    } else {
      if (!canvas._animId) {
        lastFrameTime = window.performance && window.performance.now ? window.performance.now() : Date.now();
        canvas._animId = requestAnimationFrame(animate);
      }
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Clean up function to remove listeners
  canvas._cleanup = () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('click', handleWindowClick);
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (scrollTimeout) clearTimeout(scrollTimeout);
    if (toggleBtn && themeListener) {
      toggleBtn.removeEventListener('click', themeListener);
    }
  };
}


/* ==========================================
   HOUSEHOLD FACILITY UPDATES TRACKER
   ========================================== */
function initHouseholdUpdates() {
  const form = document.getElementById('household-update-form');
  if (!form) return;

  // Initial fetch of household updates
  fetchHouseholdUpdates();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const householdId = document.getElementById('update-household-id').value.trim();
    const privateToilet = document.getElementById('chk-toilet').checked;
    const vehicle = document.getElementById('chk-vehicle').checked;
    const tapWater = document.getElementById('chk-water').checked;
    const cleanEnergy = document.getElementById('chk-energy').checked;
    const ownHouse = document.getElementById('chk-house').checked;

    fetch('/api/household-updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        householdId,
        privateToilet,
        vehicle,
        tapWater,
        cleanEnergy,
        ownHouse
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('API failed');
      return res.json();
    })
    .then(data => {
      // Show success toast
      const toastMsg = getTranslatedText('toast_household_success', '✅ Household details updated successfully!');
      showToast(toastMsg, 'success');
      
      // Reset form
      form.reset();
      
      // Close modal
      closeModal('modal-household-update');
      
      // Render updated chart
      renderHouseholdChart(data);
    })
    .catch(err => {
      console.error('Error updating household details:', err);
      const errorMsg = getTranslatedText('toast_household_error', '❌ Error updating household details. Please try again.');
      showToast(errorMsg, 'error');
    });
  });
}

function fetchHouseholdUpdates() {
  fetch('/api/household-updates')
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  })
  .then(data => {
    renderHouseholdChart(data);
  })
  .catch(err => {
    console.error('Error fetching household updates:', err);
  });
}

function renderHouseholdChart(data) {
  const percentages = data.percentages || { privateToilet: 80, vehicle: 60, tapWater: 94, cleanEnergy: 50, ownHouse: 82 };
  
  // Update text values
  const valToilet = document.getElementById('val-toilet');
  if (valToilet) valToilet.textContent = `${percentages.privateToilet}%`;
  
  const valVehicle = document.getElementById('val-vehicle');
  if (valVehicle) valVehicle.textContent = `${percentages.vehicle}%`;
  
  const valWater = document.getElementById('val-water');
  if (valWater) valWater.textContent = `${percentages.tapWater}%`;
  
  const valEnergy = document.getElementById('val-energy');
  if (valEnergy) valEnergy.textContent = `${percentages.cleanEnergy}%`;

  const valHouse = document.getElementById('val-house');
  if (valHouse) valHouse.textContent = `${percentages.ownHouse}%`;

  // Update bar widths
  const barToilet = document.getElementById('bar-toilet');
  if (barToilet) barToilet.style.width = `${percentages.privateToilet}%`;
  
  const barVehicle = document.getElementById('bar-vehicle');
  if (barVehicle) barVehicle.style.width = `${percentages.vehicle}%`;
  
  const barWater = document.getElementById('bar-water');
  if (barWater) barWater.style.width = `${percentages.tapWater}%`;
  
  const barEnergy = document.getElementById('bar-energy');
  if (barEnergy) barEnergy.style.width = `${percentages.cleanEnergy}%`;

  const barHouse = document.getElementById('bar-house');
  if (barHouse) barHouse.style.width = `${percentages.ownHouse}%`;

  // Update badge
  const badge = document.getElementById('household-chart-badge');
  if (badge) {
    const totalCount = data.totalUpdates || 50;
    const selfReportedText = getTranslatedText('self_reported', 'Self-Reported');
    badge.textContent = `${selfReportedText} (${totalCount})`;
  }
}

/* ==========================================
   CULTURAL THEME SWITCHER
   ========================================== */
function initThemeSwitcher() {
  const toggleBtn = document.getElementById('btn-theme-toggle');
  const btnIcon = document.getElementById('theme-btn-icon');
  const btnText = document.getElementById('theme-btn-text');

  if (!toggleBtn) return;

  // Load saved theme preference if any
  const savedTheme = localStorage.getItem('panchayat-theme');
  if (savedTheme === 'banjara' || (!savedTheme && document.body.classList.contains('banjara-active'))) {
    document.body.classList.add('banjara-active');
    if (btnIcon) btnIcon.textContent = '🌿';
    if (btnText) btnText.textContent = getTranslatedText('theme_eco', 'Eco Theme');
  } else {
    if (savedTheme === 'eco') {
      document.body.classList.remove('banjara-active');
    }
    if (btnText) btnText.textContent = getTranslatedText('theme_banjara', 'Banjara Theme');
  }

  toggleBtn.addEventListener('click', () => {
    const isBanjara = document.body.classList.toggle('banjara-active');

    if (isBanjara) {
      localStorage.setItem('panchayat-theme', 'banjara');
      if (btnIcon) btnIcon.textContent = '🌿';
      if (btnText) btnText.textContent = getTranslatedText('theme_eco', 'Eco Theme');
      showToast(getTranslatedText('toast_banjara', '✨ Banjara Cultural Theme activated: Traditional crimson and shell-gold colors!'), 'success');
    } else {
      localStorage.setItem('panchayat-theme', 'eco');
      if (btnIcon) btnIcon.textContent = '✨';
      if (btnText) btnText.textContent = getTranslatedText('theme_banjara', 'Banjara Theme');
      showToast(getTranslatedText('toast_eco', '🌱 Eco Theme activated: Forest Green and Amber Gold!'), 'success');
    }
  });
}

/* ==========================================
   STAGGERED HERO & BRAND LETTER REVEALS
   ========================================== */
function initHeroTextReveal() {
  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');
  const brand = document.getElementById('gp-brand-title');

  const splitText = (el, baseDelay = 0) => {
    if (!el) return;
    const originalText = el.textContent.trim();
    el.textContent = '';
    
    const words = originalText.split(/\s+/);
    let globalIndex = 0;
    
    // Use Intl.Segmenter to segment by grapheme clusters (correct for Indic scripts like Telugu & Hindi)
    const segmenter = typeof Intl.Segmenter !== 'undefined'
      ? new Intl.Segmenter(currentLanguage || 'en', { granularity: 'grapheme' })
      : null;

    words.forEach((wordText, wordIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'anim-word';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      const chars = segmenter
        ? Array.from(segmenter.segment(wordText)).map(s => s.segment)
        : [...wordText];

      chars.forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char === ' ' ? '\u00A0' : char;
        charSpan.className = 'letter-reveal';
        charSpan.style.transitionDelay = `${baseDelay + globalIndex * 25}ms`;
        wordSpan.appendChild(charSpan);
        globalIndex++;
      });
      
      el.appendChild(wordSpan);
      
      if (wordIdx < words.length - 1) {
        const space = document.createTextNode(' ');
        el.appendChild(space);
      }
    });
  };

  splitText(subtitle, 150);
  splitText(title, 350);
  splitText(brand, 200);
}

function triggerHeroReveal() {
  setTimeout(() => {
    document.querySelectorAll('.letter-reveal').forEach(span => {
      span.classList.add('active');
    });
  }, 100);
}

/* ==========================================
   LOCAL TRANSLATION ENGINE (I18N)
   ========================================== */
let originalTexts = {};
let currentLanguage = 'en';

function initLanguageSelector() {
  const select = document.getElementById('lang-select');
  if (!select) return;

  // Save original texts on first load
  const selectors = Object.keys(translationDictionary.hi);
  selectors.forEach(sel => {
    if (sel.startsWith('#') || sel.startsWith('.')) {
      const el = document.querySelector(sel);
      if (el) {
        originalTexts[sel] = el.innerHTML.trim();
      }
    }
  });

  // Load saved language preference
  const savedLang = localStorage.getItem('panchayat-lang') || 'en';
  select.value = savedLang;
  applyTranslation(savedLang);

  select.addEventListener('change', (e) => {
    const lang = e.target.value;
    applyTranslation(lang);
    
    // Staggered letter animations re-trigger for translated titles
    initHeroTextReveal();
    triggerHeroReveal();

    const toastMsg = lang === 'hi' ? '🇮🇳 भाषा बदलकर हिंदी कर दी गई है।' : lang === 'te' ? '🇮🇳 భాష తెలుగులోకి మార్చబడింది.' : '🇬🇧 Language switched to English.';
    showToast(toastMsg, 'success');
  });
}

function applyTranslation(lang) {
  currentLanguage = lang;
  localStorage.setItem('panchayat-lang', lang);
  
  // Set lang class on body and attribute on html
  document.body.classList.remove('lang-en', 'lang-hi', 'lang-te');
  document.body.classList.add('lang-' + lang);
  document.documentElement.setAttribute('lang', lang);
  
  const selectors = Object.keys(translationDictionary.hi);
  selectors.forEach(sel => {
    if (!sel.startsWith('#') && !sel.startsWith('.')) return;
    
    const el = document.querySelector(sel);
    if (!el) return;

    if (lang === 'en') {
      if (originalTexts[sel]) {
        el.innerHTML = originalTexts[sel];
      }
    } else {
      if (translationDictionary[lang] && translationDictionary[lang][sel]) {
        el.innerHTML = translationDictionary[lang][sel];
      }
    }
  });

  // Dynamically update theme button labels based on new language state
  const btnText = document.getElementById('theme-btn-text');
  if (btnText) {
    const isBanjara = document.body.classList.contains('banjara-active');
    if (isBanjara) {
      btnText.textContent = getTranslatedText('theme_eco', 'Eco Theme');
    } else {
      btnText.textContent = getTranslatedText('theme_banjara', 'Banjara Theme');
    }
  }

  // Render welfare schemes in the active language
  renderBrowseSchemes();

  // Render dynamic main page contents in the active language
  if (typeof renderDynamicMainPageContent === 'function') {
    renderDynamicMainPageContent();
  }
}

function getTranslatedText(key, defaultText) {
  if (currentLanguage !== 'en' && translationDictionary[currentLanguage] && translationDictionary[currentLanguage][key]) {
    return translationDictionary[currentLanguage][key];
  }
  return defaultText;
}

const translationDictionary = {
  hi: {
    theme_banjara: "बंजारा थीम",
    theme_eco: "इको थीम",
    toast_banjara: "✨ बंजारा सांस्कृतिक थीम सक्रिय: पारंपरिक क्रिमसन और शैल-गोल्ड रंग!",
    toast_eco: "🌱 इको थीम सक्रिय: वन हरा और एम्बर गोल्ड!",
    '#gp-brand-title': 'सीतारामपुरम टांडा',
    '#gp-brand-subtitle': 'ग्राम पंचायत पोर्टल',
    '#menu-dropdown-text': 'नेविगेशन मेनू',
    '#nav-link-about': 'हमारे बारे में',
    '#nav-link-services': 'सेवाएं',
    '#nav-link-dashboard': 'डैशबोर्ड',
    '#nav-link-svr': 'एसवीआर मानचित्र',
    '#nav-link-sustainability': 'स्मार्ट हब',
    '#nav-link-culture': 'धरोहर',
    '#nav-btn-contact': 'संपर्क',
    '#nav-login-text': 'लॉगिन',
    '#hero-subtitle-text': 'सीतारामपुरम टांडा में स्वागत है',
    '#hero-welcome-title': '"धरोहर का संरक्षण, सतत प्रगति का प्रयास"',
    '#hero-tagline-text': 'ग्राम पंचायत का आधिकारिक नागरिक और कल्याण पोर्टल',
    '#hero-description-text': 'सामूहिक लचीलेपन के लिए ग्रामीण नागरिकों को पारदर्शी प्रशासन, तत्काल आजीविका संसाधनों, महत्वपूर्ण प्रमाणपत्रों और दैनिक सामुदायिक ट्रैकर्स से जोड़ना।',
    '#hero-btn-welfare': 'कल्याणकारी योजनाएं',
    '#hero-btn-grievance': 'शिकायत निवारण',
    '.quick-access-label': 'त्वरित पहुंच',
    '#quick-btn-agri span:last-child': 'कृषि इनपुट सहायता',
    '#quick-btn-water span:last-child': 'जल उपलब्धता ट्रैकर',
    '#quick-btn-ration span:last-child': 'राशन कार्ड सेवाएं',
    '#services .section-subtitle': 'नागरिक सेवाएं और बुनियादी आजीविका केंद्र',
    '#services-heading': 'प्रत्यक्ष आजीविका और नागरिक सहायता',
    '#services .section-desc': 'आवश्यक सरकारी दस्तावेज अनुरोधों, कृषि नियोजन तंत्र और उप-केंद्र चिकित्सा सुविधाओं तक त्वरित पहुंच प्राप्त करें।',
    '#service-card-certificates h3': 'महत्वपूर्ण प्रमाणपत्र',
    '#service-card-certificates p': 'आधिकारिक प्रमाणपत्रों, भूमि कब्जा रिकॉर्ड (अदंगल/1B ROR), आय दस्तावेज सत्यापन और जन्म पंजीकरण के लिए ऑनलाइन आवेदन करें।',
    '#service-btn-certificates': 'प्रमाणपत्रों के लिए आवेदन करें',
    '#service-card-agriculture h3': 'कृषि सहायता',
    '#service-card-agriculture p': 'बुआई की सिफारिशें प्राप्त करें, बीज और उर्वरक सब्सिडी अनुरोध जमा करें, और मिट्टी के स्वास्थ्य के आधार पर सिंचाई कार्यक्रम की गणना करें।',
    '#service-btn-agri': 'कृषि सहायता प्राप्त करें',
    '#service-card-healthcare h3': 'प्राथमिक स्वास्थ्य सेवा',
    '#service-card-healthcare p': 'स्वास्थ्य उप-केंद्र की परिचालन स्थिति, टीकाकरण शिविरों का कैलेंडर, आपातकालीन चिकित्सा परिवहन कार्यक्रम और नजदीकी चिकित्सा निर्देशिका की जांच करें।',
    '#service-btn-health': 'स्वास्थ्य सेवाएं देखें',
    '#development .section-subtitle': 'विकास मैट्रिक्स और सामुदायिक चुनौतियां',
    '#dev-heading': 'पारदर्शी ग्राम संपत्ति ट्रैकिंग',
    '#development .section-desc': 'संसाधन वृक्षारोपण के लिए इंटरैक्टिव जियोटैग देखें और जल संरक्षण, रोजगार और स्कूली शिक्षा तक पहुंच में सामुदायिक प्रयासों का पता लगाएं।',
    '.map-container h3': 'संसाधन और वन संपत्ति मानचित्र',
    '.map-container p': '📍 ट्रैक की गई संपत्तियां: जलवायु लचीलेपन और छाया संरक्षण के लिए 37+ जियोटैग किए गए वृक्षारोपण सक्रिय हैं।',
    '.dev-initiatives h3': 'वर्तमान आजीविका पहल',
    '.dev-initiatives > p': 'हमारी पंचायत पारदर्शी स्थानीय संसाधनों और बजट का उपयोग करके दीर्घकालिक सामुदायिक लचीलेपन के निर्माण के लिए बुनियादी चुनौतियों का समाधान करती है।',
    '.initiative-item:nth-child(1) h4': 'जल निर्भरता प्रबंधन',
    '.initiative-item:nth-child(1) p': 'सामुदायिक वर्षा जल संचयन, स्मार्ट बोरवेल रीचार्ज ग्रिड और अनुकूली राशनिंग कार्यक्रमों के माध्यम से वर्षा निर्भरता को न्यूनतम करना।',
    '#init-btn-water': 'जल डैशबोर्ड खोलें →',
    '.initiative-item:nth-child(2) h4': 'रोजगार पोर्टल',
    '.initiative-item:nth-child(2) p': 'मनरेगा मस्टर रोल, ग्रामीण श्रम आवश्यकताओं, व्यावसायिक कार्यशालाओं और युवा कृषि कौशल प्रशिक्षण पर सीधे स्थानीय अपडेट।',
    '#init-btn-employment': 'श्रम सूचनाएं देखें →',
    '.initiative-item:nth-child(3) h4': 'शिक्षा तक पहुंच',
    '.initiative-item:nth-child(3) p': 'पूरे गांव में छात्र पारगमन सहायता, परिवहन किराया अनुदान और बाहरी बस्तियों के लिए प्राथमिक स्कूल उपस्थिति पहल।',
    '#init-btn-education': 'छात्र परिवहन देखें →',
    '#cultural .section-subtitle': 'सांस्कृतिक आधार: पहचान और सादगी',
    '#cultural-heading': 'टांडा आजीविका और कलात्मकता का सम्मान',
    '#cultural .section-desc': 'हमारे बंजारा और लबाडी सामुदायिक विरासत की पारंपरिक जीवन शैली, घनिष्ठ एकता और गहरी कलात्मक जड़ों का संरक्षण।',
    '#culture-card-gond h3': 'पारंपरिक भित्ति चित्र',
    '#culture-card-gond p': 'गांव की दीवारों पर स्थानीय आदिवासी लोककथाओं, चित्रकला विधियों और पशु-केंद्रित आख्यानों को संरक्षित करने वाली दृश्य सुंदरता।',
    '#culture-card-housing h3': 'जलवायु-अनुकूल आवास',
    '#culture-card-housing p': 'गर्मी के फैलाव और मौसमी आराम के लिए प्राकृतिक रूप से डिजाइन किए गए पारंपरिक मिट्टी-अछूता और मिट्टी की टाइलों वाले घरों का प्रदर्शन।',
    '#culture-card-weaving h3': 'लंबाडी शिल्प कौशल',
    '#culture-card-weaving p': 'लंबाडी/बंजारा कारीगरों की पीढ़ीगत विरासत का सम्मान, जिसमें जीवंत धागे, दर्पण और कौड़ी (गोले) का उपयोग किया जाता है।',
    '#about .section-subtitle': 'सामुदायिक कोना और पंचायत पारदर्शिता',
    '#transparency-heading': 'सामुदायिक अपडेट और जनसांख्यिकी',
    '#about .section-desc': 'सीतारामपुरम टांडा के वर्तमान नोटिस, सामान्य आँकड़े और नागरिक नियोजन अपडेट के बारे में सूचित रहें।',
    '.notices-board h3': 'नवीनतम आधिकारिक नोटिस',
    '.notice-item:nth-child(1) h4': 'ग्राम सभा सूचना: मौसमी जल संसाधन योजना',
    '.notice-item:nth-child(1) p': 'वर्षा जल संचयन कार्यक्रम को अंतिम रूप देने और बोरवेल राशनिंग सीमाओं की जांच करने के लिए इस मंगलवार को सुबह 10 बजे पंचायत कार्यालय में एक आपातकालीन ग्राम सभा बुलाई गई है।',
    '.notice-item:nth-child(2) h4': 'इस सप्ताहांत अनुसूचित निःशुल्क स्वास्थ्य शिविर',
    '.notice-item:nth-child(2) p': 'मंडल अस्पताल के चिकित्सा अधिकारी इस शनिवार को सुबह 9 बजे से शाम 4 बजे तक स्थानीय प्राथमिक विद्यालय में मुफ्त स्वास्थ्य जांच, बाल चिकित्सा जांच और टीकाकरण अभियान चलाएंगे।',
    '.notice-item:nth-child(3) h4': 'प्राथमिक स्कूल परिवहन सब्सिडी जारी',
    '.notice-item:nth-child(3) p': 'हाई स्कूल पारगमन के लिए छात्र यात्रा भत्ता स्वीकृत किया गया है। पात्र माता-पिता प्रमाणपत्र आवेदन डाउनलोड कर सकते हैं और भत्ता प्राप्त करने के लिए रिकॉर्ड जमा कर सकते हैं।',
    '#village-glance-panel h3': 'सीतारामपुरम टांडा एक नज़र में',
    '#stat-households .stat-label': 'परिवार',
    '#stat-households .stat-desc': 'घनिष्ठ, बहु-पीढ़ीगत परिवार',
    '#stat-livelihood .stat-label': 'आजीविका',
    '#stat-livelihood .stat-desc': 'धान, मक्का, मिर्च और दालें',
    '#stat-dialect .stat-label': 'मूल बोली',
    '#stat-dialect .stat-desc': 'संरक्षित लंबाडी/बंजारा परंपराएं',
    '#stat-assets .stat-label': 'वन संपत्तियां',
    '#stat-assets .stat-desc': 'जियोटैग किए गए हरे चंदवा वृक्षारोपण',
    '.legend-txt-school': 'स्कूल',
    '.legend-txt-bus': 'बस स्टैंड',
    '#notice-dev-upgrades-title': 'बस स्टैंड और जिला परिषद हाई स्कूल निर्माण स्थिति',
    '#notice-dev-upgrades-body': 'पंचायत ने नए बस स्टैंड आश्रय के लिए सौर छत की खरीद को मंजूरी दी। जिला परिषद हाई स्कूल में डिजिटल लैब का निर्माण ८५% पूरा हो गया है, अगले महीने उद्घाटन की उम्मीद है।',
    '.budget-card h4 span:first-child': 'पंचायत बजट आवंटन',
    '.budget-card h4 span:last-child': 'वित्त वर्ष 2026-27',
    '.budget-bar-row:nth-child(1) span:first-child': '💧 जल कार्य और संचयन',
    '.budget-bar-row:nth-child(2) span:first-child': '🛠️ सड़कें और सौर प्रकाश व्यवस्था',
    '.budget-bar-row:nth-child(3) span:first-child': '🌲 वन आवरण और वृक्षारोपण',
    '.budget-bar-row:nth-child(4) span:first-child': '🚌 छात्र पारगमन और स्वास्थ्य शिविर',
    '#village-heritage-highlight h4': 'बंजारा विरासत का संरक्षण',
    '#village-heritage-highlight p': 'सीतारामपुरम टांडा गर्व से अपनी अनूठी बंजारा पहचान की रक्षा करता है। रंगीन दर्पण वेशभूषा और लोक गीतों से लेकर आदिवासी स्व-शासन परंपराओं तक, हम स्थायी सामुदायिक सुधारों के साथ ऐतिहासिक मूल्यों का मिश्रण करते हैं।',
    '#faq .section-subtitle': 'सामान्य प्रश्न',
    '#faq-heading': 'नागरिक हेल्पडेस्क अक्सर पूछे जाने वाले प्रश्न',
    '#faq .section-desc': 'नागरिक दस्तावेजों, आवेदन प्रतीक्षा समय और सीधे पोर्टल उपयोग दिशानिर्देशों पर त्वरित उत्तर।',
    '.faq-item:nth-child(1) .faq-trigger span:first-child': '📄 भूमि अदंगल रिकॉर्ड के लिए आवेदन करने के लिए किन दस्तावेजों की आवश्यकता है?',
    '.faq-item:nth-child(1) .faq-answer p': 'आपको अपने 12-अंकीय सर्वेक्षण संख्या, पहचान के लिए आधार कार्ड और पंजीकृत भूमि मालिक के नाम के विवरण की आवश्यकता है। आवेदन सीधे महत्वपूर्ण प्रमाणपत्र टैब के माध्यम से जमा किए जा सकते हैं।',
    '.faq-item:nth-child(2) .faq-trigger span:first-child': '⏱️ एक दायर शिकायत टिकट को हल करने में कितना समय लगता है?',
    '.faq-item:nth-child(2) .faq-answer p': 'सामान्य नागरिक मुद्दों (जैसे पानी के वाल्व लीक या कचरा साफ करना) का 24-48 घंटों के भीतर निरीक्षण किया जाता है। प्रमुख सड़क मरम्मत या बिजली ग्रिड संबंधी चिंताओं में 7-10 कार्य दिवस लग सकते हैं। आप शिकायत टैब में अपनी स्थिति का लाइव ट्रैक कर सकते हैं।',
    '.faq-item:nth-child(3) .faq-trigger span:first-child': '💼 मनरेगा ग्रामीण श्रम मजदूरी के लिए कौन पात्र है?',
    '.faq-item:nth-child(3) .faq-answer p': 'सीतारामपुरम टांडा ग्राम पंचायत के सभी वयस्क निवासी जिनके पास वैध जॉब कार्ड है, वे मानक दैनिक शारीरिक श्रम के लिए पात्र हैं। मजदूरी ₹300/दिन निर्धारित है। आप रोजगार पोर्टल में सक्रिय मस्टर रोल ब्राउज़ कर सकते हैं।',
    '.faq-item:nth-child(4) .faq-trigger span:first-child': '🎒 छात्र स्कूल शटल परिवहन पास सब्सिडी के लिए कैसे आवेदन करते?',
    '.faq-item:nth-child(4) .faq-answer p': 'माता-पिता वार्ड सदस्य से निवास सत्यापन पत्र और हाई स्कूल से अध्ययन प्रमाणपत्र जमा करके आवेदन कर सकते हैं। एक बार सत्यापित होने के बाद, स्कूल परिसर में ग्राम पंचायत शटल के लिए मुफ्त पास जारी किए जाते हैं।',
    '.footer-logo h2': 'सीतारामपुरम टांडा ग्राम पंचायत',
    '#footer-link-about': 'टांडा के बारे में',
    '#footer-link-services': 'सेवा निर्देशिका',
    '#footer-link-rti': 'सूचना का अधिकार (RTI)',
    '#footer-link-privacy': 'गोपनीयता नीति',
    '.footer-bottom p:first-child': '© 2026 सीतारामपुरम टांडा पंचायत | ग्रामीण विकास और पंचायत राज विभाग',
    '.footer-bottom p:last-child': 'आधिकारिक डिजिटल नागरिक नोड | विजयवाड़ा क्षेत्र, आंध्र प्रदेश राज्य सरकार',
    '#about-modal-title': 'सीतारामपुरम टांडा ग्राम पंचायत के बारे में',
    '#nav-link-gallery': 'मीडिया गैलरी',
    '#btn-gallery-text': 'गांव की तस्वीरें और वीडियो देखें',
    '#pillar-section-subtitle': 'स्मार्ट विलेज स्तंभ और एसडीजी',
    '#sustainability-heading': 'सामाजिक-पर्यावरणीय स्थिरता पहल',
    '#pillar-section-desc': 'हमारी ग्राम पंचायत दीर्घकालिक सामुदायिक कल्याण और पारिस्थितिक-सामाजिक लचीलापन सुनिश्चित करने के लिए प्रमुख स्थिरता क्षेत्रों में प्रगति को ट्रैक करती है।',
    '#pillar-title-health': 'स्वास्थ्य और स्वच्छता',
    '#pillar-desc-health': 'चिकित्सा उप-केंद्र की तैयारी, नियमित स्वच्छता अभियान, डिजिटल स्वास्थ्य रिकॉर्ड प्रबंधन, और स्वच्छ पेयजल लेखापरीक्षा।',
    '#pillar-title-infra': 'ग्राम बुनियादी ढांचा',
    '#pillar-desc-infra': 'सभी मौसम में अनुकूल पक्की सड़कें, सामुदायिक केंद्र संवर्धन, सौर स्ट्रीट ग्रिड एकीकरण, और डिजिटल ग्राम पंचायत केंद्र।',
    '#pillar-title-water': 'जल संरक्षण',
    '#pillar-desc-water': 'सामुदायिक वर्षा जल संचयन संरचनाएं, चेक डैम स्थिति लेखापरीक्षा, और स्मार्ट बोरवेल भूजल स्तर की निगरानी।',
    '#pillar-title-energy': 'ऊर्जा उपलब्धता और दक्षता',
    '#pillar-desc-energy': 'ऑफ-ग्रिड सौर ग्रिड संचालन, एलईडी स्ट्रीट लाइट, ऊर्जा दक्षता लेखापरीक्षा, और जैव-गैस ग्रिड पहल।',
    '#pillar-title-materials': 'सामग्री और संसाधन',
    '#pillar-desc-materials': 'शून्य-प्लास्टिक पैकेजिंग नीतियां, कचरा छांटने के केंद्र (सूखा/गीला कचरा), और स्थानीय पर्यावरण-सामग्रियों को बढ़ावा देना।',
    '#pillar-title-social': 'सामाजिक सामुदायिक कार्य',
    '#pillar-desc-social': 'स्वयं सहायता समूह (SHG) बैंकिंग सहकारी समितियां, ग्राम सभा नागरिक बैठकें, और प्राथमिक स्कूल पारगमन सहायता।',
    '#pillar-title-green': 'हरित नवाचार',
    '#pillar-desc-green': 'सामाजिक वानिकी वृक्षारोपण निर्देशांक लेखापरीक्षा, जलवायु-अनुकूल फसल चयन, और जैविक खाद नेटवर्क।',
    'toast_household_success': '✅ घरेलू विवरण सफलतापूर्वक अपडेट किए गए!',
    'toast_household_error': '❌ घरेलू विवरण अपडेट करने में त्रुटि। कृपया पुनः प्रयास करें।',
    'self_reported': 'स्व-रिपोर्टेड',
    '#household-chart-title': 'घरेलू सुविधा उन्नयन',
    '#household-chart-subtitle-text': 'उन्नत नागरिक सुविधाओं की रिपोर्ट करने वाले परिवारों का प्रतिशत।',
    '#label-toilet': '🚽 निजी शौचालय का उपयोग',
    '#label-vehicle': '🚗 निजी वाहन स्वामित्व',
    '#label-water': '🚰 सुरक्षित नल जल कनेक्शन',
    '#label-energy': '⚡ रूफटॉप सोलर / बायोगैस',
    '#label-house': '🏠 पक्के/स्वयं के घर का स्वामित्व',
    '#btn-text-facility-update': 'घरेलू स्थिति अपडेट करें',
    '#household-modal-title': 'घरेलू सुख-सुविधाओं की स्थिति अपडेट करें',
    '#household-modal-desc': 'ग्राम पंचायत डेटासेट को अपडेट करने में मदद करने के लिए अपने घर की उन्नत सुविधाओं की स्व-रिपोर्ट करें।',
    '#lbl-household-id': 'राशन कार्ड या घरेलू आईडी',
    '#lbl-select-amenities': 'अपने घर में मौजूद सुविधाओं का चयन करें:',
    '#chk-label-toilet': 'हम निजी शौचालय का उपयोग करते हैं',
    '#chk-label-vehicle': 'हमारे पास निजी वाहन है',
    '#chk-label-water': 'हमारे पास सुरक्षित नल जल कनेक्शन है',
    '#chk-label-energy': 'हम स्वच्छ ऊर्जा (सौर/बायोगैस) का उपयोग करते हैं',
    '#chk-label-house': 'हम अपने स्वयं के घर में रहते हैं',
    '#btn-submit-household-update': 'अपडेट सबमिट करें',
    '#about-section-subtitle': 'गाँव और आदिवासी प्रोफ़ाइल के बारे में',
    '#about-heading': 'सीतारामपुरम टांडा इतिहास और जनसांख्यिकी',
    '#about-section-desc': 'हमारी ग्राम पंचायत के अनूठे इतिहास, सांस्कृतिक विरासत, भौगोलिक विवरण और व्यापक प्रोफ़ाइल मेट्रिक्स का अन्वेषण करें।',
    '#about-history-title': 'हमारी विरासत और समझौता',
    '#about-history-p1': '<strong>इतिहास:</strong> सीतारामपुरम टांडा की स्थापना कई पीढ़ियों पहले बंजारा (लंबाडी) जनजाति के परिवारों द्वारा की गई थी, जो आंध्र प्रदेश के पहाड़ी क्षेत्रों में चले गए थे। एक अस्थायी बस्ती (टांडा) के रूप में शुरू होकर, यह एक स्थायी लचीले कृषि केंद्र के रूप में विकसित हुआ।',
    '#about-history-p2': '<strong>नामकरण उत्पत्ति:</strong> "सीतारामपुरम" नाम पहाड़ियों के बाहरी इलाके में स्थित ऐतिहासिक सीताराम मंदिर से लिया गया है, जहां समुदाय आज भी पूजा करता है। प्रत्यय "टांडा" बंजारा बस्ती का पारंपरिक शब्द है।',
    '#about-history-p3': '<strong>आदिवासी पहचान और संस्कृति:</strong> यह गाँव मुख्य रूप से लंबाडी समुदाय द्वारा बसा हुआ है, जो अपनी पारंपरिक रंग-बिरंगी कशीदाकारी पोशाक (दर्पण और कौड़ियों से सजी) और तीज त्योहार के लोक गीतों के माध्यम से अपनी पैतृक संस्कृति को जीवित रखे हुए है।',
    '#about-history-p4': '<strong>भूगोल और भाषा:</strong> आंध्र प्रदेश के पलनाडु जिले में स्थित, हमारे निवासी आपस में गोर बोली (मूल लंबाडी बोली) बोलते हैं, और बाहरी व्यापार के लिए तेलुगु या हिंदी का उपयोग करते हैं। नजदीकी शहर माचेरला (15 किमी) और नागार्जुन सागर (28 किमी) हैं।',
    '#about-profile-title': 'ग्राम प्रोफ़ाइल डेटा',
    '#profile-label-houses': 'कुल मकान',
    '#profile-label-population': 'कुल जनसंख्या',
    '#profile-label-male': 'पुरुष जनसंख्या',
    '#profile-label-female': 'महिला जनसंख्या',
    '#profile-label-children': 'बच्चे (0-6 वर्ष)',
    '#profile-label-seniors': 'वरिष्ठ नागरिक',
    '#profile-label-disabled': 'दिव्यांग व्यक्ति',
    '#infra-table-title': 'ग्राम बुनियादी ढांचा स्थिति',
    '#infra-th-facility': 'सुविधा / परिसंपत्ति',
    '#infra-th-good': 'अच्छी स्थिति',
    '#infra-th-needs': 'सुधार की आवश्यकता',
    '#infra-th-notes': 'वर्तमान कार्य / टिप्पणियाँ',
    '#infra-row-roads': '🛣️ सड़कें (मुख्य और आंतरिक संपर्क)',
    '#infra-desc-roads': 'सभी बस्तियों को मुख्य राजमार्ग से जोड़ने वाली पक्की सीमेंट सड़कें।',
    '#infra-row-drainage': '🌧️ जल निकासी (तूफान और सीवेज नालियां)',
    '#infra-desc-drainage': 'दक्षिणी नालियों की सफाई और कंक्रीट सुदृढ़ीकरण की आवश्यकता है।',
    '#infra-row-streetlights': '💡 स्ट्रीट लाइट्स (सौर और ग्रिड)',
    '#infra-desc-streetlights': '85 स्वचालित स्मार्ट सोलर एलईडी स्ट्रीट लाइटें लगाई गईं।',
    '#infra-row-bus': '🚌 बस सुविधाएं और आश्रय',
    '#infra-desc-bus': 'मुख्य मार्ग पारगमन आश्रय का सौर छत उन्नयन चल रहा है (60% पूर्ण)।',
    '#infra-row-halls': '🏫 सामुदायिक भवन',
    '#infra-desc-halls': 'स्थानीय त्योहारों और बैठकों के लिए स्वच्छ सामुदायिक केंद्र सक्रिय।',
    '#infra-row-office': '🏢 पंचायत भवन',
    '#infra-desc-office': 'पंचायत कार्यालय सौर ऊर्जा संचालित डिजिटल नागरिक केंद्र के रूप में कार्य करता है।',
    '#infra-row-solar': '☀️ सौर ऊर्जा ग्रिड (Solar Power Grid)',
    '#infra-desc-solar': 'पंचायत भवन में 24 किलोवाट सौर ग्रिड। बैटरी और इन्वर्टर सर्विसिंग की आवश्यकता है।',
    '#edu-title-schools-status': 'स्कूल और शैक्षिक स्थिति',
    '#edu-stat-schools': '1 प्राथमिक, 1 हाई स्कूल',
    '#edu-label-schools': 'उपलब्ध स्कूल',
    '#edu-stat-anganwadi': '2 आंगनवाड़ी केंद्र',
    '#edu-label-anganwadi': 'प्रारंभिक बाल देखभाल',
    '#edu-stat-students': '184 छात्र',
    '#edu-label-students': 'नामांकित छात्र',
    '#edu-stat-metrics': '68% / 4%',
    '#edu-label-metrics': 'साक्षरता दर / स्कूल छोड़ने की दर',
    '#edu-title-higher': 'उच्च शिक्षा सहायता',
    '#edu-desc-higher': 'वर्तमान में, गाँव के 28 छात्र माचेरला और आस-पास के कॉलेज में उच्च शिक्षा प्राप्त कर रहे हैं। उन्हें ग्राम पंचायत से यात्रा पास सब्सिडी मिलती है।',
    '#edu-title-shuttle': 'पंचायत शटल समय सारणी',
    '#edu-desc-shuttle': 'सीतारामपुरम टांडा बस्तियों और मंडल मुख्यालय के सरकारी हाई स्कूल के बीच समर्पित मुफ्त परिवहन सेवा।',
    '#edu-shuttle-col-route': 'मार्ग / दिशा',
    '#edu-shuttle-col-time': 'प्रस्थान का समय',
    '#edu-shuttle-route-1': 'सुबह का मार्ग: बस्तियाँ ➔ मंडल हाई स्कूल',
    '#edu-shuttle-route-2': 'सुबह का मार्ग: मुख्य सड़क ➔ मंडल हाई स्कूल',
    '#edu-shuttle-route-3': 'शाम का मार्ग: मंडल हाई स्कूल ➔ सभी बस्तियाँ',
    '#edu-title-allowances': 'छात्र भत्ते और सब्सिडी',
    '#edu-title-pass': 'हाई स्कूल बस पास सहायता',
    '#edu-desc-pass': 'कम आय वाले परिवारों के छात्रों के लिए आरटीसी बस पास शुल्क की 100% सब्सिडी। आवेदन प्रमाणपत्र पोर्टल में जमा किए जा सकते हैं।',
    '#edu-label-papers': 'आवश्यक दस्तावेज़:',
    '#edu-desc-papers': 'निवास प्रमाण पत्र, अध्ययन प्रमाण पत्र, माता-पिता का आय प्रमाण पत्र।',
    '#health-modal-title': 'स्वास्थ्य और स्वच्छता सेवाएँ',
    '#health-title-facilities': 'स्वास्थ्य सुविधाएं और कर्मचारी',
    '#health-facility-label-subcenter': 'ग्राम स्वास्थ्य उप-केंद्र',
    '#health-facility-desc-subcenter': 'पूरी तरह से चालू',
    '#health-facility-label-phc': 'नजदीकी पीएचसी/अस्पताल',
    '#health-facility-desc-phc': 'माचेरला मंडल अस्पताल (15 किमी)',
    '#health-facility-label-asha': 'गांव में आशा कार्यकर्ता',
    '#health-facility-desc-asha': '2 कार्यकर्ता (देविका और लक्ष्मी)',
    '#health-facility-label-ambulance': 'आपातकालीन एम्बुलेंस संपर्क',
    '#health-title-hygiene': 'स्वच्छता और स्वच्छता स्थिति',
    '#health-hygiene-label-toilets': 'शौचालयों की संख्या',
    '#health-hygiene-desc-toilets': '184 निजी घरेलू शौचालय, 2 सामुदायिक स्वच्छता परिसर',
    '#health-hygiene-label-odf': 'खुले में शौच मुक्त स्थिति',
    '#health-hygiene-desc-odf': '100% ओडीएफ (खुले में शौच मुक्त) प्रमाणित',
    '#health-hygiene-label-waste': 'अपशिष्ट प्रबंधन प्रथाएं',
    '#health-hygiene-desc-waste': 'दैनिक स्रोत पृथक्करण (गीला/सूखा), केंचुआ खाद यार्ड',
    '#health-hygiene-label-plastic': 'प्लास्टिक-मुक्त प्रवर्तन',
    '#health-hygiene-desc-plastic': 'सभी दुकानों में एकल-उपयोग वाले प्लास्टिक बैग पर प्रतिबंध',
    '#health-title-awareness': 'जागरूकता अभियान और टीकाकरण',
    '#health-awareness-title-vax': 'मासिक टीकाकरण अभियान',
    '#health-awareness-desc-vax': 'आंगनवाड़ी केंद्र पर हर महीने के पहले मंगलवार को अनुसूचित टीकाकरण (पोलियो, बीसीजी, एमएमआर) किया जाता है।',
    '#health-awareness-title-camps': 'नियमित स्वास्थ्य शिविर',
    '#health-awareness-desc-camps': 'माचेरला पीएचसी के डॉक्टरों द्वारा हर तिमाही में दो बार मुफ्त चिकित्सा और सामान्य स्वास्थ्य जांच शिविर आयोजित किए जाते हैं।',
    '#water-alert-banner-text': '⚠️ मानसून की तैयारी: 12 जून को टैंक की सफाई निर्धारित है। इस दिन पानी की आपूर्ति का समय अस्थायी रूप से सुबह 5:00 बजे से 6:30 बजे तक रहेगा। कृपया वर्षा जल का संचयन करें।',
    '#water-title-resource-infra': 'जल संसाधन बुनियादी ढांचा विवरण',
    '#water-title-sources': 'पेयजल के स्रोत',
    '#water-desc-sources': 'मुख्य पानी केंद्रीय पंचायत जलाशय से पाइपलाइन के माध्यम से दिया जाता है। 8 चालू बोरवेलों का बैकअप उपलब्ध है।',
    '#water-title-tanks': 'टैंक और वर्षा जल संचयन',
    '#water-desc-tanks': '1 मुख्य ओवरहेड टैंक (1,50,000 L) और 2 मिनी वाटर टैंक। सभी घरों में वर्षा जल संचयन अनिवार्य है।',
    '#water-title-shortages': 'पानी की कमी और गुणवत्ता',
    '#water-desc-shortages': 'गर्मियों में दक्षिणी बस्ती में पानी की कमी को राशनिंग से प्रबंधित किया जाता है। रासायनिक रूप से पानी सुरक्षित है (फ्लोराइड 0.8 ppm)।',
    '#agri-label-crops': 'प्रमुख फसलें',
    '#agri-desc-crops': 'धान, मक्का, मिर्च और दालें',
    '#agri-label-irrigation': 'सिंचाई के तरीके',
    '#agri-desc-irrigation': 'नहर प्रवाह, बोरवेल ड्रिप और वर्षा आधारित खेती',
    '#agri-label-fertilizer': 'उर्वरक का उपयोग',
    '#agri-desc-fertilizer': 'वर्मीकंपोस्ट (केंचुआ खाद) को प्राथमिकता दी जाती है',
    '#agri-label-schemes': 'सरकारी योजनाएं',
    '#agri-desc-schemes': 'रायथु बंधु निवेश सहायता, पीएम-किसान, 80% ड्रिप सब्सिडी',
    '#agri-crop-selector-desc': 'बुवाई अवधि, उर्वरक इनपुट खुराक और सरकारी बीज सब्सिडी सहायता आवंटन प्राप्त करने के लिए नीचे अपनी फसल का चयन करें।',
    '#count-population': '1,245',
    '#stat-population .stat-label': 'जनसंख्या',
    '#stat-population .stat-desc': 'कुल ग्रामीण जनसंख्या',
    '#stat-literacy .stat-value': '68%',
    '#stat-literacy .stat-label': 'साक्षरता दर',
    '#stat-literacy .stat-desc': 'स्कूल और उच्च शिक्षा दर',
    '#count-households': '230',
    '#stat-households .stat-label': 'परिवार',
    '#stat-households .stat-desc': 'घनिष्ठ बहु-पीढ़ीगत परिवार',
    '#count-livelihood': 'कृषि',
    '#stat-livelihood .stat-label': 'मुख्य व्यवसाय',
    '#stat-livelihood .stat-desc': 'धान, मक्का, मिर्च और दालों पर निर्भरता',
    '#nav-link-dashboard': 'डैशबोर्ड',
    '#nav-link-dashboard-pillars': 'डैशबोर्ड',
    '#village-dashboard-modal-title': '📊 ग्राम डैशबोर्ड',
    '#vd-lbl-tab-overview': 'अवलोकन',
    '#vd-lbl-tab-statistics': 'सांख्यिकी',
    '#vd-lbl-tab-education': 'शिक्षा',
    '#vd-lbl-tab-schemes': 'सरकारी योजनाएं',
    '#vd-lbl-tab-announcements': 'घोषणाएं',
    '#vd-lbl-sec-overview': 'अवलोकन कार्ड',
    '#vd-lbl-sec-stats': 'सांख्यिकी',
    '#vd-lbl-sec-edu': 'शिक्षा',
    '#vd-lbl-sec-schemes': 'सरकारी योजनाएं',
    '#vd-lbl-sec-announce': 'घोषणाएं',
    '#vd-lbl-total-pop': 'कुल जनसंख्या',
    '#vd-lbl-total-fam': 'कुल परिवार',
    '#vd-lbl-total-houses': 'कुल घर',
    '#vd-lbl-total-farmers': 'कुल किसान',
    '#vd-lbl-total-students': 'कुल छात्र',
    '#vd-lbl-total-employees': 'कुल कर्मचारी',
    '#vd-lbl-sarpanch': 'सरपंच का नाम',
    '#vd-lbl-num-wards': 'वार्डों की संख्या',
    '#vd-lbl-gender-split-title': '👥 पुरुष बनाम महिला जनसंख्या',
    '#vd-lbl-male': '👨 पुरुष',
    '#vd-lbl-female': '👩 महिला',
    '#vd-lbl-pop-split': 'जनसंख्या विभाजन',
    '#vd-lbl-lit-rate': 'साक्षरता दर',
    '#vd-lbl-lit-sub': 'वयस्क जनसंख्या का',
    '#vd-lbl-emp-rate': 'रोजगार दर',
    '#vd-lbl-emp-sub': 'कार्यशील आयु के वयस्कों का',
    '#vd-lbl-agri-stats-title': '🌾 कृषि सांख्यिकी',
    '#vd-lbl-agri-area': 'कृषि क्षेत्र',
    '#vd-lbl-irrigated-land': 'सिंचित भूमि',
    '#vd-lbl-main-crops': 'मुख्य फसलें',
    '#vd-lbl-farmers-subsidy': 'सब्सिडी वाले किसान',
    '#vd-lbl-num-schools': 'स्कूलों की संख्या',
    '#vd-lbl-edu-students': 'कुल छात्र',
    '#vd-lbl-edu-scholarships': 'प्रदान की गई छात्रवृत्ति',
    '#vd-lbl-scheme-beneficiaries': 'लाभार्थी',
    '#vd-lbl-scheme-active': 'सक्रिय योजनाएं',
    '#vd-lbl-scheme-pending': 'लंबित आवेदन',
    '#vd-lbl-up-event': 'आगामी कार्यक्रम',
    '#vd-lbl-gs-meeting': 'ग्राम सभा बैठक',
    '#vd-lbl-gov-notif': 'सरकारी अधिसूचना'
  },
  te: {
    theme_banjara: "బంజారా థీమ్",
    theme_eco: "ఇకో థీమ్",
    toast_banjara: "✨ బంజారా సాంస్కృతిక థీమ్ సక్రియం చేయబడింది: సాంప్రదాయ క్రిమ్సన్ మరియు షెల్-గోల్డ్ రంగులు!",
    toast_eco: "🌱 ఇకో థీమ్ సక్రియం చేయబడింది: అటవీ ఆకుపచ్చ మరియు అంబర్ గోల్డ్!",
    '#gp-brand-title': 'సీతారామపురం తండా',
    '#gp-brand-subtitle': 'గ్రామ పంచాయతీ పోర్టల్',
    '#menu-dropdown-text': 'నేవిగేషన్ మెనూ',
    '#nav-link-about': 'గురించి',
    '#nav-link-services': 'సేవలు',
    '#nav-link-dashboard': 'డ్యాష్‌బోర్డ్',
    '#nav-link-svr': 'SVR మ్యాప్',
    '#nav-link-sustainability': 'స్మార్ట్ హబ్',
    '#nav-link-culture': 'వారసత్వం',
    '#nav-btn-contact': 'సంప్రదించండి',
    '#nav-login-text': 'లాగిన్',
    '#hero-subtitle-text': 'సీతారామపురం తండాకు సుస్వాగతం',
    '#hero-welcome-title': '"వారసత్వాన్ని కాపాడుతూ, స్థిరమైన ప్రగతి సాధించడం"',
    '#hero-tagline-text': 'గ్రామ పంచాయతీ అధికారిక సివిక్ & సంక్షేమ పోర్టల్',
    '#hero-description-text': 'సామూహిక పటిష్టత కోసం పారదర్శక పరిపాలన, తక్షణ జీవనోపాధి వనరులు, కీలక ధృవీకరణ పత్రాలు మరియు రోజువారీ సంఘం ట్రాకర్లతో గ్రామీణ పౌరులను అనుసంధానించడం.',
    '#hero-btn-welfare': 'సంక్షేమ పథకాలు',
    '#hero-btn-grievance': 'సమస్యల పరిష్కారం',
    '.quick-access-label': 'తక్షణ సేవలు',
    '#quick-btn-agri span:last-child': 'వ్యవసాయ ఇన్పుట్ మద్దతు',
    '#quick-btn-water span:last-child': 'నీటి లభ్యత ట్రాకర్',
    '#quick-btn-ration span:last-child': 'రేషన్ కార్డ్ సేవలు',
    '#services .section-subtitle': 'పౌర సేవలు & ప్రాథమిక జీవనోపాధి కేంద్రం',
    '#services-heading': 'ప్రత్యక్ష జీవనోపాధి & పౌర మద్దతు',
    '#services .section-desc': 'అవసరమైన ప్రభుత్వ పత్రాల అభ్యర్థనలు, వ్యవసాయ ప్రణాళికలు మరియు ఉప-కేంద్ర వైద్య సేవలను త్వరగా పొందండి.',
    '#service-card-certificates h3': 'కీలక ధృవీకరణ పత్రాలు',
    '#service-card-certificates p': 'అధికారిక ధృవీకరణ పత్రాలు, భూమి అడంగల్ రికార్డులు (Adangal/1B ROR), ఆదాయ ధృవీకరణ పత్రాలు మరియు జనన నమోదుల కోసం ఆన్‌లైన్ లో దరఖాస్తు చేసుకోండి.',
    '#service-btn-certificates': 'ధృవీకరణ పత్రాలకు దరఖాస్తు',
    '#service-card-agriculture h3': 'వ్యవసాయ మద్దతు',
    '#service-card-agriculture p': 'సాగు సిఫార్సులను పొందండి, విత్తన & ఎరువుల రాయితీ అభ్యర్థనలను సమర్పించండి మరియు నేల ఆరోగ్యం ఆధారంగా నీటిపారుదల షెడ్యూల్‌లను లెక్కించండి.',
    '#service-btn-agri': 'వ్యవసాయ సహాయం పొందండి',
    '#service-card-healthcare h3': 'ప్రాథమిక ఆరోగ్య రక్షణ',
    '#service-card-healthcare p': 'ఆరోగ్య ఉప-కేంద్రం పనితీరు, టీకాల శిబిరాల క్యాలెండర్, అత్యవసర వైద్య రవాణా వివరాలు మరియు సమీప వైద్య డైరెక్టరీలను తనిఖీ చేయండి.',
    '#service-btn-health': 'ఆరోగ్య సేవలు చూడండి',
    '#development .section-subtitle': 'అభివృద్ధి సూచిక & కమ్యూనిటీ సవాళ్లు',
    '#dev-heading': 'పారదర్శక గ్రామ ఆస్తి ట్రాకింగ్',
    '#development .section-desc': 'వనరుల పెంపకం కోసం ఇంటరాక్టివ్ జియోట్యాగ్‌లను వీక్షించండి మరియు నీటి సంరక్షణ, ఉపాధి మరియు పాఠశాల సేవల్లో కమ్యూనిటీ ప్రయత్నాలను కనుగొనండి.',
    '.map-container h3': 'వనరులు & అటవీ ఆస్తి మ్యాప్',
    '.map-container p': '📍 ట్రాక్ చేసిన ఆస్తులు: వాతావరణ పటిష్టత & నీడ సంరక్షణ కోసం 37+ జియోట్యాగ్డ్ తోటలు క్రియాశీలంగా ఉన్నాయి.',
    '.dev-initiatives h3': 'ప్రస్తుత జీవనోపాధి కార్యక్రమాలు',
    '.dev-initiatives > p': 'మా పంచాయతీ పారదర్శక స్థానిక వనరులు మరియు బడ్జెట్లను ఉపయోగించి దీర్ఘకాలిక సమాజ పటిష్టతను నిర్మించడానికి ప్రాథమిక సవాళ్లను క్రమపద్ధతిలో పరిష్కరిస్తుంది.',
    '.initiative-item:nth-child(1) h4': 'నీటి లభ్యత నిర్వహణ',
    '.initiative-item:nth-child(1) p': 'సామూహిక వర్షపు నీటి సంరక్షణ, స్మార్ట్ బోరుబావుల రీఛార్జ్ గ్రిడ్లు మరియు అనుకూల నీటి సరఫరా షెడ్యూల్స్ ద్వారా వర్షాలపై ఆధారపడటాన్ని తగ్గించడం.',
    '#init-btn-water': 'నీటి డ్యాష్‌బోర్డ్ తెరవండి →',
    '.initiative-item:nth-child(2) h4': 'ఉపాధి పోర్టల్స్',
    '.initiative-item:nth-child(2) p': 'MGNREGS మస్టర్ రోల్స్, గ్రామీణ కార్మిక అవసరాలు, వృత్తి విద్యా శిక్షణలు మరియు వ్యవసాయ నైపుణ్య శిక్షణలపై ప్రత్యక్ష స్థానిక నవీకరణలు.',
    '#init-btn-employment': 'ఉపాధి నోటీసులు చూడండి →',
    '.initiative-item:nth-child(3) h4': 'విద్యా సదుపాయం',
    '.initiative-item:nth-child(3) p': 'గ్రామవ్యాప్తంగా విద్యార్థుల రవాణా మద్దతు, ప్రయాణ రాయితీలు మరియు వెలుపలి హ్యాంలెట్ల కోసం ప్రాథమిక పాఠశాల హాజరు కార్యక్రమాలు.',
    '#init-btn-education': 'విద్యార్థుల రవాణా చూడండి →',
    '#cultural .section-subtitle': 'సాంస్కృతిక పునాది: గుర్తింపు & సరళత',
    '#cultural-heading': 'తండా జీవనోపాధి & కళాత్మకత గౌరవించడం',
    '#cultural .section-desc': 'మా బంజారా మరియు లంబాడీ సమాజ వారసత్వం యొక్క సాంప్రదాయ జీవనశైలి, ఐక్యత మరియు లోతైన కళాత్మక మూలాలను పరిరక్షించడం.',
    '#culture-card-gond h3': 'సాంప్రదాయ గోడ చిత్రాలు',
    '#culture-card-gond p': 'గ్రామ గోడలపై స్థానిక గిరిజన జానపద కథలు, చిత్రలేఖన పద్ధతులు మరియు జంతు ఆధారిత కథనాలను సంరక్షించే దృశ్య అలంకరణ.',
    '#culture-card-housing h3': 'వాతావరణ-అనుకూల గృహాలు',
    '#culture-card-housing p': 'వేడిని నిరోధించేందుకు మరియు కాలానుగుణ సౌకర్యం కోసం సహజంగా రూపొందించబడిన సాంప్రదాయ మట్టి మరియు పెంకులతో కూడిన ఇళ్లను ప్రదర్శించడం.',
    '#culture-card-weaving h3': 'లంబాడీ హస్తకళ',
    '#culture-card-weaving p': 'శక్తివంతమైన దారాలు, అద్దాలు మరియు షెల్స్ ఉపయోగించే లంబాడీ/బంజారా కళాకారుల తరతరాల వారసత్వాన్ని గౌరవించడం.',
    '#about .section-subtitle': 'కమ్యూనిటీ కార్నర్ & పంచాయతీ పారదర్శకత',
    '#transparency-heading': 'కమ్యూనిటీ అప్‌డేట్స్ & డెమోగ్రాఫిక్స్',
    '#about .section-desc': 'సీతారామపురం తండా యొక్క నోటీసులు, సాధారణ గణాంకాలు మరియు పౌర ప్రణాళిక నవీకరణల గురించి సమాచారం పొందండి.',
    '.notices-board h3': 'ఇటీవలి అధికారిక నోటీసులు',
    '.notice-item:nth-child(1) h4': 'గ్రామ సభ నోటీసు: కాలానుగుణ నీటి వనరుల ప్రణాళిక',
    '.notice-item:nth-child(1) p': 'వర్షపు నీటి నిల్వ షెడ్యూల్స్ మరియు బోరుబావుల పరిమితులను ఖరారు చేయడానికి ఈ మంగళవారం ఉదయం 10 గంటలకు పంచాయతీ కార్యాలయంలో అత్యవసర గ్రామసభ ఏర్పాటు చేయబడింది.',
    '.notice-item:nth-child(2) h4': 'ఈ వారాంతంలో ఉచిత వైద్య శిబిరం',
    '.notice-item:nth-child(2) p': 'మండల ఆసుపత్రి వైద్య అధికారులు ఈ శనివారం ఉదయం 9 నుండి సాయంత్రం 4 గంటల వరకు స్థానిక ప్రాథమిక పాఠశాలలో ఉచిత ఆరోగ్య పరీక్షలు, పిల్లల పరీక్షలు మరియు టీకాల శిబిరాన్ని నిర్వహిస్తారు.',
    '.notice-item:nth-child(3) h4': 'ప్రాథమిక పాఠశాల రవాణా రాయితీలు విడుదల',
    '.notice-item:nth-child(3) p': 'హైస్కూల్ ప్రయాణాలకు విద్యార్థుల రవాణా భత్యం ఆమోదించబడింది. అర్హులైన తల్లిదండ్రులు ధృవీకరణ పత్ర దరหัสులను డౌన్‌లోడ్ చేసుకుని భత్యం పొందడానికి సమర్పించవచ్చు.',
    '#village-glance-panel h3': 'సీతారామపురం తండా ఒక చూపులో',
    '#stat-households .stat-label': 'ఇళ్ళు',
    '#stat-households .stat-desc': 'దగ్గరి సంబంధాలు గల, బహుళ తరాల కుటుంబాలు',
    '#stat-livelihood .stat-label': 'జీవనోపాధి',
    '#stat-livelihood .stat-desc': 'వరి, మొక్కజొన్న, మిరప మరియు పప్పుధాన్యాలు',
    '#stat-dialect .stat-label': 'స్థానిక యాస',
    '#stat-dialect .stat-desc': 'భద్రపరచబడిన లంబాడీ/బంజారా సంప్రదాయాలు',
    '#stat-assets .stat-label': 'అటవీ ఆస్తులు',
    '#stat-assets .stat-desc': 'జియోట్యాగ్డ్ ఆకుపచ్చ తోటలు',
    '.legend-txt-school': 'పాఠశాల',
    '.legend-txt-bus': 'బస్ స్టాండ్',
    '#notice-dev-upgrades-title': 'బస్ స్టాండ్ & జెడ్పీ హై స్కూల్ నిర్మాణ స్థితి',
    '#notice-dev-upgrades-body': 'కొత్త బస్ స్టాండ్ షెల్టర్ కోసం సోలార్ రూఫింగ్ కొనుగోలుకు పంచాయతీ ఆమోదం తెలిపింది. జెడ్పీ ఉన్నత పాఠశాలలో డిజిటల్ ల్యాబ్ నిర్మాణం 85% పూర్తయింది, వచ్చే నెలలో ప్రారంభోత్సవాలు ఆశించవచ్చు.',
    '.budget-card h4 span:first-child': 'పంచాయతీ బడ్జెట్ కేటాయింపు',
    '.budget-card h4 span:last-child': 'FY 2026-27',
    '.budget-bar-row:nth-child(1) span:first-child': '💧 నీటి పనులు & వర్షపు నీటి నిల్వ',
    '.budget-bar-row:nth-child(2) span:first-child': '🛠️ రోడ్లు & సోలార్ లైటింగ్',
    '.budget-bar-row:nth-child(3) span:first-child': '🌲 అటవీ విస్తీర్ణం & తోటల పెంపకం',
    '.budget-bar-row:nth-child(4) span:first-child': '🚌 విద్యార్థుల రవాణా & ఆరోగ్య శిబిరం',
    '#village-heritage-highlight h4': 'బంజారా వారసత్వ పరిరక్షణ',
    '#village-heritage-highlight p': 'సీతారామపురం తండా గర్వంగా తన ప్రత్యేకమైన బంజారా గుర్తింపును కాపాడుకుంటుంది. రంగురంగుల అద్దాల వస్త్రాలు మరియు జానపద గీతాల నుండి గిరిజన స్వపరిపాలన సంప్రదాయాల వరకు, మేము చారిత్రక విలువలను సమాజ స్థిరమైన ప్రగతితో అనుసంధానిస్తాము.',
    '#faq .section-subtitle': 'సాధారణ ప్రశ్నలు',
    '#faq-heading': 'సిటిజన్ హెల్ప్‌డెస్క్ తరచుగా అడిగే ప్రశ్నలు',
    '#faq .section-desc': 'పౌర పత్రాలు, దరఖాస్తుల నిరీక్షణ సమయం మరియు పోర్టల్ వినియోగ మార్గదర్శకాలపై త్వరిత సమాధానాలు.',
    '.faq-item:nth-child(1) .faq-trigger span:first-child': '📄 భూమి అడంగల్ రికార్డు కోసం దరఖాస్తు చేయడానికి ఏ పత్రాలు అవసరం?',
    '.faq-item:nth-child(1) .faq-answer p': 'మీకు 12-అంకెల సర్వే నంబర్, గుర్తింపు కోసం ఆధార్ కార్డ్ మరియు రిజిస్టర్డ్ భూయజమాని పేరు వివరాలు అవసరం. దరఖాస్తులను నేరుగా కీలక ధృవీకరణ పత్రాల ట్యాబ్ ద్వారా సమర్పించవచ్చు.',
    '.faq-item:nth-child(2) .faq-trigger span:first-child': '⏱️ ఫిర్యాదు టిక్కెట్‌ను పరిష్కరించడానికి ఎంత సమయం పడుతుంది?',
    '.faq-item:nth-child(2) .faq-answer p': 'సాధారణ పౌర సమస్యలు (నీటి లీక్‌లు లేదా చెత్త క్లియరింగ్ వంటివి) 24-48 గంటల్లో పరిష్కరించబడతాయి. రోడ్ల మరమ్మతులకు 7-10 పనిదినాలు పట్టవచ్చు. మీరు మీ స్థితిని లైవ్‌గా ట్రాక్ చేయవచ్చు.',
    '.faq-item:nth-child(3) .faq-trigger span:first-child': '💼 MGNREGS గ్రామీణ ఉపాధి వేతనాలకు ఎవరు అర్హులు?',
    '.faq-item:nth-child(3) .faq-answer p': 'చెల్లుబాటు అయ్యే జాబ్ కార్డ్ కలిగి ఉన్న సీతారామపురం తండా గ్రామ పంచాయతీలోని వయోజన నివాసితులందరూ ప్రామాణిక రోజువారీ ఉపాధి పనులకు అర్హులు. వేతనాలు రోజుకు ₹300 గా నిర్ణయించబడ్డాయి. ఉపాధి పోర్టల్‌లో ఉపాధి పనులను చూడవచ్చు.',
    '.faq-item:nth-child(4) .faq-trigger span:first-child': '🎒 విద్యార్థులు ఉచిత బస్సు రవాణా పాస్ సబ్సిడీల కోసం ఎలా దరఖాస్తు చేయాలి?',
    '.faq-item:nth-child(4) .faq-answer p': 'తల్లిదండ్రులు వార్డు సభ్యుని నుండి నివాస ధృవీకరణ పత్రం మరియు ఉన్నత పాఠశాల నుండి అధ్యయన ధృవీకరణ పత్రాన్ని సమర్పించడం ద్వారా దరఖాస్తు చేసుకోవచ్చు. ధృవీకరించిన తర్వాత, గ్రామ పంచాయతీ షటిల్ కోసం ఉచిత పాస్‌లు జారీ చేయబడతాయి.',
    '.footer-logo h2': 'సీతారామపురం తండా గ్రామ పంచాయతీ',
    '#footer-link-about': 'తండా గురించి',
    '#footer-link-services': 'సేవల డైరెక్టరీ',
    '#footer-link-rti': 'సమాచార హక్కు చట్టం (RTI)',
    '#footer-link-privacy': 'గోప్యతా విధానం',
    '.footer-bottom p:first-child': '© 2026 సీతారామపురం తండా పంచాయితీ | గ్రామీణాభివృద్ధి & పంచాయతీ రాజ్ శాఖ',
    '.footer-bottom p:last-child': 'అధికారిక డిజిటల్ సివిక్ నోడ్ | విజయవాడ ప్రాంతం, ఆంధ్రప్రదేశ్ ప్రభుత్వ రాష్ట్రం',
    '#about-modal-title': 'సీతారామపురం తండా గ్రామ పంచాయతీ గురించి',
    '#nav-link-gallery': 'మీడియా గ్యాలరీ',
    '#btn-gallery-text': 'గ్రామ ఫోటోలు & వీడియోలు చూడండి',
    '#pillar-section-subtitle': 'స్మార్ట్ విలేజ్ పిల్లర్స్ & SDG',
    '#sustainability-heading': 'సామాజిక-పర్యావరణ స్థిరత్వ కార్యక్రమాలు',
    '#pillar-section-desc': 'మా గ్రామ పంచాయతీ దీర్ఘకాలిక సమాజ సంక్షేమం మరియు పర్యావరణ-సామాజిక పటిష్టతను నిర్ధారించడానికి కీలక స్థిరత్వ రంగాలలో పురోగతిని ట్రాక్ చేస్తుంది.',
    '#pillar-title-health': 'ఆరోగ్యం & పరిశుభ్రత',
    '#pillar-desc-health': 'వైద్య ఉప-కేంద్రం సన్నద్ధత, క్రమం తప్పకుండా పారిశుద్ధ్య కార్యక్రమాలు, డిజిటల్ ఆరోగ్య రికార్డుల నిర్వహణ మరియు స్వచ్ఛమైన త్రాగునీటి ఆడిట్.',
    '#pillar-title-infra': 'గ్రామ మౌలిక సదుపాయాలు',
    '#pillar-desc-infra': 'అన్ని వాతావరణాలకు అనుకూలమైన సిమెంట్ రోడ్లు, కమ్యూనిటీ సెంటర్ ఆధునీకరణ, సోలార్ వీధి లైట్ల గ్రిడ్ మరియు డిజిటల్ గ్రామ పంచాయతీ కేంద్రాలు.',
    '#pillar-title-water': 'జల సంరక్షణ',
    '#pillar-desc-water': 'సామూహిక వర్షపు నీటి నిల్వ నిర్మాణాలు, చెక్ డ్యామ్‌ల ఆడిట్ మరియు స్మార్ట్ బోరుబావుల భూగర్భ జలాల పర్యవేక్షణ.',
    '#pillar-title-energy': 'విద్యుత్ లభ్యత & సామర్థ్యం',
    '#pillar-desc-energy': 'ఆఫ్-గ్రిడ్ సోలార్ పవర్ ప్లాంట్ నిర్వహణ, ఎల్ఈడీ వీధి దీపాలు, ఇంధన సామర్థ్య ఆడిట్ మరియు బయో-గ్యాస్ గ్రిడ్ కార్యక్రమాలు.',
    '#pillar-title-materials': 'వనరులు & ముడి పదార్థాలు',
    '#pillar-desc-materials': 'ప్లాస్టిక్ రహిత ప్యాకేజింగ్ విధానాలు, తడి-పొడి చెత్త వేరుచేసే కేంద్రాలు మరియు స్థానిక పర్యావరణ అనుకూల వస్తువుల ప్రోత్సాహం.',
    '#pillar-title-social': 'సామాజిక కమ్యూనిటీ పనులు',
    '#pillar-desc-social': 'మహిళా స్వయం సహాయక సంఘాలు (SHG), గ్రామసభ పౌరుల సమావేశాలు మరియు ప్రాథమిక పాఠశాల విద్యార్థుల ఉచిత రవాణా సదుపాయం.',
    '#pillar-title-green': 'హరిత ఆవిష్కరణలు',
    '#pillar-desc-green': 'సామాజిక అటవీ తోటల పెంపకం ఆడిట్, వాతావరణ అనుకూల పంటల ఎంపిక మరియు సేంద్రీయ ఎరువుల నెట్‌వర్క్.',
    'toast_household_success': '✅ గృహ వివరాలు విజయవంతంగా అప్‌డేట్ చేయబడ్డాయి!',
    'toast_household_error': '❌ గృహ వివరాల అప్‌డేట్‌లో లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    'self_reported': 'స్వీయ నివేదిక',
    '#household-chart-title': 'గృహ సదుపాయాల ప్రగతి',
    '#household-chart-subtitle-text': 'గ్రామంలో ఆధునిక పౌర సదుపాయాలు కలిగి ఉన్న గృహాల శాతం.',
    '#label-toilet': '🚽 వ్యక్తిగత మరుగుదొడ్డి వినియోగం',
    '#label-vehicle': '🚗 సొంత వాహనం కలిగి ఉండటం',
    '#label-water': '🚰 సురక్షిత కుళాయి నీటి కనెక్షన్',
    '#label-energy': '⚡ సోలార్ పవర్ / బయో-గ్యాస్',
    '#label-house': '🏠 సొంత ఇల్లు కలిగి ఉండటం',
    '#btn-text-facility-update': 'గృహ సదుపాయాల స్థితిని అప్‌డేట్ చేయి',
    '#household-modal-title': 'గృహ సదుపాయాల సమాచార అప్‌డేట్',
    '#household-modal-desc': 'గ్రామ పంచాయతీ డేటాసెట్‌ను అప్‌డేట్ చేయడానికి మీ గృహ సదుపాయాల సమాచారాన్ని స్వీయ-నివేదించండి.',
    '#lbl-household-id': 'రేషన్ కార్డ్ లేదా గృహ ఐడి',
    '#lbl-select-amenities': 'మీ గృహంలో ఉన్న సదుపాయాలను ఎంచుకోండి:',
    '#chk-label-toilet': 'మేము వ్యక్తిగత మరుగుదొడ్డి వాడుతున్నాము',
    '#chk-label-vehicle': 'మాకు సొంత వాహనం ఉంది',
    '#chk-label-water': 'మాకు సురక్షిత కుళాయి నీటి కనెక్షన్ ఉంది',
    '#chk-label-energy': 'మేము హరిత ఇంధనం (సోలార్/బయో-గ్యాస్) వాడుతున్నాము',
    '#chk-label-house': 'మేము మా సొంత ఇంట్లో నివసిస్తున్నాము',
    '#btn-submit-household-update': 'సమాచారాన్ని సమర్పించు',
    '#about-section-subtitle': 'గ్రామం & గిరిజన ప్రొఫైల్ గురించి',
    '#about-heading': 'సీతారామపురం తండా చరిత్ర & జనాభా వివరాలు',
    '#about-section-desc': 'మా గ్రామ పంచాయతీ యొక్క ప్రత్యేక చరిత్ర, సాంస్కృతిక వారసత్వం, భౌగోళిక వివరాలు మరియు సమగ్ర ప్రొఫైల్ కొలతలను అన్వేషించండి.',
    '#about-history-title': 'మా వారసత్వం & స్థిరనివాసం',
    '#about-history-p1': '<strong>చరిత్ర:</strong> సీతారామపురం తండా కొన్ని తరాల క్రితం ఆంధ్రప్రదేశ్ కొండ ప్రాంతాలకు వలస వచ్చిన బంజారా (లంబాడీ) గిరిజన కుటుంబాల ద్వారా ఏర్పడింది. ఒక తాత్కాలిక స్థావరం (తండా) గా ప్రారంభమై, ఇది శాశ్వత వ్యవసాయ కేంద్రంగా ఎదిగింది.',
    '#about-history-p2': '<strong>పేరు వెనుక చరిత్ర:</strong> కొండల శివార్లలో ఉన్న చారిత్రాత్మక సీతారామ ఆలయం నుండి "సీతారామపురం" అనే పేరు వచ్చింది, ఇక్కడ సమాజం నేటికీ పూజలు నిర్వహిస్తుంది. "తండా" అనేది బంజారా స్థావరానికి సంప్రదాయ పదం.',
    '#about-history-p3': '<strong>గిరిజన గుర్తింపు & సంస్కృతి:</strong> ఈ గ్రామంలో ప్రధానంగా లంబాడీ సమాజం నివసిస్తుంది, వీరు తమ సాంప్రదాయ అద్దాలు, షెల్స్ కలిగిన రంగురంగుల దుస్తులు మరియు తీజ్ పండుగ జానపద పాటల ద్వారా తమ సంస్కృతిని కాపాడుకుంటున్నారు.',
    '#about-history-p4': '<strong>భౌగోళికం & భాష:</strong> ఆంధ్రప్రదేశ్ లోని పల్నాడు జిల్లాలో ఉన్న ఈ తండా నివాసితులు అంతర్గతంగా గోర్ బోలి (లంబాడీ భాష) మాట్లాడారు, వ్యాపార లావాదేవీల కొరకు తెలుగు లేదా హిందీ ఉపయోగిస్తారు. సమీప పట్టణాలు మాచర్ల (15 కి.మీ) మరియు నాగార్జున సాగర్ (28 కి.మీ).',
    '#about-profile-title': 'గ్రామ ప్రొఫైల్ సమాచారం',
    '#profile-label-houses': 'మొత్తం ఇళ్లు',
    '#profile-label-population': 'మొత్తం జనాభా',
    '#profile-label-male': 'పురుషుల జనాభా',
    '#profile-label-female': 'మహిళల జనాభా',
    '#profile-label-children': 'పిల్లలు (0-6 సం.)',
    '#profile-label-seniors': 'వృద్ధులు',
    '#profile-label-disabled': 'వికలాంగులు',
    '#infra-table-title': 'గ్రామ మౌలిక సదుపాయాల స్థితి',
    '#infra-th-facility': 'సదుపాయం / ఆస్తి',
    '#infra-th-good': 'మంచి పరిస్థితి',
    '#infra-th-needs': 'మెరుగుదల అవసరం',
    '#infra-th-notes': 'ప్రస్తుత చర్యలు / గమనికలు',
    '#infra-row-roads': '🛣️ రోడ్లు (ప్రధాన & తండా లింకులు)',
    '#infra-desc-roads': 'అన్ని తండాలను ప్రధాన రహదారితో కలిపే సిమెంట్ రోడ్లు.',
    '#infra-row-drainage': '🌧️ మురుగునీరు (వర్షపు నీరు & మురుగు కాలువలు)',
    '#infra-desc-drainage': 'దక్షిణ కాలువలను శుభ్రపరచడం మరియు సిమెంట్ పటిష్ఠత అవసరం.',
    '#infra-row-streetlights': '💡 వీధి దీపాలు (సోలార్ & గ్రిడ్)',
    '#infra-desc-streetlights': '85 ఆటోమేటిక్ స్మార్ట్ సోలార్ ఎల్ఈడీ వీధి దీపాలు ఏర్పాటు చేసాము.',
    '#infra-row-bus': '🚌 బస్సు సౌకర్యాలు & బస్ స్టాండ్లు',
    '#infra-desc-bus': 'ప్రధాన రహదారి బస్టాండ్ వద్ద సోలార్ రూఫ్ అప్‌గ్రేడ్ జరుగుతోంది (60% పూర్తయింది).',
    '#infra-row-halls': '🏫 కమ్యూనిటీ హాళ్లు',
    '#infra-desc-halls': 'స్థానిక పండుగలు, సమావేశాలకు కమ్యూనిటీ హాళ్లు అందుబాటులో ఉన్నాయి.',
    '#infra-row-office': '🏢 పంచాయతీ భవనాలు',
    '#infra-desc-office': 'పంచాయతీ కార్యాలయం సోలార్ డిజిటల్ సిటిజన్ హబ్‌గా పనిచేస్తుంది.',
    '#infra-row-solar': '☀️ సోలార్ పవర్ గ్రిడ్ (Solar Power Grid)',
    '#infra-desc-solar': 'పంచాయతీ భవనం వద్ద 24 kW సోలార్ గ్రిడ్. బ్యాటరీ మరియు ఇన్వర్టర్ సర్వీసింగ్ అవసరం.',
    '#edu-title-schools-status': 'పాఠశాలలు & విద్యా స్థితి',
    '#edu-stat-schools': '1 ప్రాథమిక, 1 ఉన్నత పాఠశాల',
    '#edu-label-schools': 'అందుబాటులో ఉన్న పాఠశాలలు',
    '#edu-stat-anganwadi': '2 అంగన్‌వాడీ కేంద్రాలు',
    '#edu-label-anganwadi': 'శిశు సంరక్షణ',
    '#edu-stat-students': '184 మంది విద్యార్థులు',
    '#edu-label-students': 'నమోదైన విద్యార్థులు',
    '#edu-stat-metrics': '68% / 4%',
    '#edu-label-metrics': 'అక్షరాస్యత / డ్రాపౌట్ శాతం',
    '#edu-title-higher': 'ఉన్నత విద్యా మద్దతు',
    '#edu-desc-higher': 'ప్రస్తుతం, గ్రామానికి చెందిన 28 మంది విద్యార్థులు మాచర్ల మరియు సమీప కాలేజీలలో ఉన్నత విద్యను అభ్యసిస్తున్నారు. వీరికి గ్రామ పంచాయతీ నుండి రవాణా రాయితీ అందుతోంది.',
    '#edu-title-shuttle': 'పంచాయతీ ఉచిత శటిల్ టైమ్‌టేబుల్',
    '#edu-desc-shuttle': 'సీతారామపురం తండా మరియు మండల కేంద్రంలోని ప్రభుత్వ ఉన్నత పాఠశాల మధ్య ఉచిత రవాణా సేవ.',
    '#edu-shuttle-col-route': 'మార్గం / దిశ',
    '#edu-shuttle-col-time': 'బయలుదేరే సమయం',
    '#edu-shuttle-route-1': 'ఉదయం మార్గం: తండాల నుండి ➔ ఉన్నత పాఠశాల',
    '#edu-shuttle-route-2': 'ఉదయం మార్గం: ప్రధాన రహదారి నుండి ➔ ఉన్నత పాఠశాల',
    '#edu-shuttle-route-3': 'సాయంత్రం మార్గం: ఉన్నత పాఠశాల నుండి ➔ అన్ని తండాలు',
    '#edu-title-allowances': 'విద్యార్థి భత్యాలు & రాయితీలు',
    '#edu-title-pass': 'ఉన్నత పాఠశాల బస్ పాస్ సహాయం',
    '#edu-desc-pass': 'తక్కువ ఆదాయ కుటుంబాల విద్యార్థుల RTC బస్ పాస్ ఫీజుపై 100% రాయితీ. దీని కొరకు సర్టిఫికేట్ పోర్టల్‌లో దరఖాస్తు చేసుకోవచ్చు.',
    '#edu-label-papers': 'కావలసిన పత్రాలు:',
    '#edu-desc-papers': 'నివాస ధృవీకరణ పత్రం, స్టడీ సర్టిఫికేట్, తల్లిదండ్రుల ఆదాయ పత్రం.',
    '#health-modal-title': 'ఆరోగ్యం మరియు పారిశుద్ధ్య సేవలు',
    '#health-title-facilities': 'ఆరోగ్య సదుపాయాలు & సిబ్బంది',
    '#health-facility-label-subcenter': 'గ్రామ ఆరోగ్య ఉప-కేంద్రం',
    '#health-facility-desc-subcenter': 'పూర్తిగా అందుబాటులో ఉంది',
    '#health-facility-label-phc': 'సమీప PHC/ఆసుపత్రి',
    '#health-facility-desc-phc': 'మాచర్ల మండల ఆసుపత్రి (15 కి.మీ)',
    '#health-facility-label-asha': 'గ్రామ ఆశా కార్యకర్తలు',
    '#health-facility-desc-asha': 'ఇద్దరు కార్యకర్తలు (దేవిక & లక్ష్మి)',
    '#health-facility-label-ambulance': 'అత్యవసర అంబులెన్స్ సంప్రదింపు',
    '#health-title-hygiene': 'పరిశుభ్రత & పారిశుద్ధ్య స్థితి',
    '#health-hygiene-label-toilets': 'మరుగుదొడ్ల సంఖ్య',
    '#health-hygiene-desc-toilets': '184 వ్యక్తిగత మరుగుదొడ్లు, 2 సామూహిక మరుగుదొడ్ల సముదాయాలు',
    '#health-hygiene-label-odf': 'బహిరంగ మలవిసర్జన రహిత స్థితి',
    '#health-hygiene-desc-odf': '100% బహిరంగ మలవిసర్జన రహిత గ్రామం (ODF)',
    '#health-hygiene-label-waste': 'వ్యర్థాల నిర్వహణ పద్ధతులు',
    '#health-hygiene-desc-waste': 'రోజువారీ తడి-పొడి చెత్త వర్గీకరణ, వర్మీకంపోస్ట్ కేంద్రం',
    '#health-hygiene-label-plastic': 'ప్లాస్టిక్ నిషేధం అమలు',
    '#health-hygiene-desc-plastic': 'అన్ని షాపులలో సింగిల్ యూజ్ ప్లాస్టిక్ కవర్లపై నిషేధం',
    '#health-title-awareness': 'అవగాహన ప్రచారాలు & టీకాలు',
    '#health-awareness-title-vax': 'నెలవారీ టీకాల శిబిరాలు',
    '#health-awareness-desc-vax': 'ప్రతి నెల మొదటి మంగళవారం అంగన్‌వాడీ కేంద్రంలో టీకాలు (పోలియో, బీసీజీ) వేయబడతాయి.',
    '#health-awareness-title-camps': 'క్రమబద్ధమైన ఆరోగ్య శిబిరాలు',
    '#health-awareness-desc-camps': 'మాచర్ల PHC వైద్యులచే ప్రతి మూడు నెలలకు రెండుసార్లు ఉచిత వైద్య శిబిరాలు నిర్వహించబడతాయి.',
    '#water-alert-banner-text': '⚠️ వర్షాకాల తయారీ: జూన్ 12న నీటి ట్యాంక్ శుభ్రపరచడం జరుగుతుంది. ఆ రోజు నీటి సరఫరా సమయం ఉదయం 5:00 నుండి 6:30 వరకు మాత్రమే ఉంటుంది. దయచేసి నీటిని ఆదా చేయండి.',
    '#water-title-resource-infra': 'జలవనరుల మౌలిక సదుపాయాల వివరాలు',
    '#water-title-sources': 'త్రాగునీటి వనరులు',
    '#water-desc-sources': 'ప్రధాన తాగునీరు పైపులైన్ల ద్వారా గ్రామ రిజర్వాయర్ నుండి అందుతుంది. 8 బోరుబావులు కూడా అందుబాటులో ఉన్నాయి.',
    '#water-title-tanks': 'ట్యాంకులు & వర్షపు నీటి నిల్వ',
    '#water-desc-tanks': '1 ప్రధాన ఓవర్హెడ్ ట్యాంక్ (1,50,000 లీటర్లు) & 2 చిన్న ట్యాంకులు. ఇళ్లలో వర్షపు నీటి ఇంకుడు గుంతలు తప్పనిసరి.',
    '#water-title-shortages': 'నీటి సమస్యలు & నీటి నాణ్యత',
    '#water-desc-shortages': 'ఎండకాలం దక్షిణ తండాలో వచ్చే నీటి కొరతను రేషనింగ్ ద్వారా సర్దుబాటు చేస్తాము. నీటి పరీక్షలో రసాయన స్థాయి సురక్షితంగా ఉంది.',
    '#agri-label-crops': 'ప్రధాన పంటలు',
    '#agri-desc-crops': 'వరి, మొక్కజొన్న, మిరప మరియు పప్పులు',
    '#agri-label-irrigation': 'నీటిపారుదల పద్ధతులు',
    '#agri-desc-irrigation': 'కాలువ నీరు, బోరు బావుల డ్రిప్ మరియు వర్షాధారిత వ్యవసాయం',
    '#agri-label-fertilizer': 'ఎరువుల వినియోగం',
    '#agri-desc-fertilizer': 'సేంద్రీయ వర్మీకంపోస్ట్ (వానపాముల ఎరువు) వాడకం ప్రోత్సహించబడుతుంది',
    '#agri-label-schemes': 'ప్రభుత్వ పథకాలు',
    '#agri-desc-schemes': 'రైతు బంధు పెట్టుబడి సాయం, పీఎం-కిసాన్, 80% డ్రిప్ సబ్సిడీ',
    '#agri-crop-selector-desc': 'విత్తే కాలం, ఎరువుల మోతాదు మరియు విత్తన సబ్సిడీ వివరాల కోసం కింద మీ పంటను ఎంచుకోండి.',
    '#count-population': '1,245',
    '#stat-population .stat-label': 'జనాభా',
    '#stat-population .stat-desc': 'మొత్తం గ్రామీణ జనాభా',
    '#stat-literacy .stat-value': '68%',
    '#stat-literacy .stat-label': 'అక్షరాస్యత శాతం',
    '#stat-literacy .stat-desc': 'పాఠశాల & ఉన్నత విద్యా శాతం',
    '#count-households': '230',
    '#stat-households .stat-label': 'కుటుంబాలు',
    '#stat-households .stat-desc': 'దగ్గరి సంబంధాలు గల కుటుంబాలు',
    '#count-livelihood': 'వ్యవసాయం',
    '#stat-livelihood .stat-label': 'ప్రధాన వృత్తి',
    '#stat-livelihood .stat-desc': 'వరి, మొక్కజొన్న, మిరప, పప్పులపై ఆధారపడటం',
    '#nav-link-dashboard': 'డ్యాష్‌బోర్డ్',
    '#nav-link-dashboard-pillars': 'డ్యాష్‌బోర్డ్',
    '#village-dashboard-modal-title': '📊 గ్రామ డ్యాష్‌బోర్డ్',
    '#vd-lbl-tab-overview': 'అవలోకనం',
    '#vd-lbl-tab-statistics': 'గణాంకాలు',
    '#vd-lbl-tab-education': 'విద్య',
    '#vd-lbl-tab-schemes': 'ప్రభుత్వ పథకాలు',
    '#vd-lbl-tab-announcements': 'ప్రకటనలు',
    '#vd-lbl-sec-overview': 'అవలోకనం కార్డులు',
    '#vd-lbl-sec-stats': 'గణాంకాలు',
    '#vd-lbl-sec-edu': 'విద్య',
    '#vd-lbl-sec-schemes': 'ప్రభుత్వ పథకాలు',
    '#vd-lbl-sec-announce': 'ప్రకటనలు',
    '#vd-lbl-total-pop': 'మొత్తం జనాభా',
    '#vd-lbl-total-fam': 'మొత్తం కుటుంబాలు',
    '#vd-lbl-total-houses': 'మొత్తం ఇళ్లు',
    '#vd-lbl-total-farmers': 'మొత్తం రైతులు',
    '#vd-lbl-total-students': 'మొత్తం విద్యార్థులు',
    '#vd-lbl-total-employees': 'మొత్తం ఉద్యోగులు',
    '#vd-lbl-sarpanch': 'సర్పంచ్ పేరు',
    '#vd-lbl-num-wards': 'వార్డుల సంఖ్య',
    '#vd-lbl-gender-split-title': '👥 పురుషులు వర్సెస్ మహిళలు జనాభా',
    '#vd-lbl-male': '👨 పురుషులు',
    '#vd-lbl-female': '👩 మహిళలు',
    '#vd-lbl-pop-split': 'జనాభా విభజన',
    '#vd-lbl-lit-rate': 'అక్షరాస్యత రేటు',
    '#vd-lbl-lit-sub': 'వయోజన జనాభాలో',
    '#vd-lbl-emp-rate': 'ఉపాధి రేటు',
    '#vd-lbl-emp-sub': 'పనిచేసే వయస్సు గల వారిలో',
    '#vd-lbl-agri-stats-title': '🌾 వ్యవసాయ గణాంకాలు',
    '#vd-lbl-agri-area': 'వ్యవసాయ ప్రాంతం',
    '#vd-lbl-irrigated-land': 'సాగునీటి భూమి',
    '#vd-lbl-main-crops': 'ప్రధాన పంటలు',
    '#vd-lbl-farmers-subsidy': 'సబ్సిడీ పొందుతున్న రైతులు',
    '#vd-lbl-num-schools': 'పాఠశాలల సంఖ్య',
    '#vd-lbl-edu-students': 'మొత్తం విద్యార్థులు',
    '#vd-lbl-edu-scholarships': 'అందించిన స్కాలర్‌షిప్‌లు',
    '#vd-lbl-scheme-beneficiaries': 'లబ్ధిదారులు',
    '#vd-lbl-scheme-active': 'క్రియాశీల పథకాలు',
    '#vd-lbl-scheme-pending': 'పెండింగ్ దరఖాస్తులు',
    '#vd-lbl-up-event': 'రాబోయే కార్యక్రమం',
    '#vd-lbl-gs-meeting': 'గ్రామ సభ సమావేశం',
    '#vd-lbl-gov-notif': 'ప్రభుత్వ నోటిఫికేషన్'
  }
};

/* ==========================================
   AI VOICE ASSISTANT WIDGET LOGIC
   ========================================== */
function initVoiceAssistant() {
  const fab = document.getElementById('voice-assistant-fab');
  const card = document.getElementById('voice-assistant-card');
  const closeBtn = document.getElementById('voice-card-close-btn');
  const statusEl = document.getElementById('voice-status');
  const transcriptEl = document.getElementById('voice-transcript');
  const suggestionsEl = document.getElementById('voice-suggestions');
  const suggestTitleEl = document.getElementById('voice-suggest-title');
  const cardTitleEl = document.getElementById('voice-card-title');
  const warningEl = document.getElementById('voice-ip-warning');
  const textInput = document.getElementById('voice-text-input');
  const textSubmit = document.getElementById('voice-text-submit');

  if (!fab || !card) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;

  const voiceConfigs = {
    en: {
      title: "AI Voice Assistant",
      statusClick: "Click mic to start",
      statusListening: "Listening... Speak now",
      statusError: "Error. Click mic to retry",
      statusRecognized: "Processing...",
      suggestTitle: "Suggestions",
      suggestPlaceholder: "Say a command like \"Open welfare\"...",
      chips: ["Open welfare", "File grievance", "Ration card", "Go to health", "Banjara theme", "Hindi language"],
      unsupported: "⚠️ Voice Recognition is not supported in this browser.",
      noMatch: "Command not recognized. Try saying a suggestion.",
      textPlaceholder: "Or type a command here...",
      textSubmit: "Send",
      warningIp: "🎙️ Mic disabled on HTTP IP. Type commands below, or go to chrome://flags/#unsafely-treat-insecure-origin-as-secure and add http://10.253.91.42:8000"
    },
    hi: {
      title: "एआई वॉयस असिस्टेंट",
      statusClick: "शुरू करने के लिए माइक दबाएं",
      statusListening: "सुन रहा हूँ... अब बोलें",
      statusError: "त्रुटि। पुनः प्रयास करने के लिए माइक दबाएं",
      statusRecognized: "संसाधित किया जा रहा है...",
      suggestTitle: "सुझाव",
      suggestPlaceholder: "बोलें: \"कल्याण योजना\" या \"शिकायत दर्ज\"...",
      chips: ["कल्याण योजना", "शिकायत दर्ज", "राशन कार्ड", "स्वास्थ्य पर जाएं", "थीम बदलें", "तेलुगु भाषा"],
      unsupported: "⚠️ इस ब्राउज़र में वॉयस रिकग्निशन समर्थित नहीं है।",
      noMatch: "आदेश समझ नहीं आया। कोई सुझाव बोलकर देखें।",
      textPlaceholder: "या यहाँ एक आदेश टाइप करें...",
      textSubmit: "भेजें",
      warningIp: "🎙️ HTTP आईपी पर माइक अक्षम है। नीचे आदेश टाइप करें, या क्रोम फ़्लैग्स में http://10.253.91.42:8000 जोड़ें"
    },
    te: {
      title: "AI వాయిస్ అసిస్టెంట్",
      statusClick: "ప్రారంభించడానికి మైక్ నొక్కండి",
      statusListening: "వింటున్నాను... ఇప్పుడు మాట్లాడండి",
      statusError: "లోపం. మళ్లీ ప్రయత్నించడానికి మైక్ నొక్కండి",
      statusRecognized: "ప్రాసెస్ చేయబడుతోంది...",
      suggestTitle: "సూచనలు",
      suggestPlaceholder: "చెప్పండి: \"పథకాలు\" లేదా \"ఫిర్యాదు\"...",
      chips: ["పథకాలు", "ఫిర్యాదు", "రేషన్ కార్డ్", "ఆరోగ్యం", "థీమ్ మార్చు", "ఇంగ్లీష్ భాష"],
      unsupported: "⚠️ ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు.",
      noMatch: "ఆదేశం గుర్తించబడలేదు. సూచనలలో ఒకదాన్ని చెప్పండి.",
      textPlaceholder: "లేదా ఇక్కడ టైప్ చేయండి...",
      textSubmit: "పంపు",
      warningIp: "🎙️ HTTP IP లో మైక్ నిలిపివేయబడింది. కింద టైప్ చేయండి, లేదా క్రోమ్ ఫ్లాగ్స్‌లో http://10.253.91.42:8000 జోడించండి"
    }
  };

  const handleTextSubmit = () => {
    if (textInput) {
      const val = textInput.value.trim();
      if (val) {
        if (isListening) {
          stopListening();
        }
        transcriptEl.textContent = `"${val}"`;
        processCommand(val);
        textInput.value = '';
      }
    }
  };

  if (textSubmit) {
    textSubmit.addEventListener('click', handleTextSubmit);
  }
  if (textInput) {
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleTextSubmit();
      }
    });
  }

  function updateCardTexts() {
    const lang = currentLanguage || 'en';
    const cfg = voiceConfigs[lang] || voiceConfigs['en'];
    
    cardTitleEl.textContent = cfg.title;
    suggestTitleEl.textContent = cfg.suggestTitle;
    if (!isListening) {
      statusEl.textContent = cfg.statusClick;
      transcriptEl.textContent = cfg.suggestPlaceholder;
    }

    const isSecure = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (warningEl) {
      if (!isSecure) {
        warningEl.style.display = 'block';
        warningEl.textContent = cfg.warningIp;
      } else {
        warningEl.style.display = 'none';
      }
    }

    if (textInput) {
      textInput.placeholder = cfg.textPlaceholder;
    }
    if (textSubmit) {
      textSubmit.textContent = cfg.textSubmit;
    }

    suggestionsEl.innerHTML = '';
    cfg.chips.forEach(chipText => {
      const chip = document.createElement('button');
      chip.className = 'voice-suggestion-chip';
      chip.textContent = chipText;
      chip.addEventListener('click', () => {
        if (isListening) {
          stopListening();
        }
        transcriptEl.textContent = `"${chipText}"`;
        processCommand(chipText);
      });
      suggestionsEl.appendChild(chip);
    });
  }

  function speakConfirmation(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const lang = currentLanguage || 'en';
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  }

  function startListening() {
    if (!SpeechRecognition) {
      showToast(voiceConfigs[currentLanguage || 'en'].unsupported, 'warning');
      return;
    }

    if (!recognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isListening = true;
        fab.classList.add('listening');
        card.classList.add('listening');
        const cfg = voiceConfigs[currentLanguage || 'en'] || voiceConfigs['en'];
        statusEl.textContent = cfg.statusListening;
        transcriptEl.textContent = "...";
      };

      recognition.onresult = (event) => {
        const resultText = event.results[0][0].transcript;
        transcriptEl.textContent = `"${resultText}"`;
        const cfg = voiceConfigs[currentLanguage || 'en'] || voiceConfigs['en'];
        statusEl.textContent = cfg.statusRecognized;
        processCommand(resultText);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        const cfg = voiceConfigs[currentLanguage || 'en'] || voiceConfigs['en'];
        statusEl.textContent = cfg.statusError;
        stopListening();
      };

      recognition.onend = () => {
        stopListening();
      };
    }

    const lang = currentLanguage || 'en';
    if (lang === 'hi') {
      recognition.lang = 'hi-IN';
    } else if (lang === 'te') {
      recognition.lang = 'te-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  }

  function stopListening() {
    isListening = false;
    fab.classList.remove('listening');
    card.classList.remove('listening');
    const cfg = voiceConfigs[currentLanguage || 'en'] || voiceConfigs['en'];
    if (statusEl.textContent === cfg.statusListening) {
      statusEl.textContent = cfg.statusClick;
    }
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {}
    }
  }

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = card.classList.contains('active');
    if (isActive) {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    } else {
      card.classList.add('active');
      card.setAttribute('aria-hidden', 'false');
      updateCardTexts();
      startListening();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.remove('active');
    card.setAttribute('aria-hidden', 'true');
    stopListening();
  });

  const select = document.getElementById('lang-select');
  if (select) {
    select.addEventListener('change', () => {
      updateCardTexts();
    });
  }

  function processCommand(rawText) {
    const text = rawText.toLowerCase().trim();
    const lang = currentLanguage || 'en';

    const welfareKeywords = ["welfare", "scheme", "benefit", "aasara", "pension", "farmer", "किसान", "पेंशन", "योजना", "कल्याण", "పథకాలు", "పెన్షన్", "రైతు"];
    if (welfareKeywords.some(keyword => text.includes(keyword))) {
      executeAction(() => {
        openModal('modal-welfare');
      }, {
        en: "Opening Welfare Schemes Portal",
        hi: "कल्याणकारी योजनाएं खोली जा रही हैं",
        te: "సంక్షేమ పథకాల పోర్టల్ తెరవబడుతోంది"
      });
      return;
    }

    const grievanceKeywords = ["grievance", "complaint", "issue", "problem", "ticket", "शिकायत", "समस्या", "ఫిర్యాదు", "సమస్య"];
    if (grievanceKeywords.some(keyword => text.includes(keyword))) {
      executeAction(() => {
        openModal('modal-grievance');
      }, {
        en: "Opening Grievances Portal",
        hi: "शिकायत निवारण पोर्टल खोला जा रहा है",
        te: "సమస్యల పరిష్కార పోర్టల్ తెరవబడుతోంది"
      });
      return;
    }

    const rationKeywords = ["ration", "food", "dealer", "rice", "wheat", "राशन", "अनाज", "రేషన్"];
    if (rationKeywords.some(keyword => text.includes(keyword))) {
      executeAction(() => {
        openModal('modal-ration');
      }, {
        en: "Opening Ration Card Search",
        hi: "राशन कार्ड सेवा खोली जा रही है",
        te: "రేషన్ కార్డ్ సేవలు తెరవబడుతోంది"
      });
      return;
    }

    const certKeywords = ["certificate", "adangal", "income", "land", "birth", "प्रमाण पत्र", "अदंगल", "ధృవీకరణ", "భూమి"];
    if (certKeywords.some(keyword => text.includes(keyword))) {
      executeAction(() => {
        openModal('modal-certificates');
      }, {
        en: "Opening Certificates Portal",
        hi: "प्रमाण पत्र पोर्टल खोला जा रहा है",
        te: "ధృవీకరణ పత్రాల పోర్టల్ తెరవబడుతోంది"
      });
      return;
    }

    const themeKeywords = ["theme", "banjara", "eco", "color", "थीम", "रंग", "థీమ్"];
    if (themeKeywords.some(keyword => text.includes(keyword))) {
      executeAction(() => {
        const toggleBtn = document.getElementById('btn-theme-toggle');
        if (toggleBtn) toggleBtn.click();
      }, {
        en: "Switching layout theme",
        hi: "थीम बदली जा रही है",
        te: "థీమ్ మార్చబడుతోంది"
      });
      return;
    }

    const teKeywords = ["telugu", "तेलुगु", "తెలుగు"];
    const hiKeywords = ["hindi", "हिंदी", "హిందీ"];
    const enKeywords = ["english", "अंग्रेजी", "ఇంగ్లీష్"];

    if (teKeywords.some(keyword => text.includes(keyword))) {
      executeLanguageChange('te', {
        en: "Switching language to Telugu",
        hi: "भाषा बदलकर तेलुगु की जा रही है",
        te: "భాష తెలుగులోకి మార్చబడుతోంది"
      });
      return;
    }
    if (hiKeywords.some(keyword => text.includes(keyword))) {
      executeLanguageChange('hi', {
        en: "Switching language to Hindi",
        hi: "भाषा बदलकर हिंदी की जा रही है",
        te: "భాష హిందీలోకి మార్చబడుతోంది"
      });
      return;
    }
    if (enKeywords.some(keyword => text.includes(keyword))) {
      executeLanguageChange('en', {
        en: "Switching language to English",
        hi: "भाषा बदलकर अंग्रेजी की जा रही है",
        te: "భాష ఇంగ్లీష్‌లోకి మార్చబడుతోంది"
      });
      return;
    }

    const healthNav = ["health", "स्वास्थ्य", "ఆరోగ్యం"];
    const infraNav = ["infrastructure", "infra", "बुनियादी ढांचा", "మౌలిక సదుపాయాలు"];
    const waterNav = ["water", "पानी", "नीరు"];
    const energyNav = ["energy", "ऊर्जा", "విద్యుత్"];
    const materialsNav = ["material", "resource", "recycling", "सामग्री", "वनरु", "వనరులు"];
    const socialNav = ["social", "community", "सभा", "సామాజిక"];
    const greenNav = ["green", "forestry", "हरित", "హరిత"];
    const homeNav = ["home", "back", "मुख्य", "वापस", "హోమ్", "వెనుకకు"];

    if (healthNav.some(keyword => text.includes(keyword))) {
      executeNavigation('pillars.html?type=health', {
        en: "Navigating to Health and Hygiene page",
        hi: "स्वास्थ्य और स्वच्छता पृष्ठ पर जा रहे हैं",
        te: "ఆరోగ్యం మరియు పరిశుభ్రత పేజీకి వెళ్తున్నాము"
      });
      return;
    }
    if (infraNav.some(keyword => text.includes(keyword))) {
      executeNavigation('pillars.html?type=infra', {
        en: "Navigating to Infrastructure page",
        hi: "बुनियादी ढांचा पृष्ठ पर जा रहे हैं",
        te: "మౌలిక సదుపాయాల పేజీకి వెళ్తున్నాము"
      });
      return;
    }
    if (waterNav.some(keyword => text.includes(keyword))) {
      executeNavigation('pillars.html?type=water', {
        en: "Navigating to Water Conservation page",
        hi: "जल संरक्षण पृष्ठ पर जा रहे हैं",
        te: "జల సంరక్షణ పేజీకి వెళ్తున్నాము"
      });
      return;
    }
    if (energyNav.some(keyword => text.includes(keyword))) {
      executeNavigation('pillars.html?type=energy', {
        en: "Navigating to Green Energy page",
        hi: "हरित ऊर्जा पृष्ठ पर जा रहे हैं",
        te: "విద్యుత్ లభ్యత పేజీకి వెళ్తున్నాము"
      });
      return;
    }
    if (materialsNav.some(keyword => text.includes(keyword))) {
      executeNavigation('pillars.html?type=materials', {
        en: "Navigating to Materials and Resources page",
        hi: "सामग्री और संसाधन पृष्ठ पर जा रहे हैं",
        te: "వనరులు మరియు రీసైక్లింగ్ పేజీకి వెళ్తున్నాము"
      });
      return;
    }
    if (socialNav.some(keyword => text.includes(keyword))) {
      executeNavigation('pillars.html?type=social', {
        en: "Navigating to Social Action page",
        hi: "सामाजिक कार्य पृष्ठ पर जा रहे हैं",
        te: "సామాజిక మరియు కమ్యూనిటీ పనుల పేజీకి వెళ్తున్నాము"
      });
      return;
    }
    if (greenNav.some(keyword => text.includes(keyword))) {
      executeNavigation('pillars.html?type=green', {
        en: "Navigating to Green Innovation page",
        hi: "हरित नवाचार पृष्ठ पर जा रहे हैं",
        te: "హరిత ఆవిష్కరణల పేజీకి వెళ్తున్నాము"
      });
      return;
    }
    if (homeNav.some(keyword => text.includes(keyword))) {
      executeNavigation('index.html', {
        en: "Returning to Home page",
        hi: "मुख्य पृष्ठ पर वापस जा रहे हैं",
        te: "హోమ్ పేజీకి తిరిగి వెళ్తున్నాము"
      });
      return;
    }

    const cfg = voiceConfigs[lang] || voiceConfigs['en'];
    statusEl.textContent = cfg.noMatch;
    speakConfirmation(cfg.noMatch);
  }

  function executeAction(actionCallback, responses) {
    const lang = currentLanguage || 'en';
    const responseText = responses[lang] || responses['en'];
    statusEl.textContent = responseText;
    speakConfirmation(responseText);
    
    setTimeout(() => {
      actionCallback();
      card.classList.remove('active');
    }, 1000);
  }

  function executeLanguageChange(targetLang, responses) {
    const lang = currentLanguage || 'en';
    const responseText = responses[lang] || responses['en'];
    statusEl.textContent = responseText;
    speakConfirmation(responseText);

    setTimeout(() => {
      const select = document.getElementById('lang-select');
      if (select) {
        select.value = targetLang;
        select.dispatchEvent(new Event('change'));
        updateCardTexts();
      }
      card.classList.remove('active');
    }, 1000);
  }

  function executeNavigation(url, responses) {
    const lang = currentLanguage || 'en';
    const responseText = responses[lang] || responses['en'];
    statusEl.textContent = responseText;
    speakConfirmation(responseText);

    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  }

  updateCardTexts();
}

/* ==========================================
   DYNAMIC MAIN PAGE EDITOR RENDER LOGIC
   ========================================== */
let mainPageConfig = null;

function initMainPageDynamicContent() {
  const hasIndexElements = document.getElementById('hero-welcome-title') || document.getElementById('notices-list-container');
  if (!hasIndexElements) return;

  fetch('/api/main-page-config')
    .then(res => res.json())
    .then(config => {
      mainPageConfig = config;
      renderDynamicMainPageContent();
    })
    .catch(err => {
      console.error('Error fetching main page config:', err);
    });
}

function renderDynamicMainPageContent() {
  if (!mainPageConfig) return;
  const lang = currentLanguage || 'en';

  // 1. Alert Banner
  const alertContainer = document.getElementById('sitewide-alert-container');
  if (alertContainer) {
    const banner = mainPageConfig.bannerAlert;
    if (banner && banner.active) {
      const message = banner.message[lang] || banner.message['en'] || '';
      const bannerClass = banner.type || 'info';
      alertContainer.innerHTML = `
        <div class="sitewide-alert-banner ${bannerClass}" role="alert">
          <span>📢 <strong>Notice:</strong> ${message}</span>
          <button class="close-banner-btn" onclick="this.parentElement.remove()" aria-label="Close alert banner">✕</button>
        </div>
      `;
      alertContainer.style.display = 'block';
    } else {
      alertContainer.innerHTML = '';
      alertContainer.style.display = 'none';
    }
  }

  // 2. Hero Section
  const heroTitle = document.getElementById('hero-welcome-title');
  if (heroTitle && mainPageConfig.hero && mainPageConfig.hero.title) {
    heroTitle.textContent = mainPageConfig.hero.title[lang] || mainPageConfig.hero.title['en'] || '';
  }
  const heroTagline = document.getElementById('hero-tagline-text');
  if (heroTagline && mainPageConfig.hero && mainPageConfig.hero.tagline) {
    heroTagline.textContent = mainPageConfig.hero.tagline[lang] || mainPageConfig.hero.tagline['en'] || '';
  }
  const heroDesc = document.getElementById('hero-description-text');
  if (heroDesc && mainPageConfig.hero && mainPageConfig.hero.description) {
    heroDesc.textContent = mainPageConfig.hero.description[lang] || mainPageConfig.hero.description['en'] || '';
  }

  // 3. Glance Stats
  const countPop = document.getElementById('count-population');
  if (countPop && mainPageConfig.stats && mainPageConfig.stats.population) {
    countPop.textContent = mainPageConfig.stats.population[lang] || mainPageConfig.stats.population['en'] || '';
  }
  const countHouse = document.getElementById('count-households');
  if (countHouse && mainPageConfig.stats && mainPageConfig.stats.families) {
    countHouse.textContent = mainPageConfig.stats.families[lang] || mainPageConfig.stats.families['en'] || '';
  }
  const countLit = document.getElementById('count-literacy');
  if (countLit && mainPageConfig.stats && mainPageConfig.stats.literacy) {
    countLit.textContent = mainPageConfig.stats.literacy[lang] || mainPageConfig.stats.literacy['en'] || '';
  }
  const countLivelihood = document.getElementById('count-livelihood');
  if (countLivelihood && mainPageConfig.stats && mainPageConfig.stats.occupation) {
    countLivelihood.textContent = mainPageConfig.stats.occupation[lang] || mainPageConfig.stats.occupation['en'] || '';
  }

  // 4. Budget Allocation
  const budget = mainPageConfig.budget;
  if (budget) {
    const updateBudgetBar = (key) => {
      const valEl = document.getElementById(`budget-val-${key}`);
      const barEl = document.getElementById(`budget-bar-${key}`);
      if (valEl && barEl && budget[key]) {
        valEl.textContent = `${budget[key].percent}% (${budget[key].amount})`;
        barEl.style.width = `${budget[key].percent}%`;
      }
    };
    ['water', 'roads', 'forest', 'transit'].forEach(updateBudgetBar);
  }

  // 5. Notices List
  const noticesContainer = document.getElementById('notices-list-container');
  if (noticesContainer && mainPageConfig.notices) {
    noticesContainer.innerHTML = '';
    mainPageConfig.notices.forEach(notice => {
      const noticeTitle = notice.title[lang] || notice.title['en'] || '';
      const noticeBody = notice.body[lang] || notice.body['en'] || '';
      const noticeCategory = notice.category[lang] || notice.category['en'] || '';
      const badgeClass = notice.badgeClass || 'info';

      const noticeItem = document.createElement('div');
      noticeItem.className = 'notice-item';
      
      let badgeStyle = '';
      if (badgeClass === 'info') {
        badgeStyle = 'background-color: var(--color-accent-light); color: var(--color-warning);';
      }

      noticeItem.innerHTML = `
        <div class="notice-meta">
          <span class="notice-date">${notice.date}</span>
          <span class="notice-badge ${badgeClass}" style="${badgeStyle}">${noticeCategory}</span>
        </div>
        <h4>${noticeTitle}</h4>
        <p>${noticeBody}</p>
      `;
      noticesContainer.appendChild(noticeItem);
    });
  }

  // 6. Smart Village Pillars
  const pillars = mainPageConfig.pillars;
  if (pillars) {
    const pillarKeys = ['health', 'infra', 'water', 'energy', 'materials', 'social', 'green'];
    pillarKeys.forEach(key => {
      const descEl = document.getElementById(`pillar-desc-${key}`);
      if (descEl && pillars[key]) {
        descEl.textContent = pillars[key][lang] || pillars[key]['en'] || '';
      }
    });
  }

  // 7. History & Heritage
  const history = mainPageConfig.history;
  if (history) {
    const historyTitleEl = document.getElementById('about-history-title');
    if (historyTitleEl && history.title) {
      historyTitleEl.textContent = history.title[lang] || history.title['en'] || '';
    }
    ['p1', 'p2', 'p3', 'p4'].forEach(key => {
      const pEl = document.getElementById(`about-history-${key}`);
      if (pEl && history[key]) {
        let prefix = '';
        if (key === 'p1') prefix = `<strong>${lang === 'te' ? 'చరిత్ర' : lang === 'hi' ? 'इतिहास' : 'History'}:</strong> `;
        else if (key === 'p2') prefix = `<strong>${lang === 'te' ? 'పేరు వెనుక చరిత్ర' : lang === 'hi' ? 'नामकरण उत्पत्ति' : 'Naming Origin'}:</strong> `;
        else if (key === 'p3') prefix = `<strong>${lang === 'te' ? 'గిరిజన గుర్తింపు & సంస్కృతి' : lang === 'hi' ? 'आदिवासी पहचान और संस्कृति' : 'Tribal Identity & Culture'}:</strong> `;
        else if (key === 'p4') prefix = `<strong>${lang === 'te' ? 'భౌగోళికం & భాష' : lang === 'hi' ? 'भूगोल और भाषा' : 'Geography & Language'}:</strong> `;
        
        pEl.innerHTML = prefix + (history[key][lang] || history[key]['en'] || '');
      }
    });
  }

  // 8. Profile Counts
  const profileCounts = mainPageConfig.profileCounts;
  if (profileCounts) {
    const countKeys = ['houses', 'population', 'male', 'female', 'children', 'seniors', 'disabled'];
    countKeys.forEach(key => {
      const countEl = document.getElementById(`profile-count-${key}`);
      if (countEl && profileCounts[key] !== undefined) {
        countEl.textContent = profileCounts[key];
      }
    });
  }

  // 9. Infrastructure Audit
  const infraAudit = mainPageConfig.infraAudit;
  if (infraAudit) {
    const infraKeys = ['roads', 'drainage', 'streetlights', 'bus', 'halls', 'office', 'solar'];
    infraKeys.forEach(key => {
      const descEl = document.getElementById(`infra-desc-${key}`);
      if (descEl && infraAudit[key]) {
        descEl.textContent = infraAudit[key][lang] || infraAudit[key]['en'] || '';
      }
      const goodEl = document.getElementById(`infra-good-${key}`);
      const needsEl = document.getElementById(`infra-needs-${key}`);
      if (goodEl && needsEl && infraAudit[key]) {
        let fallback = 'good';
        if (key === 'drainage' || key === 'bus' || key === 'solar') {
          fallback = 'needs_improvement';
        }
        const isGood = (infraAudit[key].status || fallback) === 'good';
        if (isGood) {
          goodEl.textContent = '✓';
          goodEl.style.color = 'var(--color-success)';
          needsEl.textContent = '—';
          needsEl.style.color = 'inherit';
        } else {
          goodEl.textContent = '—';
          goodEl.style.color = 'inherit';
          needsEl.textContent = '✓';
          needsEl.style.color = 'var(--color-warning)';
        }
      }
    });
  }

  // 10. Helpline & Contacts
  const contacts = mainPageConfig.contacts;
  if (contacts) {
    const contactKeys = ['secretary', 'sarpanch', 'address', 'timing'];
    contactKeys.forEach(key => {
      const valEl = document.getElementById(`about-modal-contact-val-${key}`);
      if (valEl && contacts[key]) {
        valEl.textContent = contacts[key][lang] || contacts[key]['en'] || '';
      }
    });
  }

  // 11. FAQs Accordion
  const faqContainer = document.getElementById('faq-accordion-container');
  if (faqContainer && mainPageConfig.faqs) {
    faqContainer.innerHTML = '';
    mainPageConfig.faqs.forEach(faq => {
      const qText = faq.question[lang] || faq.question['en'] || '';
      const aText = faq.answer[lang] || faq.answer['en'] || '';
      
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      faqItem.innerHTML = `
        <button class="faq-trigger" aria-expanded="false" aria-controls="${faq.id}">
          <span>${qText}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" id="${faq.id}" aria-hidden="true">
          <p>${aText}</p>
        </div>
      `;
      faqContainer.appendChild(faqItem);
    });
    
    // Reinitialize accordion listeners
    initFaqAccordion();
  }

  // 12. Water Availability Dashboard
  const waterConfig = mainPageConfig.waterDashboard;
  if (waterConfig) {
    const cap = parseInt(waterConfig.capacity) || 150000;
    const curr = parseInt(waterConfig.current) || 117000;
    const pct = Math.round((curr / cap) * 100);

    const fillEl = document.getElementById('reservoir-level-fill');
    if (fillEl) fillEl.style.height = `${pct}%`;

    const pctText = document.getElementById('reservoir-percentage-text');
    if (pctText) pctText.textContent = `${pct}%`;

    const volText = document.getElementById('reservoir-vol-text');
    if (volText) {
      volText.textContent = `${curr.toLocaleString()} / ${cap.toLocaleString()} Litres`;
    }

    const hoursEl = document.getElementById('water-metric-hours');
    if (hoursEl) hoursEl.textContent = waterConfig.supplyHours[lang] || waterConfig.supplyHours['en'] || '';

    const limitEl = document.getElementById('water-metric-limit');
    if (limitEl) limitEl.textContent = waterConfig.weeklyLimit[lang] || waterConfig.weeklyLimit['en'] || '';

    const wellsEl = document.getElementById('water-metric-borewells');
    if (wellsEl) wellsEl.textContent = waterConfig.borewellStatus[lang] || waterConfig.borewellStatus['en'] || '';

    const fluorideEl = document.getElementById('water-metric-fluoride');
    if (fluorideEl) fluorideEl.textContent = waterConfig.fluorideLevel[lang] || waterConfig.fluorideLevel['en'] || '';

    const labEl = document.getElementById('water-metric-labdate');
    if (labEl) labEl.textContent = waterConfig.lastLabDate[lang] || waterConfig.lastLabDate['en'] || '';

    const alertEl = document.getElementById('water-alert-banner-text');
    if (alertEl) {
      const alertMsg = waterConfig.alertBanner[lang] || waterConfig.alertBanner['en'] || '';
      alertEl.innerHTML = `⚠️ <strong>${lang === 'hi' ? 'मानसून की तैयारी' : lang === 'te' ? 'వర్షాకాలం సన్నద్ధత' : 'Monsoon Prep'}:</strong> ${alertMsg}`;
    }

    // Update accessibility label on water tank visual
    const visualEl = document.querySelector('.water-tank-visual');
    if (visualEl) {
      const label = lang === 'hi'
        ? `जलाशय की क्षमता ${pct}% है`
        : lang === 'te'
          ? `జలాశయం నిల్వ సామర్థ్యం ${pct}% వద్ద ఉంది`
          : `Reservoir capacity is at ${pct}%`;
      visualEl.setAttribute('aria-label', label);
    }

    // Update interactive map pin for water reservoir (w1)
    const waterMapNode = document.querySelector('.map-node.water');
    if (waterMapNode) {
      let speciesText = 'Panchayat Reservoir Inlet';
      let countText = `Capacity: ${cap.toLocaleString()} Litres`;
      let dateText = 'Daily Inspected';
      let statusText = `${pct}% full`;

      if (lang === 'hi') {
        speciesText = 'पंचायत जलाशय इनलेट';
        countText = `क्षमता: ${cap.toLocaleString()} लीटर`;
        dateText = 'दैनिक निरीक्षण';
        statusText = `${pct}% भरा हुआ`;
      } else if (lang === 'te') {
        speciesText = 'పంచాయతీ జలాశయం ఇన్లెట్';
        countText = `సామర్థ్యం: ${cap.toLocaleString()} లీటర్లు`;
        dateText = 'రోజువారీ తనిఖీ';
        statusText = `${pct}% నిండింది`;
      }

      waterMapNode.setAttribute('data-species', speciesText);
      waterMapNode.setAttribute('data-count', countText);
      waterMapNode.setAttribute('data-date', dateText);
      waterMapNode.setAttribute('data-status', statusText);
    }

    // Infra Details cards
    if (waterConfig.infraDetails) {
      ['sources', 'tanks', 'shortages'].forEach(key => {
        const details = waterConfig.infraDetails[key];
        if (details) {
          const titleEl = document.getElementById(`water-title-${key}`);
          if (titleEl) titleEl.textContent = details.title[lang] || details.title['en'] || '';
          const descEl = document.getElementById(`water-desc-${key}`);
          if (descEl) descEl.textContent = details.desc[lang] || details.desc['en'] || '';
        }
      });
    }
  }

  // 13. Agriculture Dashboard (Live Crops Grown & Sowing Advisories)
  const agriConfig = mainPageConfig.agriDashboard;
  if (agriConfig) {
    const cropsEl = document.getElementById('agri-desc-crops');
    if (cropsEl) cropsEl.textContent = agriConfig.cropsGrown[lang] || agriConfig.cropsGrown['en'] || '';

    const irrEl = document.getElementById('agri-desc-irrigation');
    if (irrEl) irrEl.textContent = agriConfig.irrigationMethods[lang] || agriConfig.irrigationMethods['en'] || '';

    const fertEl = document.getElementById('agri-desc-fertilizer');
    if (fertEl) fertEl.textContent = agriConfig.fertilizerUsage[lang] || agriConfig.fertilizerUsage['en'] || '';

    const schEl = document.getElementById('agri-desc-schemes');
    if (schEl) schEl.textContent = agriConfig.govSchemes[lang] || agriConfig.govSchemes['en'] || '';

    // Populate active crop details in correct language
    const activeBtn = document.querySelector('.crop-select-btn.active');
    const activeCropKey = activeBtn ? activeBtn.id.replace('crop-btn-', '') : 'paddy';
    updateCropAdvisoryDisplay(activeCropKey, lang);
  }

  // 14. Health and Hygiene Services Dashboard
  const healthConfig = mainPageConfig.healthDashboard;
  if (healthConfig) {
    // Facilities & Staff
    if (healthConfig.facilities) {
      ['subcenter', 'phc', 'asha', 'ambulance'].forEach(key => {
        const el = document.getElementById(`health-facility-desc-${key}`);
        if (el && healthConfig.facilities[key]) {
          el.textContent = healthConfig.facilities[key][lang] || healthConfig.facilities[key]['en'] || '';
        }
      });
    }
    // Hygiene & Sanitation Status
    if (healthConfig.hygiene) {
      ['toilets', 'odf', 'waste', 'plastic'].forEach(key => {
        const el = document.getElementById(`health-hygiene-desc-${key}`);
        if (el && healthConfig.hygiene[key]) {
          el.textContent = healthConfig.hygiene[key][lang] || healthConfig.hygiene[key]['en'] || '';
        }
      });
    }
    // Campaigns & Vaccination
    if (healthConfig.campaigns) {
      ['vax', 'camps'].forEach(key => {
        const campaign = healthConfig.campaigns[key];
        if (campaign) {
          const titleEl = document.getElementById(`health-awareness-title-${key}`);
          if (titleEl) titleEl.textContent = campaign.title[lang] || campaign.title['en'] || '';
          const descEl = document.getElementById(`health-awareness-desc-${key}`);
          if (descEl) descEl.textContent = campaign.desc[lang] || campaign.desc['en'] || '';
        }
      });
    }
  }

  // 15. Village Overview Dashboard
  const villageConfig = mainPageConfig.villageDashboard;
  if (villageConfig) {
    const ov = villageConfig.overview || {};
    const st = villageConfig.statistics || {};

    const setEl = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.textContent = val; };

    const edu = villageConfig.education || {};
    const sch = villageConfig.schemes || {};
    const ann = villageConfig.announcements || {};

    // Overview Cards
    setEl('vd-total-population', ov.totalPopulation);
    setEl('vd-total-families',   ov.totalFamilies);
    setEl('vd-total-houses',     ov.totalHouses);
    setEl('vd-total-farmers',    ov.totalFarmers);
    setEl('vd-total-students',   ov.totalStudents);
    setEl('vd-total-employees',  ov.totalEmployees);
    setEl('vd-sarpanch-name',    ov.sarpanchName);
    setEl('vd-number-of-wards',  ov.numberOfWards);

    // Statistics
    setEl('vd-male-pop',        st.malePopulation);
    setEl('vd-female-pop',      st.femalePopulation);
    setEl('vd-literacy-rate',   st.literacyRate);
    setEl('vd-employment-rate', st.employmentRate);
    setEl('vd-agri-area',       st.agricultureArea);
    setEl('vd-irrigated-land',  st.irrigatedLand);
    setEl('vd-main-crops',      st.mainCrops);
    setEl('vd-farmers-subsidy', st.farmersWithSubsidy);

    // Education
    setEl('vd-num-schools',      edu.numberOfSchools);
    setEl('vd-edu-students',     edu.totalStudents);
    setEl('vd-edu-scholarships', edu.scholarshipsProvided);

    // Schemes
    setEl('vd-scheme-beneficiaries', sch.beneficiaries);
    setEl('vd-scheme-active',        sch.activeSchemes);
    setEl('vd-scheme-pending',       sch.pendingApplications);

    // Announcements
    setEl('vd-announce-event',   ann.upcomingEvents);
    setEl('vd-announce-meeting', ann.gramSabhaMeetings);
    setEl('vd-announce-notif',   ann.governmentNotifications);

    // Gender bar calculation
    const male = parseInt((st.malePopulation || '').replace(/,/g, '')) || 0;
    const female = parseInt((st.femalePopulation || '').replace(/,/g, '')) || 0;
    const total = male + female;
    if (total > 0) {
      const malePct = Math.round((male / total) * 100);
      const femalePct = 100 - malePct;
      const bar = document.getElementById('vd-gender-bar');
      if (bar) bar.style.width = `${malePct}%`;
      setEl('vd-male-pct',   `${malePct}% Male`);
      setEl('vd-female-pct', `${femalePct}% Female`);
    }
  }

  // 16. Staggered reveal animation re-triggering for dynamic hero elements
  initHeroTextReveal();
  triggerHeroReveal();
}

/* ==========================================
   SMART PANCHAYAT HUB CONTROLLERS
   ========================================== */

function initEChoupal() {
  const tabRates = document.getElementById('echoupal-tab-rates');
  const tabCrafts = document.getElementById('echoupal-tab-crafts');
  const tabSell = document.getElementById('echoupal-tab-sell');
  
  const contentRates = document.getElementById('echoupal-content-rates');
  const contentCrafts = document.getElementById('echoupal-content-crafts');
  const contentSell = document.getElementById('echoupal-content-sell');

  if (!tabRates || !tabCrafts || !tabSell || !contentRates || !contentCrafts || !contentSell) return;

  const resetTabs = () => {
    [tabRates, tabCrafts, tabSell].forEach(t => t.classList.remove('active'));
    [contentRates, contentCrafts, contentSell].forEach(c => c.style.display = 'none');
  };

  tabRates.addEventListener('click', () => {
    resetTabs();
    tabRates.classList.add('active');
    contentRates.style.display = 'block';
  });

  tabCrafts.addEventListener('click', () => {
    resetTabs();
    tabCrafts.classList.add('active');
    contentCrafts.style.display = 'block';
  });

  tabSell.addEventListener('click', () => {
    resetTabs();
    tabSell.classList.add('active');
    contentSell.style.display = 'block';
  });

  // Handle Contact Seller Buttons
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-craft-contact')) {
      const artisan = e.target.getAttribute('data-artisan');
      const item = e.target.getAttribute('data-item');
      showToast(`📞 Contacting artisan ${artisan} for "${item}". Contact details sent to your device.`, 'info');
    }
  });

  // Form Submit
  const sellForm = document.getElementById('echoupal-sell-form');
  if (sellForm) {
    sellForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('sell-item-type').value;
      const name = document.getElementById('sell-item-name').value;
      const price = document.getElementById('sell-item-price').value;
      const contact = document.getElementById('sell-item-contact').value;
      const desc = document.getElementById('sell-item-desc').value;

      showToast(`🎉 Listing submitted successfully! Admin will verify and publish your ${type} within 24 hours.`, 'success');
      sellForm.reset();
      tabCrafts.click();
    });
  }
}

function initDisasterWarning() {
  const form = document.getElementById('disaster-sms-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('disaster-phone').value;
      showToast(`📱 Subscribed successfully! Emergency SMS warnings will be pushed to +91 ${phone}.`, 'success');
      form.reset();
    });
  }
}

function initTelemedicine() {
  const tabBook = document.getElementById('telehealth-tab-book');
  const tabStock = document.getElementById('telehealth-tab-stock');
  const contentBook = document.getElementById('telehealth-content-book');
  const contentStock = document.getElementById('telehealth-content-stock');

  if (!tabBook || !tabStock || !contentBook || !contentStock) return;

  tabBook.addEventListener('click', () => {
    tabBook.classList.add('active');
    tabStock.classList.remove('active');
    contentBook.style.display = 'block';
    contentStock.style.display = 'none';
  });

  tabStock.addEventListener('click', () => {
    tabStock.classList.add('active');
    tabBook.classList.remove('active');
    contentStock.style.display = 'block';
    contentBook.style.display = 'none';
  });

  // Consultation booking
  const bookingForm = document.getElementById('telehealth-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('book-patient-name').value;
      const doctorType = document.getElementById('book-doctor-type').value;

      showToast(`🗓️ Appointment booked! Block doctor session confirmed for patient ${patientName}. Details sent via SMS.`, 'success');
      bookingForm.reset();
    });
  }

  // Pharmacy stock checker
  const searchInput = document.getElementById('medicine-search-input');
  const searchBtn = document.getElementById('btn-medicine-search');
  const medRows = document.querySelectorAll('.med-row');

  const performSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    medRows.forEach(row => {
      const medName = row.getAttribute('data-name');
      if (query === '') {
        row.classList.remove('highlight-match');
        row.style.display = 'flex';
      } else if (medName.includes(query)) {
        row.classList.add('highlight-match');
        row.style.display = 'flex';
      } else {
        row.classList.remove('highlight-match');
        row.style.display = 'none';
      }
    });
  };

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('input', performSearch);
  }
}

function initELearning() {
  const tabSchool = document.getElementById('elearning-tab-school');
  const tabExams = document.getElementById('elearning-tab-exams');
  const tabBanking = document.getElementById('elearning-tab-banking');

  const contentSchool = document.getElementById('elearning-content-school');
  const contentExams = document.getElementById('elearning-content-exams');
  const contentBanking = document.getElementById('elearning-content-banking');

  if (!tabSchool || !tabExams || !tabBanking || !contentSchool || !contentExams || !contentBanking) return;

  const resetTabs = () => {
    [tabSchool, tabExams, tabBanking].forEach(t => t.classList.remove('active'));
    [contentSchool, contentExams, contentBanking].forEach(c => c.style.display = 'none');
  };

  tabSchool.addEventListener('click', () => {
    resetTabs();
    tabSchool.classList.add('active');
    contentSchool.style.display = 'block';
  });

  tabExams.addEventListener('click', () => {
    resetTabs();
    tabExams.classList.add('active');
    contentExams.style.display = 'block';
  });

  tabBanking.addEventListener('click', () => {
    resetTabs();
    tabBanking.classList.add('active');
    contentBanking.style.display = 'block';
  });

  // Play Lecture
  document.querySelectorAll('.btn-play-lecture').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      showToast(`🎬 Lecture video playing. Connecting to localized learning server...`, 'success');
    });
  });

  // Download PDF Notes
  document.querySelectorAll('.btn-pdf-download').forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(`📥 E-Learning PDF Study Guide downloaded successfully.`, 'success');
    });
  });
}

function initGovernance() {
  const tabVote = document.getElementById('governance-tab-vote');
  const tabSuggest = document.getElementById('governance-tab-suggest');
  const contentVote = document.getElementById('governance-content-vote');
  const contentSuggest = document.getElementById('governance-content-suggest');

  if (!tabVote || !tabSuggest || !contentVote || !contentSuggest) return;

  tabVote.addEventListener('click', () => {
    tabVote.classList.add('active');
    tabSuggest.classList.remove('active');
    contentVote.style.display = 'block';
    contentSuggest.style.display = 'none';
    fetchAndRenderPolls();
  });

  tabSuggest.addEventListener('click', () => {
    tabSuggest.classList.add('active');
    tabVote.classList.remove('active');
    contentSuggest.style.display = 'block';
    contentVote.style.display = 'none';
  });

  // Initial fetch of polls
  fetchAndRenderPolls();

  // Handle vote submit
  const voteForm = document.getElementById('governance-vote-form');
  if (voteForm) {
    voteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedOpt = document.querySelector('input[name="poll-option"]:checked');
      if (!selectedOpt) return;

      const optionId = selectedOpt.value;

      fetch('/api/polls/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: 'poll-1', optionId })
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to vote');
        return res.json();
      })
      .then(updatedPoll => {
        showToast('🗳️ Your vote was recorded anonymously. Thank you for participating!', 'success');
        renderPollResults(updatedPoll);
        localStorage.setItem('has-voted-poll-1', 'true');
      })
      .catch(err => {
        console.error('Error voting:', err);
        showToast('❌ Failed to record vote. Please try again.', 'error');
      });
    });
  }

  // Handle suggestion submit
  const suggestForm = document.getElementById('governance-suggest-form');
  if (suggestForm) {
    suggestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const category = document.getElementById('sug-category').value;
      const title = document.getElementById('sug-title').value;
      const text = document.getElementById('sug-text').value;

      fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title, text })
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit suggestion');
        return res.json();
      })
      .then(newSug => {
        showToast('📝 Anonymous suggestion submitted to Gram Sabha registry successfully!', 'success');
        suggestForm.reset();
      })
      .catch(err => {
        console.error('Error submitting suggestion:', err);
        showToast('❌ Failed to submit suggestion. Please try again.', 'error');
      });
    });
  }
}

function fetchAndRenderPolls() {
  fetch('/api/polls')
  .then(res => res.json())
  .then(polls => {
    const poll = polls['poll-1'];
    if (!poll) return;

    // Set question text based on active language
    const lang = currentLanguage || 'en';
    const qEl = document.getElementById('gov-poll-question');
    if (qEl) {
      qEl.textContent = `Poll: ${poll.question[lang] || poll.question['en']}`;
    }

    // Set option labels
    poll.options.forEach((opt, idx) => {
      const lbl = document.getElementById(`lbl-poll-opt-${idx + 1}`);
      if (lbl) {
        lbl.textContent = opt.text[lang] || opt.text['en'];
      }
    });

    // If already voted, show results directly
    if (localStorage.getItem('has-voted-poll-1') === 'true') {
      renderPollResults(poll);
    }
  })
  .catch(err => console.error('Error loading polls:', err));
}

function renderPollResults(poll) {
  const voteForm = document.getElementById('governance-vote-form');
  const resultsPanel = document.getElementById('poll-results-panel');
  const resultsBars = document.getElementById('poll-results-bars');

  if (!resultsBars) return;

  if (voteForm) voteForm.style.display = 'none';
  if (resultsPanel) resultsPanel.style.display = 'block';

  resultsBars.innerHTML = '';

  const lang = currentLanguage || 'en';
  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 1;

  poll.options.forEach(opt => {
    const pct = Math.round(((opt.votes || 0) / totalVotes) * 100);
    const labelText = opt.text[lang] || opt.text['en'];

    const barWrapper = document.createElement('div');
    barWrapper.className = 'poll-result-bar-wrapper';
    barWrapper.innerHTML = `
      <div class="poll-result-meta">
        <span>${labelText}</span>
        <span class="poll-result-votes">${pct}% (${opt.votes || 0} ${lang === 'hi' ? 'मत' : lang === 'te' ? 'ఓట్లు' : 'votes'})</span>
      </div>
      <div class="poll-result-bar-bg">
        <div class="poll-result-bar-fill" style="width: 0%;"></div>
      </div>
    `;
    resultsBars.appendChild(barWrapper);

    // Trigger width transition in next tick
    setTimeout(() => {
      const fillEl = barWrapper.querySelector('.poll-result-bar-fill');
      if (fillEl) fillEl.style.width = `${pct}%`;
    }, 50);
  });
}

/* ==========================================
   VILLAGE DASHBOARD CONTROLLER
   ========================================== */
function triggerGenderBarAnimation() {
  setTimeout(() => {
    const bar = document.getElementById('vd-gender-bar');
    if (bar) {
      const targetWidth = bar.style.width || '52%';
      bar.style.transition = 'none';
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.transition = 'width 1s ease';
          bar.style.width = targetWidth;
        });
      });
    }
  }, 100);
}

function initVillageDashboard() {
  // Setup sidebar tab switching
  const tabs = ['overview', 'statistics', 'education', 'schemes', 'announcements'];
  tabs.forEach(tabName => {
    const btn = document.getElementById(`vd-tab-${tabName}`);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset all buttons and sections
        tabs.forEach(t => {
          const b = document.getElementById(`vd-tab-${t}`);
          if (b) {
            b.classList.remove('active');
            b.style.color = 'var(--color-text-muted)';
            b.style.borderLeftColor = 'transparent';
          }
          const s = document.getElementById(`vd-sec-${t}`);
          if (s) s.style.display = 'none';
        });

        // Activate selected tab and section
        btn.classList.add('active');
        btn.style.color = 'var(--color-primary)';
        btn.style.borderLeftColor = 'var(--color-primary)';
        
        const sec = document.getElementById(`vd-sec-${tabName}`);
        if (sec) sec.style.display = 'block';

        // Re-trigger gender bar animation if statistics tab is selected
        if (tabName === 'statistics') {
          triggerGenderBarAnimation();
        }
      });
    }
  });
}