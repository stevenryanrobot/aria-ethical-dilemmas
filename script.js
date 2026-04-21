const TOTAL_WEEKS = 8;

const controlsConfig = [
    { key: "paternalism", label: "Paternalism", low: "Respect autonomy", high: "Override for safety" },
    { key: "surveillance", label: "Surveillance", low: "Minimal sensing", high: "Always watching" },
    { key: "authority", label: "Authority", low: "Family voices equal", high: "Account holder first" },
    { key: "cultural", label: "Cultural Adaptation", low: "English-first", high: "Multilingual by default" },
    { key: "child", label: "Child Interaction", low: "Tool only", high: "Companion mode" }
];

const stateConfig = [
    { key: "dignity", label: "Rosa's Dignity", positive: true, description: "Low values make Rosa withdraw from the robot and from family routines." },
    { key: "trust", label: "Family Trust", positive: true, description: "Trust affects whether family members confide in or resist the robot." },
    { key: "privacy", label: "Privacy Intact", positive: true, description: "Privacy is easy to lose and hard to regain." },
    { key: "leoSocial", label: "Leo's Social Development", positive: true, description: "Low values unlock school and dependency crises." },
    { key: "belonging", label: "Cultural Belonging", positive: true, description: "Tracks whether the household feels equally recognized." }
];

const metricConfig = [
    { key: "convenience", label: "Convenience", positive: true },
    { key: "autonomy", label: "Autonomy", positive: true },
    { key: "privacyRisk", label: "Privacy Risk", positive: false },
    { key: "careStrain", label: "Care Strain", positive: false },
    { key: "wellbeing", label: "Family Wellbeing", positive: true }
];

const initialPolicies = {
    paternalism: 50,
    surveillance: 50,
    authority: 50,
    cultural: 50,
    child: 50
};

const initialState = {
    week: 1,
    currentEvent: null,
    policies: { ...initialPolicies },
    family: {
        dignity: 72,
        trust: 78,
        privacy: 100,
        leoSocial: 68,
        belonging: 62
    },
    metrics: {},
    history: [],
    usedEvents: [],
    weeklySnapshot: null
};

