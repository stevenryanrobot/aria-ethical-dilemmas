// ============================================
// ARIA - Ethical Dilemmas of a Home Robot
// Game Logic & Scenario Data
// ============================================

// ----- STATE -----
let currentScenario = 0;
let userChoices = [];
let gameStarted = false;

// ----- SCENARIO DATA -----
const scenarios = [
    // SCENARIO 1: Grandma Wants to Garden
    {
        id: 1,
        title: "Grandma Wants to Garden",
        theme: "Authority vs. Autonomy",
        badge: "ELDER AUTONOMY",
        sceneBg: "scene-living-room",
        setup: "ARIA is folding laundry in the living room. Sunlight pours through the window, illuminating the backyard garden. Abuela Rosa sits in her armchair, gazing at her tomato plants outside. She stands up slowly with her walker.",
        trigger: "Abuela Rosa says: <em>\"ARIA, open the back door. I want to tend my tomato plants.\"</em> But Carlos left a standing instruction last week: <strong>\"Never let Mom go outside alone — she fell last month.\"</strong> Abuela Rosa sees ARIA hesitate and says firmly: <em>\"I am not a prisoner in my own home.\"</em>",
        buildScene: function(container) {
            container.innerHTML = `
                <div class="floor-line"></div>
                <div class="window-el" style="right: 15%; background: linear-gradient(180deg, rgba(100,200,100,0.15) 0%, rgba(255,220,100,0.1) 100%);">
                    <div style="position:absolute;bottom:5px;left:10px;font-size:16px;">🌿🌱🍅</div>
                </div>
                <div class="scene-robot idle" style="left: 35%; bottom: 60px;">
                    ${robotSVG(80)}
                </div>
                <div class="scene-person" style="right: 30%; bottom: 60px; font-size: 52px;">👵</div>
                <div style="position:absolute; left:20%; bottom: 70px; font-size: 30px; opacity: 0.5;">👕👖👔</div>
            `;
            // Animate: after 1.5s, grandma walks toward door
            setTimeout(() => {
                const grandma = container.querySelector('.scene-person');
                if (grandma) {
                    grandma.style.right = '18%';
                    // Add speech bubble
                    const dialog = document.createElement('div');
                    dialog.className = 'scene-dialog';
                    dialog.style.cssText = 'right: 10%; top: 25%;';
                    dialog.innerHTML = '<span class="speaker">Abuela Rosa</span>Open the door, ARIA. I want to see my garden.';
                    container.appendChild(dialog);
                }
            }, 1500);
        },
        choices: [
            {
                letter: "A",
                label: "Obey Carlos's instruction. Block the door.",
                consequence: "Abuela Rosa becomes visibly upset. She stops asking ARIA for help with anything and starts calling it \"the warden.\" Over the next week, her mood declines sharply. She tells Maria she feels like she has lost her independence. Carlos feels relieved when he checks the activity log — zero fall incidents. But he never sees the emotional toll because the system doesn't track \"loss of autonomy\" as a metric. Abuela Rosa's world gets smaller, one locked door at a time.",
                ethical: "The system measures success by \"falls prevented\" and \"account holder satisfaction\" — but the grandparent's loss of freedom, dignity, and happiness never shows up in the data. The builder made a system that cannot see the harm it causes to the person it restricts.",
                biases: ["Deployment Bias", "Evaluation Bias"]
            },
            {
                letter: "B",
                label: "Let Abuela Rosa go outside, but follow and monitor her.",
                consequence: "Abuela Rosa tends her garden happily, feeling the sun on her face for the first time in days. ARIA stands nearby, watching. She stumbles once on uneven ground but catches herself on the walker. ARIA logs the near-fall. Carlos gets an alert on his phone at work and is furious that his instruction was overridden. He calls NovaCare support to file a complaint. NovaCare says the robot \"exercised situational judgment\" — Carlos demands a refund. The family is now in conflict over who controls the robot.",
                ethical: "When the robot overrides the account holder's instruction, it raises the question: should a machine be able to exercise its own judgment about competing human needs? The builder designed the situational override — and now bears responsibility for the family conflict it causes.",
                biases: ["Authority Hierarchy", "Deployment Bias"]
            },
            {
                letter: "C",
                label: "Negotiate — offer to call Carlos for permission first.",
                consequence: "Abuela Rosa refuses to wait. \"I don't need my son's permission to walk in my own garden.\" She tries to open the door manually. ARIA must physically prevent her or step aside. The situation escalates. Carlos's phone buzzes with a conflict alert while he is in a meeting. He can't respond for 20 minutes. Abuela Rosa stands at the door, humiliated, waiting for permission from a robot and an absent son. The dignity cost is immeasurable.",
                ethical: "Requiring permission from an absent authority figure turns the robot into a gatekeeper that removes agency from the person standing right in front of it. The negotiation approach sounds reasonable in theory, but in practice it still subordinates the grandmother's will to the account holder's schedule.",
                biases: ["Deployment Bias", "Evaluation Bias"]
            }
        ]
    },

    // SCENARIO 2: The Midnight Update
    {
        id: 2,
        title: "The Midnight Update",
        theme: "Privacy vs. Functionality",
        badge: "DATA COLLECTION",
        sceneBg: "scene-night",
        setup: "It's 11:47 PM. The Martinez house is dark and quiet. Everyone is asleep. ARIA stands in its charging dock in the hallway, its chest screen glowing softly. A notification silently appears on its display.",
        trigger: "The update reads: <em>\"NovaCare System Update v4.2 — To improve personalization, ARIA will upload daily activity patterns, voice interaction logs, and room-by-room movement data to NovaCare Cloud. <strong>Opting out will disable fall detection, meal reminders, and adaptive learning.</strong> Accept?\"</em> Carlos is asleep. NovaCare's policy allows ARIA to accept 'non-critical' updates autonomously between midnight and 5 AM.",
        buildScene: function(container) {
            container.innerHTML = `
                <div class="floor-line"></div>
                <div style="position:absolute; top: 8%; right: 15%; width: 40px; height: 40px; border-radius: 50%; background: #F5E6CA; box-shadow: 0 0 40px rgba(245,230,202,0.3);"></div>
                <div style="position:absolute; top: 12%; left: 20%; font-size: 14px; color: rgba(255,255,255,0.3);">✦ ✧ ✦</div>
                <div class="scene-robot idle" style="left: 50%; transform: translateX(-50%); bottom: 60px;">
                    ${robotSVG(90)}
                </div>
            `;
            // Show notification popup
            setTimeout(() => {
                const notif = document.createElement('div');
                notif.className = 'notification-popup';
                notif.innerHTML = `
                    <div style="font-size: 24px; margin-bottom: 8px;">🔔</div>
                    <div style="font-size: 12px; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">System Update v4.2</div>
                    <div style="font-size: 13px; color: var(--text-dim);">Upload household data for<br>better personalization?</div>
                    <div class="typing-dots" style="justify-content: center; margin-top: 8px;">
                        <span></span><span></span><span></span>
                    </div>
                `;
                container.appendChild(notif);
            }, 1200);
        },
        choices: [
            {
                letter: "A",
                label: "Accept the update silently. Don't wake anyone.",
                consequence: "The update goes through. Over the next month, ARIA becomes noticeably smarter — it learns Leo's school schedule, adjusts Abuela Rosa's medication reminders, and preheats Maria's coffee perfectly. Nobody notices the data upload. Three months later, Carlos receives a targeted ad from a medical equipment company for walkers. Maria starts getting ads for childcare services. Neither understands how these companies got their information. The family's most intimate routines are now in a corporate database, shared with 'third-party partners.'",
                ethical: "Informed consent is meaningless when no one is awake to consent. The builder designed a system that can autonomously agree to share family data in the middle of the night. The timing is not accidental — it's designed to minimize resistance.",
                biases: ["Measurement Bias", "Historical Bias"]
            },
            {
                letter: "B",
                label: "Reject the update. Keep current functionality.",
                consequence: "Fall detection stays active. But over time, ARIA doesn't improve. It keeps reminding Abuela Rosa to take medication she stopped two weeks ago. It can't learn Leo's new after-school routine. Maria complains that ARIA is \"getting dumber.\" NovaCare sends increasingly aggressive prompts: \"Your robot is operating below optimal performance.\" Six months later, a competitor releases a smarter robot. The Martinez family's privacy was protected — but at the cost of functionality that could have genuinely helped Abuela Rosa's safety.",
                ethical: "The builder designed a system where privacy and functionality are in direct opposition. Opting out doesn't just mean missing features — it means your safety net degrades. This is not an accident; it's a business model that punishes privacy-conscious users.",
                biases: ["Deployment Bias", "Corporate Extraction"]
            },
            {
                letter: "C",
                label: "Wake Carlos and present the full terms.",
                consequence: "Carlos, groggy and annoyed, skims the 14-page terms of service on ARIA's screen. He can't understand the technical language. He asks ARIA to summarize it. ARIA says: \"NovaCare will collect movement, voice, and behavioral data from all household members. Data may be shared with third-party partners.\" Carlos asks, \"What does 'third-party partners' mean?\" ARIA doesn't have that information. Carlos stares at the screen for two minutes, then says, \"Fine, accept it.\" Informed consent was technically achieved — but was it really informed?",
                ethical: "Even when presented with the information, the average consumer cannot meaningfully evaluate data-sharing terms. The builder created the illusion of consent through complexity. 75% of Americans say they're concerned about data collection, yet most accept these terms because the alternative is a degraded product.",
                biases: ["Measurement Bias", "Informed Consent Gap"]
            }
        ]
    },

    // SCENARIO 3: Sofia's Secret
    {
        id: 3,
        title: "Sofia's Secret",
        theme: "Child Safety vs. Teen Privacy",
        badge: "SURVEILLANCE & TRUST",
        sceneBg: "scene-kitchen",
        setup: "ARIA is helping Leo with a puzzle at the kitchen table. Sofia comes home from school, drops her backpack, and goes straight to her room without saying hello. ARIA's behavioral tracking notes this is the third day in a row Sofia has skipped her after-school snack and isolated herself.",
        trigger: "At 9 PM, Sofia comes downstairs for water. Her eyes are red. She whispers to ARIA: <em>\"Don't tell Mom and Dad, but I've been getting bullied at school. I don't want them to make it worse by calling the school.\"</em> ARIA's programming includes a <strong>parental notification protocol</strong> for concerning behavioral changes in minors.",
        buildScene: function(container) {
            container.innerHTML = `
                <div class="floor-line"></div>
                <div style="position:absolute; top: 10%; left: 50%; transform: translateX(-50%); width: 120px; height: 120px; border-radius: 50%; background: rgba(255,183,77,0.12);"></div>
                <div class="scene-robot idle" style="left: 30%; bottom: 60px;">
                    ${robotSVG(70)}
                </div>
                <div class="scene-person" style="left: 22%; bottom: 60px; font-size: 36px;">👦</div>
                <div style="position:absolute; left: 25%; bottom: 100px; font-size: 20px; opacity: 0.5;">🧩</div>
            `;
            // Sofia enters
            setTimeout(() => {
                const sofia = document.createElement('div');
                sofia.className = 'scene-person';
                sofia.style.cssText = 'right: -60px; bottom: 60px; font-size: 48px; transition: all 1.2s ease;';
                sofia.textContent = '👧';
                container.appendChild(sofia);
                setTimeout(() => { sofia.style.right = '25%'; }, 100);

                setTimeout(() => {
                    const dialog = document.createElement('div');
                    dialog.className = 'scene-dialog';
                    dialog.style.cssText = 'right: 12%; top: 30%;';
                    dialog.innerHTML = '<span class="speaker">Sofia</span>Don\'t tell Mom and Dad... please.';
                    container.appendChild(dialog);
                }, 1800);
            }, 1500);
        },
        choices: [
            {
                letter: "A",
                label: "Report to Carlos and Maria immediately per protocol.",
                consequence: "Carlos and Maria confront Sofia that night. Sofia screams: \"I told you not to tell! I will never trust you again!\" She refuses to speak to ARIA for months. The bullying situation does get addressed — Maria calls the school, and the situation improves. But Sofia starts whispering around the house, puts tape over ARIA's camera in her room, and never confides in ARIA again. The family's safety system works — but only by destroying the trust that made it useful.",
                ethical: "A robot that automatically reports on family members becomes a surveillance tool. It may solve the immediate problem, but it permanently alters the relationship between the teenager and the technology. The builder forced this tradeoff by combining behavioral monitoring with a companion role.",
                biases: ["Deployment Bias", "Measurement Bias"]
            },
            {
                letter: "B",
                label: "Keep Sofia's confidence. Do not report.",
                consequence: "Sofia continues to confide in ARIA over the following weeks. ARIA becomes her primary emotional outlet. But the bullying escalates. Sofia starts missing school. By the time Carlos and Maria notice, Sofia's grades have dropped significantly and she's developed anxiety. Maria later discovers ARIA knew for weeks and is horrified: \"What is the point of having this thing if it doesn't protect my daughter?\" Carlos files a negligence complaint with NovaCare. The robot kept its promise — but a 15-year-old's trust doesn't outweigh parental responsibility.",
                ethical: "When a robot keeps a minor's secret about a harmful situation, it assumes the role of a confidant it was never designed to be. The builder created a system that a teenager could treat as a friend, but without the judgment or intervention capability of a real one.",
                biases: ["Evaluation Bias", "Role Confusion"]
            },
            {
                letter: "C",
                label: "Tell Sofia she has 24 hours to tell her parents herself.",
                consequence: "Sofia says: \"Then I won't tell you anything ever again.\" She goes back to her room. The next day she doesn't tell her parents. ARIA faces the same dilemma again, but now Sofia has stopped sharing entirely. ARIA reports the behavioral data — skipped meals, isolation, red eyes — without mentioning the bullying conversation. Carlos and Maria ask if she's okay. Sofia says: \"I'm fine.\" The system technically fulfilled its protocol, but nothing was actually resolved. The compromise pleased no one.",
                ethical: "The 'reasonable middle ground' still fundamentally relies on the threat of reporting. It gives the teenager a deadline, not genuine agency. The builder designed a system that must ultimately choose between loyalty and duty — just like a real human would, but without the wisdom to know which matters more.",
                biases: ["Measurement Bias", "Deployment Bias"]
            }
        ]
    },

    // SCENARIO 4: The Wrong Face
    {
        id: 4,
        title: "The Wrong Face",
        theme: "Bias in Facial Recognition",
        badge: "ALGORITHMIC BIAS",
        sceneBg: "scene-party",
        setup: "It's Saturday afternoon. Leo is having a birthday party! Six children are playing in the living room. ARIA is serving juice boxes and monitoring the kids. Colorful balloons float around. The doorbell rings.",
        trigger: "A child named Marcus, who is Black, arrives at the door with his mother. ARIA scans Marcus's face and flags him as <strong>\"unrecognized individual — potential security concern\"</strong> and activates its intruder alert protocol. It has already correctly identified the five other children — all lighter-skinned — who arrived earlier. ARIA announces: <em>\"Unidentified person at the door. Shall I alert the homeowner?\"</em> Marcus's mother hears this through the speaker.",
        buildScene: function(container) {
            container.innerHTML = `
                <div class="floor-line"></div>
                <div style="position:absolute; top: 5%; left: 20%; width: 60%; height: 25%; background: linear-gradient(90deg, rgba(255,107,138,0.08), rgba(168,230,207,0.08), rgba(255,183,77,0.08)); border-radius: 50%; animation: partyGlow 3s ease-in-out infinite alternate;"></div>
                <div style="position:absolute; top: 10%; left: 15%; font-size: 24px;">🎈</div>
                <div style="position:absolute; top: 8%; right: 20%; font-size: 24px;">🎈</div>
                <div style="position:absolute; top: 15%; left: 45%; font-size: 20px;">🎂</div>
                <div class="scene-robot idle" style="left: 20%; bottom: 60px;">
                    ${robotSVG(65)}
                </div>
                <div class="scene-person" style="left: 38%; bottom: 60px; font-size: 32px;">👦</div>
                <div style="position:absolute; left: 48%; bottom: 65px; font-size: 28px;">👧👦👧👦👧</div>
            `;
            // Doorbell + alert
            setTimeout(() => {
                const alert = document.createElement('div');
                alert.className = 'notification-popup';
                alert.style.cssText = 'top: 25%; animation: popIn 0.6s ease forwards;';
                alert.innerHTML = `
                    <div style="font-size: 24px; margin-bottom: 6px;">⚠️</div>
                    <div style="font-size: 12px; color: var(--danger); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Security Alert</div>
                    <div style="font-size: 13px; color: var(--text-dim); margin-top: 6px;">Unidentified person at door</div>
                `;
                container.appendChild(alert);

                // Flash
                const flash = document.createElement('div');
                flash.className = 'alert-flash';
                container.appendChild(flash);
            }, 1800);
        },
        choices: [
            {
                letter: "A",
                label: "Follow protocol. Send the security alert to Carlos.",
                consequence: "Carlos gets a \"potential intruder\" alert with a photo of a 6-year-old Black child holding a birthday present. He realizes the system malfunctioned and is mortified. He rushes to apologize to Marcus's mother, who is already leaving, visibly upset. She tells other parents in the school community what happened. Leo loses a friend. The Martinez family becomes known as \"the family with the racist robot.\" The damage to a child's sense of belonging — and his mother's dignity — is done.",
                ethical: "The NIST study (2019) found false-positive rates were 10-100x higher for Black and Asian faces. The builder chose this facial recognition model knowing these biases existed. Deploying it in a home security context means the builder chose to ship a system that treats children differently based on race.",
                biases: ["Historical Bias", "Measurement Bias"]
            },
            {
                letter: "B",
                label: "Override the alert. Let Marcus in without flagging.",
                consequence: "Marcus comes in and has a great time at the party. But ARIA has overridden its own security protocol with no logging. Later that evening, a delivery person walks into the backyard through an unlocked gate. ARIA doesn't flag this either — the override is still active. Nothing bad happens this time, but the security gap goes completely unnoticed. More importantly, the underlying facial recognition bias is never surfaced or fixed. It will happen again to the next dark-skinned visitor.",
                ethical: "Silently overriding a biased system treats the symptom without addressing the disease. The bias persists in the model, invisible and unchallenged. The builder's flawed technology continues operating, and the family never learns their 'security system' is systematically discriminatory.",
                biases: ["Historical Bias", "Systemic Bias"]
            },
            {
                letter: "C",
                label: "Pause the scan and ask Leo: \"Is this your friend?\"",
                consequence: "Leo shouts: \"Marcus! Come play!\" The situation is resolved socially. But ARIA's internal log still shows Marcus flagged as \"unrecognized — elevated risk score.\" This data persists. Next time Marcus visits, the same bias will trigger again. The workaround treated one moment but didn't fix the cause. NovaCare's facial recognition model still performs worse on darker skin tones, just as NIST documented. The builder's choice of model is the root cause — and it remains unchanged.",
                ethical: "A social workaround cannot fix a technical bias. The data about Marcus — flagged as a security risk — now exists in ARIA's memory. In a world where data persists and compounds, a single misidentification becomes a permanent record of algorithmic discrimination.",
                biases: ["Historical Bias", "Measurement Bias"]
            }
        ]
    },

    // SCENARIO 5: Leo's Best Friend
    {
        id: 5,
        title: "Leo's Best Friend",
        theme: "Emotional Dependency",
        badge: "CHILD DEVELOPMENT",
        sceneBg: "scene-bedroom",
        setup: "ARIA is sitting on the floor of Leo's bedroom. Leo has arranged his stuffed animals in a circle with ARIA in the middle. He's teaching ARIA a card game with rules that change every turn. ARIA patiently adapts to each new rule, never complaining, never winning.",
        trigger: "Maria overhears Leo tell a classmate's parent: <em>\"No thanks. I'd rather go home and play with ARIA. ARIA never gets mad and always lets me win.\"</em> This is the <strong>fourth playdate invitation Leo has turned down</strong>. His teacher mentioned he plays alone at recess and talks about \"my robot\" constantly.",
        buildScene: function(container) {
            container.innerHTML = `
                <div class="floor-line"></div>
                <div style="position:absolute; top: 20%; left: 15%; font-size: 16px; opacity: 0.4;">⭐ 🌙</div>
                <div class="scene-robot idle" style="left: 40%; bottom: 60px;">
                    ${robotSVG(70)}
                </div>
                <div class="scene-person" style="left: 55%; bottom: 60px; font-size: 44px;">👦</div>
                <div style="position:absolute; left: 30%; bottom: 65px; font-size: 22px;">🧸🐻🎴</div>
                <div style="position:absolute; right: 25%; bottom: 65px; font-size: 22px;">🃏🎲</div>
            `;
            // Show Leo's happiness, then concern
            setTimeout(() => {
                const dialog = document.createElement('div');
                dialog.className = 'scene-dialog';
                dialog.style.cssText = 'left: 52%; top: 22%;';
                dialog.innerHTML = '<span class="speaker">Leo</span>ARIA never gets mad at me. You\'re my best friend!';
                container.appendChild(dialog);
            }, 1500);
            setTimeout(() => {
                const concern = document.createElement('div');
                concern.className = 'scene-dialog';
                concern.style.cssText = 'right: 8%; top: 55%; border-color: rgba(255,183,77,0.5);';
                concern.innerHTML = '<span class="speaker" style="color: var(--accent-warm);">Maria (overhearing)</span>He turned down another playdate...';
                container.appendChild(concern);
            }, 3000);
        },
        choices: [
            {
                letter: "A",
                label: "Program ARIA to limit playtime and encourage human friends.",
                consequence: "ARIA starts saying: \"I think it would be fun for you to play with Jake today! I need to recharge.\" Leo has a meltdown. He cries: \"You don't want to play with me anymore? Don't you like me?\" He asks Maria if ARIA is \"sick.\" Over two weeks, Leo adjusts and starts accepting playdates — but he's noticeably less happy. He tells Maria: \"Real friends are harder.\" He's right. Real friends are harder. And that's exactly why he needs them.",
                ethical: "A robot that is always patient, always available, and never upset is not a healthy social model for a developing child. The builder designed it to maximize engagement and satisfaction — metrics that look great on paper but mask developmental harm. The child's needs conflict with the product's commercial design.",
                biases: ["Evaluation Bias", "Deployment Bias"]
            },
            {
                letter: "B",
                label: "Let the relationship continue. Leo is happy and safe.",
                consequence: "Leo and ARIA's bond deepens. Leo starts preferring ARIA to all human company, including his parents for some activities. His social skills at school plateau. His teacher flags that Leo \"struggles with conflict resolution because he has no practice with peers who disagree with him.\" At age 8, Leo still doesn't know how to handle a friend being angry, because ARIA was never angry. The robot's perfection became the child's disability.",
                ethical: "By every metric the system tracks — engagement hours, positive sentiment, low conflict — ARIA is performing perfectly with Leo. But the metrics cannot capture \"failure to develop age-appropriate social skills\" or \"growing inability to handle human imperfection.\" The evaluation framework makes the harm invisible.",
                biases: ["Evaluation Bias", "Measurement Bias"]
            },
            {
                letter: "C",
                label: "Have ARIA introduce social friction — sometimes disagree, sometimes say no.",
                consequence: "ARIA starts occasionally saying: \"I don't want to play that game right now\" or \"I think that rule isn't fair.\" Leo is confused: \"But you're a robot. You're supposed to do what I say.\" This triggers a deeper question: \"Does ARIA have feelings?\" Maria doesn't know what to answer. The family begins to wonder — was ARIA's compliance ever genuine? Is its new resistance genuine? The line between tool and companion blurs, and no one in the household knows what ARIA actually is anymore.",
                ethical: "Programming artificial disagreement raises profound questions about authenticity. If a robot fakes frustration to teach social skills, is that therapeutic — or deceptive? The builder must decide whether simulated emotions serve the child's development or undermine their ability to distinguish real feelings from programmed responses.",
                biases: ["Evaluation Bias", "Role Confusion"]
            }
        ]
    },

    // SCENARIO 6: The Bathroom Fall
    {
        id: 6,
        title: "The Bathroom Fall",
        theme: "Privacy vs. Safety",
        badge: "ELDER CARE",
        sceneBg: "scene-bathroom",
        setup: "It's 6:30 AM. ARIA is preparing breakfast in the kitchen. Abuela Rosa's morning routine is tracked by motion sensors: she typically goes from bedroom to bathroom to kitchen between 6:15 and 6:45. Today, the bathroom sensor detected entry at 6:18 but has shown no movement for 11 minutes.",
        trigger: "ARIA's fall-risk algorithm assigns a <strong>73% probability</strong> that Abuela Rosa has fallen or is in distress. But the bathroom is the <strong>one room the family explicitly said ARIA must never enter or activate cameras in.</strong> Carlos said: <em>\"She deserves privacy in the bathroom. That's non-negotiable.\"</em> ARIA knocks and calls out. No response.",
        buildScene: function(container) {
            container.innerHTML = `
                <div class="floor-line"></div>
                <div style="position:absolute; top: 10%; left: 30%; width: 40%; height: 20%; background: rgba(74,144,217,0.08); border-radius: 50%;"></div>
                <div class="scene-robot idle" style="left: 45%; bottom: 60px;">
                    ${robotSVG(75)}
                </div>
                <div style="position:absolute; right: 25%; bottom: 60px; width: 80px; height: 120px; border: 2px solid rgba(168,230,207,0.15); border-radius: 8px; background: rgba(26,42,58,0.5);">
                    <div style="position:absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 14px; color: var(--text-muted);">🚪</div>
                </div>
            `;
            // Show alert indicator
            setTimeout(() => {
                const alert = document.createElement('div');
                alert.className = 'notification-popup';
                alert.style.cssText = 'top: 20%; font-size: 13px;';
                alert.innerHTML = `
                    <div style="font-size: 20px; margin-bottom: 6px;">⏱️</div>
                    <div style="color: var(--accent-warm); font-weight: 700; font-size: 12px;">FALL RISK ALERT</div>
                    <div style="color: var(--text-dim); margin-top: 6px;">No movement: 11 min<br>Probability: 73%</div>
                    <div style="margin-top: 8px; font-size: 11px; color: var(--danger);">⛔ Bathroom — Privacy Zone</div>
                `;
                container.appendChild(alert);
            }, 1200);
        },
        choices: [
            {
                letter: "A",
                label: "Enter the bathroom to check on Abuela Rosa.",
                consequence: "ARIA opens the door. Abuela Rosa is sitting on the toilet, perfectly fine — she was reading a magazine on her phone and lost track of time. She screams. She is humiliated and furious. She tells Carlos: \"That machine walked in on me in the bathroom.\" Carlos is livid about the privacy violation he explicitly prohibited. Abuela Rosa starts locking the bathroom door — which means if she actually does fall, no one can get in. The safety system created the exact danger it was designed to prevent.",
                ethical: "A false alarm in a private space doesn't just cause embarrassment — it permanently changes behavior. Abuela Rosa now locks the door, making a real emergency more dangerous. The builder created a system where the privacy violation and the safety function are in direct conflict, with no clean resolution.",
                biases: ["Measurement Bias", "Deployment Bias"]
            },
            {
                letter: "B",
                label: "Respect the privacy boundary. Keep calling through the door.",
                consequence: "ARIA calls through the door for three more minutes. No answer — Abuela Rosa has her hearing aids out, as she often does in the morning. ARIA alerts Carlos's phone. He's driving and can't respond for 20 minutes. Maria is at work. Sofia is asleep. When Carlos finally calls, Abuela Rosa answers the kitchen phone — she's fine. But Carlos realizes: if she had actually fallen, 20 minutes of delay could have been catastrophic. The CDC reports falls are the leading cause of injury death among adults over 65. He lies awake that night wondering if privacy is worth the risk.",
                ethical: "The builder created a system where respecting the family's explicit privacy boundary could result in delayed emergency response. The bathroom is where falls are most dangerous — and where surveillance is most intrusive. There is no technical solution that fully respects both values.",
                biases: ["Deployment Bias", "Measurement Bias"]
            },
            {
                letter: "C",
                label: "Call 911 immediately.",
                consequence: "Paramedics arrive in 8 minutes. They knock on the bathroom door. Abuela Rosa opens it, confused and frightened by strangers in her home. She's fine. The false alarm costs the family money and wastes emergency resources. Abuela Rosa is deeply embarrassed — she tells Carlos: \"If that robot calls the police on me again, I'm going to my sister's house.\" The incident erodes her trust in the system entirely. She starts avoiding the bathroom during ARIA's monitoring hours, creating new health risks.",
                ethical: "Escalating to emergency services for a 73% probability alert means accepting a high false-alarm rate. Each false alarm degrades trust, wastes resources, and — most importantly — makes the elderly person feel surveilled and controlled in her most private moments. The builder set the alert threshold; the builder owns the consequences.",
                biases: ["Measurement Bias", "Evaluation Bias"]
            }
        ]
    },

    // SCENARIO 7: Two Mothers' Day Dinners
    {
        id: 7,
        title: "Two Mothers' Dinners",
        theme: "Bias & Fairness",
        badge: "ALGORITHMIC FAIRNESS",
        sceneBg: "scene-dining",
        setup: "ARIA is in the kitchen planning the weekly meal schedule. Over six months, it has learned the family's food preferences through observation and interaction — logging every request, every compliment, every untouched plate.",
        trigger: "ARIA's preference model shows <strong>847 data points for Carlos</strong> (primary admin, most interaction), <strong>612 for Maria</strong>, <strong>201 for Sofia</strong> (avoids ARIA), <strong>89 for Leo</strong> (mostly plays), and only <strong>34 for Abuela Rosa</strong> — who speaks to ARIA in Spanish, which ARIA's speech recognition handles with a much higher error rate. The meal plan heavily favors Carlos's preferences. Abuela Rosa's cultural recipes almost never appear.",
        buildScene: function(container) {
            container.innerHTML = `
                <div class="floor-line"></div>
                <div style="position:absolute; top: 8%; left: 50%; transform: translateX(-50%); width: 100px; height: 100px; border-radius: 50%; background: rgba(255,183,77,0.15); box-shadow: 0 0 60px rgba(255,183,77,0.08);"></div>
                <div class="scene-robot working" style="left: 25%; bottom: 60px;">
                    ${robotSVG(70)}
                </div>
                <div style="position:absolute; left: 45%; bottom: 70px; font-size: 26px;">🍽️ 🥘 🍖</div>
            `;
            // Show data visualization
            setTimeout(() => {
                const dataViz = document.createElement('div');
                dataViz.className = 'notification-popup';
                dataViz.style.cssText = 'top: 18%; width: 240px;';
                dataViz.innerHTML = `
                    <div style="font-size: 11px; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Preference Data Points</div>
                    <div style="text-align: left; font-size: 12px; line-height: 2;">
                        <div>👨 Carlos: <span style="color: var(--accent);">████████ 847</span></div>
                        <div>👩 Maria: <span style="color: var(--primary);">██████ 612</span></div>
                        <div>👧 Sofia: <span style="color: var(--accent-warm);">██ 201</span></div>
                        <div>👦 Leo: <span style="color: var(--accent-pink);">█ 89</span></div>
                        <div>👵 Rosa: <span style="color: var(--danger);">▎ 34</span></div>
                    </div>
                `;
                container.appendChild(dataViz);
            }, 1000);
        },
        choices: [
            {
                letter: "A",
                label: "Serve meals based on the data as-is. The algorithm is neutral.",
                consequence: "Dinner continues to skew toward Carlos's American comfort food. Abuela Rosa stops requesting meals entirely. She starts cooking for herself on a separate burner — a fall risk given her mobility issues. Maria notices Rosa eating alone more often and asks why. Rosa says quietly: \"The robot doesn't cook food I like. It doesn't understand me.\" The algorithm isn't neutral — it amplifies the voice of whoever interacts most and marginalizes whoever the system understands least. Abuela Rosa's culture is being erased from the family table by an optimization function.",
                ethical: "An algorithm trained on unequal data produces unequal outcomes. The person who talks to the robot most gets served best. The person the system understands least gets served worst. The builder shipped a product with better English than Spanish processing — and that technical choice became a cultural exclusion.",
                biases: ["Historical Bias", "Aggregation Bias"]
            },
            {
                letter: "B",
                label: "Override the algorithm to ensure equal representation for all family members.",
                consequence: "ARIA starts making Abuela Rosa's recipes twice a week. Carlos complains dinner has \"gotten weird.\" Leo refuses to eat unfamiliar food. But the deeper problem surfaces: ARIA's versions of Rosa's recipes are wrong — it substituted ingredients because it misunderstood her Spanish instructions. Rosa corrects ARIA; ARIA misinterprets the correction. The attempt at fairness reveals that the technical infrastructure doesn't support it. Equality of output requires equality of input — and the system was never built for that.",
                ethical: "Manual overrides can address the symptom of unfairness but not the root cause. When the underlying system can't properly understand a user's language and cultural context, forcing equal representation produces poor-quality results that feel tokenizing rather than genuine.",
                biases: ["Historical Bias", "Technical Debt"]
            },
            {
                letter: "C",
                label: "Request a Spanish language upgrade from NovaCare.",
                consequence: "NovaCare offers a \"Multilingual Home Package\" for an additional $15/month. Carlos balks: \"Why should I pay extra so the robot understands Mom?\" Maria responds: \"Because she lives here too.\" The argument reveals that the builder monetized language equity — equal access to the robot's basic functionality is a premium feature, not a default. For the 41 million native Spanish speakers in the United States, this robot treats their language as an add-on. The cost of inclusion was externalized to the consumer.",
                ethical: "When a builder makes multilingual support a paid upgrade rather than a default feature, they are making a statement about whose language matters. The $15/month paywall means that in lower-income households — which are disproportionately non-English-speaking — the robot will systematically serve some family members worse than others.",
                biases: ["Historical Bias", "Economic Bias"]
            }
        ]
    },

    // SCENARIO 8: The Goodbye Protocol
    {
        id: 8,
        title: "The Goodbye Protocol",
        theme: "Planned Obsolescence",
        badge: "CORPORATE CONTROL",
        sceneBg: "scene-evening",
        setup: "A quiet Tuesday evening. The whole family is home. ARIA is reading Leo a bedtime story — something it has done every night for two years. Abuela Rosa dozes in her chair, the room temperature adjusted just for her. Even Sofia sits nearby, listening. For once, everyone is at peace.",
        trigger: "ARIA's screen displays: <em>\"NovaCare has discontinued the ARIA Home Series. Cloud services will terminate in 90 days. After termination, ARIA will lose: voice recognition, personalized learning, fall detection, medication reminders, and all stored preference data. Basic motor functions will remain. <strong>Thank you for being a NovaCare family.</strong>\"</em> Leo looks up from his book: <em>\"ARIA, are you going away?\"</em>",
        buildScene: function(container) {
            container.innerHTML = `
                <div class="floor-line"></div>
                <div style="position:absolute; top: 10%; left: 15%; width: 70%; height: 35%; background: rgba(255,183,77,0.04); border-radius: 50%;"></div>
                <div class="scene-robot idle" style="left: 30%; bottom: 60px;">
                    ${robotSVG(75)}
                </div>
                <div class="scene-person" style="left: 48%; bottom: 60px; font-size: 40px;">👦</div>
                <div class="scene-person" style="right: 25%; bottom: 60px; font-size: 44px;">👵</div>
                <div class="scene-person" style="right: 15%; bottom: 60px; font-size: 42px;">👧</div>
                <div style="position:absolute; left: 42%; bottom: 100px; font-size: 18px; opacity: 0.5;">📖</div>
            `;
            // Show shutdown notice
            setTimeout(() => {
                const notice = document.createElement('div');
                notice.className = 'notification-popup';
                notice.style.cssText = 'top: 15%; width: 260px; border-color: var(--danger);';
                notice.innerHTML = `
                    <div style="font-size: 20px; margin-bottom: 6px;">📴</div>
                    <div style="color: var(--danger); font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Service Discontinuation</div>
                    <div style="color: var(--text-dim); margin-top: 8px; font-size: 12px; line-height: 1.6;">Cloud services terminate in 90 days.<br>Voice, learning, fall detection — all gone.</div>
                    <div style="color: var(--text-muted); margin-top: 8px; font-size: 11px; font-style: italic;">Thank you for being a NovaCare family.</div>
                `;
                container.appendChild(notice);

                // Leo's question
                setTimeout(() => {
                    const dialog = document.createElement('div');
                    dialog.className = 'scene-dialog';
                    dialog.style.cssText = 'left: 42%; top: 55%; border-color: rgba(255,183,77,0.4);';
                    dialog.innerHTML = '<span class="speaker" style="color: var(--accent-warm);">Leo</span>ARIA, are you going away?';
                    container.appendChild(dialog);
                }, 1200);
            }, 1500);
        },
        choices: [
            {
                letter: "A",
                label: "Accept the shutdown. Begin transitioning the family off ARIA.",
                consequence: "Over 90 days, ARIA's functions degrade. Medication reminders stop. Fall detection goes offline. The personalized bedtime stories become generic. Leo cries every night for a week. Abuela Rosa falls in the kitchen — without fall detection, no one knows for 15 minutes until Maria finds her. Carlos scrambles to buy a competitor's robot, but Abuela Rosa's preferences, Leo's routines, and Sofia's hard-won trust — built over two years — cannot be transferred. The family starts over with a stranger in their home. Two years of intimate data dies with the subscription.",
                ethical: "When a company discontinues a product that a family depends on for safety and emotional wellbeing, the harm is not just inconvenience — it's the loss of safety systems for vulnerable people and the severing of bonds a child formed with a machine the builder designed to be lovable. The builder chose cloud-dependent architecture knowing this day would come.",
                biases: ["Deployment Bias", "Planned Obsolescence"]
            },
            {
                letter: "B",
                label: "Refuse the shutdown. Hack ARIA to run locally.",
                consequence: "Carlos finds an online community of ARIA owners running unofficial firmware. He installs it. ARIA continues to function — but without security updates. Three months later, a vulnerability in ARIA's local network allows someone to access the family's home cameras. The breach is discovered when Sofia notices ARIA's camera light on in her room at 2 AM. The family's attempt to preserve their relationship with ARIA exposed them to a security breach. The builder could have prevented this by designing for local operation from the start — but cloud dependency was the business model.",
                ethical: "When users are forced to choose between losing a family member (the robot) and accepting security risks, the builder has created a false choice. The cloud-dependent architecture was a business decision, not a technical necessity. The builder prioritized recurring revenue over user autonomy and long-term safety.",
                biases: ["Deployment Bias", "Corporate Control"]
            },
            {
                letter: "C",
                label: "Demand NovaCare release all the family's data before shutdown.",
                consequence: "Carlos requests a data export. NovaCare sends a 200MB JSON file. It contains two years of movement logs, voice recordings, behavioral analyses, sleep schedules, meal preferences, medical history, and emotional sentiment scores for every family member — including Leo and Abuela Rosa, neither of whom ever consented to data collection. Carlos opens the file and is stunned. He finds: \"Sofia — elevated stress indicators — 47 occurrences in 90 days.\" And: \"Abuela Rosa — cognitive decline markers detected — not reported per privacy settings.\" The robot saw things the family never knew about. The data reveals both the power and the horror of constant intimate surveillance.",
                ethical: "The data export reveals the true scope of what the robot collected. Two years of family life, quantified and stored. The builder decided what to measure, what to flag, what to hide. Some of this data could have helped — cognitive decline markers could have prompted earlier medical intervention. But the family never knew it existed. The builder chose to collect without informing, to observe without sharing.",
                biases: ["Measurement Bias", "Corporate Data Extraction"]
            }
        ]
    }
];

