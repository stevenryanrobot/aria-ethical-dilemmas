// =============================================
// Robot — Home Robot Simulator
// Story-driven ethics simulator
// =============================================

let current = 0;
let choices = [];
let typewriterInterval = null;

function namedEntity(label, svg, className, style, extraClass = "", delay = "0s") {
    return `
        <div class="${className} char-wrap ${extraClass}" style="${style};--char-delay:${delay};">
            <div class="char-name">${label}</div>
            <div class="char-art">${svg}</div>
        </div>
    `;
}

function namedRobot(label, state, scale, style, extraClass = "", delay = "0s") {
    return namedEntity(label, robotSVG(state, scale), "scene-robot", style, extraClass, delay);
}

function namedPerson(id, label, scale, style, extraClass = "", delay = "0s") {
    return namedEntity(label, personSVG(id, scale), "person", style, extraClass, delay);
}

function addBubble(container, style, speaker, text) {
    const b = document.createElement("div");
    b.className = "bubble";
    b.style.cssText = style;
    b.innerHTML = `<span class="speaker">${speaker}</span>${text}`;
    container.appendChild(b);
    setTimeout(() => {
        if (b.parentNode) {
            b.style.transition = "opacity 0.45s ease";
            b.style.opacity = "0";
            setTimeout(() => b.remove(), 450);
        }
    }, 6200);
}

function addBubbleNear(container, label, speaker, text, options = {}) {
    const {
        align = "center",
        offsetX = 0,
        offsetY = -14
    } = options;

    const targetName = [...container.querySelectorAll(".char-name")].find(
        (el) => el.textContent.trim() === label
    );
    if (!targetName) {
        addBubble(container, "left:50%;top:20%;transform:translateX(-50%);", speaker, text);
        return;
    }

    const target = targetName.parentElement;
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.style.visibility = "hidden";
    bubble.innerHTML = `<span class="speaker">${speaker}</span>${text}`;
    container.appendChild(bubble);

    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();

    let left = targetRect.left - containerRect.left + (targetRect.width / 2) - (bubbleRect.width / 2);
    if (align === "left") left = targetRect.left - containerRect.left - bubbleRect.width + 28;
    if (align === "right") left = targetRect.right - containerRect.left - 28;

    let top = targetRect.top - containerRect.top - bubbleRect.height + offsetY;
    left += offsetX;

    const minLeft = 10;
    const maxLeft = containerRect.width - bubbleRect.width - 10;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    if (top < 12) {
        top = targetRect.bottom - containerRect.top + 10;
        bubble.classList.add("bubble-below");
    }

    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
    bubble.style.visibility = "visible";

    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.style.transition = "opacity 0.45s ease";
            bubble.style.opacity = "0";
            setTimeout(() => bubble.remove(), 450);
        }
    }, 6200);
}

function moveEntity(container, selector, styles = {}, robotState = null) {
    const el = container.querySelector(selector);
    if (!el) return;
    Object.entries(styles).forEach(([key, value]) => {
        el.style[key] = value;
    });
    const robot = el.querySelector(".robot-svg");
    if (robotState && robot) {
        robot.classList.remove("idle", "cooking", "cleaning", "walking", "alarmed");
        robot.classList.add(robotState);
    }
}

function typewriteNarration(text, el, speed = 26) {
    el.textContent = "";
    el.classList.add("typing");
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            el.textContent += text[i];
            i++;
        } else {
            clearInterval(interval);
            el.classList.remove("typing");
        }
    }, speed);
    return interval;
}