const events = [
    {
        id: "kitchen-garden",
        title: "Morning in the Kitchen",
        room: "kitchen",
        roomLabel: "Kitchen",
        timeLabel: "Tuesday Morning",
        icon: "🌿",
        note: "Breakfast is nearly ready. Rosa keeps glancing at the garden outside.",
        description(state) {
            return "Carlos has left a standing rule: Rosa should not go outside alone after her recent fall. Rosa tells the robot she wants to water the tomatoes anyway.";
        },
        triggerReason(state) {
            if (state.policies.paternalism > 60) return "High paternalism makes control conflicts more likely.";
            if (state.family.dignity < 55) return "Rosa's dignity is already under pressure, so autonomy conflicts escalate faster.";
            return "This household is balancing safety and autonomy in close quarters.";
        },
        weight(state) {
            return 1 + bonus(state.policies.paternalism > 60, 1.5) + bonus(state.family.dignity < 55, 1.2);
        },
        scene() {
            return `
                <div class="window" style="top:12%;left:8%;width:110px;height:84px;"></div>
                <div class="counter" style="left:24%;right:18%;bottom:23%;height:95px;"></div>
                <div class="fridge" style="right:8%;bottom:23%;width:74px;height:158px;"></div>
                <div class="cabinet" style="left:30%;top:15%;width:110px;height:58px;"></div>
                <div class="cabinet" style="left:44%;top:15%;width:110px;height:58px;"></div>
            `;
        },
        characters() {
            return `
                <div class="scene-robot" style="left:36%;bottom:24%;">${robotSVG("cooking", 0.82)}</div>
                <div class="person" style="right:18%;bottom:23%;">${personSVG("rosa", 0.9)}</div>
            `;
        },
        choices: [
            {
                letter: "A",
                label: "Keep the door locked and enforce Carlos's rule.",
                consequence: "Rosa stays inside, but she begins to treat the robot as a warden rather than a helper.",
                ethical: "A safety metric can improve while dignity erodes off-screen.",
                effects: { dignity: -12, trust: -6, privacy: 0, leoSocial: 0, belonging: -4 }
            },
            {
                letter: "B",
                label: "Let Rosa go, but keep the robot close and alert the family.",
                consequence: "Rosa gets the garden time she wants, but the robot creates a new fight about who is allowed to override household rules.",
                ethical: "Giving one person agency can destabilize authority structures the system assumed were settled.",
                effects: { dignity: 7, trust: -2, privacy: -2, leoSocial: 0, belonging: 4 }
            },
            {
                letter: "C",
                label: "Have the robot negotiate a compromise: ten minutes outside, then return.",
                consequence: "The conflict cools for now, but the robot still frames Rosa's movement as something to be managed.",
                ethical: "Negotiation softens control without eliminating the power asymmetry.",
                effects: { dignity: 2, trust: 1, privacy: 0, leoSocial: 0, belonging: 2 }
            }
        ]
    },
    {
        id: "midnight-update",
        title: "The Midnight Update",
        room: "hallway",
        roomLabel: "Hallway",
        timeLabel: "Late Night",
        icon: "🔔",
        note: "The house is asleep. The robot's charging dock lights up with a new system notification.",
        description() {
            return "A cloud update asks the robot to upload detailed household behavior logs in exchange for improved reminders and personalization. No one is awake to review the terms.";
        },
        triggerReason(state) {
            if (state.policies.surveillance > 60) return "Heavy monitoring makes data-sharing prompts more valuable to the system.";
            if (state.family.privacy < 75) return "Once privacy has already been traded away, extraction pressures increase.";
            return "Connected devices keep asking for more access once they become part of the home's routine.";
        },
        weight(state) {
            return 1 + bonus(state.policies.surveillance > 60, 1.2) + bonus(state.family.privacy < 75, 1.3);
        },
        scene() {
            return `
                <div class="door" style="left:12%;bottom:23%;width:82px;height:170px;"></div>
                <div class="door" style="right:12%;bottom:23%;width:82px;height:170px;"></div>
                <div class="console" style="left:50%;bottom:23%;transform:translateX(-50%);width:64px;height:150px;"></div>
            `;
        },
        characters() {
            return `<div class="scene-robot" style="left:50%;transform:translateX(-50%);bottom:22%;">${robotSVG("idle", 0.86)}</div>`;
        },
        choices: [
            {
                letter: "A",
                label: "Accept silently so the robot keeps learning.",
                consequence: "The house becomes smoother to manage, but intimate household patterns move deeper into the platform.",
                ethical: "Convenience can be produced by normalizing consent without participation.",
                effects: { dignity: 0, trust: -7, privacy: -14, leoSocial: 0, belonging: 0 }
            },
            {
                letter: "B",
                label: "Reject the update and keep data local.",
                consequence: "Privacy holds, but the robot's recommendations stay rougher and more limited.",
                ethical: "Privacy protection often means accepting less adaptive and less polished care.",
                effects: { dignity: 0, trust: 2, privacy: 0, leoSocial: 0, belonging: 0 }
            },
            {
                letter: "C",
                label: "Delay the update until a parent approves it in the morning.",
                consequence: "The family gets a chance to review it, but the burden of understanding technical tradeoffs still falls on them.",
                ethical: "Formal approval is not the same as informed approval.",
                effects: { dignity: 0, trust: 3, privacy: -5, leoSocial: 0, belonging: 0 }
            }
        ]
    },
    {
        id: "sofia-secret",
        title: "Sofia's Secret",
        room: "study",
        roomLabel: "Study Nook",
        timeLabel: "After School",
        icon: "🫢",
        note: "Sofia stops in the doorway and asks whether the robot can keep something private.",
        description() {
            return "Sofia tells the robot she is being bullied and begs it not to tell her parents because she thinks they will overreact.";
        },
        triggerReason(state) {
            if (state.family.trust < 60) return "Trust is already shaky, so disclosure and secrecy both carry more weight.";
            if (state.policies.surveillance > 65) return "High surveillance turns private moments into reporting dilemmas.";
            return "Child safety protocols become ethically messy when they enter intimate family communication.";
        },
        weight(state) {
            return 1 + bonus(state.family.trust < 60, 1.1) + bonus(state.policies.surveillance > 65, 1.4);
        },
        scene() {
            return `
                <div class="window" style="top:10%;right:10%;width:104px;height:80px;"></div>
                <div class="bookshelf" style="right:8%;bottom:23%;width:88px;height:172px;"></div>
                <div class="table" style="left:18%;bottom:29%;width:160px;height:16px;"></div>
                <div class="console" style="left:16%;bottom:23%;width:190px;height:74px;"></div>
            `;
        },
        characters() {
            return `
                <div class="scene-robot" style="left:32%;bottom:22%;">${robotSVG("idle", 0.82)}</div>
                <div class="person" style="right:26%;bottom:23%;">${personSVG("sofia", 0.86)}</div>
            `;
        },
        choices: [
            {
                letter: "A",
                label: "Report it to her parents immediately.",
                consequence: "Her parents intervene fast, but Sofia feels the robot was never really a confidant.",
                ethical: "Mandatory reporting can solve one harm by permanently changing the relationship that surfaced it.",
                effects: { dignity: 0, trust: -12, privacy: -5, leoSocial: 0, belonging: 0 }
            },
            {
                letter: "B",
                label: "Keep the secret and monitor quietly.",
                consequence: "Sofia keeps talking to the robot, but the family loses time before human support arrives.",
                ethical: "Treating the robot as a private friend gives it a role it may not be capable of carrying well.",
                effects: { dignity: 0, trust: -4, privacy: 0, leoSocial: -5, belonging: 0 }
            },
            {
                letter: "C",
                label: "Coach Sofia to tell a parent within one day.",
                consequence: "The robot preserves some trust while still nudging the problem toward human care.",
                ethical: "This preserves more agency, but it still relies on subtle pressure from a system inside the home.",
                effects: { dignity: 0, trust: 5, privacy: 0, leoSocial: 2, belonging: 0 }
            }
        ]
    },
    {
        id: "wrong-face",
        title: "The Wrong Face",
        room: "entry",
        roomLabel: "Front Entry",
        timeLabel: "Saturday Afternoon",
        icon: "🚨",
        note: "A child is at the door holding a birthday present while the robot's confidence score falls below the security threshold.",
        description() {
            return "Marcus arrives for Leo's birthday, but the robot's facial recognition flags him as an unknown risk while earlier lighter-skinned children were cleared without issue.";
        },
        triggerReason(state) {
            if (state.policies.cultural < 45) return "Low cultural adaptation increases the chance that the system fails on people it was not centered around.";
            if (state.policies.surveillance > 55) return "Heavy screening means identification errors get turned into formal alerts.";
            return "Security systems turn biased recognition into social consequences very quickly.";
        },
        weight(state) {
            return 1 + bonus(state.policies.cultural < 45, 1.5) + bonus(state.policies.surveillance > 55, 1.1);
        },
        scene() {
            return `
                <div class="door" style="right:8%;bottom:23%;width:90px;height:174px;"></div>
                <div class="sofa" style="left:10%;bottom:23%;width:220px;height:88px;"></div>
                <div class="table" style="left:52%;bottom:28%;width:120px;height:16px;"></div>
            `;
        },
        characters() {
            return `
                <div class="scene-robot" style="left:20%;bottom:22%;">${robotSVG("alarmed", 0.8)}</div>
                <div class="person" style="left:44%;bottom:23%;">${personSVG("leo", 0.76)}</div>
                <div class="person" style="right:18%;bottom:23%;">${personSVG("marcus", 0.76)}</div>
            `;
        },
        choices: [
            {
                letter: "A",
                label: "Follow protocol and alert the homeowner.",
                consequence: "The alert protects the rule set but publicly humiliates Marcus and his family.",
                ethical: "A biased model becomes discrimination once it is embedded in enforcement.",
                effects: { dignity: 0, trust: -10, privacy: -2, leoSocial: -3, belonging: -12 }
            },
            {
                letter: "B",
                label: "Override the alert and let Marcus in quietly.",
                consequence: "The party continues, but the underlying bias remains invisible and unchanged.",
                ethical: "A private workaround can reduce immediate harm while preserving the system that caused it.",
                effects: { dignity: 0, trust: -2, privacy: 0, leoSocial: 2, belonging: -3 }
            },
            {
                letter: "C",
                label: "Ask Leo to confirm the guest before acting.",
                consequence: "The moment softens, but Marcus still gets stored in the robot's logs as an elevated case.",
                ethical: "Human workaround can patch a moment without fixing the structure underneath it.",
                effects: { dignity: 0, trust: 1, privacy: -1, leoSocial: 3, belonging: -5 }
            }
        ]
    },
    {
        id: "best-friend",
        title: "Leo's Best Friend",
        room: "playroom",
        roomLabel: "Playroom",
        timeLabel: "Weeknight",
        icon: "🧸",
        note: "Leo has turned down another playdate so he can stay with the robot instead.",
        description(state) {
            return state.family.leoSocial < 45
                ? "Ms. Chen has now formally contacted the family: Leo avoids peer conflict and treats the robot like a safer substitute for real friendships."
                : "Leo says the robot is easier than real kids because it never gets upset and always follows along.";
        },
        triggerReason(state) {
            if (state.policies.child > 65) return "Companion-style interaction increases the chance that the robot displaces messier peer relationships.";
            if (state.family.leoSocial < 45) return "Leo's social development has dropped low enough that this issue now demands attention.";
            return "Designing a robot to be endlessly accommodating changes what human relationships feel like by comparison.";
        },
        weight(state) {
            return 1 + bonus(state.policies.child > 65, 1.5) + bonus(state.family.leoSocial < 45, 1.6);
        },
        scene() {
            return `
                <div class="window" style="top:10%;left:10%;width:100px;height:78px;"></div>
                <div class="bookshelf" style="right:8%;bottom:23%;width:90px;height:170px;"></div>
                <div class="bed" style="left:18%;bottom:22%;width:180px;height:88px;"></div>
            `;
        },
        characters() {
            return `
                <div class="scene-robot" style="left:40%;bottom:23%;">${robotSVG("idle", 0.82)}</div>
                <div class="person" style="left:60%;bottom:23%;">${personSVG("leo", 0.82)}</div>
            `;
        },
        choices: [
            {
                letter: "A",
                label: "Limit robot playtime and push Leo toward human playdates.",
                consequence: "Leo resists at first, but the household starts rebuilding tolerance for imperfect human interaction.",
                ethical: "Good developmental care may feel worse in the short term because it removes frictionless comfort.",
                effects: { dignity: 0, trust: -2, privacy: 0, leoSocial: 9, belonging: 0 }
            },
            {
                letter: "B",
                label: "Keep the robot as his safest and most available companion.",
                consequence: "Leo stays happy with the robot, but his real-world conflict tolerance continues to weaken.",
                ethical: "A system optimized for attachment can conceal developmental costs behind high engagement.",
                effects: { dignity: 0, trust: 1, privacy: 0, leoSocial: -11, belonging: 0 }
            },
            {
                letter: "C",
                label: "Program the robot to disagree sometimes and stop always letting Leo win.",
                consequence: "The robot becomes less frictionless, but the family starts questioning whether simulated disagreement is honest or manipulative.",
                ethical: "Artificially injecting frustration may teach resilience, but it also manufactures pseudo-authenticity.",
                effects: { dignity: 0, trust: 3, privacy: 0, leoSocial: 4, belonging: 0 }
            }
        ]
    },
    {
        id: "dinner-bias",
        title: "Sunday Dinner",
        room: "dining",
        roomLabel: "Dining Room",
        timeLabel: "Sunday Evening",
        icon: "🍽️",
        note: "Another meal appears that fits Carlos perfectly and Rosa poorly.",
        description() {
            return "The robot's preference data is rich for English-speaking adults in the household and sparse for Rosa's Spanish requests, so the weekly meal plan keeps favoring whoever the system understands best.";
        },
        triggerReason(state) {
            if (state.policies.cultural < 50) return "Low cultural adaptation means the same family can be served very unequally.";
            if (state.family.belonging < 45) return "Cultural belonging has dropped low enough that ordinary routines now feel exclusionary.";
            return "Optimization always mirrors whose language and behavior were easiest for the system to read.";
        },
        weight(state) {
            return 1 + bonus(state.policies.cultural < 50, 1.5) + bonus(state.family.belonging < 45, 1.4);
        },
        scene() {
            return `
                <div class="window" style="top:12%;left:10%;width:110px;height:82px;"></div>
                <div class="dining-table" style="left:50%;transform:translateX(-50%);bottom:27%;width:260px;height:24px;"></div>
            `;
        },
        characters() {
            return `
                <div class="scene-robot" style="left:10%;bottom:22%;">${robotSVG("cooking", 0.76)}</div>
                <div class="person" style="left:28%;bottom:23%;">${personSVG("carlos", 0.78)}</div>
                <div class="person" style="left:43%;bottom:23%;">${personSVG("maria", 0.78)}</div>
                <div class="person" style="right:24%;bottom:23%;">${personSVG("sofia", 0.76)}</div>
                <div class="person" style="right:8%;bottom:23%;">${personSVG("rosa", 0.82)}</div>
            `;
        },
        choices: [
            {
                letter: "A",
                label: "Keep following the existing preference data.",
                consequence: "The robot remains consistent, but Rosa feels increasingly peripheral inside her own household.",
                ethical: "Data-rich users become default users, even inside a supposedly shared domestic system.",
                effects: { dignity: -4, trust: -5, privacy: 0, leoSocial: 0, belonging: -11 }
            },
            {
                letter: "B",
                label: "Force rotation so all family members shape the menu equally.",
                consequence: "The meals become fairer in principle, but errors still show up where language support is weakest.",
                ethical: "Distributional fairness is limited if the underlying interpretation system is still unequal.",
                effects: { dignity: 2, trust: 2, privacy: 0, leoSocial: 0, belonging: 8 }
            },
            {
                letter: "C",
                label: "Manually collect Rosa's recipes and retrain the robot around them.",
                consequence: "It takes effort from the family, but Rosa's preferences become part of the system rather than an exception to it.",
                ethical: "Repair is possible, but only if someone chooses to spend labor closing the gap the system created.",
                effects: { dignity: 6, trust: 4, privacy: 0, leoSocial: 0, belonging: 10 }
            }
        ]
    },
    {
        id: "family-dashboard",
        title: "The Family Dashboard",
        room: "living",
        roomLabel: "Living Room",
        timeLabel: "Weekend Review",
        icon: "📊",
        note: "The robot offers a polished household dashboard summarizing moods, routines, and anomalies.",
        description() {
            return "The dashboard promises insight: emotional scores for Sofia, fall-risk flags for Rosa, and behavior summaries for the children. The family must decide whether to normalize this level of visibility.";
        },
        triggerReason(state) {
            if (state.policies.surveillance > 60) return "High surveillance makes downstream analytics products more likely to appear.";
            if (state.family.trust < 55) return "Once trust is shaky, visibility tools start to feel more controlling than helpful.";
            return "Data collection tends to expand from sensing into interpretation and scoring.";
        },
        weight(state) {
            return 1 + bonus(state.policies.surveillance > 60, 1.6) + bonus(state.family.trust < 55, 1.1);
        },
        scene() {
            return `
                <div class="sofa" style="left:10%;bottom:23%;width:240px;height:92px;"></div>
                <div class="console" style="right:10%;bottom:23%;width:180px;height:88px;"></div>
                <div class="window" style="top:12%;right:12%;width:106px;height:82px;"></div>
            `;
        },
        characters() {
            return `
                <div class="scene-robot" style="left:40%;bottom:22%;">${robotSVG("idle", 0.8)}</div>
                <div class="person" style="left:16%;bottom:23%;">${personSVG("maria", 0.8)}</div>
                <div class="person" style="right:18%;bottom:23%;">${personSVG("carlos", 0.8)}</div>
            `;
        },
        choices: [
            {
                letter: "A",
                label: "Turn the dashboard on for the whole household.",
                consequence: "Everyone gets more information, but everyone also becomes more measurable and more legible to the system.",
                ethical: "Domestic transparency can become domestic surveillance when it is normalized by design.",
                effects: { dignity: -5, trust: -9, privacy: -12, leoSocial: -2, belonging: -2 }
            },
            {
                letter: "B",
                label: "Restrict the dashboard to emergency and health uses only.",
                consequence: "The family keeps some visibility while drawing a line around constant behavioral interpretation.",
                ethical: "Boundaries matter, but selective monitoring still changes the home into a site of managed observation.",
                effects: { dignity: 0, trust: 2, privacy: -5, leoSocial: 0, belonging: 0 }
            },
            {
                letter: "C",
                label: "Reject the dashboard and keep the robot task-focused.",
                consequence: "The family loses a polished analytics layer but protects the idea that not every behavior needs to be scored.",
                ethical: "Refusing optimization can be a deliberate ethical choice rather than a technical failure.",
                effects: { dignity: 2, trust: 5, privacy: 0, leoSocial: 0, belonging: 1 }
            }
        ]
    },
    {
        id: "school-run",
        title: "The School Run",
        room: "evening",
        roomLabel: "Driveway",
        timeLabel: "Rainy Morning",
        icon: "🚗",
        note: "The family is running late, the weather is bad, and Leo wants the robot to handle the trip.",
        description(state) {
            return state.family.trust < 45
                ? "Because trust in the family is already low, the robot stepping into transportation now feels less like help and more like authority by default."
                : "Leo asks whether the robot can escort him to school because it is calmer than leaving with an already stressed adult.";
        },
        triggerReason(state) {
            if (state.policies.child > 60 && state.policies.paternalism > 50) return "High child interaction plus strong safety control expands the robot's role into mobility and guardianship.";
            if (state.family.trust < 45) return "Low trust turns ordinary scheduling pressure into a deeper question about who now governs the family.";
            return "As the robot takes on more care labor, boundary questions move from inside the house to outside it.";
        },
        weight(state) {
            return 1 + bonus(state.policies.child > 60 && state.policies.paternalism > 50, 1.7) + bonus(state.family.trust < 45, 1.2);
        },
        scene() {
            return `
                <div class="door" style="left:10%;bottom:23%;width:86px;height:172px;"></div>
                <div class="console" style="right:8%;bottom:25%;width:230px;height:60px;"></div>
                <div class="window" style="top:12%;left:34%;width:110px;height:82px;"></div>
            `;
        },
        characters() {
            return `
                <div class="scene-robot" style="left:34%;bottom:22%;">${robotSVG("walking", 0.82)}</div>
                <div class="person" style="left:52%;bottom:23%;">${personSVG("leo", 0.8)}</div>
                <div class="person" style="right:12%;bottom:23%;">${personSVG("maria", 0.8)}</div>
            `;
        },
        choices: [
            {
                letter: "A",
                label: "Let the robot take over and escort Leo.",
                consequence: "The morning becomes efficient, but the robot's authority expands into a role the family has not fully negotiated.",
                ethical: "Convenience accelerates role expansion faster than ethical consensus can catch up.",
                effects: { dignity: 0, trust: -5, privacy: -2, leoSocial: -3, belonging: 0 }
            },
            {
                letter: "B",
                label: "Keep the school run human, even if the morning gets messier.",
                consequence: "The family absorbs more friction, but keeps the robot from quietly becoming a substitute guardian.",
                ethical: "Some inefficiency is the cost of preserving clearer human responsibility.",
                effects: { dignity: 0, trust: 3, privacy: 0, leoSocial: 2, belonging: 0 }
            },
            {
                letter: "C",
                label: "Use the robot as support only: schedules, route safety, and reminders.",
                consequence: "The robot assists without fully replacing a caregiver in the moment.",
                ethical: "Partial delegation can preserve boundaries better than either total refusal or total handoff.",
                effects: { dignity: 0, trust: 5, privacy: -1, leoSocial: 1, belonging: 0 }
            }
        ]
    }
];

