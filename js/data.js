// ============================================
// RECRUITER vs CV — Card Data (Expanded)
// ============================================

const CV_DATA = {
  personal: {
    name: "Christos Galaios",
    title: "Senior Gameplay Programmer",
    subtitle: "VR & Multiplayer",
    email: "christosgaleos@gmail.com",
    phone: "07469 198668",
    location: "Bristol, UK (Remote/Hybrid)",
    status: "UK Settled Status",
    linkedin: "linkedin.com/in/christos-galaios",
    linkedinUrl: "https://linkedin.com/in/christos-galaios",
    summary: "Senior Gameplay Programmer with 5+ years specialising in high-concurrency multiplayer systems and physics-based interactions within the Meta VR ecosystem."
  }
};

// ================================================
// Recruiter's objection cards (Red) — Expanded
// ================================================
const OBJECTION_CARDS = [
  {
    id: "obj_vr",
    title: "No VR Experience",
    description: "We ship on Quest. VR is mandatory.",
    power: 2,
    category: "experience",
    icon: "🥽"
  },
  {
    id: "obj_shipped",
    title: "No Shipped Titles",
    description: "Have you actually shipped anything?",
    power: 3,
    category: "delivery",
    icon: "📦"
  },
  {
    id: "obj_location",
    title: "Not UK-Based",
    description: "We need someone local for hybrid.",
    power: 1,
    category: "logistics",
    icon: "📍"
  },
  {
    id: "obj_published",
    title: "No Published Work",
    description: "No research or academic background.",
    power: 2,
    category: "academic",
    icon: "📄"
  },
  {
    id: "obj_performance",
    title: "No Performance Chops",
    description: "72Hz native is non-negotiable.",
    power: 3,
    category: "technical",
    icon: "⚡"
  },
  {
    id: "obj_leadership",
    title: "No Leadership Skills",
    description: "Can you actually manage a team?",
    power: 3,
    category: "leadership",
    icon: "👑"
  },
  {
    id: "obj_multiplayer",
    title: "No Multiplayer Exp",
    description: "Real-time state sync is critical.",
    power: 3,
    category: "networking",
    icon: "🌐"
  },
  {
    id: "obj_tools",
    title: "No Custom Tooling",
    description: "We need bespoke editor tools.",
    power: 2,
    category: "tools",
    icon: "🔧"
  },
  {
    id: "obj_education",
    title: "No Formal Training",
    description: "Self-taught won't cut it here.",
    power: 2,
    category: "academic",
    icon: "🎓"
  },
  {
    id: "obj_audio",
    title: "No Audio Skills",
    description: "Spatial audio is a core requirement.",
    power: 2,
    category: "audio",
    icon: "🔊"
  },
  {
    id: "obj_physics",
    title: "No Physics Expertise",
    description: "We need deep physics knowledge.",
    power: 3,
    category: "technical",
    icon: "🎯"
  },
  {
    id: "obj_rapid_learn",
    title: "Slow Ramp-Up",
    description: "New engines take years to learn.",
    power: 2,
    category: "adaptability",
    icon: "🐌"
  },
  {
    id: "obj_game_feel",
    title: "No Game Feel Sense",
    description: "Juice and polish aren't optional.",
    power: 2,
    category: "design",
    icon: "✨"
  },
  {
    id: "obj_testing",
    title: "No Testing Culture",
    description: "We need robust QA pipelines.",
    power: 2,
    category: "process",
    icon: "🧪"
  },
  {
    id: "obj_scale",
    title: "Can't Handle Scale",
    description: "Can you handle thousands of entities?",
    power: 3,
    category: "architecture",
    icon: "📈"
  }
];

