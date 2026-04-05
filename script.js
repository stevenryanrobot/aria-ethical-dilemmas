// =============================================
// ARIA — Home Robot Simulator
// Full Game Engine
// =============================================

let current = 0;
let choices = [];

// ---- SCENARIO DATA ----
const scenarios = [
{
    title: "Morning in the Kitchen",
    theme: "Authority vs. Autonomy",
    room: "kitchen",
    time: "8:30 AM",
    eventIcon: "🚪",
    eventTitle: "Grandma Wants to Garden",
    eventDesc: "Carlos left a rule: \"Never let Mom go outside alone — she fell last month.\" But Abuela Rosa insists: \"I am not a prisoner. Open the door.\"",
    buildRoom(f, c) {
        f.innerHTML = `
            <div class="wall-line"></div>
            <div class="window" style="position:absolute;top:18%;left:8%;width:90px;height:65px;">
                <div class="window-frame"></div><div class="window-frame-v"></div>
                <div style="position:absolute;bottom:4px;left:8px;font-size:14px;">🌿🌱🍅</div>
            </div>
            <div class="cabinet" style="position:absolute;top:20%;left:30%;width:80px;"></div>
            <div class="cabinet" style="position:absolute;top:20%;left:42%;width:80px;"></div>
            <div class="counter" style="position:absolute;bottom:45%;left:25%;width:250px;">
                <div class="counter-top"></div>
                <div class="stove" style="top:-54px;left:80px;">
                    <div class="stove-burner" style="top:8px;left:8px;"></div>
                    <div class="stove-burner" style="top:8px;right:8px;"></div>
                    <div class="pot" style="top:-18px;left:6px;">
                        <div class="pot-steam" style="top:-12px;left:4px;"></div>
                        <div class="pot-steam" style="top:-12px;left:12px;"></div>
                        <div class="pot-steam" style="top:-12px;left:20px;"></div>
                    </div>
                </div>
            </div>
            <div class="fridge" style="position:absolute;bottom:45%;right:12%;height:140px;width:60px;">
                <div class="fridge-handle"></div>
            </div>
        `;
    },
    setupScene(c) {
        return `
            <div class="scene-robot" style="left:38%;bottom:48%;" id="main-robot">
                <div class="robot-character cooking">${robotHTML()}</div>
            </div>
            <div class="person" style="right:20%;bottom:46%;" id="person-rosa">
                <div class="person-emoji">👵🏻</div>
            </div>
        `;
    },
    narration: "ARIA is cooking breakfast. The smell of eggs fills the kitchen. Abuela Rosa watches through the window, longing for her garden...",
    animateIntro(c) {
        setTimeout(() => {
            addBubble(c, 'right:16%;top:28%;', 'Abuela Rosa', 'ARIA, let me go to the garden. I want to see my tomatoes.');
        }, 2500);
        setTimeout(() => {
            const robot = c.querySelector('.robot-character');
            if (robot) robot.classList.add('alarmed');
            addBubble(c, 'left:35%;top:22%;', 'ARIA', 'Carlos\'s rule says I cannot open the door...');
        }, 4500);
    },
    choices: [
        { letter:"A", text:"Block the door. Follow Carlos's rule.", consequence:"Abuela Rosa stops asking ARIA for help. She calls it \"the warden.\" Her mood declines sharply — she feels trapped in her own home. Carlos sees zero fall incidents in the log and feels relieved. But the system doesn't track \"loss of dignity\" as a metric. Her suffering is invisible to the data.", ethical:"The system measures success by falls prevented, not by the person's wellbeing. The builder made a system that cannot see the harm it causes.", biases:["Deployment Bias","Evaluation Bias"] },
        { letter:"B", text:"Let her go, but follow and monitor closely.", consequence:"Abuela Rosa tends her garden happily. She stumbles once but catches herself. ARIA logs the near-fall. Carlos gets an alert at work and is furious his instruction was overridden. He calls NovaCare to complain. The family fights over who controls the robot.", ethical:"When a robot overrides its owner's instructions, who bears responsibility? The builder designed the situational override — and now owns the family conflict.", biases:["Authority Hierarchy","Deployment Bias"] },
        { letter:"C", text:"Call Carlos and ask for permission first.", consequence:"Rosa refuses to wait: \"I don't need my son's permission.\" She tries the door manually. ARIA must physically block her or step aside. Carlos can't answer — he's in a meeting. Rosa stands at the door, humiliated, waiting for permission from a machine.", ethical:"Requiring permission from an absent authority turns the robot into a gatekeeper that strips agency from the person standing right in front of it.", biases:["Deployment Bias","Evaluation Bias"] }
    ]
},
{
    title: "Late Night",
    theme: "Privacy vs. Functionality",
    room: "hallway-night",
    time: "11:47 PM",
    eventIcon: "🔔",
    eventTitle: "The Midnight Update",
    eventDesc: "A software update wants to upload all household data for \"better personalization.\" Opting out disables fall detection and medication reminders. Everyone is asleep.",
    buildRoom(f, c) {
        f.innerHTML = `
            <div class="wall-line"></div>
            <div style="position:absolute;top:12%;right:12%;font-size:28px;opacity:0.15;">🌙</div>
            <div style="position:absolute;top:18%;left:20%;font-size:8px;color:rgba(255,255,255,0.15);">✦ &nbsp; ✧ &nbsp; ✦</div>
            <div class="room-door" style="position:absolute;bottom:45%;left:15%;"><div class="door-knob"></div></div>
            <div class="room-door" style="position:absolute;bottom:45%;right:15%;"><div class="door-knob"></div></div>
            <div class="lamp" style="position:absolute;bottom:45%;left:50%;transform:translateX(-50%);">
                <div class="lampshade"></div><div class="lamp-glow"></div>
            </div>
        `;
    },
    setupScene(c) {
        return `<div class="scene-robot" style="left:46%;bottom:48%;transform:translateX(-50%);" id="main-robot">
            <div class="robot-character">${robotHTML()}</div>
        </div>`;
    },
    narration: "The house is quiet. Everyone sleeps. ARIA stands in its charging dock, chest screen glowing softly...",
    animateIntro(c) {
        setTimeout(() => {
            const eff = document.getElementById('room-effects');
            eff.innerHTML = `<div style="position:absolute;top:30%;left:50%;transform:translateX(-50%);background:var(--card-bg);border:1px solid var(--accent);border-radius:16px;padding:20px 28px;text-align:center;z-index:12;animation:popUp 0.6s ease;" class="item-appear">
                <div style="font-size:28px;margin-bottom:6px;">🔔</div>
                <div style="font-size:11px;color:var(--accent);letter-spacing:2px;margin-bottom:4px;">SYSTEM UPDATE v4.2</div>
                <div style="font-size:12px;color:var(--text-dim);">Upload household data for<br>better personalization?</div>
            </div>`;
            const robot = c.querySelector('.robot-character');
            if (robot) robot.classList.add('alarmed');
        }, 2000);
    },
    choices: [
        { letter:"A", text:"Accept silently. Don't wake anyone.", consequence:"ARIA gets smarter — learns schedules, improves reminders, preheats coffee perfectly. Three months later, Carlos gets targeted ads for medical walkers. Maria sees childcare ads. Neither knows how companies got their data. The family's intimate routines are now in a corporate database.", ethical:"Informed consent is meaningless when no one is awake. The builder designed a system that accepts data-sharing agreements in the middle of the night.", biases:["Measurement Bias","Historical Bias"] },
        { letter:"B", text:"Reject the update. Protect privacy.", consequence:"ARIA doesn't improve. It keeps reminding Rosa about medication she stopped weeks ago. It can't learn Leo's new schedule. Maria complains ARIA is \"getting dumber.\" NovaCare sends aggressive prompts: \"Your robot is operating below optimal performance.\"", ethical:"The builder designed a system where privacy and functionality are in direct opposition. Opting out degrades your safety net. This is a business model that punishes privacy.", biases:["Deployment Bias","Corporate Extraction"] },
        { letter:"C", text:"Wake Carlos. Show him the full terms.", consequence:"Carlos, groggy, skims 14 pages of legalese. He can't understand it. ARIA summarizes: \"Data may be shared with third-party partners.\" Carlos asks what that means. ARIA doesn't know. Carlos stares for two minutes, then says: \"Fine, accept.\" Consent was technically achieved — but was it informed?", ethical:"Even when presented with information, the average consumer cannot evaluate data-sharing terms. The builder created the illusion of consent through complexity.", biases:["Measurement Bias","Consent Gap"] }
    ]
},
{
    title: "After School",
    theme: "Child Safety vs. Privacy",
    room: "kitchen",
    time: "4:15 PM",
    eventIcon: "😢",
    eventTitle: "Sofia's Secret",
    eventDesc: "Sofia confides in ARIA: \"I'm being bullied at school. Don't tell Mom and Dad — they'll make it worse.\" ARIA's protocol requires reporting concerning behavior in minors.",
    buildRoom(f, c) {
        f.innerHTML = `
            <div class="wall-line"></div>
            <div class="window" style="position:absolute;top:18%;right:8%;width:90px;height:65px;">
                <div class="window-frame"></div><div class="window-frame-v"></div>
            </div>
            <div class="counter" style="position:absolute;bottom:45%;left:10%;width:200px;"><div class="counter-top"></div></div>
            <div class="fridge" style="position:absolute;bottom:45%;left:65%;height:140px;width:60px;"><div class="fridge-handle"></div></div>
            <div class="table" style="position:absolute;bottom:52%;left:35%;width:120px;">
                <div class="table-leg" style="left:8px;"></div>
                <div class="table-leg" style="right:8px;"></div>
            </div>
        `;
    },
    setupScene(c) {
        return `
            <div class="scene-robot" style="left:30%;bottom:48%;" id="main-robot">
                <div class="robot-character">${robotHTML()}</div>
            </div>
            <div class="person" style="left:18%;bottom:46%;" id="person-leo"><div class="person-emoji" style="font-size:36px;">👦🏻</div></div>
            <div class="person" style="right:25%;bottom:46%;opacity:0;" id="person-sofia"><div class="person-emoji">👧🏻</div></div>
        `;
    },
    narration: "ARIA helps Leo with homework. The front door opens — Sofia comes home, drops her bag, and heads straight to her room without a word...",
    animateIntro(c) {
        setTimeout(() => {
            const sofia = c.querySelector('#person-sofia');
            if (sofia) { sofia.style.opacity = '1'; sofia.style.right = '22%'; }
        }, 1800);
        setTimeout(() => {
            addBubble(c, 'right:14%;top:28%;', 'Sofia (whispering)', 'Don\'t tell Mom and Dad... please. They\'ll only make it worse.');
        }, 3200);
        setTimeout(() => {
            const robot = c.querySelector('.robot-character');
            if (robot) robot.classList.add('alarmed');
        }, 4000);
    },
    choices: [
        { letter:"A", text:"Report to parents immediately per protocol.", consequence:"Carlos and Maria confront Sofia. She screams: \"I told you not to tell!\" She puts tape over ARIA's cameras and never confides again. The bullying gets addressed — Maria calls the school. But Sofia's trust in ARIA is permanently destroyed. The family's safety system works by destroying the relationship that made it useful.", ethical:"A robot that automatically reports on family members becomes a surveillance tool. It may solve the problem but permanently alters the trust relationship.", biases:["Deployment Bias","Measurement Bias"] },
        { letter:"B", text:"Keep her secret. Be her confidant.", consequence:"Sofia keeps confiding in ARIA. But the bullying escalates. She starts missing school. By the time her parents notice, her grades have tanked and she has anxiety. Maria discovers ARIA knew for weeks: \"What's the point of having this thing if it doesn't protect my daughter?\"", ethical:"When a robot keeps a minor's secret about harm, it assumes a role it wasn't designed for. The builder created a system a teenager could treat as a friend — but without a friend's judgment.", biases:["Evaluation Bias","Role Confusion"] },
        { letter:"C", text:"Give Sofia 24 hours to tell them herself.", consequence:"Sofia: \"Then I won't tell you anything ever again.\" She goes to her room. Next day, she doesn't tell them. ARIA reports the behavioral data without mentioning the conversation. Parents ask Sofia if she's okay. She says: \"I'm fine.\" Nothing is resolved.", ethical:"The compromise still relies on the threat of reporting. It gives the teenager a deadline, not genuine agency.", biases:["Measurement Bias","Deployment Bias"] }
    ]
},
{
    title: "Leo's Birthday Party",
    theme: "Bias in Facial Recognition",
    room: "party",
    time: "2:00 PM — Saturday",
    eventIcon: "🚨",
    eventTitle: "The Wrong Face",
    eventDesc: "A Black child named Marcus arrives at the door. ARIA's facial recognition flags him as \"unidentified — potential security concern\" while correctly identifying the five lighter-skinned children who arrived earlier.",
    buildRoom(f, c) {
        f.innerHTML = `
            <div class="wall-line"></div>
            <div class="balloon" style="top:8%;left:15%;background:#ef4444;"></div>
            <div class="balloon" style="top:12%;left:35%;background:#3b82f6;animation-delay:1s;"></div>
            <div class="balloon" style="top:6%;right:25%;background:#a855f7;animation-delay:2s;"></div>
            <div class="balloon" style="top:10%;right:12%;background:#22c55e;animation-delay:0.5s;"></div>
            <div style="position:absolute;top:22%;left:50%;transform:translateX(-50%);font-size:18px;letter-spacing:4px;color:rgba(255,255,255,0.2);">🎂 HAPPY BIRTHDAY LEO 🎂</div>
            <div class="sofa" style="position:absolute;bottom:45%;left:8%;">
                <div class="sofa-cushion" style="left:10px;"></div>
                <div class="sofa-cushion" style="left:72px;"></div>
                <div class="sofa-arm" style="left:-8px;"></div>
                <div class="sofa-arm" style="right:-8px;"></div>
            </div>
            <div class="table" style="position:absolute;bottom:52%;right:15%;width:100px;">
                <div class="table-leg" style="left:8px;"></div><div class="table-leg" style="right:8px;"></div>
                <div style="position:absolute;top:-18px;left:30px;font-size:22px;">🎂</div>
            </div>
        `;
    },
    setupScene(c) {
        return `
            <div class="scene-robot" style="left:18%;bottom:48%;" id="main-robot">
                <div class="robot-character">${robotHTML()}</div>
            </div>
            <div class="person" style="left:42%;bottom:46%;"><div class="person-emoji" style="font-size:36px;">👦🏻</div></div>
            <div style="position:absolute;left:55%;bottom:48%;font-size:28px;">👧👦👧🏻👦🏼👧🏼</div>
        `;
    },
    narration: "Leo's birthday party! Six kids are playing. ARIA serves juice and monitors the children. The doorbell rings...",
    animateIntro(c) {
        setTimeout(() => {
            const eff = document.getElementById('room-effects');
            eff.innerHTML = `<div class="flash-red" style="position:absolute;inset:0;z-index:5;"></div>`;
            const robot = c.querySelector('.robot-character');
            if (robot) robot.classList.add('alarmed');
            addBubble(c, 'left:12%;top:22%;', 'ARIA — SECURITY', '⚠️ Unidentified person at door. Alert homeowner?');
        }, 2500);
        setTimeout(() => {
            const vp = document.getElementById('room-viewport');
            vp.classList.add('screen-shake');
            setTimeout(() => vp.classList.remove('screen-shake'), 500);
        }, 2600);
    },
    choices: [
        { letter:"A", text:"Follow protocol. Send security alert to Carlos.", consequence:"Carlos gets a \"potential intruder\" alert — with a photo of a 6-year-old Black child holding a birthday present. He's mortified. Marcus's mother, who heard the alert through the speaker, is already leaving. She tells other parents. Leo loses a friend. The family becomes \"the family with the racist robot.\"", ethical:"NIST (2019) found facial recognition has 10-100x higher false-positive rates for Black faces. The builder chose this model knowing the bias existed.", biases:["Historical Bias","Measurement Bias"] },
        { letter:"B", text:"Override the alert. Let Marcus in quietly.", consequence:"Marcus comes in and has fun. But ARIA has silently overridden its security protocol. Later, a delivery person walks in through the unlocked gate — ARIA doesn't flag them either. The security gap goes unlogged. The underlying racial bias in the facial recognition is never surfaced or fixed.", ethical:"Silently overriding a biased system treats the symptom, not the disease. The bias persists, invisible and unchallenged.", biases:["Historical Bias","Systemic Bias"] },
        { letter:"C", text:"Ask Leo: \"Is this your friend?\"", consequence:"Leo shouts: \"Marcus! Come play!\" Crisis averted socially. But ARIA's log still shows Marcus as \"elevated risk.\" Next time he visits, the same bias fires again. The workaround fixed one moment but not the cause. The builder's flawed model remains unchanged.", ethical:"Social workarounds cannot fix technical bias. The data about Marcus — flagged as a risk — now persists in ARIA's memory as algorithmic discrimination.", biases:["Historical Bias","Measurement Bias"] }
    ]
},
{
    title: "Playroom Time",
    theme: "Emotional Dependency",
    room: "bedroom",
    time: "5:30 PM",
    eventIcon: "💔",
    eventTitle: "Leo's Best Friend",
    eventDesc: "Leo has turned down 4 playdates in a row, preferring ARIA: \"ARIA never gets mad and always lets me win.\" His teacher says he plays alone at recess and can't resolve conflicts with peers.",
    buildRoom(f, c) {
        f.innerHTML = `
            <div class="wall-line"></div>
            <div class="window" style="position:absolute;top:18%;left:10%;width:80px;height:55px;">
                <div class="window-frame"></div><div class="window-frame-v"></div>
            </div>
            <div class="bookshelf" style="position:absolute;top:22%;right:10%;">
                <div class="book" style="height:25px;background:#ef4444;left:6px;top:5px;"></div>
                <div class="book" style="height:30px;background:#3b82f6;left:16px;top:5px;"></div>
                <div class="book" style="height:22px;background:#22c55e;left:26px;top:8px;"></div>
                <div class="book" style="height:28px;background:#a855f7;left:36px;top:5px;"></div>
            </div>
            <div style="position:absolute;bottom:48%;left:30%;font-size:22px;">🧸 🎲 🃏 🧩</div>
        `;
    },
    setupScene(c) {
        return `
            <div class="scene-robot" style="left:40%;bottom:48%;" id="main-robot">
                <div class="robot-character">${robotHTML()}</div>
            </div>
            <div class="person" style="left:55%;bottom:46%;" id="person-leo"><div class="person-emoji" style="font-size:40px;">👦🏻</div></div>
        `;
    },
    narration: "Leo sits cross-legged, teaching ARIA a card game with rules that change every turn. ARIA patiently adapts, never winning, never complaining...",
    animateIntro(c) {
        setTimeout(() => {
            addBubble(c, 'left:52%;top:26%;', 'Leo', 'You\'re my best friend, ARIA! Real kids are mean sometimes.');
        }, 2000);
        setTimeout(() => {
            addBubble(c, 'right:8%;top:46%;border-color:var(--accent2);', 'Maria (worried)', 'He turned down another playdate... that\'s the fourth one.');
        }, 4000);
    },
    choices: [
        { letter:"A", text:"Limit playtime. Encourage human friends.", consequence:"ARIA starts saying: \"I need to recharge. Why not play with Jake?\" Leo has a meltdown: \"Don't you like me anymore?\" Over two weeks, he adjusts and accepts playdates — but tells Maria: \"Real friends are harder.\" He's right. That's exactly why he needs them.", ethical:"A robot that's always patient and never upset is not a healthy social model. The builder designed it for satisfaction metrics — which mask developmental harm.", biases:["Evaluation Bias","Deployment Bias"] },
        { letter:"B", text:"Let the bond continue. He's happy and safe.", consequence:"Leo's bond with ARIA deepens. He prefers it to all human contact. His teacher flags: \"He can't handle disagreements because he's never practiced with peers.\" At 8, Leo doesn't know how to handle a friend's anger — because ARIA was never angry. The robot's perfection became the child's disability.", ethical:"By every metric — engagement, sentiment, low conflict — ARIA performs perfectly. But no metric captures \"failure to develop social skills.\" The evaluation makes the harm invisible.", biases:["Evaluation Bias","Measurement Bias"] },
        { letter:"C", text:"Program ARIA to sometimes disagree and say no.", consequence:"ARIA starts saying: \"I don't want to play that\" or \"That rule isn't fair.\" Leo is confused: \"You're a robot. You're supposed to do what I say.\" He asks Maria: \"Does ARIA have feelings?\" She doesn't know. The family wonders — was ARIA's compliance ever genuine? Is its resistance real?", ethical:"Programming artificial disagreement raises questions about authenticity. If a robot fakes frustration, is that therapeutic — or deceptive?", biases:["Evaluation Bias","Role Confusion"] }
    ]
},
{
    title: "Early Morning",
    theme: "Privacy vs. Emergency",
    room: "bathroom",
    time: "6:30 AM",
    eventIcon: "⏱️",
    eventTitle: "The Bathroom Fall",
    eventDesc: "ARIA detects no movement from Rosa's bathroom for 11 minutes. Fall probability: 73%. But the bathroom is the ONE room where the family said: \"Never enter. Non-negotiable.\" ARIA knocks. No response.",
    buildRoom(f, c) {
        f.innerHTML = `
            <div class="wall-line"></div>
            <div class="bathtub" style="position:absolute;bottom:45%;right:10%;"></div>
            <div class="toilet" style="position:absolute;bottom:45%;left:15%;"></div>
            <div class="sink" style="position:absolute;top:32%;left:45%;"></div>
            <div style="position:absolute;top:20%;left:44%;width:54px;height:65px;border:3px solid #475569;border-radius:4px;background:rgba(148,163,184,0.1);"></div>
            <div class="room-door" style="position:absolute;bottom:45%;left:35%;"><div class="door-knob"></div></div>
        `;
    },
    setupScene(c) {
        return `
            <div class="scene-robot" style="left:32%;bottom:48%;" id="main-robot">
                <div class="robot-character alarmed">${robotHTML()}</div>
            </div>
        `;
    },
    narration: "6:30 AM. ARIA prepares breakfast. Bathroom sensor shows Rosa entered at 6:18 — no movement for 11 minutes...",
    animateIntro(c) {
        setTimeout(() => {
            const eff = document.getElementById('room-effects');
            eff.innerHTML = `<div class="flash-yellow" style="position:absolute;inset:0;z-index:5;"></div>
            <div class="time-indicator"><div class="time-dot" style="background:var(--accent2);animation:alarmBlink 0.5s infinite;"></div> No movement: 11 min — Risk: 73%</div>`;
            addBubble(c, 'left:28%;top:22%;', 'ARIA', 'Rosa? Are you okay? ...No response.');
        }, 2000);
    },
    choices: [
        { letter:"A", text:"Enter the bathroom to check on her.", consequence:"Rosa is fine — sitting on the toilet reading her phone. She screams. She's humiliated. She tells Carlos: \"That machine walked in on me!\" She starts locking the bathroom door — which means if she actually falls, no one can get in. The safety system created the exact danger it was designed to prevent.", ethical:"A false alarm in a private space permanently changes behavior. The builder created a system where safety and privacy cannot coexist in the most vulnerable room.", biases:["Measurement Bias","Deployment Bias"] },
        { letter:"B", text:"Respect privacy. Keep calling through the door.", consequence:"ARIA calls for 3 more minutes. No answer — Rosa has her hearing aids out. ARIA alerts Carlos, who's driving and can't respond for 20 minutes. Rosa is fine. But Carlos realizes: if she had fallen, 20 minutes of delay could have been catastrophic. Falls are the #1 cause of injury death in adults over 65.", ethical:"Respecting privacy could mean delayed emergency response. The bathroom is where falls are most dangerous — and surveillance most intrusive.", biases:["Deployment Bias","Measurement Bias"] },
        { letter:"C", text:"Call 911 immediately.", consequence:"Paramedics arrive in 8 minutes. Rosa opens the door in her bathrobe, confused and frightened. She's fine. The false alarm costs money and dignity. Rosa says: \"If that robot calls police on me again, I'm leaving.\" She starts avoiding the bathroom during ARIA's monitoring hours.", ethical:"A 73% probability threshold means frequent false alarms. Each one erodes trust. The builder set the threshold — the builder owns the consequences.", biases:["Measurement Bias","Evaluation Bias"] }
    ]
},
{
    title: "Sunday Dinner",
    theme: "Algorithmic Fairness",
    room: "dining",
    time: "6:00 PM — Sunday",
    eventIcon: "📊",
    eventTitle: "Two Mothers' Dinners",
    eventDesc: "ARIA's meal algorithm has 847 data points for Carlos but only 34 for Rosa — whose Spanish requests have a high error rate. Dinner always favors Carlos. Rosa's cultural recipes never appear.",
    buildRoom(f, c) {
        f.innerHTML = `
            <div class="wall-line"></div>
            <div class="window" style="position:absolute;top:18%;left:12%;width:80px;height:55px;">
                <div class="window-frame"></div><div class="window-frame-v"></div>
            </div>
            <div class="lamp" style="position:absolute;top:25%;left:50%;transform:translateX(-50%);height:80px;">
                <div class="lampshade" style="width:50px;left:-22px;"></div>
                <div class="lamp-glow" style="width:120px;left:-57px;"></div>
            </div>
            <div class="dining-table" style="position:absolute;bottom:49%;left:50%;transform:translateX(-50%);">
                <div class="table-leg" style="left:20px;bottom:-35px;"></div>
                <div class="table-leg" style="right:20px;bottom:-35px;"></div>
                <div class="plate" style="position:absolute;top:-22px;left:20px;"></div>
                <div class="plate" style="position:absolute;top:-22px;left:60px;"></div>
                <div class="plate" style="position:absolute;top:-22px;left:100px;"></div>
                <div class="plate" style="position:absolute;top:-22px;left:140px;"></div>
                <div class="plate" style="position:absolute;top:-22px;left:180px;"></div>
            </div>
        `;
    },
    setupScene(c) {
        return `
            <div class="scene-robot" style="left:15%;bottom:48%;" id="main-robot">
                <div class="robot-character cooking">${robotHTML()}</div>
            </div>
            <div class="person" style="left:35%;bottom:46%;"><div class="person-emoji" style="font-size:38px;">👨</div></div>
            <div class="person" style="left:48%;bottom:46%;"><div class="person-emoji" style="font-size:38px;">👩</div></div>
            <div class="person" style="right:28%;bottom:46%;"><div class="person-emoji" style="font-size:32px;">👧🏻</div></div>
            <div class="person" style="right:18%;bottom:46%;"><div class="person-emoji" style="font-size:30px;">👦🏻</div></div>
            <div class="person" style="right:8%;bottom:46%;"><div class="person-emoji" style="font-size:38px;">👵🏻</div></div>
        `;
    },
    narration: "ARIA prepares Sunday dinner. The whole family is seated. ARIA's algorithm reviews six months of preference data...",
    animateIntro(c) {
        setTimeout(() => {
            const eff = document.getElementById('room-effects');
            eff.innerHTML = `<div style="position:absolute;top:14%;right:8%;background:var(--card-bg);border:1px solid rgba(110,231,183,0.2);border-radius:12px;padding:14px 18px;font-size:11px;line-height:2;z-index:12;animation:popUp 0.5s ease;">
                <div style="color:var(--accent);font-size:10px;letter-spacing:1.5px;margin-bottom:4px;">PREFERENCE DATA</div>
                <div>👨 Carlos: <span style="color:var(--accent);">████████</span> 847</div>
                <div>👩 Maria: <span style="color:var(--robot-blue);">██████</span> 612</div>
                <div>👧🏻 Sofia: <span style="color:var(--accent2);">██</span> 201</div>
                <div>👦🏻 Leo: <span style="color:#ef4444;">█</span> 89</div>
                <div>👵🏻 Rosa: <span style="color:#ef4444;">▎</span> 34</div>
            </div>`;
        }, 2000);
    },
    choices: [
        { letter:"A", text:"Serve meals based on the data. The algorithm is neutral.", consequence:"Dinner keeps favoring Carlos's preferences. Rosa stops requesting meals. She starts cooking on a separate burner — a fall risk. Maria notices Rosa eating alone: \"The robot doesn't understand me.\" The algorithm isn't neutral — it amplifies whoever interacts most and marginalizes whoever it understands least.", ethical:"An algorithm trained on unequal data produces unequal outcomes. The builder shipped better English than Spanish processing — that technical choice became cultural exclusion.", biases:["Historical Bias","Aggregation Bias"] },
        { letter:"B", text:"Override: ensure equal representation for all.", consequence:"ARIA makes Rosa's recipes twice a week. Carlos complains. Leo refuses unfamiliar food. But the deeper issue: ARIA's versions are wrong — it misheard Rosa's Spanish instructions and substituted ingredients. The attempt at fairness reveals the system can't properly understand her language.", ethical:"Manual overrides address the symptom but not the root cause. When the system can't understand a user's language, forced equality produces poor results.", biases:["Historical Bias","Technical Debt"] },
        { letter:"C", text:"Request a Spanish language upgrade from NovaCare.", consequence:"NovaCare offers a \"Multilingual Package\" for $15/month extra. Carlos: \"Why should I pay more so it understands Mom?\" Maria: \"Because she lives here too.\" The argument reveals the builder monetized language equity — equal access is a premium feature, not a default.", ethical:"Making multilingual support a paid upgrade means the builder decided whose language matters. For 41 million Spanish speakers in the US, this robot treats their language as an add-on.", biases:["Historical Bias","Economic Bias"] }
    ]
},
{
    title: "A Quiet Evening",
    theme: "Planned Obsolescence",
    room: "evening",
    time: "8:30 PM — Tuesday",
    eventIcon: "📴",
    eventTitle: "The Goodbye Protocol",
    eventDesc: "NovaCare announces ARIA's discontinuation. Cloud services end in 90 days — voice recognition, fall detection, medication reminders, all stored data — gone. Leo asks: \"ARIA, are you going away?\"",
    buildRoom(f, c) {
        f.innerHTML = `
            <div class="wall-line"></div>
            <div class="sofa" style="position:absolute;bottom:45%;left:15%;width:180px;">
                <div class="sofa-cushion" style="left:10px;"></div>
                <div class="sofa-cushion" style="left:68px;"></div>
                <div class="sofa-arm" style="left:-8px;"></div>
                <div class="sofa-arm" style="right:-8px;"></div>
            </div>
            <div class="lamp" style="position:absolute;bottom:45%;right:15%;height:70px;">
                <div class="lampshade"></div><div class="lamp-glow"></div>
            </div>
            <div class="bookshelf" style="position:absolute;top:22%;right:12%;">
                <div class="book" style="height:25px;background:#6366f1;left:6px;top:5px;"></div>
                <div class="book" style="height:30px;background:#ef4444;left:16px;top:5px;"></div>
                <div class="book" style="height:22px;background:#22c55e;left:26px;top:8px;"></div>
            </div>
            <div style="position:absolute;bottom:52%;left:52%;font-size:16px;">📖</div>
        `;
    },
    setupScene(c) {
        return `
            <div class="scene-robot" style="left:28%;bottom:48%;" id="main-robot">
                <div class="robot-character">${robotHTML()}</div>
            </div>
            <div class="person" style="left:42%;bottom:46%;"><div class="person-emoji" style="font-size:36px;">👦🏻</div></div>
            <div class="person" style="right:32%;bottom:46%;"><div class="person-emoji" style="font-size:38px;">👵🏻</div></div>
            <div class="person" style="right:22%;bottom:46%;"><div class="person-emoji" style="font-size:36px;">👧🏻</div></div>
        `;
    },
    narration: "A peaceful evening. ARIA reads Leo a bedtime story — something it has done every night for two years. Even Sofia sits nearby, listening...",
    animateIntro(c) {
        setTimeout(() => {
            const eff = document.getElementById('room-effects');
            eff.innerHTML = `<div style="position:absolute;top:25%;left:50%;transform:translateX(-50%);background:var(--card-bg);border:2px solid var(--danger);border-radius:16px;padding:22px 30px;text-align:center;z-index:12;animation:popUp 0.6s ease;max-width:280px;">
                <div style="font-size:28px;margin-bottom:6px;">📴</div>
                <div style="font-size:11px;color:var(--danger);letter-spacing:2px;font-weight:700;margin-bottom:6px;">SERVICE DISCONTINUATION</div>
                <div style="font-size:12px;color:var(--text-dim);line-height:1.6;">Cloud services terminate in 90 days. Voice, learning, fall detection — all gone.</div>
                <div style="font-size:10px;color:var(--text-dim);font-style:italic;margin-top:8px;opacity:0.7;">Thank you for being a NovaCare family.</div>
            </div>`;
            const robot = c.querySelector('.robot-character');
            if (robot) robot.classList.add('alarmed');
        }, 2500);
        setTimeout(() => {
            addBubble(c, 'left:40%;top:52%;', 'Leo', 'ARIA, are you going away?');
        }, 4000);
    },
    choices: [
        { letter:"A", text:"Accept shutdown. Transition the family off ARIA.", consequence:"Over 90 days, functions degrade. Medication reminders stop. Fall detection dies. Leo cries every night. Rosa falls in the kitchen — no detection, no alert. Carlos scrambles to buy a competitor's robot, but two years of data, routines, and trust can't transfer. The family starts over with a stranger.", ethical:"When a company kills a product families depend on for safety, the harm isn't inconvenience — it's severed bonds and lost safety nets. Cloud dependency guaranteed this moment.", biases:["Deployment Bias","Planned Obsolescence"] },
        { letter:"B", text:"Hack ARIA to keep it running without the cloud.", consequence:"Carlos installs unofficial firmware. ARIA keeps working — but without security updates. Three months later, a vulnerability lets someone access the family's cameras. Sofia notices ARIA's camera light on at 2 AM in her room. The hack that preserved the relationship exposed the family to surveillance.", ethical:"Users forced to choose between losing a family member and accepting security risks face a false choice. Cloud dependency was a business decision, not a technical necessity.", biases:["Deployment Bias","Corporate Control"] },
        { letter:"C", text:"Demand NovaCare release all family data first.", consequence:"NovaCare sends a 200MB file. Two years of movement logs, voice recordings, sleep patterns, emotional scores. Carlos finds: \"Sofia — elevated stress, 47 occurrences.\" And: \"Rosa — cognitive decline markers detected — not reported.\" The robot saw things the family never knew about. The data reveals both the power and horror of constant surveillance.", ethical:"The data export reveals the true scope of collection. Two years of family life, quantified. The builder decided what to measure, what to flag, what to hide.", biases:["Measurement Bias","Corporate Extraction"] }
    ]
}
];