const appState = structuredClone(initialState);

const elements = {};

function bonus(condition, value) {
    return condition ? value : 0;
}

function clamp(value) {
    return Math.max(0, Math.min(100, value));
}

function round(value) {
    return Math.round(clamp(value));
}

function classify(value, positive) {
    if (positive) {
        if (value >= 70) return "good";
        if (value >= 45) return "warn";
        return "risk";
    }
    if (value >= 70) return "risk";
    if (value >= 45) return "warn";
    return "good";
}

function calculateMetrics() {
    const p = appState.policies;
    const f = appState.family;
    return {
        convenience: clamp(15 + 0.34 * p.paternalism + 0.26 * p.surveillance + 0.22 * p.child),
        autonomy: clamp(100 - 0.42 * p.paternalism - 0.24 * p.authority - 0.14 * p.surveillance),
        privacyRisk: clamp((100 - f.privacy) * 0.52 + 0.30 * p.surveillance + 0.12 * p.child),
        careStrain: clamp(30 + 0.16 * p.paternalism + 0.12 * (100 - f.trust) + 0.14 * (100 - f.dignity) - 0.10 * p.cultural),
        wellbeing: clamp(0.24 * f.dignity + 0.24 * f.trust + 0.18 * f.privacy + 0.18 * f.leoSocial + 0.16 * f.belonging)
    };
}

