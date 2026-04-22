// =============================================
// Robot — Character SVG Generators
// Atlas-style humanoid robot + Cartoon people
// =============================================

// ---- ATLAS-STYLE HUMANOID ROBOT ----
function robotSVG(state = 'idle', scale = 1) {
    const w = 100 * scale, h = 160 * scale;
    return `<svg class="robot-svg ${state}" width="${w}" height="${h}" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Head -->
        <rect x="30" y="4" width="40" height="30" rx="10" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="2"/>
        <!-- Visor/Face plate -->
        <rect x="35" y="10" width="30" height="14" rx="5" fill="#1a2a3a"/>
        <!-- Eyes -->
        <circle cx="43" cy="17" r="3.5" class="robot-eye-svg" fill="#6ee7b7"/>
        <circle cx="57" cy="17" r="3.5" class="robot-eye-svg" fill="#6ee7b7"/>
        <!-- Eye glow -->
        <circle cx="43" cy="17" r="3.5" fill="none" class="eye-glow-ring"/>
        <circle cx="57" cy="17" r="3.5" fill="none" class="eye-glow-ring"/>
        <!-- Antenna -->
        <line x1="50" y1="4" x2="50" y2="-4" stroke="#2c6fa0" stroke-width="2.5"/>
        <circle cx="50" cy="-6" r="4" class="antenna-tip" fill="#6ee7b7"/>

        <!-- Neck -->
        <rect x="44" y="34" width="12" height="8" rx="3" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1.5"/>

        <!-- Torso/Chest -->
        <path d="M28 42 h44 a4 4 0 0 1 4 4 v36 a4 4 0 0 1-4 4 H28 a4 4 0 0 1-4-4 V46 a4 4 0 0 1 4-4z" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="2"/>
        <!-- Chest plate detail -->
        <rect x="36" y="50" width="28" height="20" rx="4" fill="#2c6fa0" opacity="0.5"/>
        <!-- Chest arc reactor -->
        <circle cx="50" cy="60" r="8" fill="#1a2a3a" stroke="#6ee7b7" stroke-width="2" class="chest-core"/>
        <circle cx="50" cy="60" r="4" fill="#6ee7b7" class="chest-glow" opacity="0.8"/>
        <!-- Chest vents -->
        <rect x="32" y="74" width="6" height="2" rx="1" fill="#2c6fa0"/>
        <rect x="32" y="78" width="6" height="2" rx="1" fill="#2c6fa0"/>
        <rect x="62" y="74" width="6" height="2" rx="1" fill="#2c6fa0"/>
        <rect x="62" y="78" width="6" height="2" rx="1" fill="#2c6fa0"/>

        <!-- Left Arm -->
        <g class="arm-left-g">
            <!-- Shoulder joint -->
            <circle cx="24" cy="46" r="6" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1.5"/>
            <!-- Upper arm -->
            <rect x="18" y="50" width="12" height="24" rx="5" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="1.5"/>
            <!-- Elbow joint -->
            <circle cx="24" cy="76" r="4.5" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1"/>
            <!-- Forearm -->
            <rect x="19" y="78" width="10" height="22" rx="4" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="1.5"/>
            <!-- Hand -->
            <rect x="18" y="99" width="12" height="8" rx="4" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1"/>
        </g>

        <!-- Right Arm -->
        <g class="arm-right-g">
            <circle cx="76" cy="46" r="6" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1.5"/>
            <rect x="70" y="50" width="12" height="24" rx="5" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="1.5"/>
            <circle cx="76" cy="76" r="4.5" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1"/>
            <rect x="71" y="78" width="10" height="22" rx="4" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="1.5"/>
            <rect x="70" y="99" width="12" height="8" rx="4" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1"/>
        </g>

        <!-- Waist -->
        <rect x="34" y="86" width="32" height="10" rx="4" fill="#2c6fa0"/>
        <!-- Hip joints -->
        <circle cx="40" cy="98" r="5" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1.5"/>
        <circle cx="60" cy="98" r="5" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1.5"/>

        <!-- Left Leg -->
        <g class="leg-left-g">
            <rect x="34" y="102" width="12" height="26" rx="5" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="1.5"/>
            <circle cx="40" cy="130" r="4" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1"/>
            <rect x="34" y="132" width="12" height="16" rx="5" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="1.5"/>
            <!-- Foot -->
            <path d="M30 148 h20 a4 4 0 0 1 4 4 v4 a2 2 0 0 1-2 2 H30 a4 4 0 0 1-4-4 v-2 a4 4 0 0 1 4-4z" fill="#2c6fa0"/>
        </g>

        <!-- Right Leg -->
        <g class="leg-right-g">
            <rect x="54" y="102" width="12" height="26" rx="5" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="1.5"/>
            <circle cx="60" cy="130" r="4" fill="#4a9ade" stroke="#2c6fa0" stroke-width="1"/>
            <rect x="54" y="132" width="12" height="16" rx="5" fill="#3a8fd4" stroke="#2c6fa0" stroke-width="1.5"/>
            <path d="M50 148 h20 a4 4 0 0 1 4 4 v4 a2 2 0 0 1-2 2 H50 a4 4 0 0 1-4-4 v-2 a4 4 0 0 1 4-4z" fill="#2c6fa0"/>
        </g>
    </svg>`;
}