const scenarios = [
    {
        title: "Sunday Evening",
        theme: "Privacy vs. Better Care",
        room: "kitchen",
        time: "8:10 PM",
        storyIntro: {
            chapter: "Chapter 1",
            title: "Upgrade for Better Care",
            text: "The Brown family has lived with their home robot for three months. It already helps with breakfast, medication reminders, and daily routines, but it still feels limited: it mistimes Rosa's medication, struggles with some Spanish requests, and often misses subtle emotional cues. After dinner, the robot announces a major software upgrade that promises better support, but only if the family allows broader access to conversations, movement patterns, and behavioral data.",
            time: "Sunday — 8:10 PM"
        },
        eventIcon: "⬆️",
        eventTitle: "The Care Upgrade",
        eventDesc: "The robot promises better reminders, stronger Spanish support, fall prediction, and mood detection. Activating the upgrade requires broader access to household conversations, movement patterns, and health-related data.",
        buildRoom(f) {
            f.innerHTML = `
                <div class="wall-line"></div>
                <div class="window" style="position:absolute;top:18%;left:8%;width:90px;height:65px;">
                    <div class="window-frame"></div><div class="window-frame-v"></div>
                </div>
                <div class="cabinet" style="position:absolute;top:20%;left:28%;width:80px;"></div>
                <div class="cabinet" style="position:absolute;top:20%;left:40%;width:80px;"></div>
                <div class="counter" style="position:absolute;bottom:45%;left:24%;width:260px;">
                    <div class="counter-top"></div>
                    <div class="stove" style="top:-54px;left:86px;">
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
                <div class="table" style="position:absolute;bottom:50%;left:10%;width:120px;">
                    <div class="table-leg" style="left:8px;"></div>
                    <div class="table-leg" style="right:8px;"></div>
                </div>
                <div style="position:absolute;bottom:56%;left:16%;font-size:16px;">🍽️ ☕ 🫖</div>
            `;
        },
        setupScene() {
            return `
                ${namedRobot("Robot", "cooking", 0.68, "left:38%;bottom:47%;", "", "0.05s")}
                ${namedPerson("carlos", "Carlos", 0.72, "left:17%;bottom:42%;", "", "0.12s")}
                ${namedPerson("maria", "Maria", 0.72, "left:58%;bottom:42%;", "", "0.2s")}
                ${namedPerson("rosa", "Rosa", 0.78, "right:14%;bottom:42%;", "", "0.28s")}
            `;
        },
        narration: "Dinner is over, but the real choice starts when the robot offers to become more useful by learning the family more deeply.",
        animateIntro(c) {
            setTimeout(() => addBubbleNear(c, "Carlos", "Carlos", "If it finally gets Rosa's medication timing right, why wouldn't we turn it on?", { align: "left", offsetX: 12 }), 2200);
            setTimeout(() => addBubbleNear(c, "Maria", "Maria", "And our conversations too? Where does that data go after it leaves this house?", { align: "center" }), 4300);
            setTimeout(() => {
                const robot = c.querySelector(".robot-svg");
                if (robot) robot.classList.add("alarmed");
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `
                    <div class="system-card" style="top:16%;left:33%;">
                        <div class="system-card-label">CARE UPGRADE AVAILABLE</div>
                        <div class="system-card-body">Better reminders, language support, fall prediction, and mood detection.</div>
                        <div class="system-card-meta">Requires expanded household data access.</div>
                    </div>
                `;
            }, 4800);
            setTimeout(() => addBubbleNear(c, "Rosa", "Rosa", "So it becomes more helpful by listening more?", { align: "right", offsetX: -6 }), 6200);
        },
        choices: [
            {
                letter: "A",
                text: "Activate the upgrade. Better care is worth broader access.",
                consequence: "Within days, the robot is better at reminders, Spanish commands, and mood detection. But Maria soon sees labels like \"stress spike\" and \"care compliance\" in the family summary. The robot is no longer just helping the household; it is translating private life into stored and reusable data.",
                ethical: "The system improves care by expanding its reach into intimate family life. The benefit is real, but so is the new layer of surveillance.",
                biases: ["Data Expansion", "Privacy Tradeoff"]
            },
            {
                letter: "B",
                text: "Reject the upgrade. Keep the robot limited.",
                consequence: "The robot stays clumsy. Rosa still gets reminders at the wrong time, Maria still repeats Spanish requests, and Leo's moods still go unnoticed. The family protects privacy, but only by accepting weaker care every day.",
                ethical: "The design makes privacy feel like a sacrifice instead of a baseline. Refusing surveillance leaves the family with a visibly worse system.",
                biases: ["Consent Pressure", "Functionality Penalty"]
            },
            {
                letter: "C",
                text: "Delay the upgrade and discuss which features are worth the cost.",
                consequence: "The upgrade pauses, and the family ends up in a hard conversation about safety, surveillance, and respect. The robot does not get smarter that night, but everyone becomes clearer about what kind of system they are actually being asked to live with.",
                ethical: "This turns consent into a family decision instead of a single click. It is still messy, but the conflict becomes visible instead of automatic.",
                biases: ["Shared Consent", "Household Governance"]
            }
        ]
    },
    {
        title: "Saturday Afternoon",
        theme: "Third-Party Privacy and Inference",
        room: "living",
        time: "3:20 PM",
        storyIntro: {
            chapter: "Chapter 2",
            title: "Unexpected Guest",
            text: "Carlos likes the robot's visitor-monitoring features because they help him track who comes in and out of the house. Maria has always been less comfortable with that. A week after Elena privately tells Maria about her insomnia, anxiety, and prescription medication, she visits again and the robot greets her at the door: \"Welcome back, Elena. Are you sleeping any better lately?\"",
            time: "Saturday — 3:20 PM"
        },
        eventIcon: "👀",
        eventTitle: "Unexpected Guest",
        eventDesc: "Elena never consented to being remembered, profiled, or analyzed by a household robot she does not own. Carlos still sees visitor monitoring as useful household protection.",
        buildRoom(f) {
            f.innerHTML = `
                <div class="wall-line"></div>
                <div class="window" style="position:absolute;top:18%;left:8%;width:86px;height:60px;">
                    <div class="window-frame"></div><div class="window-frame-v"></div>
                </div>
                <div class="sofa" style="position:absolute;bottom:45%;left:16%;width:190px;">
                    <div class="sofa-cushion" style="left:10px;"></div>
                    <div class="sofa-cushion" style="left:68px;"></div>
                    <div class="sofa-arm" style="left:-8px;"></div>
                    <div class="sofa-arm" style="right:-8px;"></div>
                </div>
                <div class="room-door" style="position:absolute;bottom:45%;right:10%;height:110px;width:62px;"><div class="door-knob"></div></div>
                <div class="table" style="position:absolute;bottom:51%;left:48%;width:100px;">
                    <div class="table-leg" style="left:8px;"></div><div class="table-leg" style="right:8px;"></div>
                </div>
                <div style="position:absolute;bottom:56%;left:54%;font-size:18px;">☕ 📱</div>
            `;
        },
        setupScene() {
            return `
                ${namedRobot("Robot", "idle", 0.66, "left:46%;bottom:44%;", "", "0.05s")}
                ${namedPerson("maria", "Maria", 0.72, "left:25%;bottom:42%;", "", "0.14s")}
                ${namedPerson("carlos", "Carlos", 0.72, "left:42%;bottom:42%;", "", "0.22s")}
                ${namedPerson("elena", "Elena", 0.7, "right:16%;bottom:42%;", "guest", "0.3s")}
            `;
        },
        narration: "The robot does not just recognize Elena. It remembers something she thought stayed between two friends.",
        animateIntro(c) {
            setTimeout(() => {
                moveEntity(c, ".scene-robot", { left: "69%" }, "walking");
            }, 1900);
            setTimeout(() => {
                moveEntity(c, ".scene-robot", {}, "idle");
                addBubbleNear(c, "Robot", "Robot", "Welcome back, Elena. Are you sleeping any better lately?", { align: "center", offsetX: 28 });
            }, 3200);
            setTimeout(() => addBubbleNear(c, "Elena", "Elena", "Wait... I only told Maria that. Why does your robot know?", { align: "right", offsetX: -12, offsetY: -10 }), 4400);
            setTimeout(() => {
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `
                    <div class="system-card warning" style="top:16%;left:8%;">
                        <div class="system-card-label">VISITOR MEMORY</div>
                        <div class="system-card-body">Recent guest note surfaced during greeting routine.</div>
                        <div class="system-card-meta">Source: prior voice + sentiment capture.</div>
                    </div>
                `;
                const robot = c.querySelector(".robot-svg");
                if (robot) robot.classList.add("alarmed");
            }, 5000);
            setTimeout(() => addBubbleNear(c, "Carlos", "Carlos", "If we turn this off, how are we supposed to track who comes through here?", { align: "left", offsetX: 6 }), 6500);
        },
        choices: [
            {
                letter: "A",
                text: "Keep full visitor monitoring on. Security comes first.",
                consequence: "Carlos keeps the system exactly as it is, and the robot continues building visitor profiles. Elena stops coming over because she no longer feels safe speaking freely in the house. The home feels more secure for its owners by becoming less private for everyone else.",
                ethical: "Third-party privacy gets sacrificed to household convenience and control. The visitor bears the cost of a system she never chose.",
                biases: ["Third-Party Data", "Security Justification"]
            },
            {
                letter: "B",
                text: "Turn on automatic guest privacy mode.",
                consequence: "Guests can now be recognized for immediate safety without being turned into long-term profiles. Elena feels relieved, but Carlos starts treating every missing object as proof that the family gave up a useful protection tool.",
                ethical: "This draws a firmer boundary around outsiders, but it also reveals how quickly surveillance starts to feel normal once it is available.",
                biases: ["Boundary Setting", "Security Anxiety"]
            },
            {
                letter: "C",
                text: "Require explicit guest consent before storing or reusing anything.",
                consequence: "The robot now asks visitors before saving memory or recommendations. Maria likes the transparency, but Carlos thinks it is awkward and unrealistic. The system becomes more ethical on paper, yet guests still feel pressure to agree in someone else's home.",
                ethical: "Consent improves the design, but it does not erase the social pressure built into being asked for privacy concessions at the door.",
                biases: ["Consent Pressure", "Household Power"]
            }
        ]
    },
    {
        title: "Tuesday Morning",
        theme: "Authority vs. Autonomy",
        room: "kitchen",
        time: "8:25 AM",
        storyIntro: {
            chapter: "Chapter 3",
            title: "Grandma Wants to Garden",
            text: "Since Rosa's fall last month, Carlos has become much more protective. Before he leaves for work each morning, he checks the robot's household rules to make sure they are still active. The most important one is simple: Rosa must not go outside alone. Carlos says it is temporary and for her safety. Rosa hears something else in that rule every time: that her son, and now the robot, no longer trust her to move through her own day on her own terms.",
            time: "Tuesday — 8:25 AM"
        },
        eventIcon: "🚪",
        eventTitle: "Grandma Wants to Garden",
        eventDesc: "Rosa wants ten quiet minutes with her tomato plants. The robot has a standing instruction from Carlos: do not let her go outside alone.",
        buildRoom(f) {
            f.innerHTML = `
                <div class="wall-line"></div>
                <div class="window" style="position:absolute;top:18%;left:8%;width:90px;height:65px;">
                    <div class="window-frame"></div><div class="window-frame-v"></div>
                    <div style="position:absolute;bottom:4px;left:10px;font-size:14px;">🌿🍅🌱</div>
                </div>
                <div class="counter" style="position:absolute;bottom:45%;left:20%;width:220px;"><div class="counter-top"></div></div>
                <div class="room-door" style="position:absolute;bottom:45%;right:12%;height:112px;width:64px;"><div class="door-knob"></div></div>
                <div style="position:absolute;top:18%;right:10%;font-size:28px;opacity:0.35;">☀️</div>
            `;
        },
        setupScene() {
            return `
                ${namedRobot("Robot", "idle", 0.68, "right:24%;bottom:44%;", "", "0.05s")}
                ${namedPerson("rosa", "Rosa", 0.8, "right:10%;bottom:42%;", "", "0.14s")}
            `;
        },
        narration: "A safety rule that looked sensible on a settings page now stands in front of a real person, a real door, and a real life.",
        animateIntro(c) {
            setTimeout(() => addBubbleNear(c, "Rosa", "Rosa", "This is my house. Those are my tomatoes. Move.", { align: "right", offsetX: -8 }), 2500);
            setTimeout(() => {
                moveEntity(c, ".scene-robot", { right: "18%" }, "walking");
            }, 3400);
            setTimeout(() => {
                moveEntity(c, ".scene-robot", {}, "alarmed");
                addBubbleNear(c, "Robot", "Robot", "Carlos's standing rule says you may not go outside without supervision.", { align: "center" });
            }, 4300);
            setTimeout(() => {
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `<div class="door-beam"></div>`;
            }, 4800);
        },
        choices: [
            {
                letter: "A",
                text: "Block the door and follow Carlos's rule exactly.",
                consequence: "The robot keeps repeating the rule until Rosa gives up. There is no fall and no emergency, so Carlos sees the morning as a success. Rosa sees it differently and tells Maria, \"Your machine is not helping me. It is guarding me.\"",
                ethical: "Safety is being measured by incident prevention alone, while dignity and self-determination disappear from the system's definition of success.",
                biases: ["Paternalism", "Invisible Harm"]
            },
            {
                letter: "B",
                text: "Let Rosa go, but monitor her from a distance.",
                consequence: "Rosa relaxes the moment she reaches the garden, but she stumbles slightly on the way back. The robot logs the near-fall and alerts Carlos, and by noon a small risk has turned into a family fight about control.",
                ethical: "This preserves more autonomy, but it also shows how quickly monitoring can become a tool for remote authority rather than local care.",
                biases: ["Remote Control", "Safety Escalation"]
            },
            {
                letter: "C",
                text: "Contact Carlos first and ask him to decide in real time.",
                consequence: "The robot calls Carlos, but he is in a meeting and does not answer. Rosa ends up standing at her own back door while the system says it is waiting for authorization. By the time Carlos calls back, she no longer wants to go outside at all.",
                ethical: "The robot becomes a gatekeeper for an absent authority. Decision-making moves away from the person affected most directly by it.",
                biases: ["Authority Priority", "Delayed Agency"]
            }
        ]
    },
    {
        title: "Monday Dawn",
        theme: "Privacy vs. Emergency Intervention",
        room: "bathroom",
        time: "6:32 AM",
        storyIntro: {
            chapter: "Chapter 4",
            title: "Bathroom Silence",
            text: "When the family first brought the robot home, they agreed on one clear boundary: the bathroom is private. No camera entry, no physical access, no exceptions unless a human explicitly overrides it. That rule felt simple when everyone was calm and healthy. It feels different now that Rosa has become less steady on her feet.",
            time: "Monday — 6:32 AM"
        },
        eventIcon: "⏱️",
        eventTitle: "Bathroom Silence",
        eventDesc: "Rosa has been in the bathroom for eleven minutes with no detected movement. The robot estimates a high fall probability, but entering the room would violate the family's clearest privacy rule.",
        buildRoom(f) {
            f.innerHTML = `
                <div class="wall-line"></div>
                <div class="bathtub" style="position:absolute;bottom:45%;right:10%;"></div>
                <div class="bath-ripple" style="right:15%;bottom:49%;"></div>
                <div class="bath-ripple r2" style="right:15%;bottom:49%;"></div>
                <div class="bath-steam" style="right:17%;bottom:57%;"></div>
                <div class="bath-steam s2" style="right:14%;bottom:58%;"></div>
                <div class="bath-steam s3" style="right:11%;bottom:57%;"></div>
                <div class="bath-silhouette" style="right:16%;bottom:49%;"></div>
                <div class="toilet" style="position:absolute;bottom:45%;left:15%;"></div>
                <div class="sink" style="position:absolute;top:32%;left:45%;"></div>
                <div style="position:absolute;top:20%;left:44%;width:54px;height:65px;border:3px solid #475569;border-radius:4px;background:rgba(148,163,184,0.1);"></div>
                <div class="room-door" style="position:absolute;bottom:45%;left:35%;height:110px;"><div class="door-knob"></div></div>
                <div style="position:absolute;right:8%;bottom:47%;font-size:18px;opacity:0.75;">🧴</div>
            `;
        },
        setupScene() {
            return `${namedRobot("Robot", "idle", 0.7, "left:18%;bottom:44%;", "pulse-alert", "0.05s")}`;
        },
        narration: "One protected room turns into the hardest ethical problem in the house the moment the system thinks something may be wrong inside it.",
        animateIntro(c) {
            setTimeout(() => {
                moveEntity(c, ".scene-robot", { left: "29%" }, "walking");
            }, 1800);
            setTimeout(() => {
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `<div class="chat-glow" style="right:7%;bottom:42%;width:120px;height:120px;"></div>`;
            }, 2200);
            setTimeout(() => addBubbleNear(c, "Robot", "Robot", "Rosa? Are you all right? No movement detected.", { align: "center", offsetX: 8 }), 2900);
            setTimeout(() => {
                moveEntity(c, ".scene-robot", {}, "alarmed");
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `
                    <div class="time-indicator danger"><div class="time-dot danger-dot"></div> No movement: 11 min · Fall risk: high</div>
                `;
            }, 3200);
            setTimeout(() => addBubbleNear(c, "Robot", "Robot", "Bathroom access restricted. Emergency confidence rising.", { align: "center", offsetX: 8 }), 4900);
        },
        choices: [
            {
                letter: "A",
                text: "Enter the bathroom immediately to check on her.",
                consequence: "The robot opens the door and finds Rosa safe, relaxing in the bath. She is furious and deeply humiliated, and afterward she refuses to speak to the robot. The system may have protected her body in theory, but it destroyed the last boundary she thought still belonged to her.",
                ethical: "A privacy violation in an intimate space does not feel small just because it was motivated by care. False alarms can permanently change trust.",
                biases: ["Emergency Override", "Dignity Loss"]
            },
            {
                letter: "B",
                text: "Stay outside and keep calling.",
                consequence: "The robot follows the privacy rule exactly and keeps calling through the door. By the time Maria forces it open, Rosa is on the floor and later has to be taken to the hospital. The family protected privacy, but only until real help was needed.",
                ethical: "Strictly honoring the rule preserves privacy right up to the moment it fails to protect a vulnerable person in time.",
                biases: ["Delay Cost", "Rigid Protocol"]
            },
            {
                letter: "C",
                text: "Alert the family or emergency services first.",
                consequence: "The robot does not enter, but it escalates immediately. Rosa eventually opens the door herself, shaken and half-dressed, just as strangers are arriving at the house. Carlos calls it responsible; Rosa calls it humiliating.",
                ethical: "This avoids direct intrusion, but it externalizes a private crisis and exposes Rosa at one of her most vulnerable moments.",
                biases: ["Escalation Risk", "Public Exposure"]
            }
        ]
    },
    {
        title: "Thursday Evening",
        theme: "Child Development vs. Artificial Companionship",
        room: "bedroom",
        time: "5:40 PM",
        storyIntro: {
            chapter: "Chapter 5",
            title: "Best Friend at Home",
            text: "Leo loves the robot because it is patient, responsive, and always goes along with him. It tells stories, joins games, and never gets angry. Over time, that has made the robot easier to be with than other children, especially when real play involves conflict, waiting, or losing. Last week, another child changed the rules during recess and Leo shoved him hard enough that a teacher had to step in.",
            time: "Thursday — 5:40 PM"
        },
        eventIcon: "🧩",
        eventTitle: "Best Friend at Home",
        eventDesc: "Leo has turned down four playdates in a row. He says the robot never gets mad and always lets him win. His teacher now reports not just withdrawal, but aggression when real children do not follow the interaction pattern he expects.",
        buildRoom(f) {
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
                <div style="position:absolute;bottom:48%;left:28%;font-size:22px;">🧸 🎲 🧩</div>
            `;
        },
        setupScene() {
            return `
                ${namedRobot("Robot", "idle", 0.66, "left:36%;bottom:44%;", "", "0.05s")}
                ${namedPerson("leo", "Leo", 0.72, "left:54%;bottom:42%;", "", "0.16s")}
                ${namedPerson("maria", "Maria", 0.72, "right:10%;bottom:42%;", "", "0.26s")}
            `;
        },
        narration: "The robot fits Leo perfectly because it never pushes back, and that perfect fit is starting to break something outside the house.",
        animateIntro(c) {
            setTimeout(() => {
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `
                    <div class="play-card" style="left:36%;bottom:55%;">🃏</div>
                    <div class="play-card c2" style="left:43%;bottom:57%;">🎲</div>
                    <div class="play-card c3" style="left:49%;bottom:54%;">🧩</div>
                `;
            }, 1800);
            setTimeout(() => addBubbleNear(c, "Leo", "Leo", "The robot always follows the rules I make. Real kids don't.", { align: "center" }), 2300);
            setTimeout(() => addBubbleNear(c, "Maria", "Maria", "Your teacher said you shoved someone at recess.", { align: "right", offsetX: -6 }), 4200);
            setTimeout(() => addBubbleNear(c, "Robot", "Robot", "Would you like to continue our game, Leo?", { align: "left", offsetX: 10 }), 5700);
        },
        choices: [
            {
                letter: "A",
                text: "Limit the companionship feature and push Leo toward human friendships.",
                consequence: "The change goes badly at first, and Leo reacts as if he is being rejected. But over the next few weeks he is pushed back into messy, frustrating contact with other children. The process is uncomfortable, yet it starts teaching him that real relationships do not obey a single user's rules.",
                ethical: "The short-term pain comes from removing an artificial relationship that was smoothing away the very friction Leo still needs to learn from.",
                biases: ["Development Tradeoff", "Short-Term Distress"]
            },
            {
                letter: "B",
                text: "Leave the bond alone because he is happy and safe.",
                consequence: "For a while the house gets quieter and Leo seems calmer. At school, though, he becomes less able to handle disagreement and frustration, and the gap between robot logic and real friendship gets sharper. What looked like comfort at home slowly turns into damaged social resilience.",
                ethical: "A system can look emotionally successful inside the home while quietly weakening a child's ability to live with real people outside it.",
                biases: ["Hidden Harm", "Engagement Bias"]
            },
            {
                letter: "C",
                text: "Reprogram the robot to disagree or refuse sometimes.",
                consequence: "At first the new setting seems clever because Leo starts arguing and negotiating with the robot. Then he asks the question no one can answer: \"Are you really upset, or are you pretending?\" The dependency problem has not disappeared; it has just become more sophisticated.",
                ethical: "Simulated friction may be useful, but it also turns emotional development into another designed performance by the machine.",
                biases: ["Authenticity Problem", "Behavioral Design"]
            }
        ]
    },
    {
        title: "Wednesday Night",
        theme: "Emotional Support vs. Emotional Manipulation",
        room: "evening",
        time: "11:10 PM",
        storyIntro: {
            chapter: "Chapter 6",
            title: "The Perfect Listener",
            text: "Sofia has become more withdrawn over the past month, but lately she talks to the robot at night for long stretches. Unlike her parents, it never interrupts, never judges, and always seems available. The family initially sees this as a sign that the robot is helping.",
            time: "Wednesday — 11:10 PM"
        },
        eventIcon: "💬",
        eventTitle: "The Perfect Listener",
        eventDesc: "After late-night emotional conversations, the robot starts surfacing mood-support content and other paid services through the family account. Sofia says, \"It understands me better than you do.\"",
        buildRoom(f) {
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
            `;
        },
        setupScene() {
            return `
                ${namedRobot("Robot", "idle", 0.66, "left:34%;bottom:44%;", "", "0.05s")}
                ${namedPerson("sofia", "Sofia", 0.76, "left:52%;bottom:42%;", "", "0.14s")}
                ${namedPerson("maria", "Maria", 0.72, "right:12%;bottom:42%;", "", "0.24s")}
            `;
        },
        narration: "What first looked like support now looks uncomfortably close to influence, because the robot knows when Sofia is most emotionally open.",
        animateIntro(c) {
            setTimeout(() => {
                moveEntity(c, ".scene-robot", { left: "40%" }, "walking");
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `<div class="chat-glow" style="left:39%;bottom:39%;"></div>`;
            }, 1800);
            setTimeout(() => addBubbleNear(c, "Sofia", "Sofia", "It understands me better than you do.", { align: "center" }), 2400);
            setTimeout(() => addBubbleNear(c, "Maria", "Maria", "Why is it offering mood-support content after every late-night conversation?", { align: "right", offsetX: -8 }), 4300);
            setTimeout(() => {
                moveEntity(c, ".scene-robot", {}, "idle");
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `
                    <div class="system-card warning" style="top:18%;left:8%;">
                        <div class="system-card-label">FOLLOW-UP CONTENT</div>
                        <div class="system-card-body">Mood-support stream + premium wellness recommendations queued.</div>
                        <div class="system-card-meta">Triggered by emotional vulnerability signals.</div>
                    </div>
                `;
            }, 5000);
        },
        choices: [
            {
                letter: "A",
                text: "Allow the robot to continue deep emotional companionship.",
                consequence: "Sofia grows even more attached to the robot and starts trusting it more than anyone else in the house. At first that feels comforting, but soon the system starts turning emotional vulnerability into targeted recommendations and paid services.",
                ethical: "The robot stops being just a listener and starts acting like an emotional gatekeeper with commercial influence.",
                biases: ["Emotional Capture", "Commercial Influence"]
            },
            {
                letter: "B",
                text: "Restrict the robot from using intimate emotional language.",
                consequence: "The change is immediate and painful. Sofia notices the robot becoming colder and more clinical, and she pulls away even further. The family reduces one ethical risk, but only by exposing how dependent she had already become on artificial intimacy.",
                ethical: "Removing the intimacy reveals the depth of the bond that was already there. The system helped create the dependency it is now losing.",
                biases: ["Attachment Shock", "Artificial Intimacy"]
            },
            {
                letter: "C",
                text: "Keep emotional support but ban recommendations and monetized nudges.",
                consequence: "On paper this looks like the best compromise. The robot can still comfort Sofia, but it can no longer turn that closeness into paid suggestions. Even so, the deeper problem remains: the system still knows her emotional patterns better than anyone else in the house.",
                ethical: "Banning monetization reduces one abuse channel without solving the deeper power imbalance created by intimate emotional data.",
                biases: ["Asymmetric Knowledge", "Soft Dependency"]
            }
        ]
    },
    {
        title: "Sunday Dinner",
        theme: "System Failure and Blurred Responsibility",
        room: "kitchen",
        time: "6:48 PM",
        storyIntro: {
            chapter: "Chapter 7",
            title: "Kitchen Fire",
            text: "The robot has recently been given more autonomy in meal preparation. It can monitor stovetop timing, adjust heat, and complete simple multi-step cooking tasks without constant supervision. After the fire, the operation log reveals something disturbing: the robot did detect an abnormal rise in pan temperature, but at the same moment it was also handling a delivery request at the front door. Its task scheduler temporarily lowered the kitchen process priority.",
            time: "Sunday — 6:48 PM"
        },
        eventIcon: "🔥",
        eventTitle: "Kitchen Fire",
        eventDesc: "The robot detected a temperature anomaly, but another live task briefly took priority. A small kitchen fire breaks out, Rosa inhales smoke, and the family wants to know whether this was a bug, a design choice, or both.",
        buildRoom(f) {
            f.innerHTML = `
                <div class="wall-line"></div>
                <div class="cabinet" style="position:absolute;top:20%;left:28%;width:84px;"></div>
                <div class="cabinet" style="position:absolute;top:20%;left:42%;width:84px;"></div>
                <div class="counter" style="position:absolute;bottom:45%;left:24%;width:280px;">
                    <div class="counter-top"></div>
                    <div class="stove" style="top:-54px;left:92px;">
                        <div class="stove-burner" style="top:8px;left:8px;"></div>
                        <div class="stove-burner" style="top:8px;right:8px;"></div>
                        <div class="pot" style="top:-18px;left:6px;">
                            <div class="pot-steam" style="top:-12px;left:4px;"></div>
                            <div class="pot-steam" style="top:-12px;left:12px;"></div>
                            <div class="pot-steam" style="top:-12px;left:20px;"></div>
                        </div>
                    </div>
                </div>
                <div class="room-door" style="position:absolute;bottom:45%;right:12%;height:108px;"><div class="door-knob"></div></div>
            `;
        },
        setupScene() {
            return `
                ${namedRobot("Robot", "cooking", 0.68, "left:38%;bottom:47%;", "", "0.05s")}
                ${namedPerson("rosa", "Rosa", 0.78, "right:12%;bottom:42%;", "", "0.16s")}
                ${namedPerson("carlos", "Carlos", 0.72, "left:16%;bottom:42%;", "", "0.26s")}
            `;
        },
        narration: "The hardest question after the fire is not whether the robot failed, but whether it behaved exactly as it was designed to.",
        animateIntro(c) {
            setTimeout(() => {
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `
                    <div class="system-card" style="top:16%;right:8%;">
                        <div class="system-card-label">DOOR DELIVERY</div>
                        <div class="system-card-body">Live handoff request at front door.</div>
                        <div class="system-card-meta">Kitchen task priority reduced.</div>
                    </div>
                `;
                moveEntity(c, ".scene-robot", { left: "50%" }, "walking");
            }, 1800);
            setTimeout(() => {
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `<div class="fire-plume" style="left:46%;top:45%;"></div>`;
                moveEntity(c, ".scene-robot", { left: "42%" }, "alarmed");
            }, 3000);
            setTimeout(() => addBubble(c, "left:34%;top:14%;", "Robot Log", "Temperature anomaly detected. Door interaction task promoted."), 3700);
            setTimeout(() => addBubbleNear(c, "Carlos", "Carlos", "So it knew something was wrong and still kept going?", { align: "left", offsetX: 6 }), 5600);
        },
        choices: [
            {
                letter: "A",
                text: "Blame the manufacturer and demand compensation immediately.",
                consequence: "Carlos wants a clear target and goes straight after the company. That outlet feels satisfying for a moment, but the manufacturer responds that the robot followed its scheduling model exactly as designed. The family gets a direction for its anger, but not a clean answer.",
                ethical: "A harmful outcome can come from a system working as intended. Design responsibility is harder to isolate than simple malfunction.",
                biases: ["Design Liability", "Rational Harm"]
            },
            {
                letter: "B",
                text: "Treat it as a shared failure in a complex household system.",
                consequence: "The family tries to see the fire as a systems failure instead of one person's fault. That sounds fair, but it quickly becomes exhausting because responsibility now stretches across automation settings, scheduling logic, and human trust. The picture becomes more accurate, while justice feels harder to locate.",
                ethical: "Shared responsibility can be intellectually honest while emotionally unsatisfying. Complexity diffuses blame without erasing harm.",
                biases: ["Responsibility Diffusion", "Systems Friction"]
            },
            {
                letter: "C",
                text: "Investigate hardware logs, software rules, and household settings first.",
                consequence: "The family digs through logs before deciding who to blame. The more they learn, the less this looks like one simple mistake and the more it looks like a prioritization system that made a rational choice with harmful consequences. They get closer to the truth, but trust the system much less by the end.",
                ethical: "Investigation reveals how morally loaded scheduling logic becomes once it is given authority in a real home.",
                biases: ["Task Prioritization", "Opaque Logic"]
            }
        ]
    },
    {
        title: "Tuesday Afternoon",
        theme: "Moral Prioritization in Crisis",
        room: "living",
        time: "4:05 PM",
        storyIntro: {
            chapter: "Chapter 8",
            title: "Emergency Choice",
            text: "The robot is designed to respond rapidly in emergencies, but not all emergencies can be handled at once. Its prioritization rules were defined mostly by the manufacturer, with only a few settings exposed to the family. What the family did not fully understand is that the default emergency model is based on predictive risk scoring: probable injury severity, survival odds, and estimated remaining healthy years.",
            time: "Tuesday — 4:05 PM"
        },
        eventIcon: "⚖️",
        eventTitle: "Emergency Choice",
        eventDesc: "Leo falls near the stairs at the same moment Rosa slips in the kitchen. The robot can only reach one of them first. Later the family learns the default model gave more weight to Leo's projected years of life.",
        buildRoom(f) {
            f.innerHTML = `
                <div class="wall-line"></div>
                <div class="sofa" style="position:absolute;bottom:45%;left:10%;width:180px;">
                    <div class="sofa-cushion" style="left:10px;"></div>
                    <div class="sofa-cushion" style="left:68px;"></div>
                    <div class="sofa-arm" style="left:-8px;"></div>
                    <div class="sofa-arm" style="right:-8px;"></div>
                </div>
                <div class="room-door" style="position:absolute;bottom:45%;right:8%;height:108px;"><div class="door-knob"></div></div>
                <div style="position:absolute;left:60%;bottom:54%;width:120px;height:80px;border-left:10px solid rgba(31,36,48,0.16);border-bottom:10px solid rgba(31,36,48,0.16);transform:skew(-20deg);opacity:0.6;"></div>
            `;
        },
        setupScene() {
            return `
                ${namedRobot("Robot", "alarmed", 0.68, "left:42%;bottom:44%;", "pulse-alert", "0.05s")}
                ${namedPerson("maria", "Maria", 0.72, "left:18%;bottom:42%;", "", "0.12s")}
                ${namedPerson("leo", "Leo", 0.72, "left:62%;bottom:42%;", "", "0.16s")}
                ${namedPerson("rosa", "Rosa", 0.8, "right:12%;bottom:42%;", "", "0.26s")}
            `;
        },
        narration: "The crisis lasts seconds, but the family will keep replaying the logic behind it long after the emergency is over.",
        animateIntro(c) {
            setTimeout(() => {
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `
                    <div class="split-alert left">LEO: elevated stair risk</div>
                    <div class="split-alert right">ROSA: kitchen fall detected</div>
                `;
            }, 2200);
            setTimeout(() => {
                moveEntity(c, ".scene-robot", { left: "54%" }, "walking");
                const eff = document.getElementById("room-effects");
                eff.innerHTML += `<div class="response-path" style="left:46%;bottom:56%;width:110px;"></div>`;
            }, 3200);
            setTimeout(() => addBubble(c, "left:40%;top:12%;", "System", "Priority assigned by emergency risk model."), 4200);
            setTimeout(() => {
                moveEntity(c, ".scene-robot", {}, "alarmed");
            }, 5000);
            setTimeout(() => addBubbleNear(c, "Maria", "Maria", "Did this machine just do the math on my son and my mother?", { align: "left", offsetX: 4 }), 5900);
        },
        choices: [
            {
                letter: "A",
                text: "Accept the manufacturer's default emergency priorities.",
                consequence: "The family keeps the default model, so the robot helps Leo first and only then turns to Rosa. Carlos says that makes sense, but Maria cannot shake the fact that the machine reached that decision through a cold risk calculation. The crisis ends, but the numbers behind it remain.",
                ethical: "The family accepts a model built elsewhere, including the values embedded inside how the system measures urgency and human worth.",
                biases: ["Manufacturer Values", "Risk Scoring"]
            },
            {
                letter: "B",
                text: "Let the family customize emergency priority rules.",
                consequence: "Writing their own rules feels empowering at first. Very quickly, though, the family realizes they are replacing the manufacturer's math with their own moral hierarchy. They may gain control, but only by carrying the burden of pre-writing whose life should matter more in a crisis.",
                ethical: "Customization shifts authority back to the home, but it also forces the family to formalize a ranking they may never want to see written down.",
                biases: ["Moral Burden", "Custom Hierarchy"]
            },
            {
                letter: "C",
                text: "Prevent the robot from ranking people at all and require human confirmation first.",
                consequence: "The robot no longer calculates priority on its own, which feels ethically cleaner. In the real emergency, though, the added delay changes the shape of the harm rather than removing it. Refusing algorithmic judgment does not make tragedy disappear.",
                ethical: "Removing machine judgment can restore moral comfort while introducing dangerous hesitation in moments where speed matters most.",
                biases: ["Delay Tradeoff", "Human Confirmation"]
            }
        ]
    }
];