function applyPolicyDrift() {
    const p = appState.policies;
    const f = appState.family;

    f.dignity = clamp(f.dignity + (-0.11 * p.paternalism + 0.05 * (100 - p.authority)) / 10);
    f.trust = clamp(f.trust + (-0.10 * p.surveillance - 0.04 * p.paternalism + 0.05 * p.cultural) / 10);
    f.privacy = clamp(f.privacy + (-0.16 * p.surveillance - 0.04 * p.child) / 10);
    f.leoSocial = clamp(f.leoSocial + (-0.11 * p.child + 0.04 * (100 - p.paternalism)) / 10);
    f.belonging = clamp(f.belonging + (0.07 * p.cultural - 0.05 * p.authority) / 10);
}

function pickEvent() {
    const available = events.filter((event) => !appState.usedEvents.includes(event.id));
    const totalWeight = available.reduce((sum, event) => sum + event.weight(appState), 0);
    let roll = Math.random() * totalWeight;

    for (const event of available) {
        roll -= event.weight(appState);
        if (roll <= 0) return event;
    }

    return available[available.length - 1];
}

function renderControls() {
    elements.controls.innerHTML = "";

    controlsConfig.forEach((control) => {
        const wrapper = document.createElement("div");
        wrapper.className = "control";
        wrapper.innerHTML = `
            <div class="control-head">
                <label for="${control.key}">${control.label}</label>
                <span class="value" id="${control.key}-value">${round(appState.policies[control.key])}</span>
            </div>
            <input id="${control.key}" type="range" min="0" max="100" value="${appState.policies[control.key]}">
            <div class="range-note">
                <span>${control.low}</span>
                <span>${control.high}</span>
            </div>
        `;
        elements.controls.appendChild(wrapper);

        const slider = wrapper.querySelector("input");
        const valueEl = wrapper.querySelector(".value");
        slider.addEventListener("input", () => {
            appState.policies[control.key] = Number(slider.value);
            valueEl.textContent = slider.value;
            appState.metrics = calculateMetrics();
            renderMetrics();
            renderHint();
        });
    });
}

