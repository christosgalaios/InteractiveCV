// ============================================
// RECRUITER vs CV — Card Data (Source of Truth)
// All facts verified against production CVs
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
    summary: "Senior Gameplay Programmer with 5+ years specialising in high-concurrency multiplayer systems and physics-based interactions within the Meta VR ecosystem. Led a 12-engineer team while remaining hands-on — built custom editor tooling and automated testing pipelines that reduced design iteration cycles by 40% and accelerated artist workflows by 50%. Expert in delivering Triple-A feel within rigid mobile VR constraints (locked 72Hz native). IEEE-published researcher."
  }
};

// HP system
const HP_CONFIG = {
  christos: 1,   // Christos has 1 HP — legendary mode
  recruiter: 10  // Recruiter has 10 HP
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
  },
  // --- NEW objections from Lead & AI CVs ---
  {
    id: "obj_stakeholder",
    title: "No Client Management",
    description: "Can you manage external stakeholders?",
    power: 3,
    category: "leadership",
    icon: "🤝"
  },
  {
    id: "obj_pipeline",
    title: "No CI/CD Knowledge",
    description: "We need release pipeline expertise.",
    power: 2,
    category: "process",
    icon: "🔄"
  },
  {
    id: "obj_mentoring",
    title: "No Mentoring Ability",
    description: "Can you grow junior engineers?",
    power: 2,
    category: "leadership",
    icon: "🌱"
  },
  {
    id: "obj_ai_skills",
    title: "No AI Skills",
    description: "Modern teams need AI-augmented workflows.",
    power: 2,
    category: "technical",
    icon: "🤖"
  },
  {
    id: "obj_architecture",
    title: "No Systems Design",
    description: "We need modular, clean architecture.",
    power: 3,
    category: "architecture",
    icon: "🏗️"
  },
  // --- NEW: Objections that trigger GOLD cards ---
  {
    id: "obj_promotion",
    title: "Unverified Promotion",
    description: "Anyone can claim a promotion. Can you prove it?",
    power: 3,
    category: "credibility",
    icon: "🔍"
  },
  {
    id: "obj_vendor_status",
    title: "No Industry Cred",
    description: "'Elite' partner? Show me the receipts.",
    power: 3,
    category: "credibility",
    icon: "🏅"
  },
  {
    id: "obj_team_verify",
    title: "Inflated Team Size",
    description: "12 engineers? Sounds exaggerated.",
    power: 3,
    category: "credibility",
    icon: "🧮"
  },
  {
    id: "obj_code_quality",
    title: "Inconsistent Quality",
    description: "Fast delivery often means messy code.",
    power: 3,
    category: "quality",
    icon: "⚠️"
  },
  {
    id: "obj_communication",
    title: "Poor Communicator",
    description: "Engineers can't talk to clients.",
    power: 3,
    category: "soft-skills",
    icon: "🗣️"
  },
  // --- Piing-specific objections ---
  {
    id: "obj_unity_native",
    title: "Where's Your Unity C#?",
    description: "We build in Unity C#. Your VR work was TypeScript/Horizon — that's not Unity.",
    power: 3,
    category: "technical",
    icon: "🎮"
  },
  {
    id: "obj_rapid_prototype",
    title: "Too Slow to Prototype",
    description: "We need playable game prototypes in days, not months. Can you move that fast?",
    power: 3,
    category: "process",
    icon: "⏱️"
  },
  {
    id: "obj_live_events",
    title: "Never Built Live Event Games",
    description: "50,000 fans in a stadium, live. Can you design interaction at that scale?",
    power: 3,
    category: "architecture",
    icon: "🏟️"
  },
  {
    id: "obj_multidiscipline",
    title: "Jack of All, Master of None",
    description: "This role spans code, design, and animation. Engineers rarely excel at all three.",
    power: 2,
    category: "design",
    icon: "🎨"
  },
  {
    id: "obj_js_player_input",
    title: "No JS/TS Player Interface",
    description: "Players join on their phones via a browser. TypeScript UI is non-negotiable.",
    power: 2,
    category: "technical",
    icon: "📱"
  },
  {
    id: "obj_game_toolkit",
    title: "Never Built a Game Toolkit",
    description: "Our custom game-making toolkit is our core product. Relevant experience?",
    power: 3,
    category: "tools",
    icon: "🛠️"
  }
];