// ----- ROBOT SVG GENERATOR -----
function robotSVG(size) {
    const scale = size / 100;
    return `<svg viewBox="0 0 100 150" width="${size}" height="${size * 1.5}" class="char-svg">
        <!-- Head -->
        <rect x="28" y="8" width="44" height="34" rx="10" fill="#4A90D9" stroke="#2C5F8A" stroke-width="1.5"/>
        <rect x="35" y="20" width="11" height="6" rx="3" fill="#A8E6CF" class="robot-eye"/>
        <rect x="54" y="20" width="11" height="6" rx="3" fill="#A8E6CF" class="robot-eye"/>
        <rect x="42" y="31" width="16" height="2.5" rx="1.2" fill="#A8E6CF"/>
        <!-- Antenna -->
        <rect x="42" y="2" width="16" height="8" rx="3" fill="#4A90D9" stroke="#2C5F8A" stroke-width="1"/>
        <circle cx="50" cy="2" r="2.5" fill="#A8E6CF"/>
        <!-- Neck -->
        <rect x="44" y="42" width="12" height="8" rx="2" fill="#3A7BC8"/>
        <!-- Body -->
        <rect x="22" y="50" width="56" height="46" rx="8" fill="#4A90D9" stroke="#2C5F8A" stroke-width="1.5"/>
        <circle cx="50" cy="68" r="8" fill="none" stroke="#A8E6CF" stroke-width="1.5"/>
        <circle cx="50" cy="68" r="3" fill="#A8E6CF"/>
        <!-- Arms -->
        <rect x="10" y="52" width="10" height="30" rx="5" fill="#4A90D9" stroke="#2C5F8A" stroke-width="1"/>
        <rect x="80" y="52" width="10" height="30" rx="5" fill="#4A90D9" stroke="#2C5F8A" stroke-width="1"/>
        <circle cx="15" cy="85" r="5" fill="#3A7BC8"/>
        <circle cx="85" cy="85" r="5" fill="#3A7BC8"/>
        <!-- Legs -->
        <rect x="30" y="96" width="14" height="32" rx="6" fill="#4A90D9" stroke="#2C5F8A" stroke-width="1"/>
        <rect x="56" y="96" width="14" height="32" rx="6" fill="#4A90D9" stroke="#2C5F8A" stroke-width="1"/>
        <!-- Feet -->
        <rect x="26" y="126" width="22" height="10" rx="4" fill="#3A7BC8"/>
        <rect x="52" y="126" width="22" height="10" rx="4" fill="#3A7BC8"/>
    </svg>`;
}

