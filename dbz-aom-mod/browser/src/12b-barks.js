// =====================================================================
// 12b. SPEECH BUBBLES: heroes talk when selected, ordered, hurt or near friends
// =====================================================================
// sel: selected; go: ordered to move; atk: ordered to attack; die: last words.
const BARKS = {
  bardock: { sel: ['Bardock. Low class, high stakes.', 'Frieza is coming for us all.', 'What now?'], go: ['On my way.', 'Move it!'], atk: ['Riot Javelin!', 'This one is for my comrades!'], die: ['Kakarot… avenge us…'] },
  broly: { sel: ['Kakarot…', '…', 'I will destroy everything.'], go: ['Grrr…', 'Out of my way.'], atk: ['KAKAROT!', 'Nothing can stop me!'], die: ['Kaka… rot…'] },
  // ---- campaign-only heroes and villains (lines are short paraphrases, not quotes)
  goten: { sel: ['Wanna play?', 'Is it time to fight?', "I'm Goten!"], go: ['Wait for me, Trunks!', 'Okay!'], atk: ['Ka… me… ha… me… HA!', 'Take that!'], die: ['Mommy…'] },
  kidtrunks: { sel: ['This is too easy.', "Dad's gonna see this.", "I'm Trunks!"], go: ['Keep up, Goten!', 'Fine.'], atk: ['Buster Cannon!', 'Too slow!'], die: ['No fair…'] },
  videl: { sel: ["I'll handle this myself.", "Don't treat me like a kid.", 'Videl here.'], go: ['On it.', 'Right behind you.'], atk: ['Hi-yah!', 'Justice punch!'], die: ['Gohan…'] },
  satan: { sel: ['Make way for the World Champ!', 'Ha ha ha! The champion is here!', 'Uh… is it safe?'], go: ['The champ is on the move!', 'A strategic retreat!'], atk: ['Dynamite Kick!', 'Megaton Punch!'], die: ['That was… a trick…'] },
  yajirobe: { sel: ['What? I was eating.', 'Got any food?', 'Yajirobe. Samurai.'], go: ['Ugh, walking.', 'Fine, fine.'], atk: ['One cut is all I need!', 'Hyaah!'], die: ['Should have… stayed home…'] },
  chiaotzu: { sel: ['Tien?', "I'm ready.", 'I can help!'], go: ['Okay!', 'Following Tien.'], atk: ['Dodon Ray!', "You can't move!"], die: ['Goodbye… Tien…'] },
  nail: { sel: ['I guard the Elder.', 'Speak.', 'Nail is ready.'], go: ['As you wish.', 'Moving.'], atk: ['For Namek!', 'You will not pass!'], die: ['Elder… forgive me…'] },
  guldo: { sel: ['Guldo! Ready!', 'Nobody respects me…', 'Four eyes see everything.'], go: ['Wait for me!', 'Going, going!'], atk: ['Time Freeze!', "You can't move now!"], die: ['Not fair…'] },
  burter: { sel: ["I'm the fastest in the universe!", 'Burter.', 'Too slow, all of you.'], go: ['Already there!', 'Watch this speed!'], atk: ['Blue Hurricane!', 'Can you even see me?'], die: ['Too… fast…'] },
  jeice: { sel: ['Jeice here.', 'Red Magma, ready.', 'Easy work.'], go: ['On my way, Captain.', 'Right.'], atk: ['Crusher Ball!', 'Purple Comet!'], die: ['Captain… help…'] },
  kingcoldh: { sel: ['Speak, servant.', 'I am King Cold.', 'This planet bores me.'], go: ['Very well.', 'If I must.'], atk: ['Kneel.', 'How rude of you.'], die: ['Wait… let us talk…'] },
  mecha: { sel: ['I came back for revenge.', 'Steel and hatred.', 'Where is the Saiyan?'], go: ['Out of my way.', 'Hmph.'], atk: ['Death Beam!', 'This planet ends today.'], die: ['Not… again…'] },
  dabura: { sel: ['I am the King of Demons.', 'Speak, mortal.', 'Babidi commands.'], go: ['As you wish.', 'Very well.'], atk: ['Turn to stone!', 'Darkness Sword!'], die: ['Impossible…'] },
  puipui: { sel: ['Pui Pui reporting!', 'Easy job.', 'For Babidi!'], go: ['Moving!', 'Right away!'], atk: ['Take this!', 'Ha!'], die: ['Master Babidi…'] },
  spopovich: { sel: ['…', 'Grrr.', 'For Babidi.'], go: ['Grrr.', '…'], atk: ['RAAAH!', 'Crush!'], die: ['…urgh.'] },
  babidi: { sel: ['Papparapa!', 'Do as I say!', 'I am the great Babidi!'], go: ['Hurry, hurry!', 'Faster, fool!'], atk: ['Get them, get them!', 'Magic!'], die: ['Buu… save me…'] },
  fatbuu: { sel: ['Buu is here!', 'Buu wants candy!', 'Hee hee!'], go: ['Buu goes!', 'Okay!'], atk: ['Buu turns you into candy!', 'Buu is angry!'], die: ['Buu… sleepy…'] },
  superbuu: { sel: ['Buu is bored.', 'Bring me the strong ones.', 'Ha ha ha!'], go: ['Fine.', 'Buu goes where Buu wants.'], atk: ['Human Extinction Attack!', 'You will be absorbed!'], die: ['Buu will… come back…'] },
  kidbuu: { sel: ['Hee hee hee!', 'Boom?', 'Rrraaah!'], go: ['Hee!', 'Wheee!'], atk: ['BOOM!', 'Hee hee… boom!'], die: ['Aaaaagh!'] },
  goku: { sel: ["Hey! I'm Goku!", 'Somebody strong out there?', 'Ready when you are!'], go: ['On my way!', 'Instant Transmission… kidding, running!', 'Got it!'], atk: ["Let's see what you've got!", 'Ka… me… ha… me…', "Now I'm excited!"], die: ['Sorry… everyone…'] },
  krillin: { sel: ['Krillin here!', "I'm stronger than I look!", 'Do I have to?'], go: ['Moving!', 'Right behind you, Goku!'], atk: ['Destructo Disc!', "Here goes nothing!"], die: ['Not again…'] },
  piccolo: { sel: ['Hmph.', 'Make it quick.', 'I am listening.'], go: ['Fine.', 'Stay focused.'], atk: ['Special Beam Cannon!', 'You will regret this.'], die: ['Gohan… run…'] },
  gohan: { sel: ["I'll do my best!", "I won't let anyone down.", 'Mister Piccolo taught me well.'], go: ['Okay!', 'Coming!'], atk: ['Masenko!', "I won't hold back!"], die: ['Dad… I tried…'] },
  blue: { sel: ['General Blue reporting.', 'Make it clean.', 'Discipline wins wars.'], go: ['Move out!', 'Understood.'], atk: ['Look into my eyes…', 'Disgusting rabble.'], die: ['Impossible…'] },
  a17: { sel: ['Yeah, yeah.', 'This is kind of fun.', "What's the job?"], go: ['Sure.', 'Whatever you say.'], atk: ['Barrier up. Game on.', "Let's play."], die: ['Huh. Didn’t see that coming.'] },
  a18: { sel: ['What?', "Don't waste my time.", 'Fine, I’m listening.'], go: ['Hmph. Fine.', 'Going.'], atk: ['You’re in my way.', 'Too slow.'], die: ['Tch…'] },
  cell: { sel: ['Perfection, at your service.', 'Such delicious energy nearby…', 'Do you need a monster?'], go: ['As you wish.', 'Lead on.'], atk: ['Absorb… everything!', 'Kamehameha! Yes, I know it too.'], die: ['But I am… perfect…'] },
  vegeta: { sel: ['I am the Prince of all Saiyans!', 'What do you want?', "Don't keep me waiting."], go: ['Tch. Fine.', 'Out of my way.'], atk: ['Galick Gun!', "You're a disgrace to fighters!", 'Final Flash!'], die: ['Kakarot… you win…'] },
  raditz: { sel: ['Raditz. Remember the name.', 'Weaklings everywhere.', 'Speak.'], go: ['Hmph.', 'Moving.'], atk: ['Double Sunday!', 'Grovel!'], die: ['Brother…'] },
  nappa: { sel: ['Heh heh heh.', 'Anything to smash?', 'Vegeta said I could play.'], go: ['Stomping over!', 'Yeah, yeah.'], atk: ['Break Cannon!', 'Ha! Too easy!'], die: ['Vegeta… help me…'] },
  yamcha: { sel: ['Yamcha, ready to roll!', "I've been training too!", 'Wolf Fang Fist at your service.'], go: ['On it!', 'Watch me move!'], atk: ['Wolf Fang Fist!', 'Spirit Ball, go!'], die: ['Not… like this…'] },
  roshi: { sel: ['Ho ho! The old master is here.', 'Patience, young one.', 'Mind your training.'], go: ['Slowly, slowly…', 'My back! Fine, I’m going.'], atk: ['MAX Power Kamehameha!', 'Watch and learn!'], die: ['I taught you well…'] },
  tien: { sel: ['Tien Shinhan.', 'Discipline first.', 'Where is Chiaotzu?'], go: ['Moving.', 'Understood.'], atk: ['Tri-Beam!', 'You will not pass!'], die: ['Chiaotzu… forgive me…'] },
  trunks: { sel: ['I came from the future to help.', 'My sword is ready.', 'The androids took everything.'], go: ['Right away.', 'Let me handle it.'], atk: ['Burning Attack!', 'Not this time!'], die: ['Mom… I’m sorry…'] },
  gotenks: { sel: ["Gotenks! The coolest guy ever!", 'Who wants a beating?', 'Fusion is awesome!'], go: ['Gotenks is on the move!', 'Easy peasy!'], atk: ['Super Ghost Kamikaze Attack!', 'Galactic Donut!'], die: ['The fusion wore off…'] },
  black: { sel: ['Officer Black, sir.', 'Orders, Commander?', 'Production on schedule.'], go: ['Yes, sir.', 'Moving.'], atk: ['Open fire!', 'For the Red Ribbon!'], die: ['Commander… Red…'] },
  tao: { sel: ['Tao. The best assassin money can buy.', 'Name your target.', 'My fee is high.'], go: ['Hmph.', 'As you like.'], atk: ['Dodon Ray!', 'You are already dead.'], die: ['Impossible…'] },
  a16: { sel: ['Android 16.', 'I like the birds here.', 'Mission: protect.'], go: ['Affirmative.', 'Moving.'], atk: ["Hell's Flash!", 'Target acquired.'], die: ['Look after… the birds…'] },
  a19: { sel: ['Android 19, online.', 'Energy readings nominal.', 'Hungry for power.'], go: ['Processing.', 'Moving.'], atk: ['Absorbing!', 'Your energy is mine.'], die: ['System… failure…'] },
  zarbon: { sel: ['Zarbon. Charmed.', 'Beauty and power.', 'Do not touch the hair.'], go: ['Gracefully.', 'If I must.'], atk: ['Elegant Blaster!', 'You force my ugly side.'], die: ['My… beautiful face…'] },
  dodoriah: { sel: ['Dodoria, heh!', 'Who needs smashing?', 'Lord Frieza sent me.'], go: ['Out of my way!', 'Hurry up.'], atk: ['Mouth Energy Wave!', 'Crushed!'], die: ['Spare me…'] },
  ginyucap: { sel: ['Captain Ginyu!', 'Ginyu Force, pose!', 'Ready for orders!'], go: ['Ginyu Force, move out!', 'With style!'], atk: ['Body Change!', 'Your body will do nicely.'], die: ['Not… my… body…'] },
  recoome: { sel: ['Recoome!', 'Recoome is ready!', 'Time for a pose!'], go: ['Recoome coming!', 'Heh heh!'], atk: ['Recoome Eraser Gun!', 'Recoome Ultra Fighting Bomber!'], die: ['Recoome… no fun…'] },
  coolerh: { sel: ['I am Cooler.', 'My brother was soft.', 'Speak, and be brief.'], go: ['Very well.', 'Hmph.'], atk: ['Supernova!', 'Feel true terror.'], die: ['Brother… you…'] },
  frieza: { sel: ['Yes? Make it worth my time.', 'How tiresome.', 'I am the emperor here.'], go: ['If I must.', 'Very well.'], atk: ['Death Beam!', "I'll make you suffer."], die: ['A monkey… beat me?'] },
};
// Short exchanges between two of your heroes standing near each other (pair key is sorted).
const BANTER = {
  'bardock|raditz': [['raditz', 'Father, Frieza is watching us.'], ['bardock', 'Let him watch. Saiyans do not kneel.']],
  'bardock|vegeta': [['vegeta', 'A low-class soldier, giving me advice?'], ['bardock', 'Your father never listened either, Prince.']],
  'broly|vegeta': [['vegeta', 'Broly. Stay on a leash.'], ['broly', '…Kakarot.']],
  'chiaotzu|tien': [['chiaotzu', 'Tien, are we strong enough?'], ['tien', 'Stay behind me and we will be.']],
  'goten|kidtrunks': [['goten', 'Trunks, wanna race?'], ['kidtrunks', 'Loser cleans my room!']],
  'piccolo|satan': [['satan', 'Ha! With me here, you can relax.'], ['piccolo', '…Please stop talking.']],
  'goten|piccolo': [['goten', 'Mr. Piccolo, are you scary?'], ['piccolo', 'Only to my enemies, kid.']],
  'gohan|videl': [['videl', 'So, Great Saiyaman, ready?'], ['gohan', 'Shh! Not so loud!']],
  'krillin|tien': [['krillin', 'Just like the old tournament days, Tien.'], ['tien', 'Except now the stakes are the planet.']],
  'piccolo|trunks': [['trunks', 'In my future, you all fell.'], ['piccolo', 'Then we change it. Here.']],
  'piccolo|vegeta': [['vegeta', 'Keep up, Namekian.'], ['piccolo', 'Worry about yourself, Vegeta.']],
  'satan|yajirobe': [['yajirobe', 'Hey, got any food?'], ['satan', 'Champions do not share snacks!']],
  'goku|piccolo': [['piccolo', "Don't get used to this, Goku."], ['goku', 'You say that every time!']],
  'gohan|piccolo': [['piccolo', 'Keep your guard up, kid.'], ['gohan', "Yes, Mister Piccolo! I'm ready."]],
  'goku|krillin': [['krillin', 'Remember training at Kame House?'], ['goku', 'Yeah! Master Roshi worked us hard!']],
  'gohan|goku': [['goku', "Gohan, you're getting really strong."], ['gohan', 'I had good teachers, Dad.']],
  'gohan|krillin': [['krillin', 'Stick with me, Gohan.'], ['gohan', "I'll protect you too, Krillin!"]],
  'a17|a18': [['a17', 'Bored yet, sis?'], ['a18', 'Since we woke up.']],
  'a17|cell': [['cell', 'You smell… complete.'], ['a17', 'Keep your tail to yourself.']],
  'nappa|vegeta': [['nappa', 'Can I squash them, Vegeta?'], ['vegeta', 'Do it quietly, Nappa.']],
  'raditz|vegeta': [['raditz', 'My brother lives on this planet.'], ['vegeta', 'Then he will die on it.']],
  'frieza|vegeta': [['frieza', 'Remember who owns you, Vegeta.'], ['vegeta', 'Not for long.']],
  'goku|vegeta': [['vegeta', "Don't think we're friends, Kakarot."], ['goku', 'Sure, sure. Wanna spar later?']],
  'goku|roshi': [['roshi', 'Remember: work, study, eat, and rest.'], ['goku', 'Got it, Master Roshi! Mostly the eating part.']],
  'krillin|roshi': [['krillin', 'Master, can we skip the delivery runs?'], ['roshi', 'Ho ho! Milk does not deliver itself.']],
  'goku|yamcha': [['yamcha', 'I could have handled it, you know.'], ['goku', 'You fought great, Yamcha!']],
  'krillin|yamcha': [['yamcha', 'Think I still have a chance in this fight?'], ['krillin', 'About as much as me, buddy.']],
  'goku|tien': [['tien', 'You beat me once, Goku. Not again.'], ['goku', "Ha! I'll be ready."]],
  'piccolo|tien': [['tien', 'Strange to fight beside you, Piccolo.'], ['piccolo', 'Stranger days are coming.']],
  'goku|trunks': [['trunks', 'In my time, you died of a heart virus.'], ['goku', "Then I'd better stay healthy!"]],
  'gohan|trunks': [['trunks', 'You trained me, Gohan… in my future.'], ['gohan', 'Then I must have been a good teacher.']],
  'trunks|vegeta': [['trunks', 'Father…'], ['vegeta', 'Stop staring and fight.']],
  'gotenks|piccolo': [['gotenks', "Piccolo, watch this move I invented!"], ['piccolo', 'Focus, or Buu will eat you.']],
  'black|tao': [['black', 'The Commander pays you to win, Tao.'], ['tao', 'And I always deliver.']],
  'a16|a17': [['a17', 'Still watching birds, 16?'], ['a16', 'They are worth protecting.']],
  'a16|a18': [['a18', 'You talk less than anyone I know.'], ['a16', 'Yes.']],
  'a16|cell': [['cell', 'You will be part of me soon, 16.'], ['a16', 'Not while I function.']],
  'a19|black': [['black', 'Report, 19.'], ['a19', 'Energy reserves: very tasty.']],
  'ginyucap|recoome': [['ginyucap', 'Recoome, pose number three!'], ['recoome', 'Recoome! Ready!']],
  'frieza|zarbon': [['zarbon', 'Lord Frieza, the planet is secured.'], ['frieza', 'Then find me the Dragon Balls, Zarbon.']],
  'dodoriah|frieza': [['dodoriah', 'Shall I crush them, Lord Frieza?'], ['frieza', 'Quietly, Dodoria. You are so loud.']],
  'coolerh|frieza': [['coolerh', 'Losing to a Saiyan, little brother?'], ['frieza', 'Mind your own empire, Cooler.']],
  'frieza|ginyucap': [['frieza', 'Ginyu, no dancing this time.'], ['ginyucap', 'But Lord Frieza… the poses!']],
};
function pickLine(list) { return list[Math.floor(Math.random() * list.length)]; }
function bubble(u, text, dur) {
  if (G.headless || !text) return;
  G.bubbles = (G.bubbles || []).filter(b => b.uid !== u.id);
  G.bubbles.push({ uid: u.id, x: u.x, y: u.y, text, t0: performance.now(), dur: (dur || 2.6) * 1000 });
  if (G.bubbles.length > 6) G.bubbles.shift();
}
function bark(u, kind) {
  if (G.headless || !u || u.dead) return;
  const B0 = BARKS[u.key] || (u.nick && BARKS[u.nick.toLowerCase()]); if (!B0 || !B0[kind]) return;
  const now = performance.now();
  if (now - (G.lastBark || 0) < 1200 || now - (u.lastBark || 0) < 3500) return;
  G.lastBark = now; u.lastBark = now;
  bubble(u, pickLine(B0[kind]));
}
function barkDeath(u) { if (G.headless || !BARKS[u.key] || !BARKS[u.key].die) return; if (!G.revealAll && !isAlly(u.owner, G.me) && !visibleAt(u.x, u.y)) return; G.bubbles = (G.bubbles || []); G.bubbles.push({ uid: 0, x: u.x, y: u.y, text: pickLine(BARKS[u.key].die), t0: performance.now(), dur: 3200 }); }
// Every so often, two of your idle heroes standing together chat.
function tickBanter() {
  if (G.headless || !G.me || G.paused || STORY.active || (G.scn && DLG.cur)) return;
  if (G.time < (G.nextBanter || 40)) return;
  G.nextBanter = G.time + 45 + Math.random() * 40;
  const heroes = G.units.filter(u => u.owner === G.me && u.def.cls === 'hero' && !u.garrison && u.order.type !== 'attack');
  for (let i = 0; i < heroes.length; i++) for (let j = i + 1; j < heroes.length; j++) {
    const a = heroes[i], b = heroes[j]; if (Math.hypot(a.x - b.x, a.y - b.y) > 7) continue;
    const key = [a.key, b.key].sort().join('|'), lines = BANTER[key]; if (!lines || !visibleAt(a.x, a.y)) continue;
    const game = G.gameN;
    lines.forEach(([who, text], k) => setTimeout(() => { const u = who === a.key ? a : b; if (!u.dead && G.started && G.gameN === game) bubble(u, text, 3); }, k * 2600));
    return;
  }
}
function drawBubbles() {
  if (!G.bubbles || !G.bubbles.length) return;
  const now = performance.now();
  G.bubbles = G.bubbles.filter(b => now - b.t0 < b.dur);
  ctx.font = '600 12.5px "Chakra Petch", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const b of G.bubbles) {
    let u = b.uid ? G.byId.get(b.uid) : null; if (u && u.kind !== 'unit') u = null;
    if (u && !u.dead) { b.x = u.px !== undefined ? u.x : u.x; b.y = u.y; }
    if (!G.revealAll && !visibleAt(b.x, b.y) && !(u && isAlly(u.owner, G.me))) continue;
    const L = u ? unitLook(u) : {}, h = (L.r === 'ape' ? 120 : L.r === 'ship' ? 40 : 60 * (L.scale || 1)) + (u ? (u.lift || 0) * 30 : 0);
    const x = sx(b.x, b.y), y = sy(b.x, b.y) - h * cam.z - 8;
    const k = Math.min(1, (now - b.t0) / 120, (b.dur - (now - b.t0)) / 250);
    const w = Math.min(240, ctx.measureText(b.text).width + 18);
    ctx.globalAlpha = Math.max(0, k);
    ctx.fillStyle = 'rgba(250,250,255,.96)'; ctx.strokeStyle = 'rgba(20,24,40,.85)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x - w / 2 + 8, y - 12); ctx.arcTo(x + w / 2, y - 12, x + w / 2, y + 12, 8); ctx.arcTo(x + w / 2, y + 12, x - w / 2, y + 12, 8); ctx.lineTo(x + 6, y + 12); ctx.lineTo(x, y + 19); ctx.lineTo(x - 4, y + 12); ctx.arcTo(x - w / 2, y + 12, x - w / 2, y - 12, 8); ctx.arcTo(x - w / 2, y - 12, x + w / 2, y - 12, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#141828'; ctx.fillText(b.text, x, y + .5, 226);
  }
  ctx.globalAlpha = 1; ctx.textBaseline = 'alphabetic';
}
