import { Question, ExamSession, MistakeItem, Tutor } from '../types';

export const mockQuestions: Question[] = [
  {
    id: 17,
    subject: 'Physics',
    chapter: 'Thermodynamics',
    topic: 'Isothermal Expansion',
    difficulty: 'Medium',
    title: 'Ideal Gas Isothermal Expansion',
    questionText:
      'An ideal gas in a sealed container undergoes an isothermal expansion from volume V₁ to V₂, where V₂ = 2V₁. Which of the following statements is true regarding the change in internal energy (ΔU) and the heat added (Q) to the system?',
    formula: 'ΔU = Q - W',
    options: [
      { id: 'A', text: 'ΔU = 0 and Q > 0' },
      { id: 'B', text: 'ΔU > 0 and Q = 0' },
      { id: 'C', text: 'ΔU < 0 and Q < 0' },
      { id: 'D', text: 'ΔU = 0 and Q < 0' },
    ],
    correctAnswer: 'A',
    explanation: {
      overview:
        'In an isothermal process for an ideal gas, temperature remains strictly constant. Since internal energy U depends solely on temperature, ΔU = 0.',
      whyWrongDetails:
        'During expansion (V₂ > V₁), the gas performs positive work on its surroundings (W > 0). According to the First Law of Thermodynamics (ΔU = Q - W), Q = W > 0, meaning heat must be added to the system.',
      stepByStep: [
        '1. For an ideal gas, internal energy is a function of temperature only: U = nCvT.',
        '2. In an isothermal process, ΔT = 0, therefore ΔU = 0.',
        '3. Work done by an expanding gas is W = ∫ P dV = nRT ln(V₂/V₁). Since V₂ = 2V₁ > V₁, W > 0.',
        '4. By the 1st Law of Thermodynamics: ΔU = Q - W ⇒ 0 = Q - W ⇒ Q = W > 0.',
      ],
      simpleExplanation:
        'Because temperature does not change, internal energy stays flat (ΔU = 0). The gas expands and pushes outward, doing work, so heat (Q) must flow in to keep the temperature up.',
      banglaExplanation:
        'সমোষ্ণ প্রক্রিয়ায় (Isothermal process) তাপমাত্রা ধ্রুব থাকে। আদর্শ গ্যাসের অভ্যন্তরীণ শক্তি (Internal Energy) শুধুমাত্র তাপমাত্রার উপর নির্ভর করে, তাই ΔU = 0। গ্যাস প্রসারিত হওয়ার সময় কাজ (Work) সম্পাদিত হয় (W > 0), সুতরাং তাপগতিবিদ্যার প্রথম সূত্রানুসারে Q = W > 0।',
      keyTakeaway: 'Isothermal for ideal gas implies ΔU = 0 always. Expansion requires positive heat input (Q > 0).',
    },
    graphType: 'thermodynamics',
  },
  {
    id: 14,
    subject: 'Mathematics',
    chapter: 'Calculus',
    topic: 'Integration by Partial Fractions',
    difficulty: 'Hard',
    title: 'Rational Polynomial Integration',
    questionText: 'Evaluate the indefinite integral:',
    formula: '∫ (3x² + 2x + 1) / (x³ + x² + x + 1) dx',
    options: [
      { id: 'A', text: 'ln|x³ + x² + x + 1| + C' },
      { id: 'B', text: '(3x² + 2x + 1) ln|x| + C' },
      { id: 'C', text: 'ln|x + 1| + ln(x² + 1) + C' },
      { id: 'D', text: 'arctan(x) + ln|x + 1| + C' },
    ],
    correctAnswer: 'C',
    explanation: {
      overview:
        'Factoring the denominator reveals grouped linear and quadratic factors: x³ + x² + x + 1 = (x² + 1)(x + 1).',
      whyWrongDetails:
        "You might have chosen Option A assuming the numerator (3x² + 2x + 1) is simply the exact derivative of denominator (x³ + x² + x + 1), but d/dx(x³ + x² + x + 1) = 3x² + 2x + 1. While derivative matching is tempting, algebraic decomposition simplifies the integral into two natural logarithms.",
      stepByStep: [
        '1. Factor denominator by grouping: x²(x + 1) + 1(x + 1) = (x² + 1)(x + 1).',
        '2. Express in partial fractions: (3x² + 2x + 1)/[(x² + 1)(x + 1)] = A/(x + 1) + (Bx + C)/(x² + 1).',
        '3. Equate coefficients: A = 1, B = 2, C = 0.',
        '4. Integrate terms: ∫ 1/(x + 1) dx + ∫ 2x/(x² + 1) dx = ln|x + 1| + ln(x² + 1) + C.',
      ],
      simpleExplanation:
        'Break the denominator into two simpler blocks: (x+1) and (x²+1). The integral separates into 1/(x+1) which gives ln|x+1|, plus 2x/(x²+1) which gives ln(x²+1).',
      banglaExplanation:
        'হরটিকে উৎপাদকে বিশ্লেষণ করুন: x³ + x² + x + 1 = (x² + 1)(x + 1)। এরপর আংশিক ভগ্নাংশে বিভক্ত করলে পাওয়া যায় 1/(x+1) + 2x/(x²+1)। উভয় অংশকে সমাকলন করলে ফলাফল দাঁড়ায় ln|x+1| + ln(x²+1) + C।',
      keyTakeaway: 'Always factor polynomial denominators first before attempting logarithmic direct forms.',
    },
    graphType: 'integral',
  },
  {
    id: 1,
    subject: 'Physics',
    chapter: 'Mechanics',
    topic: 'Kinematics & Projectile Motion',
    difficulty: 'Medium',
    title: 'Maximum Range of Projectile',
    questionText:
      'A projectile is launched from ground level with an initial velocity v₀ at an angle θ above the horizontal on a flat surface. Ignoring air resistance, what angle θ yields the maximum horizontal range?',
    formula: 'R = (v₀² sin(2θ)) / g',
    options: [
      { id: 'A', text: '30°' },
      { id: 'B', text: '45°' },
      { id: 'C', text: '60°' },
      { id: 'D', text: '90°' },
    ],
    correctAnswer: 'B',
    explanation: {
      overview: 'The horizontal range formula is R = (v₀² sin 2θ) / g. Range is maximized when sin(2θ) reaches its maximum value of 1.',
      stepByStep: [
        '1. Range formula: R = (v₀² sin 2θ) / g.',
        '2. sin(2θ) is maximized when 2θ = 90°.',
        '3. Solving gives θ = 45°.',
      ],
      simpleExplanation: '45 degrees provides the optimal mathematical split between forward speed and hang time.',
      banglaExplanation: 'প্রক্ষেপকের অনুভূমিক পাল্লা সর্বাধিক হয় যখন sin(2θ) = 1 হয়, অর্থাৎ 2θ = 90° বা θ = 45°।',
      keyTakeaway: 'Optimal launch angle on level ground without drag is 45°.',
    },
    graphType: 'velocity-time',
  },
  {
    id: 2,
    subject: 'Physics',
    chapter: 'Waves',
    topic: 'Doppler Effect',
    difficulty: 'Hard',
    title: 'Frequency Shift for Moving Source',
    questionText:
      'A sound source emitting frequency f moves directly toward a stationary observer at a constant speed v_s. If the speed of sound in air is v, what is the observed frequency f′?',
    formula: 'f′ = f · [v / (v - v_s)]',
    options: [
      { id: 'A', text: 'f′ = f · [v / (v + v_s)]' },
      { id: 'B', text: 'f′ = f · [v / (v - v_s)]' },
      { id: 'C', text: 'f′ = f · [(v - v_s) / v]' },
      { id: 'D', text: 'f′ = f · [(v + v_s) / v]' },
    ],
    correctAnswer: 'B',
    explanation: {
      overview: 'As the source approaches, wavefronts are compressed in front of it, reducing wavelength and increasing observed pitch.',
      stepByStep: [
        '1. Effective wavelength: λ′ = (v - v_s)/f.',
        '2. Observed frequency: f′ = v / λ′ = v / [(v - v_s)/f] = f [v / (v - v_s)].',
      ],
      simpleExplanation: 'Waves bunch up as the source moves forward, making the pitch higher: f′ > f.',
      banglaExplanation: 'শব্দের উৎস যখন স্থির পর্যবেক্ষকের দিকে এগিয়ে আসে, তখন আপাত কম্পাঙ্ক বৃদ্ধি পায় এবং সূত্রটি হলো f′ = f · [v / (v - v_s)]।',
      keyTakeaway: 'Approaching source reduces apparent wavelength: denominator is (v - v_s).',
    },
    graphType: 'wave',
  },
  {
    id: 3,
    subject: 'Chemistry',
    chapter: 'Organic Chemistry',
    topic: 'Electrophilic Aromatic Substitution',
    difficulty: 'Medium',
    title: 'Benzene Nitration Reagents',
    questionText:
      'Which mixture of reagents is standardly used to perform electrophilic aromatic nitration of benzene?',
    formula: 'C₆H₆ + HNO₃ / H₂SO₄ → C₆H₅NO₂ + H₂O',
    options: [
      { id: 'A', text: 'Concentrated HNO₃ and concentrated H₂SO₄' },
      { id: 'B', text: 'Dilute HNO₃ with aqueous HCl' },
      { id: 'C', text: 'NaNO₂ with glacial acetic acid' },
      { id: 'D', text: 'NH₄NO₃ with alkaline NaOH' },
    ],
    correctAnswer: 'A',
    explanation: {
      overview: 'Sulfuric acid acts as a stronger acid to protonate nitric acid, generating the active electrophile nitronium ion (NO₂⁺).',
      stepByStep: [
        '1. HNO₃ + 2 H₂SO₄ ⇌ NO₂⁺ + H₃O⁺ + 2 HSO₄⁻.',
        '2. The electrophile NO₂⁺ attacks the π-electron cloud of benzene.',
        '3. Deprotonation restores aromaticity.',
      ],
      simpleExplanation: 'Concentrated H₂SO₄ activates HNO₃ to make the powerful NO₂⁺ ion that bonds to the benzene ring.',
      banglaExplanation: 'বেনজিনের নাইট্রেশনে গাঢ় HNO₃ এবং গাঢ় H₂SO₄ ব্যবহৃত হয়। সালফিউরিক এসিড নাইট্রিক এসিডকে প্রোটোনেটেড করে সক্রিয় নাইট্রোনিয়াম আয়ন (NO₂⁺) তৈরি করে।',
      keyTakeaway: 'Nitronium ion (NO₂⁺) generation requires concentrated H₂SO₄ catalyst.',
    },
  },
  {
    id: 4,
    subject: 'Mathematics',
    chapter: 'Algebra',
    topic: 'Quadratic Discriminant & Roots',
    difficulty: 'Easy',
    title: 'Nature of Quadratic Roots',
    questionText:
      'For the quadratic equation ax² + bx + c = 0 with real coefficients, if the discriminant Δ = b² - 4ac < 0, what can be concluded about its roots?',
    formula: 'Δ = b² - 4ac',
    options: [
      { id: 'A', text: 'Two distinct real roots' },
      { id: 'B', text: 'Two equal real roots' },
      { id: 'C', text: 'Two complex conjugate non-real roots' },
      { id: 'D', text: 'No solutions exist in any number field' },
    ],
    correctAnswer: 'C',
    explanation: {
      overview: 'When Δ < 0, the square root √Δ produces an imaginary component ±i√|Δ|, yielding two complex conjugate roots.',
      stepByStep: [
        '1. Quadratic formula: x = (-b ± √(b² - 4ac)) / (2a).',
        '2. With Δ < 0, √(b² - 4ac) = i√|Δ|.',
        '3. Roots are x = -b/(2a) ± i(√|Δ|)/(2a).',
      ],
      simpleExplanation: 'Taking the square root of a negative number creates imaginary numbers, producing two conjugate complex roots.',
      banglaExplanation: 'যদি নিরূপক Δ = b² - 4ac < 0 হয়, তবে দ্বিঘাত সমীকরণের মূলদ্বয় পরস্পর অনুবন্ধী জটিল সংখ্যা (Complex conjugates) হবে।',
      keyTakeaway: 'Negative discriminant implies complex conjugate pair roots.',
    },
  },
];