// =============================================
// Christos' counter cards (Gold/Emerald)
// =============================================
const COUNTER_CARDS = [
  {
    id: "ctr_vr",
    counters: "obj_vr",
    title: "Meta VR Ecosystem",
    description: "5+ years shipping on Meta Quest. Native 72Hz. This IS what I do.",
    power: 5,
    source: "Professional Summary",
    category: "experience",
    icon: "🎮"
  },
  {
    id: "ctr_shipped",
    counters: "obj_shipped",
    title: "Multi-Title Veteran",
    description: "Shipped at Koffee Cup & Virtually Sports. VR, mobile, multiplayer — all live.",
    power: 5,
    source: "Koffee Cup & Virtually Sports",
    category: "delivery",
    icon: "🚀"
  },
  {
    id: "ctr_location",
    counters: "obj_location",
    title: "Bristol, UK — Settled",
    description: "UK Settled Status. Remote or Hybrid. No visa needed.",
    power: 4,
    source: "Personal Info",
    category: "logistics",
    icon: "🇬🇧"
  },
  {
    id: "ctr_published",
    counters: "obj_published",
    title: "IEEE Published",
    description: "Published thesis on educational games for children with ADHD. Academic? Check.",
    power: 5,
    source: "Education — Middlesex Uni",
    category: "academic",
    icon: "📜"
  },
  {
    id: "ctr_performance",
    counters: "obj_performance",
    title: "72Hz Native Lock",
    description: "Locked 72Hz on Quest. Perfetto, RenderDoc, Unity Profiler — I live in these.",
    power: 6,
    source: "Tech Lead @ Koffee Cup",
    category: "technical",
    icon: "📊"
  },
  {
    id: "ctr_leadership",
    counters: "obj_leadership",
    title: "12-Engineer Team Lead",
    description: "Led 12 engineers as Tech Lead. Cut iteration cycles 40%, boosted art workflows 50%.",
    power: 6,
    source: "Tech Lead @ Koffee Cup",
    category: "leadership",
    icon: "⚔️"
  },
  {
    id: "ctr_multiplayer",
    counters: "obj_multiplayer",
    title: "Client-Side Auth Model",
    description: "Architected zero-latency shooting. Deterministic state sync. Multiplayer is my arena.",
    power: 6,
    source: "Interactive Dev @ Koffee Cup",
    category: "networking",
    icon: "🛡️"
  },
  {
    id: "ctr_tools",
    counters: "obj_tools",
    title: "Custom Editor Tooling",
    description: "Material Testing Tool + Debug/Cheat System. Testing velocity up ~10x.",
    power: 5,
    source: "Tech Lead @ Koffee Cup",
    category: "tools",
    icon: "⚒️"
  },
  {
    id: "ctr_education",
    counters: "obj_education",
    title: "First Class Honours",
    description: "BSc Games Programming — First Class. Combat AI thesis using BTs and FSM.",
    power: 5,
    source: "Middlesex University",
    category: "academic",
    icon: "🏛️"
  },
  {
    id: "ctr_audio",
    counters: "obj_audio",
    title: "Spatial Audio Pipeline",
    description: "Optimised spatial audio — 60% memory reduction. High-fidelity soundscapes maintained.",
    power: 5,
    source: "Tech Lead @ Koffee Cup",
    category: "audio",
    icon: "🎵"
  },
  {
    id: "ctr_physics",
    counters: "obj_physics",
    title: "Physics-Based Combat",
    description: "Procedural recoil, ballistic projectiles, Raycast Pooling. Physics is second nature.",
    power: 6,
    source: "Interactive Dev @ Koffee Cup",
    category: "technical",
    icon: "💥"
  },
  {
    id: "ctr_rapid_learn",
    counters: "obj_rapid_learn",
    title: "12-Month Promotion",
    description: "Mastered TypeScript + proprietary engine from zero. Promoted to Tech Lead in 12 months.",
    power: 5,
    source: "Interactive Dev @ Koffee Cup",
    category: "adaptability",
    icon: "🚀"
  },
  {
    id: "ctr_game_feel",
    counters: "obj_game_feel",
    title: "UX & Haptics Pioneer",
    description: "'Blind Pickup' haptic UX — cited by client as key to prototype → full title expansion.",
    power: 5,
    source: "Interactive Dev @ Koffee Cup",
    category: "design",
    icon: "🎯"
  },
  {
    id: "ctr_testing",
    counters: "obj_testing",
    title: "Debug Architecture",
    description: "Debug/Cheat System: inject state, unlock progression, populate levels — 10x test velocity.",
    power: 5,
    source: "Tech Lead @ Koffee Cup",
    category: "process",
    icon: "🔬"
  },
  {
    id: "ctr_scale",
    counters: "obj_scale",
    title: "10,000+ Entity Crowds",
    description: "Probabilistic reactions for 10K+ entities. High-perf State Machine. Stadium-scale.",
    power: 6,
    source: "Virtually Sports",
    category: "architecture",
    icon: "🏟️"
  }
];

// Narrator lines
const NARRATOR_LINES = {
  intro: [
    "The recruiter shuffles their deck of doubts...",
    "But across the table sits a formidable hand.",
    "Play your objections. See what answers await."
  ],
  clash: [
    "The cards collide. Let the evidence speak.",
    "An objection meets its match.",
    "The CV strikes back.",
    "Another doubt crushed by experience.",
    "Can mere words defeat proven results?"
  ],
  lowCards: [
    "Running low on objections, recruiter?",
    "The doubts grow thin...",
    "Perhaps it's time to reconsider."
  ],
  victory: [
    "The recruiter's deck is empty.",
    "Every objection answered. Every doubt dismantled.",
    "There's only one move left..."
  ],
  surrender: [
    "The recruiter lowers their hand...",
    "Convinced. No more objections needed.",
    "A wise decision. Let's talk."
  ]
};

// Full CV experience for deck viewer
const CV_FULL_EXPERIENCE = [
  {
    role: "Technical Lead (Interactive)",
    dates: "Jan 2024 – Feb 2026",
    company: "Koffee Cup Ltd",
    platform: "Mobile & VR Platforms | Managed 12 Engineers",
    achievements: [
      "Debug Architecture — 10x testing velocity via Debug/Cheat System",
      "Pipeline Leadership — 50% faster artist workflows via Material Testing Tool",
      "Audio Pipeline — 60% audio memory reduction with Spatial Audio optimisation",
      "Context-Sensitive Traversal — Vehicle/Boat/On-Foot state management",
      "Performance — Locked 72Hz with physics & animation optimisation"
    ]
  },
  {
    role: "Interactive Developer",
    dates: "Jan 2023 – Jan 2024",
    company: "Koffee Cup Ltd",
    platform: "TypeScript / Meta Horizon Engine",
    achievements: [
      "AI-Accelerated Onboarding — Mastered TypeScript + proprietary engine, promoted in 12 months",
      "Optimistic Networking — Client-Side Authoritative shooting model",
      "Combat Engineering — Procedural recoil, physics-based projectiles, Raycast Pooling",
      "UX & Haptics — 'Blind Pickup' system cited as key to prototype→full title expansion",
      "Creative Optimisation — Baked animation states for 72Hz native"
    ]
  },
  {
    role: "Software Engineer (Unity)",
    dates: "Jan 2021 – Jan 2023",
    company: "Virtually Sports",
    platform: "Unity | C#",
    achievements: [
      "Systemic Crowds — 10,000+ entity probabilistic reactions via State Machine",
      "Immersive Audio — Cross-engine Spatial Audio integration",
      "UI Juice & Polish — DOTween + Particle Systems for Triple-A feel"
    ]
  }
];