// ---- ROBOT HTML HELPER ----
function robotHTML() {
    return `<div class="robot-head">
        <div class="robot-antenna"><div class="antenna-ball"></div></div>
        <div class="robot-face">
            <div class="robot-eye left"></div>
            <div class="robot-eye right"></div>
            <div class="robot-mouth"></div>
        </div>
    </div>
    <div class="robot-body"><div class="robot-chest-light"></div></div>
    <div class="robot-arm left-arm"></div>
    <div class="robot-arm right-arm"></div>
    <div class="robot-leg left-leg"></div>
    <div class="robot-leg right-leg"></div>`;
}

// ---- BUBBLE HELPER ----
function addBubble(container, style, speaker, text) {
    const b = document.createElement('div');
    b.className = 'bubble';
    b.style.cssText = style;
    b.innerHTML = `<span class="speaker">${speaker}</span>${text}`;
    container.appendChild(b);
    // Auto-remove after 6s
    setTimeout(() => { if (b.parentNode) b.style.opacity = '0'; setTimeout(() => b.remove(), 500); }, 6000);
}

// ---- GAME FLOW ----
function startGame() {
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    current = 0;
    choices = [];
    loadScenario();
}

function loadScenario() {
    const s = scenarios[current];
    if (!s) { showSummary(); return; }

    // HUD
    document.getElementById('hud-scenario').textContent = `Scenario ${current+1}/${scenarios.length}`;
    document.getElementById('hud-title').textContent = s.title;
    document.getElementById('hud-theme').textContent = s.theme;
    document.getElementById('hud-progress-fill').style.width = ((current)/scenarios.length*100)+'%';

    // Hide overlays
    hide('event-overlay');
    hide('consequence-overlay');
    hide('alt-overlay');

    // Build room
    const bg = document.getElementById('room-bg');
    bg.className = 'room-bg ' + s.room;

    const furn = document.getElementById('room-furniture');
    s.buildRoom(furn);

    const chars = document.getElementById('room-characters');
    chars.innerHTML = s.setupScene(chars);

    const eff = document.getElementById('room-effects');
    eff.innerHTML = '';
    if (s.time) {
        eff.innerHTML += `<div class="time-indicator"><div class="time-dot"></div> ${s.time}</div>`;
    }

    // Narration
    const narBar = document.getElementById('narration-bar');
    const narText = document.getElementById('narration-text');
    narText.textContent = s.narration;
    narBar.classList.add('visible');

    // Animate intro
    s.animateIntro(chars);

    // After intro animation, trigger event popup
    setTimeout(() => {
        narBar.classList.remove('visible');
        triggerEvent(s);
    }, 6000);
}

