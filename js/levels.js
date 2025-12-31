// Level configuration for Corporate Whack

export const LEVELS = [
    {
        id: 1,
        name: "Junior Staff",
        targetHits: 10,
        timeLimit: 60,
        moleVisibleTime: 2000, // ms
        spawnInterval: 1500, // ms between spawns
        maxActiveMoles: 2,
        problemRatio: 0.9, // 90% problems, 10% culture
        speedMultiplier: 1.0
    },
    {
        id: 2,
        name: "Senior Staff",
        targetHits: 10,
        timeLimit: 60,
        moleVisibleTime: 1700,
        spawnInterval: 1300,
        maxActiveMoles: 3,
        problemRatio: 0.8,
        speedMultiplier: 1.2
    },
    {
        id: 3,
        name: "Director",
        targetHits: 10,
        timeLimit: 60,
        moleVisibleTime: 1400,
        spawnInterval: 1100,
        maxActiveMoles: 4,
        problemRatio: 0.7,
        speedMultiplier: 1.4
    },
    {
        id: 4,
        name: "Head of Department",
        targetHits: 10,
        timeLimit: 60,
        moleVisibleTime: 1100,
        spawnInterval: 900,
        maxActiveMoles: 5,
        problemRatio: 0.6,
        speedMultiplier: 1.6
    },
    {
        id: 5,
        name: "CEO",
        targetHits: 10,
        timeLimit: 60,
        moleVisibleTime: 800,
        spawnInterval: 700,
        maxActiveMoles: 6,
        problemRatio: 0.5, // 50/50 chaos
        speedMultiplier: 2.0
    }
];

// Problem moles - WHACK THESE
export const PROBLEMS = [
    { id: 'email', emoji: '📧', label: 'Unread Emails', color: 0x3498db },
    { id: 'contract', emoji: '📝', label: 'Contract Negotiations', color: 0x9b59b6 },
    { id: 'staff', emoji: '👥', label: 'Staff Conflict', color: 0xe67e22 },
    { id: 'bug', emoji: '🐛', label: 'Software Bug', color: 0x1abc9c },
    { id: 'it', emoji: '💻', label: 'IT Problems', color: 0x34495e },
    { id: 'report', emoji: '📊', label: 'Reports Due', color: 0x2ecc71 },
    { id: 'call', emoji: '📞', label: 'Missed Calls', color: 0xf1c40f },
    { id: 'client', emoji: '🔥', label: 'Client Complaint', color: 0xe74c3c },
    { id: 'meeting', emoji: '📅', label: 'Meeting Overload', color: 0x95a5a6 }
];

// Culture moles - DO NOT WHACK
export const CULTURE = [
    { id: 'teambuilding', emoji: '🎭', label: 'Team Building', color: 0xff69b4 },
    { id: 'employee', emoji: '🏆', label: 'Employee of Month', color: 0xffd700 },
    { id: 'mandatoryfun', emoji: '🤝', label: 'Mandatory Fun', color: 0xff1493 },
    { id: 'allhands', emoji: '📣', label: 'All-Hands Meeting', color: 0x00ced1 },
    { id: 'birthday', emoji: '🎂', label: 'Birthday Party', color: 0xffa07a },
    { id: 'opendoor', emoji: '💬', label: 'Open Door Policy', color: 0x98fb98 }
];

// Game constants
export const GAME_CONFIG = {
    maxStrikes: 5,
    minSuccessRate: 0.5, // 50% hit rate needed to advance
    holePositions: [
        // 3x3 grid positions (normalized -1 to 1)
        { x: -0.6, z: -0.6 },
        { x: 0, z: -0.6 },
        { x: 0.6, z: -0.6 },
        { x: -0.6, z: 0 },
        { x: 0, z: 0 },
        { x: 0.6, z: 0 },
        { x: -0.6, z: 0.6 },
        { x: 0, z: 0.6 },
        { x: 0.6, z: 0.6 }
    ]
};

// Promotion messages
export const PROMOTION_MESSAGES = {
    2: "You've proven yourself capable of handling emails.\nNow handle EVERYTHING.",
    3: "Middle management awaits.\nMore politics, same pay.",
    4: "You're now responsible for other people's mistakes.\nCongratulations?",
    5: "The corner office is yours.\nSurvive this and you can retire."
};

// Game over messages
export const GAMEOVER_MESSAGES = {
    fired: [
        "HR would like a word with you.",
        "You're just not a culture fit.",
        "We're going in a different direction.",
        "It's not you, it's... actually, it's you.",
        "Please collect your things from your desk."
    ],
    performance: [
        "Your performance review was... concerning.",
        "We expected more synergy from you.",
        "Your KPIs are not meeting expectations.",
        "Perhaps corporate life isn't for you.",
        "The quarterly targets remain unmet."
    ]
};