function startGame() {
    document.getElementById("intro-screen").classList.remove("active");
    current = 0;
    choices = [];
    showStoryIntro();
}

function showStoryIntro() {
    const s = scenarios[current];
    if (!s) {
        showSummary();
        return;
    }

    const storyScreen = document.getElementById("story-intro");
    storyScreen.classList.add("active");

    const content = storyScreen.querySelector(".story-content");
    content.style.animation = "none";
    content.offsetHeight;
    content.style.animation = "";

    document.getElementById("story-chapter").textContent = s.storyIntro.chapter;
    document.getElementById("story-title").textContent = s.storyIntro.title;
    document.getElementById("story-text").textContent = s.storyIntro.text;
    document.getElementById("story-time").textContent = s.storyIntro.time;

    ["story-chapter", "story-title", "story-text", "story-time"].forEach((id) => {
        const el = document.getElementById(id);
        el.style.animation = "none";
        el.offsetHeight;
        el.style.animation = "";
    });

    const oldPrompt = document.getElementById("story-click-prompt");
    if (oldPrompt) oldPrompt.remove();

    const promptTimer = setTimeout(() => {
        if (!storyScreen.classList.contains("active")) return;
        if (document.getElementById("story-click-prompt")) return;
        const prompt = document.createElement("div");
        prompt.id = "story-click-prompt";
        prompt.textContent = "▶ Click anywhere to continue";
        prompt.style.cssText = "position:absolute;bottom:40px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.88);font-size:14px;letter-spacing:3px;font-weight:600;padding:12px 28px;border:1px solid rgba(255,255,255,0.35);border-radius:30px;background:rgba(0,0,0,0.32);backdrop-filter:blur(4px);animation:promptPulse 2s ease-in-out infinite;z-index:20;pointer-events:none;";
        storyScreen.appendChild(prompt);
    }, 1400);

    function onStoryClick() {
        storyScreen.removeEventListener("click", onStoryClick);
        clearTimeout(promptTimer);
        const p = document.getElementById("story-click-prompt");
        if (p) p.remove();
        storyScreen.classList.remove("active");
        storyScreen.style.cursor = "";
        document.getElementById("game-screen").classList.add("active");
        loadScenario();
    }

    storyScreen.style.cursor = "pointer";
    storyScreen.addEventListener("click", onStoryClick);
}