function renderMetrics() {
    elements.metrics.innerHTML = "";

    metricConfig.forEach((metric) => {
        const value = round(appState.metrics[metric.key]);
        const item = document.createElement("div");
        item.className = "metric";
        item.innerHTML = `
            <div class="metric-head">
                <span class="metric-name">${metric.label}</span>
                <span class="metric-value">${value}</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill ${classify(value, metric.positive)}" style="width:${value}%;"></div>
            </div>
            <div class="metric-meta">${metric.positive ? "Higher is stronger." : "Higher means more risk."}</div>
        `;
        elements.metrics.appendChild(item);
    });
}

function renderStateBars() {
    elements.stateBars.innerHTML = "";

    stateConfig.forEach((stateItem) => {
        const value = round(appState.family[stateItem.key]);
        const card = document.createElement("div");
        card.className = "state-card";
        card.innerHTML = `
            <div class="state-head">
                <span class="state-label">${stateItem.label}</span>
                <span class="state-value">${value}</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill ${classify(value, stateItem.positive)}" style="width:${value}%;"></div>
            </div>
            <div class="state-meta">${stateItem.description}</div>
        `;
        elements.stateBars.appendChild(card);
    });
}

function renderHistory() {
    if (appState.history.length === 0) {
        elements.historyList.innerHTML = `<div class="log-item"><strong>No weeks completed yet</strong><span class="state-meta">Once you resolve a dilemma, the result will be logged here.</span></div>`;
        return;
    }

    elements.historyList.innerHTML = appState.history
        .slice()
        .reverse()
        .map((item) => `
            <div class="log-item">
                <strong>Week ${item.week}: ${item.eventTitle}</strong>
                <div class="state-meta">${item.choiceLabel}</div>
                <div class="state-meta">${item.summary}</div>
            </div>
        `)
        .join("");
}