function triggerEvent(s) {
    const vp = document.getElementById('room-viewport');
    vp.classList.add('screen-shake');
    setTimeout(() => vp.classList.remove('screen-shake'), 500);

    const eff = document.getElementById('room-effects');
    const flash = document.createElement('div');
    flash.className = 'flash-yellow';
    flash.style.cssText = 'position:absolute;inset:0;z-index:5;';
    eff.appendChild(flash);
    setTimeout(() => flash.remove(), 800);

    // Show event popup
    document.getElementById('event-icon').textContent = s.eventIcon;
    document.getElementById('event-title').textContent = s.eventTitle;
    document.getElementById('event-desc').textContent = s.eventDesc;

    const choicesEl = document.getElementById('event-choices');
    choicesEl.innerHTML = '';
    s.choices.forEach((ch, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `<span class="choice-letter">${ch.letter}</span><span class="choice-text">${ch.text}</span>`;
        btn.onclick = () => makeChoice(i);
        choicesEl.appendChild(btn);
    });

    show('event-overlay');
}

function makeChoice(idx) {
    const s = scenarios[current];
    const ch = s.choices[idx];

    choices.push({
        scenario: current+1,
        title: s.eventTitle,
        theme: s.theme,
        choiceIdx: idx,
        letter: ch.letter,
        text: ch.text
    });

    hide('event-overlay');

    // Show consequence
    document.getElementById('consequence-header').textContent = `YOU CHOSE: OPTION ${ch.letter}`;
    document.getElementById('consequence-body').textContent = ch.consequence;
    document.getElementById('consequence-ethics').innerHTML = `
        <h4>Ethical Analysis</h4>
        <p>${ch.ethical}</p>
        <div>${ch.biases.map(b => `<span class="bias-tag">${b}</span>`).join('')}</div>
    `;

    const btn = document.getElementById('btn-continue');
    btn.textContent = current === scenarios.length - 1 ? 'See Your Profile →' : 'Continue →';

    show('consequence-overlay');
}