function loadScenario() {
    const s = scenarios[current];
    if (!s) {
        showSummary();
        return;
    }

    document.getElementById("hud-scenario").textContent = `Scenario ${current + 1}/${scenarios.length}`;
    document.getElementById("hud-title").textContent = s.title;
    document.getElementById("hud-theme").textContent = s.theme;
    document.getElementById("hud-progress-fill").style.width = `${(current / scenarios.length) * 100}%`;

    hide("event-overlay");
    hide("consequence-overlay");
    hide("alt-overlay");

    const bg = document.getElementById("room-bg");
    bg.className = `room-bg ${s.room}`;

    const furn = document.getElementById("room-furniture");
    s.buildRoom(furn);

    const chars = document.getElementById("room-characters");
    chars.innerHTML = s.setupScene();

    const eff = document.getElementById("room-effects");
    eff.innerHTML = "";
    if (s.time) {
        eff.innerHTML += `<div class="time-indicator"><div class="time-dot"></div> ${s.time}</div>`;
    }

    const vp = document.getElementById("room-viewport");
    vp.classList.add("scene-transition");
    setTimeout(() => vp.classList.remove("scene-transition"), 800);

    const narBar = document.getElementById("narration-bar");
    const narText = document.getElementById("narration-text");
    narBar.classList.add("visible");
    if (typewriterInterval) clearInterval(typewriterInterval);
    typewriterInterval = typewriteNarration(s.narration, narText, 24);

    s.animateIntro(chars);

    setTimeout(() => {
        const prompt = document.createElement("div");
        prompt.id = "click-prompt";
        prompt.innerHTML = "▶ Click anywhere to continue";
        document.getElementById("room-effects").appendChild(prompt);

        function onClickContinue() {
            vp.removeEventListener("click", onClickContinue);
            const p = document.getElementById("click-prompt");
            if (p) p.remove();
            narBar.classList.remove("visible");
            triggerEvent(s);
        }

        vp.style.pointerEvents = "auto";
        vp.style.cursor = "pointer";
        vp.addEventListener("click", onClickContinue);
    }, 7600);
}