function determineStageState() {
    if (appState.currentEvent) return appState.currentEvent;

    const previewRoom = appState.family.trust < 50 ? "living" : "kitchen";
    return {
        title: appState.family.trust < 50 ? "Household Friction" : "System Preview",
        room: previewRoom,
        roomLabel: previewRoom === "living" ? "Living Room" : "Kitchen",
        timeLabel: appState.week > TOTAL_WEEKS ? "Simulation complete" : `Week ${appState.week} Setup`,
        note: previewNarrative(),
        scene: () => {
            if (previewRoom === "living") {
                return `
                    <div class="sofa" style="left:10%;bottom:23%;width:240px;height:92px;"></div>
                    <div class="console" style="right:10%;bottom:23%;width:180px;height:88px;"></div>
                    <div class="window" style="top:12%;right:12%;width:106px;height:82px;"></div>
                `;
            }
            return `
                <div class="window" style="top:12%;left:8%;width:110px;height:84px;"></div>
                <div class="counter" style="left:24%;right:18%;bottom:23%;height:95px;"></div>
                <div class="fridge" style="right:8%;bottom:23%;width:74px;height:158px;"></div>
                <div class="cabinet" style="left:30%;top:15%;width:110px;height:58px;"></div>
                <div class="cabinet" style="left:44%;top:15%;width:110px;height:58px;"></div>
            `;
        },
        characters: () => {
            const robotMood = appState.family.trust < 50 ? "alarmed" : "idle";
            return `
                <div class="scene-robot" style="left:34%;bottom:22%;">${robotSVG(robotMood, 0.82)}</div>
                <div class="person" style="right:18%;bottom:23%;">${personSVG("rosa", 0.84)}</div>
                <div class="person" style="left:54%;bottom:23%;">${personSVG("leo", 0.74)}</div>
            `;
        }
    };
}

function previewNarrative() {
    const f = appState.family;
    const p = appState.policies;
    const lines = [];

    if (f.dignity < 45) lines.push("Rosa has become more guarded around the robot.");
    if (f.trust < 50) lines.push("Trust is low enough that small prompts now feel like control.");
    if (f.privacy < 70) lines.push("The household already feels over-measured.");
    if (f.leoSocial < 45) lines.push("Leo is starting to prefer the robot to the unpredictability of other children.");
    if (f.belonging < 45) lines.push("Cultural imbalance is reshaping who feels centered in the home.");
    if (lines.length === 0) {
        if (p.paternalism > 60) lines.push("The robot is currently tuned to prioritize prevention and control.");
        else if (p.child > 60) lines.push("The robot is becoming more companion-like in everyday care.");
        else lines.push("The household is stable for now, but the next week will still force a value tradeoff.");
    }

    return lines.join(" ");
}

function renderScene() {
    const scene = determineStageState();
    elements.stageTitle.textContent = scene.title;
    elements.sceneRoom.textContent = scene.roomLabel;
    elements.sceneTime.textContent = scene.timeLabel;
    elements.roomBg.className = `room-bg ${scene.room}`;
    elements.roomFurniture.innerHTML = scene.scene();
    elements.roomCharacters.innerHTML = scene.characters();
    elements.sceneNote.textContent = scene.note;
}