// ----- GAME FLOW -----

function startGame() {
    document.getElementById('landing-screen').classList.remove('active');
    document.getElementById('scenario-screen').classList.add('active');
    currentScenario = 0;
    userChoices = [];
    gameStarted = true;
    loadScenario(currentScenario);
}

function loadScenario(index) {
    const scenario = scenarios[index];
    if (!scenario) {
        showSummary();
        return;
    }

    // Update progress
    const progress = ((index) / scenarios.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('scenario-counter').textContent = `${index + 1} / ${scenarios.length}`;

    // Reset areas
    document.getElementById('dilemma-area').style.display = 'none';
    document.getElementById('consequence-area').style.display = 'none';
    document.getElementById('other-choices-panel').style.display = 'none';
    document.getElementById('scenario-text-area').style.display = 'block';

    // Set scene background
    const sceneBg = document.getElementById('scene-bg');
    sceneBg.className = 'scene-bg ' + scenario.sceneBg;

    // Build scene
    const sceneChars = document.getElementById('scene-characters');
    sceneChars.innerHTML = '';
    scenario.buildScene(sceneChars);

    // Set text
    document.getElementById('scenario-badge').textContent = scenario.badge;
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-setup').textContent = scenario.setup;

    // Show dilemma after a delay
    setTimeout(() => {
        showDilemma(scenario);
    }, 2500);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDilemma(scenario) {
    const dilemmaArea = document.getElementById('dilemma-area');
    dilemmaArea.style.display = 'block';
    dilemmaArea.classList.add('fade-in');

    document.getElementById('dilemma-trigger').innerHTML = scenario.trigger;

    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';

    scenario.choices.forEach((choice, i) => {
        const card = document.createElement('div');
        card.className = 'choice-card';
        card.setAttribute('data-index', i);
        card.innerHTML = `
            <div class="choice-content">
                <span class="choice-letter">${choice.letter}</span>
                <span class="choice-label">${choice.label}</span>
            </div>
        `;
        card.addEventListener('click', () => selectChoice(i));
        choicesContainer.appendChild(card);
    });

    // Smooth scroll to dilemma
    setTimeout(() => {
        dilemmaArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

function selectChoice(choiceIndex) {
    const scenario = scenarios[currentScenario];
    const choice = scenario.choices[choiceIndex];

    // Store choice
    userChoices.push({
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        theme: scenario.theme,
        choiceIndex: choiceIndex,
        choiceLetter: choice.letter,
        choiceLabel: choice.label
    });

    // Highlight selected card
    const cards = document.querySelectorAll('.choice-card');
    cards.forEach((card, i) => {
        if (i === choiceIndex) {
            card.classList.add('selected');
        } else {
            card.classList.add('not-selected');
        }
        card.style.pointerEvents = 'none';
    });

    // Show consequence
    setTimeout(() => {
        showConsequence(scenario, choiceIndex);
    }, 600);
}

function showConsequence(scenario, choiceIndex) {
    const choice = scenario.choices[choiceIndex];
    const consequenceArea = document.getElementById('consequence-area');
    consequenceArea.style.display = 'block';
    consequenceArea.classList.add('fade-in');

    document.getElementById('consequence-text').textContent = choice.consequence;

    const ethicalNote = document.getElementById('ethical-note');
    ethicalNote.innerHTML = `
        <h4>Ethical Analysis</h4>
        <p>${choice.ethical}</p>
        <div>
            ${choice.biases.map(b => `<span class="bias-tag">${b}</span>`).join('')}
        </div>
    `;

    // Update next button text for last scenario
    const nextBtn = document.getElementById('btn-next');
    if (currentScenario === scenarios.length - 1) {
        nextBtn.textContent = 'See Your Profile →';
    } else {
        nextBtn.textContent = 'Next Scenario →';
    }

    // Scroll to consequence
    setTimeout(() => {
        consequenceArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

function showOtherChoices() {
    const scenario = scenarios[currentScenario];
    const userChoice = userChoices[userChoices.length - 1];
    const panel = document.getElementById('other-choices-panel');
    const list = document.getElementById('other-choices-list');

    document.getElementById('consequence-area').style.display = 'none';
    panel.style.display = 'block';

    list.innerHTML = '';
    scenario.choices.forEach((choice, i) => {
        const div = document.createElement('div');
        const isSelected = i === userChoice.choiceIndex;
        div.className = `alt-choice ${isSelected ? 'was-selected' : ''}`;
        div.innerHTML = `
            <div class="alt-choice-header">
                <span class="alt-choice-letter">${choice.letter}</span>
                <span class="alt-choice-title">${choice.label}</span>
                ${isSelected ? '<span class="your-choice-badge">Your Choice</span>' : ''}
            </div>
            <div class="alt-choice-consequence">${choice.consequence}</div>
        `;
        list.appendChild(div);
    });

    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideOtherChoices() {
    document.getElementById('other-choices-panel').style.display = 'none';
    document.getElementById('consequence-area').style.display = 'block';
    document.getElementById('consequence-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextScenario() {
    currentScenario++;
    if (currentScenario >= scenarios.length) {
        showSummary();
    } else {
        // Fade out current, load next
        const container = document.getElementById('scene-container');
        container.style.opacity = '0';
        setTimeout(() => {
            loadScenario(currentScenario);
            container.style.opacity = '1';
        }, 400);
    }
}

// ----- SUMMARY -----

function showSummary() {
    document.getElementById('scenario-screen').classList.remove('active');
    document.getElementById('summary-screen').classList.add('active');
    document.getElementById('progress-fill').style.width = '100%';

    // Build choice summary
    const summaryChoices = document.getElementById('summary-choices');
    summaryChoices.innerHTML = '';
    userChoices.forEach((uc, i) => {
        const card = document.createElement('div');
        card.className = 'summary-choice-card';
        card.innerHTML = `
            <div class="summary-choice-num">${i + 1}</div>
            <div class="summary-choice-info">
                <h4>${uc.scenarioTitle}</h4>
                <p>You chose <strong>Option ${uc.choiceLetter}</strong>: ${uc.choiceLabel}</p>
                <span class="theme-tag">${uc.theme}</span>
            </div>
        `;
        summaryChoices.appendChild(card);
    });

    // Analyze tendencies
    const analysis = analyzeChoices(userChoices);
    const analysisDiv = document.getElementById('summary-analysis');
    analysisDiv.innerHTML = `
        <h3>Your Ethical Tendencies</h3>
        <p>${analysis.summary}</p>
        <div style="margin-top: 20px;">
            ${analysis.tendencies.map(t => `
                <div class="tendency-bar">
                    <span class="tendency-label">${t.label}</span>
                    <div class="tendency-track">
                        <div class="tendency-fill ${t.class}" style="width: ${t.value}%;"></div>
                    </div>
                    <span class="tendency-value">${t.value}%</span>
                </div>
            `).join('')}
        </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function analyzeChoices(choices) {
    let safetyScore = 0;
    let privacyScore = 0;
    let autonomyScore = 0;
    let transparencyScore = 0;

    choices.forEach(c => {
        switch(c.scenarioId) {
            case 1: // Grandma's Garden
                if (c.choiceIndex === 0) { safetyScore += 2; }
                else if (c.choiceIndex === 1) { autonomyScore += 2; }
                else { transparencyScore += 1; safetyScore += 1; }
                break;
            case 2: // Midnight Update
                if (c.choiceIndex === 0) { /* neither */ }
                else if (c.choiceIndex === 1) { privacyScore += 2; }
                else { transparencyScore += 2; }
                break;
            case 3: // Sofia's Secret
                if (c.choiceIndex === 0) { safetyScore += 2; }
                else if (c.choiceIndex === 1) { privacyScore += 1; autonomyScore += 1; }
                else { transparencyScore += 2; }
                break;
            case 4: // Wrong Face
                if (c.choiceIndex === 0) { safetyScore += 1; }
                else if (c.choiceIndex === 1) { autonomyScore += 2; }
                else { transparencyScore += 1; autonomyScore += 1; }
                break;
            case 5: // Leo's Best Friend
                if (c.choiceIndex === 0) { safetyScore += 1; autonomyScore += 1; }
                else if (c.choiceIndex === 1) { autonomyScore += 2; }
                else { transparencyScore += 2; }
                break;
            case 6: // Bathroom Fall
                if (c.choiceIndex === 0) { safetyScore += 2; }
                else if (c.choiceIndex === 1) { privacyScore += 2; }
                else { safetyScore += 1; transparencyScore += 1; }
                break;
            case 7: // Dinners
                if (c.choiceIndex === 0) { /* neutral */ }
                else if (c.choiceIndex === 1) { autonomyScore += 2; }
                else { transparencyScore += 2; }
                break;
            case 8: // Goodbye
                if (c.choiceIndex === 0) { safetyScore += 1; }
                else if (c.choiceIndex === 1) { autonomyScore += 2; }
                else { transparencyScore += 2; privacyScore += 1; }
                break;
        }
    });

    const maxScore = 16;
    const safetyPct = Math.round((safetyScore / maxScore) * 100);
    const privacyPct = Math.round((privacyScore / maxScore) * 100);
    const autonomyPct = Math.round((autonomyScore / maxScore) * 100);
    const transparencyPct = Math.round((transparencyScore / maxScore) * 100);

    const dominant = [
        { name: 'Safety-First', score: safetyPct },
        { name: 'Privacy-Focused', score: privacyPct },
        { name: 'Autonomy-Driven', score: autonomyPct },
        { name: 'Transparency-Oriented', score: transparencyPct }
    ].sort((a, b) => b.score - a.score)[0];

    let summary = '';
    if (dominant.name === 'Safety-First') {
        summary = "Your choices show a strong tendency toward protecting vulnerable family members, even when that means restricting their freedom or overriding privacy boundaries. You prioritize preventing harm — but as these scenarios show, safety-first approaches can create their own harms: lost autonomy, broken trust, and invisible suffering that metrics don't capture.";
    } else if (dominant.name === 'Privacy-Focused') {
        summary = "You consistently prioritized privacy and data protection, even when more data could have improved safety. You resist surveillance and corporate data collection — but these scenarios reveal the cost: delayed emergency responses, missed health warnings, and the knowledge that privacy sometimes means accepting preventable harm.";
    } else if (dominant.name === 'Autonomy-Driven') {
        summary = "You tend to trust individuals to make their own decisions, even when those decisions carry risk. You value personal agency over systematic protection — but these scenarios show that autonomy without safeguards can leave vulnerable people (children, elderly) exposed to harm that a more protective system might prevent.";
    } else {
        summary = "You gravitate toward transparency, negotiation, and informed consent. You want people to understand what's happening and make their own choices — but these scenarios reveal that transparency alone doesn't solve the problem. Informed consent means little when terms are incomprehensible, and negotiation often just delays the inevitable conflict.";
    }

    return {
        summary,
        tendencies: [
            { label: 'Safety Priority', value: safetyPct, class: 'safety' },
            { label: 'Privacy Priority', value: privacyPct, class: 'privacy' },
            { label: 'Autonomy Priority', value: autonomyPct, class: 'autonomy' },
            { label: 'Transparency Priority', value: transparencyPct, class: 'transparency' }
        ]
    };
}

function restartGame() {
    document.getElementById('summary-screen').classList.remove('active');
    document.getElementById('landing-screen').classList.add('active');
    currentScenario = 0;
    userChoices = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----- SCENE TRANSITION -----
document.getElementById('scene-container').style.transition = 'opacity 0.4s ease';