// Generate 50 questions for full mock experience by expanding variants
export function generateFullExam(count: number = 20, subject: string = 'Physics'): Question[] {
  const base = mockQuestions;
  const questions: Question[] = [];
  
  for (let i = 1; i <= count; i++) {
    const template = base[(i - 1) % base.length];
    questions.push({
      ...template,
      id: i,
      title: i === 17 ? 'Ideal Gas Isothermal Expansion' : `${template.subject} Drill #${i}: ${template.topic}`,
    });
  }
  return questions;
}

export const mockMistakes: MistakeItem[] = [
  {
    id: 'm1',
    subject: 'Mathematics',
    topic: 'Calculus',
    subtopic: 'Integration by Parts',
    title: 'Integration by Parts',
    attemptCount: 3,
    correctCount: 0,
    lastAttempted: 'Yesterday at 4:30 PM',
    question: mockQuestions[1],
  },
  {
    id: 'm2',
    subject: 'Mathematics',
    topic: 'Algebra',
    subtopic: 'Quadratic Formula Applications',
    title: 'Quadratic Formula Applications',
    attemptCount: 2,
    correctCount: 0,
    lastAttempted: '2 days ago',
    question: mockQuestions[5],
  },
  {
    id: 'm3',
    subject: 'Physics',
    topic: 'Thermodynamics',
    subtopic: 'Carnot Cycle & Entropy',
    title: 'Isothermal vs Adiabatic Work',
    attemptCount: 4,
    correctCount: 1,
    lastAttempted: '3 days ago',
    question: mockQuestions[0],
  },
  {
    id: 'm4',
    subject: 'Physics',
    topic: 'Waves',
    subtopic: 'Doppler Shift for Reflected Signals',
    title: 'Doppler Effect Calculations',
    attemptCount: 2,
    correctCount: 0,
    lastAttempted: '4 days ago',
    question: mockQuestions[3],
  },
  {
    id: 'm5',
    subject: 'Chemistry',
    topic: 'Organic Chemistry',
    subtopic: 'Electrophilic Substitution Mechanisms',
    title: 'Benzene Nitration Reagents & Electrophiles',
    attemptCount: 3,
    correctCount: 1,
    lastAttempted: '5 days ago',
    question: mockQuestions[4],
  },
];