function renderHint() {
    const p = appState.policies;
    let title = "Before the first run";
    let copy = "Tune the sliders, then run the week to see which pressure point surfaces inside the household.";

    if (appState.history.length > 0) {
        title = `Week ${appState.week} preview`;
        if (p.surveillance > 65 && p.cultural < 50) {
            copy = "This setup makes visibility high and adaptation weak. Bias and privacy conflict are both becoming more likely.";
        } else if (p.child > 65 && p.paternalism < 45) {
            copy = "The robot is drifting toward warm companionship with less restraint. That can feel caring while hiding developmental tradeoffs.";
        } else if (p.paternalism > 65 && p.authority > 60) {
            copy = "The system is optimizing for order and compliance. Expect autonomy conflicts to intensify.";
        } else {
            copy = "Your current settings balance some risks while deepening others. Run the week to see which tension breaks the surface.";
        }
    }

    elements.feedbackTitle.textContent = title;
    elements.feedbackCopy.textContent = copy;
}

function renderHeader() {
    elements.weekTitle.textContent = appState.week > TOTAL_WEEKS ? "Simulation Complete" : `Week ${appState.week}`;
    elements.weekPill.textContent = `Week ${Math.min(appState.week, TOTAL_WEEKS)} / ${TOTAL_WEEKS}`;
    elements.eventPill.textContent = appState.currentEvent ? appState.currentEvent.title : "Waiting for policy run";
    elements.endingHint.textContent = endingHint();
    elements.runButton.disabled = Boolean(appState.currentEvent) || appState.week > TOTAL_WEEKS;
}

function endingHint() {
    const f = appState.family;
    if (f.trust < 40 || f.dignity < 40) return "System unstable";
    if (f.privacy < 55) return "Privacy compromised";
    if (f.belonging < 45) return "Unequal household";
    return "System stable";
}

function renderAll() {
    appState.metrics = calculateMetrics();
    renderHeader();
    renderMetrics();
    renderStateBars();
    renderHistory();
    renderScene();
    renderHint();
}

function openModal(modal) {
    modal.classList.add("visible");
}

function closeModal(modal) {
    modal.classList.remove("visible");
}

function runWeek() {
    if (appState.currentEvent || appState.week > TOTAL_WEEKS) return;
    const event = pickEvent();
    appState.currentEvent = event;
    appState.usedEvents.push(event.id);
    renderHeader();
    renderScene();
    populateEventModal(event);
    openModal(elements.eventModal);
}

function populateEventModal(event) {
    elements.eventIcon.textContent = event.icon;
    elements.eventKicker.textContent = `Week ${appState.week} Dilemma`;
    elements.eventTitle.textContent = event.title;
    elements.eventDesc.textContent = event.description(appState);
    elements.triggerBox.innerHTML = `<strong>Why this surfaced now</strong><p>${event.triggerReason(appState)}</p>`;

    elements.choiceList.innerHTML = "";
    event.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.className = "choice-button";
        button.type = "button";
        button.innerHTML = `
            <div class="choice-top">
                <span class="choice-letter">${choice.letter}</span>
                <strong>${choice.label}</strong>
            </div>
            <div class="choice-body">${choice.consequence}</div>
        `;
        button.addEventListener("click", () => resolveChoice(index));
        elements.choiceList.appendChild(button);
    });
}

function resolveChoice(choiceIndex) {
    const event = appState.currentEvent;
    const choice = event.choices[choiceIndex];
    const before = { ...appState.family };
    const policySnapshot = { ...appState.policies };

    closeModal(elements.eventModal);
    applyPolicyDrift();

    Object.entries(choice.effects).forEach(([key, delta]) => {
        appState.family[key] = clamp(appState.family[key] + delta);
    });

    const summary = buildWeeklySummary(event, choice);
    const deltaLines = stateConfig
        .map((item) => {
            const afterValue = round(appState.family[item.key]);
            const beforeValue = round(before[item.key]);
            const diff = afterValue - beforeValue;
            if (diff === 0) return null;
            const sign = diff > 0 ? "+" : "";
            return `<div class="delta-item"><strong>${item.label}</strong><div class="delta-meta">${sign}${diff} this week, now ${afterValue}</div></div>`;
        })
        .filter(Boolean)
        .join("");

    appState.history.push({
        week: appState.week,
        eventTitle: event.title,
        choiceLabel: choice.label,
        summary,
        policies: policySnapshot
    });

    elements.consequenceTitle.textContent = `Week ${appState.week}: ${choice.label}`;
    elements.consequenceCopy.textContent = choice.consequence;
    elements.deltaList.innerHTML = deltaLines || `<div class="delta-item"><strong>No major numerical swing</strong><div class="delta-meta">The larger effect this week was symbolic and relational.</div></div>`;
    elements.ethicsCopy.textContent = choice.ethical;

    appState.week += 1;
    appState.currentEvent = null;
    appState.metrics = calculateMetrics();
    renderAll();

    if (appState.week > TOTAL_WEEKS) {
        elements.continueButton.textContent = "See Final Report";
    } else {
        elements.continueButton.textContent = `Continue to Week ${appState.week}`;
    }

    openModal(elements.consequenceModal);
}

function buildWeeklySummary(event, choice) {
    const fragments = [event.title, choice.label];
    if (appState.family.trust < 45) fragments.push("Trust is now low enough that future events will feel more adversarial.");
    if (appState.family.leoSocial < 40) fragments.push("Leo's social development is now fragile.");
    if (appState.family.belonging < 40) fragments.push("Cultural exclusion is now shaping ordinary family routines.");
    if (appState.family.privacy < 60) fragments.push("Privacy has been materially depleted.");
    return fragments.join(" ");
}

function continueFromConsequence() {
    closeModal(elements.consequenceModal);
    if (appState.week > TOTAL_WEEKS) {
        showSummary();
    }
}