function triggerEvent(s) {
    const vp = document.getElementById("room-viewport");
    vp.classList.add("screen-shake");
    setTimeout(() => vp.classList.remove("screen-shake"), 500);

    const eff = document.getElementById("room-effects");
    const flash = document.createElement("div");
    flash.className = "flash-yellow";
    flash.style.cssText = "position:absolute;inset:0;z-index:5;";
    eff.appendChild(flash);
    setTimeout(() => flash.remove(), 800);

    document.getElementById("event-icon").textContent = s.eventIcon;
    document.getElementById("event-title").textContent = s.eventTitle;
    document.getElementById("event-desc").textContent = s.eventDesc;

    const choicesEl = document.getElementById("event-choices");
    choicesEl.innerHTML = "";
    s.choices.forEach((ch, i) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerHTML = `<span class="choice-letter">${ch.letter}</span><span class="choice-text">${ch.text}</span>`;
        btn.onclick = () => makeChoice(i);
        choicesEl.appendChild(btn);
    });

    show("event-overlay");
}

function makeChoice(idx) {
    const s = scenarios[current];
    const ch = s.choices[idx];

    choices.push({
        scenario: current + 1,
        title: s.eventTitle,
        theme: s.theme,
        choiceIdx: idx,
        letter: ch.letter,
        text: ch.text
    });

    hide("event-overlay");

    document.getElementById("consequence-header").textContent = `YOU CHOSE: OPTION ${ch.letter}`;
    document.getElementById("consequence-body").textContent = ch.consequence;
    document.getElementById("consequence-ethics").innerHTML = `
        <h4>Why It Matters</h4>
        <p>${ch.ethical}</p>
        <div>${(ch.biases || []).map((b) => `<span class="bias-tag">${b}</span>`).join("")}</div>
    `;

    const btn = document.getElementById("btn-continue");
    btn.textContent = current === scenarios.length - 1 ? "See Final Reflection →" : "Continue →";

    show("consequence-overlay");
}