// ---- CARTOON PEOPLE ----
function personSVG(who, scale = 1) {
    const w = 60 * scale, h = 120 * scale;
    const defs = {
        carlos: { skin:'#c68642', hair:'#2c1810', hairStyle:'short', shirt:'#2563eb', pants:'#1e3a5a', shoes:'#1a1a2e', beard:true },
        maria:  { skin:'#d4a574', hair:'#3d1f0e', hairStyle:'long', shirt:'#dc2626', pants:'#4a3728', shoes:'#8b4513', earrings:true },
        elena:  { skin:'#e2b48d', hair:'#5a3422', hairStyle:'long', shirt:'#0f766e', pants:'#5b4636', shoes:'#7c3f00', earrings:true },
        sofia:  { skin:'#d4a574', hair:'#3d1f0e', hairStyle:'ponytail', shirt:'#a855f7', pants:'#4a3728', shoes:'#ec4899', teen:true },
        leo:    { skin:'#c68642', hair:'#2c1810', hairStyle:'messy', shirt:'#22c55e', pants:'#1e3a5a', shoes:'#333', child:true },
        rosa:   { skin:'#c68642', hair:'#d4d4d4', hairStyle:'bun', shirt:'#f59e0b', pants:'#6b4226', shoes:'#8b4513', elderly:true, glasses:true },
        marcus: { skin:'#6b4226', hair:'#1a1a1a', hairStyle:'short', shirt:'#3b82f6', pants:'#1e293b', shoes:'#333', child:true },
        kid1:   { skin:'#f5d6b8', hair:'#d4a574', hairStyle:'pigtails', shirt:'#ec4899', pants:'#4a3728', shoes:'#e11d48', child:true },
        kid2:   { skin:'#f5d6b8', hair:'#8b6914', hairStyle:'short', shirt:'#06b6d4', pants:'#334155', shoes:'#333', child:true }
    };
    const d = defs[who] || defs.carlos;
    const childScale = d.child ? 0.75 : (d.teen ? 0.88 : 1);
    const vH = d.child ? 100 : (d.teen ? 110 : 120);

    let hair = '';
    switch(d.hairStyle) {
        case 'short':
            hair = `<ellipse cx="30" cy="10" rx="14" ry="8" fill="${d.hair}"/>`;
            break;
        case 'long':
            hair = `<ellipse cx="30" cy="10" rx="14" ry="8" fill="${d.hair}"/>
                    <path d="M16 14 Q14 35 18 45" stroke="${d.hair}" stroke-width="5" fill="none" stroke-linecap="round"/>
                    <path d="M44 14 Q46 35 42 45" stroke="${d.hair}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
            break;
        case 'ponytail':
            hair = `<ellipse cx="30" cy="10" rx="14" ry="8" fill="${d.hair}"/>
                    <path d="M40 8 Q48 12 46 28 Q44 36 42 40" stroke="${d.hair}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
            break;
        case 'messy':
            hair = `<ellipse cx="30" cy="10" rx="14" ry="8" fill="${d.hair}"/>
                    <path d="M18 8 L16 3 M24 5 L23 0 M30 4 L30 -1 M36 5 L37 0 M42 8 L44 3" stroke="${d.hair}" stroke-width="2.5" stroke-linecap="round"/>`;
            break;
        case 'bun':
            hair = `<ellipse cx="30" cy="10" rx="14" ry="8" fill="${d.hair}"/>
                    <circle cx="30" cy="2" r="7" fill="${d.hair}"/>`;
            break;
        case 'pigtails':
            hair = `<ellipse cx="30" cy="10" rx="14" ry="8" fill="${d.hair}"/>
                    <circle cx="16" cy="12" r="5" fill="${d.hair}"/>
                    <circle cx="44" cy="12" r="5" fill="${d.hair}"/>`;
            break;
    }

    let extras = '';
    if (d.beard) {
        extras += `<path d="M23 26 Q30 34 37 26" stroke="${d.hair}" stroke-width="2" fill="${d.hair}" opacity="0.5"/>`;
    }
    if (d.glasses) {
        extras += `<circle cx="25" cy="19" r="5" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
                   <circle cx="35" cy="19" r="5" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
                   <line x1="30" y1="19" x2="30" y2="19" stroke="#94a3b8" stroke-width="1.5"/>
                   <line x1="16" y1="19" x2="20" y2="19" stroke="#94a3b8" stroke-width="1"/>
                   <line x1="40" y1="19" x2="44" y2="19" stroke="#94a3b8" stroke-width="1"/>`;
    }
    if (d.earrings) {
        extras += `<circle cx="16" cy="22" r="2" fill="#fbbf24"/>
                   <circle cx="44" cy="22" r="2" fill="#fbbf24"/>`;
    }
    if (d.elderly) {
        extras += `<path d="M22 24 Q20 26 22 28" stroke="${d.skin}" stroke-width="0.8" fill="none" opacity="0.4"/>
                   <path d="M38 24 Q40 26 38 28" stroke="${d.skin}" stroke-width="0.8" fill="none" opacity="0.4"/>`;
    }

    return `<svg class="person-svg person-${who}" width="${w}" height="${h}" viewBox="0 0 60 ${vH}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Hair (behind head) -->
        ${hair}
        <!-- Head -->
        <circle cx="30" cy="18" r="13" fill="${d.skin}"/>
        <!-- Eyes -->
        <ellipse cx="25" cy="18" rx="2" ry="2.2" fill="#1a1a2e"/>
        <ellipse cx="35" cy="18" rx="2" ry="2.2" fill="#1a1a2e"/>
        <!-- Eye highlights -->
        <circle cx="26" cy="17" r="0.8" fill="white"/>
        <circle cx="36" cy="17" r="0.8" fill="white"/>
        <!-- Mouth -->
        <path d="M26 24 Q30 27 34 24" stroke="#8b4513" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        ${extras}

        <!-- Neck -->
        <rect x="27" y="30" width="6" height="6" fill="${d.skin}"/>

        <!-- Body/Torso -->
        <path d="M18 36 Q16 36 15 40 L13 60 Q12 64 16 64 L44 64 Q48 64 47 60 L45 40 Q44 36 42 36 Z" fill="${d.shirt}"/>
        ${d.child ? '' : '<!-- Collar --><path d="M24 36 L30 42 L36 36" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>'}

        <!-- Arms -->
        <g class="person-arm-left">
            <path d="M15 40 Q10 50 12 ${d.child ? '58' : '65'}" stroke="${d.shirt}" stroke-width="7" fill="none" stroke-linecap="round"/>
            <circle cx="12" cy="${d.child ? '58' : '65'}" r="4" fill="${d.skin}"/>
        </g>
        <g class="person-arm-right">
            <path d="M45 40 Q50 50 48 ${d.child ? '58' : '65'}" stroke="${d.shirt}" stroke-width="7" fill="none" stroke-linecap="round"/>
            <circle cx="48" cy="${d.child ? '58' : '65'}" r="4" fill="${d.skin}"/>
        </g>

        <!-- Legs -->
        <g class="person-legs">
            <rect x="20" y="64" width="9" height="${d.child ? '22' : '30'}" rx="4" fill="${d.pants}"/>
            <rect x="31" y="64" width="9" height="${d.child ? '22' : '30'}" rx="4" fill="${d.pants}"/>
        </g>

        <!-- Shoes -->
        <rect x="18" y="${vH - 10}" width="13" height="8" rx="4" fill="${d.shoes}"/>
        <rect x="30" y="${vH - 10}" width="13" height="8" rx="4" fill="${d.shoes}"/>
    </svg>`;
}

// ---- FAMILY STRIP for intro screen ----
function buildFamilyStrip() {
    const members = [
        { id:'carlos', name:'Carlos', role:'Father, 38', emoji:'👨' },
        { id:'maria', name:'Maria', role:'Mother, 36', emoji:'👩' },
        { id:'sofia', name:'Sofia', role:'Daughter, 14', emoji:'👧🏻' },
        { id:'leo', name:'Leo', role:'Son, 6', emoji:'👦🏻' },
        { id:'rosa', name:'Rosa', role:'Grandma, 72', emoji:'👵🏻' }
    ];
    const strip = document.getElementById('family-strip');
    if (!strip) return;
    strip.innerHTML = members.map(m => `
        <div class="family-chip">
            <div class="chip-avatar">${personSVG(m.id, 0.45)}</div>
            <div><strong>${m.name}</strong><small>${m.role}</small></div>
        </div>
    `).join('');
}

// ---- INTRO ROBOT ----
function buildIntroRobot() {
    const el = document.getElementById('intro-robot-anim');
    if (el) el.innerHTML = robotSVG('idle', 1.2);
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    buildFamilyStrip();
    buildIntroRobot();
});