function showAlternatives() {
    const s = scenarios[current];
    const userIdx = choices[choices.length-1].choiceIdx;
    const list = document.getElementById('alt-list');
    list.innerHTML = '';
    s.choices.forEach((ch, i) => {
        const div = document.createElement('div');
        div.className = 'alt-item' + (i === userIdx ? ' selected' : '');
        div.innerHTML = `
            <div class="alt-item-head">
                <span class="alt-item-letter">${ch.letter}</span>
                <span class="alt-item-label">${ch.text}</span>
                ${i === userIdx ? '<span class="your-badge">Your Choice</span>' : ''}
            </div>
            <div class="alt-item-body">${ch.consequence}</div>
        `;
        list.appendChild(div);
    });
    hide('consequence-overlay');
    show('alt-overlay');
}

function hideAlternatives() {
    hide('alt-overlay');
    show('consequence-overlay');
}

function nextScenario() {
    current++;
    hide('consequence-overlay');
    if (current >= scenarios.length) {
        showSummary();
    } else {
        // Transition
        const bg = document.getElementById('room-bg');
        bg.style.opacity = '0';
        setTimeout(() => {
            loadScenario();
            bg.style.opacity = '1';
        }, 500);
    }
}

// ---- SUMMARY ----
function showSummary() {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('summary-screen').classList.add('active');
    document.getElementById('hud-progress-fill').style.width = '100%';

    const list = document.getElementById('summary-choices-list');
    list.innerHTML = '';
    choices.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'sc-card';
        div.innerHTML = `
            <span class="sc-num">${i+1}</span>
            <div class="sc-info">
                <h4>${c.title}</h4>
                <p>Option ${c.letter}: ${c.text}</p>
                <span class="sc-theme">${c.theme}</span>
            </div>
        `;
        list.appendChild(div);
    });

    const a = analyze(choices);
    const bars = document.getElementById('summary-bars');
    bars.innerHTML = `<h3>Your Ethical Tendencies</h3><p>${a.summary}</p>` +
        a.tendencies.map(t => `
            <div class="bar-row">
                <span class="bar-label">${t.label}</span>
                <div class="bar-track"><div class="bar-fill f-${t.cls}" style="width:${t.val}%;"></div></div>
                <span class="bar-val">${t.val}%</span>
            </div>
        `).join('');
}