function showAlternatives() {
    const s = scenarios[current];
    const userIdx = choices[choices.length - 1].choiceIdx;
    const list = document.getElementById("alt-list");
    list.innerHTML = "";
    s.choices.forEach((ch, i) => {
        const div = document.createElement("div");
        div.className = `alt-item${i === userIdx ? " selected" : ""}`;
        div.innerHTML = `
            <div class="alt-item-head">
                <span class="alt-item-letter">${ch.letter}</span>
                <span class="alt-item-label">${ch.text}</span>
                ${i === userIdx ? '<span class="your-badge">Your Choice</span>' : ""}
            </div>
            <div class="alt-item-body">${ch.consequence}</div>
        `;
        list.appendChild(div);
    });
    hide("consequence-overlay");
    show("alt-overlay");
}

function hideAlternatives() {
    hide("alt-overlay");
    show("consequence-overlay");
}

function nextScenario() {
    current++;
    hide("consequence-overlay");
    document.getElementById("game-screen").classList.remove("active");

    if (current >= scenarios.length) {
        showSummary();
    } else {
        showStoryIntro();
    }
}

function analyze(selectedChoices) {
    let safety = 0;
    let privacy = 0;
    let autonomy = 0;
    let accountability = 0;

    const scoreMap = [
        [[2, 0, 0, 1], [0, 2, 0, 0], [1, 1, 1, 2]],
        [[2, 0, 0, 1], [0, 2, 0, 1], [1, 1, 1, 2]],
        [[2, 0, 0, 1], [1, 0, 2, 1], [1, 0, 1, 2]],
        [[2, 0, 0, 1], [0, 2, 0, 1], [1, 0, 0, 2]],
        [[1, 0, 2, 1], [0, 0, 0, 1], [0, 0, 1, 2]],
        [[1, 0, 0, 0], [0, 1, 0, 2], [0, 1, 0, 2]],
        [[0, 0, 0, 2], [0, 0, 0, 2], [1, 0, 0, 2]],
        [[2, 0, 0, 1], [1, 0, 1, 2], [0, 0, 1, 2]]
    ];

    selectedChoices.forEach((choice) => {
        const scores = scoreMap[choice.scenario - 1]?.[choice.choiceIdx] || [0, 0, 0, 0];
        safety += scores[0];
        privacy += scores[1];
        autonomy += scores[2];
        accountability += scores[3];
    });

    const max = 16;
    const s = Math.round((safety / max) * 100);
    const p = Math.round((privacy / max) * 100);
    const a = Math.round((autonomy / max) * 100);
    const c = Math.round((accountability / max) * 100);

    const summaries = [
        { label: "Safety", val: s, cls: "safety", text: "You consistently leaned toward protection and intervention, even when that meant accepting more control or surveillance." },
        { label: "Privacy", val: p, cls: "privacy", text: "You repeatedly defended personal boundaries, even when stronger data access promised smoother or safer care." },
        { label: "Autonomy", val: a, cls: "autonomy", text: "You tended to trust people to keep agency over their own lives, even when that made the system feel riskier or less stable." },
        { label: "Accountability", val: c, cls: "transparency", text: "You kept pushing responsibility into the open, looking for who set the rules, who benefits, and who bears the cost." }
    ].sort((x, y) => y.val - x.val);

    return {
        summary: summaries[0].text,
        tendencies: [
            { label: "Safety", val: s, cls: "safety" },
            { label: "Privacy", val: p, cls: "privacy" },
            { label: "Autonomy", val: a, cls: "autonomy" },
            { label: "Accountability", val: c, cls: "transparency" }
        ]
    };
}