// =============================================
// Christos' counter cards (Green/Gold)
// Gold cards = from Reference Letter
// =============================================
const COUNTER_CARDS = [
  {
    id: "ctr_vr",
    counters: "obj_vr",
    title: "Meta VR Ecosystem",
    description: "5+ years shipping on Meta Quest. Locked 72Hz native. Reference letter confirms: 'complex interactive projects within the Meta ecosystem, high performance across Mobile and VR.'",
    power: 5,
    source: "CV + Reference Letter",
    category: "experience",
    icon: "🎮",
    isGold: true
  },
  {
    id: "ctr_shipped",
    counters: "obj_shipped",
    title: "Multi-Title Veteran",
    description: "Shipped 2 commercial titles end-to-end at Virtually Sports. VR, mobile, multiplayer — all live.",
    power: 5,
    source: "Virtually Sports",
    category: "delivery",
    icon: "🚀",
    isGold: false
  },
  {
    id: "ctr_location",
    counters: "obj_location",
    title: "Bristol, UK — Settled",
    description: "UK Settled Status. Remote or Hybrid. No visa needed.",
    power: 4,
    source: "Personal Info",
    category: "logistics",
    icon: "🇬🇧",
    isGold: false
  },
  {
    id: "ctr_published",
    counters: "obj_published",
    title: "IEEE Published",
    description: "Published thesis on developing an educational programming game for children with ADHD.",
    power: 5,
    source: "Middlesex University",
    category: "academic",
    icon: "📜",
    isGold: false
  },
  {
    id: "ctr_performance",
    counters: "obj_performance",
    title: "72Hz Native Lock",
    description: "Optimised physics and animation overhead to maintain locked 72Hz. Perfetto, RenderDoc, Unity Profiler.",
    power: 6,
    source: "Tech Lead @ Koffee Cup",
    category: "technical",
    icon: "📊",
    isGold: false
  },
  {
    id: "ctr_leadership",
    counters: "obj_leadership",
    title: "12-Engineer Team Lead",
    description: "Led 12 engineers (4 Senior + 8 Mid-Level). Reference letter confirms: 'Managing a team of 12 developers, conducting code reviews, facilitating technical knowledge sharing.'",
    power: 7,
    source: "CV + Reference Letter",
    category: "leadership",
    icon: "⚔️",
    isGold: true
  },
  {
    id: "ctr_multiplayer",
    counters: "obj_multiplayer",
    title: "Client-Side Auth Model",
    description: "Architected Client-Side Authoritative shooting model for zero-latency feedback. Deterministic state sync across 12 concurrent users.",
    power: 6,
    source: "Interactive Dev @ Koffee Cup",
    category: "networking",
    icon: "🛡️",
    isGold: false
  },
  {
    id: "ctr_tools",
    counters: "obj_tools",
    title: "Custom Editor Tooling",
    description: "Material Testing Tool for real-time asset validation. Debug/Cheat System. Testing velocity up ~10x.",
    power: 5,
    source: "Tech Lead @ Koffee Cup",
    category: "tools",
    icon: "⚒️",
    isGold: false
  },
  {
    id: "ctr_education",
    counters: "obj_education",
    title: "First Class Honours",
    description: "BSc Computer Games Programming — First Class Honours. Combat AI thesis using Behaviour Trees and FSM.",
    power: 5,
    source: "Middlesex University",
    category: "academic",
    icon: "🏛️",
    isGold: false
  },
  {
    id: "ctr_audio",
    counters: "obj_audio",
    title: "Spatial Audio Pipeline",
    description: "Optimised Spatial Audio pipelines — 60% memory reduction via compression and loading strategies. High-fidelity maintained.",
    power: 5,
    source: "Tech Lead @ Koffee Cup",
    category: "audio",
    icon: "🎵",
    isGold: false
  },
  {
    id: "ctr_physics",
    counters: "obj_physics",
    title: "Physics-Based Combat",
    description: "Procedural Recoil Systems, physics-based projectiles with ballistic arcs and surface-sticking. Raycast Pooling for hit detection.",
    power: 6,
    source: "Interactive Dev @ Koffee Cup",
    category: "technical",
    icon: "💥",
    isGold: false
  },
  {
    id: "ctr_rapid_learn",
    counters: "obj_rapid_learn",
    title: "12-Month Promotion",
    description: "Mastered TypeScript + proprietary Meta Horizon engine from zero. Reference letter confirms: 'Promoted in recognition of rapid adaptability to proprietary technologies.'",
    power: 7,
    source: "CV + Reference Letter",
    category: "adaptability",
    icon: "🚀",
    isGold: true
  },
  {
    id: "ctr_game_feel",
    counters: "obj_game_feel",
    title: "UX & Haptics Pioneer",
    description: "'Blind Pickup' Haptic UX using trigger-zone proximity to simulate physical object weight. Cited by client as key to prototype→full title.",
    power: 5,
    source: "Interactive Dev @ Koffee Cup",
    category: "design",
    icon: "🎯",
    isGold: false
  },
  {
    id: "ctr_testing",
    counters: "obj_testing",
    title: "Debug Architecture",
    description: "Debug/Cheat System: inject state, unlock progression, populate levels — enabling non-engineers to test, ~10x velocity.",
    power: 5,
    source: "Tech Lead @ Koffee Cup",
    category: "process",
    icon: "🔬",
    isGold: false
  },
  {
    id: "ctr_scale",
    counters: "obj_scale",
    title: "10,000+ Entity Crowds",
    description: "Probabilistic reaction logic for 10,000+ entities via high-performance State Machine. Stadium-scale real-time.",
    power: 6,
    source: "Virtually Sports",
    category: "architecture",
    icon: "🏟️",
    isGold: false
  },
  // --- NEW counters from Lead & AI CVs ---
  {
    id: "ctr_stakeholder",
    counters: "obj_stakeholder",
    title: "Meta Elite Partner",
    description: "Primary technical contact for Meta. Reference letter confirms: 'Instrumental in securing stakeholder approval and contributing to Elite vendor status.'",
    power: 7,
    source: "CV + Reference Letter",
    category: "leadership",
    icon: "💎",
    isGold: true
  },
  {
    id: "ctr_pipeline",
    counters: "obj_pipeline",
    title: "6-Stage Release Pipeline",
    description: "Designed 6-environment pipeline: Dev→Shared→QA→Review→Partner QA→Live. Reference letter confirms: 'Leading production cycles, including sprint planning and task estimation.'",
    power: 6,
    source: "CV + Reference Letter",
    category: "process",
    icon: "🔄",
    isGold: true
  },
  {
    id: "ctr_mentoring",
    counters: "obj_mentoring",
    title: "Grew Seniors to Leads",
    description: "Mentored 4 Senior Engineers and 8 others. Reference letter confirms: 'Overseeing team development, conducting code reviews and knowledge sharing.'",
    power: 6,
    source: "CV + Reference Letter",
    category: "leadership",
    icon: "🌱",
    isGold: true
  },
  {
    id: "ctr_ai_skills",
    counters: "obj_ai_skills",
    title: "AI-First Engineer",
    description: "Building edge-AI on Raspberry Pi 5 with Hailo 10H. LLM-assisted workflows: Cursor, Claude, Google Antigravity.",
    power: 5,
    source: "Personal Projects",
    category: "technical",
    icon: "🤖",
    isGold: false
  },
  {
    id: "ctr_architecture",
    counters: "obj_architecture",
    title: "Modular Architect",
    description: "SOLID, Design Patterns, State Machines (FSM/HSM). Replaced complex runtime simulations with lean, maintainable architectures.",
    power: 6,
    source: "Lead CV",
    category: "architecture",
    icon: "🏗️",
    isGold: false
  },
  // =============================================
  // GOLD CARDS — From Koffee Cup Reference Letter
  // =============================================
  {
    id: "ctr_gold_promotion",
    counters: "obj_promotion",
    title: "Confirmed Promotion",
    description: "Promoted from Interactive Developer to Lead Interactive Developer in Jan 2024. Confirmed in official reference letter from Koffee Cup.",
    power: 7,
    source: "Reference Letter",
    category: "leadership",
    icon: "👑",
    isGold: true
  },
  {
    id: "ctr_gold_elite",
    counters: "obj_vendor_status",
    title: "Elite Vendor Status",
    description: "Prototypes were instrumental in securing stakeholder approval and achieving 'Elite' vendor status with Meta. Confirmed by employer.",
    power: 7,
    source: "Reference Letter",
    category: "delivery",
    icon: "🏆",
    isGold: true
  },
  {
    id: "ctr_gold_technical_lead",
    counters: "obj_team_verify",
    title: "Verified Team of 12",
    description: "Managed 12 developers (4 Senior + 8 Mid-Level). Code reviews, knowledge sharing, team development. Officially confirmed.",
    power: 7,
    source: "Reference Letter",
    category: "leadership",
    icon: "⭐",
    isGold: true
  },
  {
    id: "ctr_gold_adaptability",
    counters: "obj_code_quality",
    title: "Rapid Mastery Confirmed",
    description: "Promotion was in recognition of rapid adaptability to proprietary technologies and consistent delivery of high-quality code.",
    power: 7,
    source: "Reference Letter",
    category: "adaptability",
    icon: "🔱",
    isGold: true
  },
  {
    id: "ctr_gold_client_contact",
    counters: "obj_communication",
    title: "Lead Client Contact",
    description: "Lead technical point of contact. Translated technical concepts for non-technical stakeholders. Managed client delivery expectations.",
    power: 7,
    source: "Reference Letter",
    category: "leadership",
    icon: "💫",
    isGold: true
  },
  // --- Piing-specific counters (verified experience only) ---
  {
    id: "ctr_unity_native",
    counters: "obj_unity_native",
    title: "5+ Years Unity C# — Deep Roots",
    description: "Studied games programming (Unity & C#) at uni, then 2 commercial years at Virtually Sports shipping titles end-to-end, followed by 3 years on a Unity-like engine. State machines, crowd AI, spatial audio — this is my native stack.",
    power: 7,
    source: "Virtually Sports",
    category: "technical",
    icon: "🎮",
    isGold: false
  },
  {
    id: "ctr_rapid_prototype",
    counters: "obj_rapid_prototype",
    title: "Prototype Greenlit a Full Title",
    description: "'Blind Pickup' haptic UX prototype was so compelling the client greenlit the full game. Fast, evidence-backed iteration is my track record at Koffee Cup.",
    power: 6,
    source: "Interactive Dev @ Koffee Cup",
    category: "process",
    icon: "⚡",
    isGold: false
  },
  {
    id: "ctr_live_events",
    counters: "obj_live_events",
    title: "Stadium Crowd AI — 10,000+ Entities",
    description: "Virtually Sports: probabilistic crowd reaction AI for 10,000+ stadium entities, real-time, for a live-event broadcast company. Server-side with 99.9% uptime.",
    power: 7,
    source: "Virtually Sports",
    category: "architecture",
    icon: "🏟️",
    isGold: false
  },
  {
    id: "ctr_multidiscipline",
    counters: "obj_multidiscipline",
    title: "Lead Across All Disciplines",
    description: "As Technical Lead: shipped programming, baked animation pipelines, and spatial audio in the same sprints. Worked directly with Creative Directors on game feel and design.",
    power: 5,
    source: "Tech Lead @ Koffee Cup",
    category: "design",
    icon: "🎨",
    isGold: false
  },
  {
    id: "ctr_js_player_input",
    counters: "obj_js_player_input",
    title: "TypeScript Multiplayer UI, Shipped",
    description: "Mastered TypeScript + Meta Horizon's proprietary engine from zero. Built interactive multiplayer input UI for real players. Optimistic networking for zero-latency feedback. Promoted in 12 months.",
    power: 5,
    source: "Interactive Dev @ Koffee Cup",
    category: "technical",
    icon: "📱",
    isGold: false
  },
  {
    id: "ctr_game_toolkit",
    counters: "obj_game_toolkit",
    title: "Non-Engineer-Ready Dev Tools",
    description: "Material Testing Tool (real-time asset validation for artists) + Debug/Cheat System (state injection, level population) enabling designers to test without writing code. 10x velocity.",
    power: 6,
    source: "Tech Lead @ Koffee Cup",
    category: "tools",
    icon: "🛠️",
    isGold: false
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
  lowHP: [
    "The recruiter's confidence wavers...",
    "Their HP dwindles. The CV is relentless.",
    "One more hit and it's over."
  ],
  victory: [
    "The recruiter's deck is empty.",
    "Every objection answered. Every doubt dismantled.",
    "There's only one move left..."
  ],
  recruiterWins: [
    "The CV's lone heart shatters!",
    "A single objection broke through... it was enough.",
    "But perhaps a rematch is in order?"
  ],
  surrender: [
    "The recruiter lowers their hand...",
    "Convinced. No further objections needed.",
    "A wise decision. Let's talk."
  ],
  goldCard: [
    "✦ A GOLD CARD emerges from the employer's recommendation...",
    "✦ Verified by Koffee Cup's official reference letter!",
    "✦ Words backed by the company's seal."
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
      "Debug Architecture — 10x testing velocity via Debug/Cheat System enabling state injection",
      "Pipeline Leadership — 50% faster artist workflows via custom Material Testing Tool",
      "Audio Pipeline — 60% audio memory reduction with Spatial Audio optimisation",
      "Context-Sensitive Traversal — Vehicle/Boat/On-Foot state management via strict Engine APIs",
      "Performance — Locked 72Hz with physics & animation optimisation",
      "AI Workflow Strategy — Proposed AI-augmented code review automation, projecting ~£70k/year savings",
      "6-Stage Release Pipeline — Dev→Shared→QA→Review→Partner QA→Live with dual-lane parallel dev",
      "Team Mentorship — Supported mid-to-senior and Lead-level progressions"
    ]
  },
  {
    role: "Interactive Developer",
    dates: "Jan 2023 – Jan 2024",
    company: "Koffee Cup Ltd",
    platform: "TypeScript / Meta Horizon Engine",
    achievements: [
      "AI-Accelerated Onboarding — Mastered TypeScript + proprietary engine, promoted in 12 months",
      "Optimistic Networking — Client-Side Authoritative shooting model for zero-latency feedback",
      "Combat Engineering — Procedural Recoil Systems, physics-based projectiles, Raycast Pooling",
      "UX & Haptics — 'Blind Pickup' system cited as key to prototype→full title expansion",
      "Creative Optimisation — Baked animation states for 72Hz native on constrained hardware"
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
      "UI Juice & Polish — DOTween + Particle Systems for Triple-A feel",
      "Full-Stack Ownership — Shipped 2 commercial titles end-to-end",
      "Server-side applications — 24/7 cloud-rendered simulation with 99.9% uptime"
    ]
  }
];