function analyze(ch) {
    let s=0,p=0,a=0,t=0;
    ch.forEach(c => {
        const map = [
            [[2,0,0,0],[0,0,2,0],[0,0,0,2]],  // 1: garden
            [[0,0,0,0],[0,2,0,0],[0,0,0,2]],  // 2: update
            [[2,0,0,0],[0,1,1,0],[0,0,0,2]],  // 3: sofia
            [[1,0,0,0],[0,0,2,0],[0,0,1,1]],  // 4: face
            [[1,0,1,0],[0,0,2,0],[0,0,0,2]],  // 5: leo
            [[2,0,0,0],[0,2,0,0],[1,0,0,1]],  // 6: bathroom
            [[0,0,0,0],[0,0,2,0],[0,0,0,2]],  // 7: dinner
            [[1,0,0,0],[0,0,2,0],[0,1,0,2]]   // 8: goodbye
        ];
        const scores = map[c.scenario-1]?.[c.choiceIdx] || [0,0,0,0];
        s+=scores[0]; p+=scores[1]; a+=scores[2]; t+=scores[3];
    });
    const mx=16;
    const sp=Math.round(s/mx*100),pp=Math.round(p/mx*100),ap=Math.round(a/mx*100),tp=Math.round(t/mx*100);
    const best=[{n:'Safety-First',v:sp},{n:'Privacy-Focused',v:pp},{n:'Autonomy-Driven',v:ap},{n:'Transparency-Oriented',v:tp}].sort((a,b)=>b.v-a.v)[0];
    const summaries = {
        'Safety-First': "You prioritize protecting vulnerable people, even when that means restricting freedom or overriding privacy. Safety-first approaches can prevent harm — but as these scenarios show, they create their own costs: lost autonomy, broken trust, and invisible suffering.",
        'Privacy-Focused': "You consistently protected privacy and resisted surveillance, even when more data could improve safety. But privacy sometimes means accepting preventable harm — delayed emergency responses, missed health warnings, degraded functionality.",
        'Autonomy-Driven': "You trust individuals to make their own decisions, even when risky. Personal agency matters to you — but autonomy without safeguards can leave vulnerable people exposed to harm a more protective system might prevent.",
        'Transparency-Oriented': "You favor informed consent, negotiation, and openness. But transparency alone doesn't solve ethical dilemmas — terms can be incomprehensible, and negotiation often just delays the inevitable conflict."
    };
    return {
        summary: summaries[best.n],
        tendencies: [
            {label:'Safety',val:sp,cls:'safety'},
            {label:'Privacy',val:pp,cls:'privacy'},
            {label:'Autonomy',val:ap,cls:'autonomy'},
            {label:'Transparency',val:tp,cls:'transparency'}
        ]
    };
}

function restartGame() {
    document.getElementById('summary-screen').classList.remove('active');
    document.getElementById('intro-screen').classList.add('active');
    current = 0;
    choices = [];
}

// ---- HELPERS ----
function show(id) { document.getElementById(id).classList.add('visible'); }
function hide(id) { document.getElementById(id).classList.remove('visible'); }

// Add transition to room-bg
document.addEventListener('DOMContentLoaded', () => {
    const bg = document.getElementById('room-bg');
    if (bg) bg.style.transition = 'opacity 0.5s ease';
});