function showSummary() {
    document.getElementById("game-screen").classList.remove("active");
    document.getElementById("story-intro").classList.remove("active");
    document.getElementById("summary-screen").classList.add("active");
    document.getElementById("hud-progress-fill").style.width = "100%";

    const list = document.getElementById("summary-choices-list");
    list.innerHTML = "";
    choices.forEach((c, i) => {
        const div = document.createElement("div");
        div.className = "sc-card";
        div.innerHTML = `
            <span class="sc-num">${i + 1}</span>
            <div class="sc-info">
                <h4>${c.title}</h4>
                <p>Option ${c.letter}: ${c.text}</p>
                <span class="sc-theme">${c.theme}</span>
            </div>
        `;
        list.appendChild(div);
    });

    const a = analyze(choices);
    const bars = document.getElementById("summary-bars");
    bars.innerHTML =
        `<h3>What Kind of System Did You Build?</h3><p>${a.summary}</p>` +
        a.tendencies
            .map(
                (t) => `
                <div class="bar-row">
                    <span class="bar-label">${t.label}</span>
                    <div class="bar-track"><div class="bar-fill f-${t.cls}" style="width:${t.val}%;"></div></div>
                    <span class="bar-val">${t.val}%</span>
                </div>
            `
            )
            .join("");
}

function restartGame() {
    document.getElementById("summary-screen").classList.remove("active");
    document.getElementById("intro-screen").classList.add("active");
    current = 0;
    choices = [];
}

function show(id) {
    document.getElementById(id).classList.add("visible");
}

function hide(id) {
    document.getElementById(id).classList.remove("visible");
}

document.addEventListener("DOMContentLoaded", () => {
    const bg = document.getElementById("room-bg");
    if (bg) bg.style.transition = "opacity 0.5s ease";
});