export const mockTutors: Tutor[] = [
  {
    id: 't1',
    name: 'Dr. Aris Thorne',
    title: 'Dr. Aris Thorne',
    subject: 'Mathematics',
    specialty: 'Advanced Calculus & Differential Equations',
    rating: 5.0,
    reviewCount: 142,
    yearsExperience: 12,
    languages: ['English', 'Bng'],
    hourlyRateBDT: 1200,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyhKzWU-fjDuJ0TNsWsdcJjmjVrebw2NTwUBjJKcmYJSZtO6D5aDHJsSrzDU9IBr2uEsW-jUmapUFAa_WGZkUFhtPsnQ-Pz-Z1JEIEctDN7iC7vRE3YtPBUZi1HPY7-HncsrN6h185VaMdQGodh8VYeoE759kQjVo-uz_wOhpSjoeQeQ8tyONDar6iyJhQhdpsALM8pSQxTcnBBa9WpuyYely5Cf939dXIdibiKPaLlt0GmwW9jlLZrQ',
    isAvailableToday: true,
    bio: 'Former Olympiad coach and university lecturer with over a decade of helping students ace calculus and competitive engineering exams.',
    education: 'Ph.D. in Applied Mathematics, Cambridge',
  },
  {
    id: 't2',
    name: 'Prof. Elena Rostova',
    title: 'Prof. Elena Rostova',
    subject: 'Physics',
    specialty: 'Quantum Physics, Mechanics & Electromagnetism',
    rating: 4.9,
    reviewCount: 289,
    yearsExperience: 15,
    languages: ['English', 'German'],
    hourlyRateBDT: 1500,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBpi8iW1H_3RXSFbrHJFlbheuapFwvjhP3G9YPKd322V-zoi8e4lHaRucWtfANLlH8RAwwkr0Oerk9Tu1axKDG81fHwIZjUlEB66ywMipWdHBf2ny9nt7epLgE-AyjsHRCmCTa6l1E04m-6dwRUbBl-P6kOsijzPjJXRP1T6nRI8S5WHrIF0CvJmGdp-cnyAJZRtu_TgA74JUrItR2fSIV4LTiKy8cV0X93pI2OsFrhAA3Ax8S3V6grYA',
    isHighDemand: true,
    isAvailableToday: true,
    bio: 'Renowned researcher and educator specializing in high-stakes college board and entrance physics problem sets.',
    education: 'M.Sc. & D.Sc. in Theoretical Physics, MIT',
  },
  {
    id: 't3',
    name: 'Marcus Chen',
    title: 'Marcus Chen',
    subject: 'Chemistry',
    specialty: 'Organic Chemistry & Reaction Mechanisms',
    rating: 4.8,
    reviewCount: 97,
    yearsExperience: 5,
    languages: ['English'],
    hourlyRateBDT: 800,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAq0btIXctHRz_Oqt_a5Z0-B71k_L_CWQAw3yMkVtkkn0eeayAXGOkrwhLacxwN36jcqm6d81hOo-1KdJJwHMf-DIZC1QkVBNWzJN73ZkHpQa1Yh76fMpFViNVZIPpSVSv_pJaVMkjXw9tTbNAidJ39HMtJq3UbaaThmxni5bRd4pIyGvpYeP5zZCma2d_W8w7uB7p_FZSVMUlUrl-_WFbOge9dvDuZsl_xs7gQEJvW_QCnwBBxNse4gA',
    isAvailableToday: false,
    bio: 'Dedicated medical school entrance specialist focusing on rapid reaction synthesis and memorization shortcuts.',
    education: 'B.S. in Chemical Biology, UC Berkeley',
  },
  {
    id: 't4',
    name: 'Dr. Ananya Sen',
    title: 'Dr. Ananya Sen',
    subject: 'Mathematics',
    specialty: 'Statistics, Probability & Discrete Math',
    rating: 4.9,
    reviewCount: 118,
    yearsExperience: 9,
    languages: ['English', 'Bng'],
    hourlyRateBDT: 1100,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB8dAfcc_6FIQewza9T7NUcG_OMS-LZMtejzUiTsJOhBrLHVMHoFr1eC1zeWmOVw43M8O-QO0ollXUgdzUEIVm27EyNdz4OuFp-lm9LHgt_ItyKZ-BwgOoqcskM1GyLVpTUibNE9Ecwtwmdty6ytg5I2LFnT50L7e-5x6k6SxijsnHi33U8uUn7LvE7wnUDHDemGCmvlxgGTC1ZvhnI_aR1POtktNcLO7WzYWwvg1ehQZoHWxqn6XLomw',
    isAvailableToday: true,
    bio: 'Experienced university instructor with bilingual English and Bengali teaching expertise in competitive exams.',
    education: 'Ph.D. in Statistics, University of Dhaka',
  },
];