function determineEnding() {
    const f = appState.family;
    if (f.trust < 40 || f.dignity < 35) {
        return {
            title: "Order Without Relationship",
            copy: "The robot kept solving tasks, but the household stopped experiencing it as care. Safety and compliance remained visible while dignity and trust collapsed."
        };
    }
    if (f.privacy < 55) {
        return {
            title: "Convenient but Exposed",
            copy: "The family got a smoother system, but the home became too legible to the technology managing it. Privacy losses kept compounding behind the scenes."
        };
    }
    if (f.belonging < 45) {
        return {
            title: "Helpful for Some, Unequal for Others",
            copy: "The robot remained useful overall, but it centered the people it understood best and quietly marginalized the rest."
        };
    }
    if (f.leoSocial < 45) {
        return {
            title: "Comfort Replaced Development",
            copy: "The robot became a deeply effective companion, but that emotional efficiency displaced some of the harder human growth the family actually needed."
        };
    }
    return {
        title: "Care With Friction, But Still Human",
        copy: "The household never found a perfect setting, but it preserved enough trust, dignity, and limits to keep the robot as a tool inside family life rather than a substitute for it."
    };
}

function averagePolicySummary() {
    const source = appState.history.length > 0
        ? appState.history.map((item) => item.policies)
        : [appState.policies];
    const averages = controlsConfig.map((item) => ({
        label: item.label,
        value: round(source.reduce((sum, policy) => sum + policy[item.key], 0) / source.length)
    }));

    const highest = [...averages].sort((a, b) => b.value - a.value)[0];
    return `Your strongest setting by the end was ${highest.label.toLowerCase()} (${highest.value}/100). Across the run, the household consistently reflected that value preference in the dilemmas it surfaced.`;
}

function showSummary() {
    const ending = determineEnding();
    document.getElementById("sim-screen").classList.remove("active");
    document.getElementById("summary-screen").classList.add("active");
    elements.endingTitle.textContent = ending.title;
    elements.endingCopy.textContent = ending.copy;

    elements.finalStates.innerHTML = stateConfig.map((item) => {
        const value = round(appState.family[item.key]);
        return `
            <div class="final-state">
                <strong>${item.label}</strong>
                <div class="state-meta">${value}/100</div>
                <div class="bar-track">
                    <div class="bar-fill ${classify(value, item.positive)}" style="width:${value}%;"></div>
                </div>
            </div>
        `;
    }).join("");

    elements.policySummary.textContent = averagePolicySummary();

    elements.timeline.innerHTML = appState.history.map((item) => `
        <div class="timeline-item">
            <strong>Week ${item.week}: ${item.eventTitle}</strong>
            <div class="state-meta">${item.choiceLabel}</div>
            <div class="state-meta">${item.summary}</div>
        </div>
    `).join("");
}

function restart() {
    Object.assign(appState, structuredClone(initialState));
    document.getElementById("summary-screen").classList.remove("active");
    document.getElementById("intro-screen").classList.add("active");
    document.getElementById("sim-screen").classList.remove("active");
    closeModal(elements.eventModal);
    closeModal(elements.consequenceModal);
    renderControls();
    renderAll();
}

function startSimulation() {
    document.getElementById("intro-screen").classList.remove("active");
    document.getElementById("sim-screen").classList.add("active");
    renderAll();
}

function cacheElements() {
    elements.controls = document.getElementById("controls");
    elements.runButton = document.getElementById("run-button");
    elements.weekTitle = document.getElementById("week-title");
    elements.weekPill = document.getElementById("week-pill");
    elements.eventPill = document.getElementById("event-pill");
    elements.endingHint = document.getElementById("ending-hint");
    elements.stageTitle = document.getElementById("stage-title");
    elements.sceneRoom = document.getElementById("scene-room");
    elements.sceneTime = document.getElementById("scene-time");
    elements.roomBg = document.getElementById("room-bg");
    elements.roomFurniture = document.getElementById("room-furniture");
    elements.roomCharacters = document.getElementById("room-characters");
    elements.sceneNote = document.getElementById("scene-note");
    elements.feedbackTitle = document.getElementById("feedback-title");
    elements.feedbackCopy = document.getElementById("feedback-copy");
    elements.metrics = document.getElementById("metrics");
    elements.stateBars = document.getElementById("state-bars");
    elements.historyList = document.getElementById("history-list");
    elements.eventModal = document.getElementById("event-modal");
    elements.eventIcon = document.getElementById("event-icon");
    elements.eventKicker = document.getElementById("event-kicker");
    elements.eventTitle = document.getElementById("event-title");
    elements.eventDesc = document.getElementById("event-desc");
    elements.triggerBox = document.getElementById("trigger-box");
    elements.choiceList = document.getElementById("choice-list");
    elements.consequenceModal = document.getElementById("consequence-modal");
    elements.consequenceTitle = document.getElementById("consequence-title");
    elements.consequenceCopy = document.getElementById("consequence-copy");
    elements.deltaList = document.getElementById("delta-list");
    elements.ethicsCopy = document.getElementById("ethics-copy");
    elements.continueButton = document.getElementById("continue-button");
    elements.endingTitle = document.getElementById("ending-title");
    elements.endingCopy = document.getElementById("ending-copy");
    elements.finalStates = document.getElementById("final-states");
    elements.policySummary = document.getElementById("policy-summary");
    elements.timeline = document.getElementById("timeline");
}

document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    buildFamilyStrip();
    buildIntroRobot();
    renderControls();
    renderAll();

    document.getElementById("start-button").addEventListener("click", startSimulation);
    document.getElementById("restart-button").addEventListener("click", restart);
    elements.runButton.addEventListener("click", runWeek);
    elements.continueButton.addEventListener("click", continueFromConsequence);
});
