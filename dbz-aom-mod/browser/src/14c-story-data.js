// =====================================================================
// 14c. CAMPAIGN STORY: scenes between missions, new missions, extra character moments
// =====================================================================
// Scenes play before a mission (intro) and after a victory (outro), like the cinematics
// between Age of Mythology scenarios. Lines are original paraphrases of the saga.
const STORY_SCENES = {
  m1: {
    intro: [{ bg: 'vegeta', place: 'Planet Vegeta — many years ago', left: ['bardock'], right: ['frieza'], lines: [
      ['bardock', 'Frieza! We Saiyans conquered planets for you, and now you want us gone?'],
      ['frieza', 'Monkeys should know their place. Goodbye, planet Vegeta.'],
      ['bardock', 'Kakarot… my son. You were sent to a far planet called Earth. Live… and one day, stop him.'],
    ] }, { bg: 'kamehouse', place: 'Kame House', left: ['goku', 'krillin', 'roshi'], right: ['raditz', 'piccolo'], lines: [
      ['krillin', 'Goku! You actually came! And who is this little guy hiding behind you?'],
      ['goku', 'This is my son, Gohan. Say hello, Gohan.'],
      ['roshi', 'A son! Ho ho! The boy I trained is a father now. I feel ancient.'],
      ['raditz', 'So this is where you have been hiding, Kakarot.'],
      ['goku', 'Kakarot? Who are you?'],
      ['raditz', 'Your brother. We are Saiyans, and you were sent here as a baby to wipe out this planet. Join me… or the boy pays for it.'],
      ['goku', 'Gohan! Give him back!'],
      ['piccolo', 'Goku. That Saiyan is a threat to my plans for this world too. For today, we fight on the same side.'],
      ['goku', 'Piccolo… all right. Let’s get my son back.'],
    ] }],
    outro: { bg: 'mountains', place: 'The crater', left: ['goku', 'piccolo', 'kami'], right: ['raditz'], lines: [
      ['raditz', 'Fools… my comrades heard everything through my scouter. In one year they will come… and they are far stronger than me.'],
      ['piccolo', 'Then we have one year.'],
      ['kami', 'Goku, you must train beyond the limits of this world. King Kai lives at the end of Snake Way. He can teach you.'],
      ['goku', 'Snake Way, huh? Sounds like fun!'],
      ['piccolo', 'And I will take the boy. His hidden power is too dangerous to waste.'],
    ] },
  },
  m2: {
    intro: { bg: 'wasteland', place: 'One year later', left: ['piccolo', 'gohan', 'tien', 'yamcha'], right: ['nappa', 'vegeta'], lines: [
      ['piccolo', 'They are here, kid. Remember everything I taught you.'],
      ['gohan', 'Y-yes, Mister Piccolo!'],
      ['yamcha', 'Relax, everyone. After a whole year of training, how bad can two guys be?'],
      ['tien', 'Chiaotzu, stay behind me. Their power is enormous.'],
      ['nappa', 'Vegeta, look at these weaklings. Can I plant the Saibamen?'],
      ['vegeta', 'Go ahead, Nappa. Let us see if they can amuse me.'],
      ['kingkai', 'Hold on, everyone! Goku is racing down Snake Way right now. Keep them busy until he arrives!'],
    ] },
    outro: { bg: 'wasteland', place: 'The battlefield', left: ['goku', 'krillin'], right: ['vegeta', 'nappa'], lines: [
      ['goku', 'Sorry I took so long, everyone.'],
      ['nappa', 'Vegeta… help me…'],
      ['vegeta', 'A Saiyan who cannot move is no use to me, Nappa.'],
      ['krillin', 'He… he finished off his own partner!'],
      ['vegeta', 'Kakarot. Finally, a Saiyan worth my time. Tomorrow it is just you and me.'],
      ['goku', 'Fine by me. I learned a few tricks from King Kai.'],
    ] },
  },
  m3: {
    intro: { bg: 'mountains', place: 'The Saiyan camp', left: ['goku', 'krillin', 'gohan'], right: ['vegeta'], lines: [
      ['vegeta', 'Kakarot, you are a low-class warrior. I am the Prince of all Saiyans.'],
      ['goku', 'Low class or not, I won’t let you hurt this planet.'],
      ['krillin', 'We’ve got your back, Goku. Gohan, are you ready?'],
      ['gohan', 'I’m scared… but I’ll fight!'],
      ['vegeta', 'Then all of you will watch the moon rise. Saiyans become something truly terrifying under a full moon.'],
    ] },
    outro: { bg: 'night', place: 'Under the moon', left: ['goku', 'krillin', 'bulma'], right: ['vegeta'], lines: [
      ['vegeta', 'My tail… my power… This is not over, Kakarot!'],
      ['krillin', 'He’s trying to escape! Let me finish him!'],
      ['goku', 'Let him go, Krillin. Please. I want to fight him again someday.'],
      ['bulma', 'Guys, listen! Piccolo’s people come from a planet called Namek. They should have their own Dragon Balls!'],
      ['krillin', 'Then we’re going to Namek.'],
    ] },
  },
  m4: {
    intro: { bg: 'namek', place: 'Planet Namek', left: ['krillin', 'gohan', 'bulma'], right: ['dende', 'guru'], lines: [
      ['bulma', 'Planet Namek! Look, even the sky is green!'],
      ['krillin', 'Something’s wrong. I sense Vegeta… and something much, much stronger.'],
      ['gohan', 'Frieza. He’s destroying villages to take their Dragon Balls.'],
      ['dende', 'Please help us… they killed everyone in my village. The Grand Elder can help you.'],
      ['guru', 'Children of Earth, come closer. I will awaken your sleeping power. Then bring the Dragon Balls here, before the tyrant does.'],
    ] },
    outro: { bg: 'namek', place: 'Guru’s House', left: ['krillin', 'gohan'], right: ['vegeta', 'guru'], lines: [
      ['guru', 'Well done. The Dragon Balls are safe in my house… for now.'],
      ['vegeta', 'Hand them over, Earthlings. I intend to wish for immortality.'],
      ['krillin', 'Not a chance, Vegeta!'],
      ['vegeta', 'Then hear this: Frieza has summoned the Ginyu Force. Alone, you will die. With me, you might live a little longer.'],
      ['gohan', 'Krillin… do we trust him?'],
      ['krillin', 'Do we have a choice?'],
    ] },
  },
  m4b: {
    intro: { bg: 'frieza_ship', place: 'Frieza’s ship', left: ['frieza'], right: ['ginyucap', 'recoome', 'burter', 'jeice', 'guldo'], lines: [
      ['frieza', 'Ginyu. A Saiyan and two children stole my Dragon Balls. Bring them back.'],
      ['ginyucap', 'At once, Lord Frieza! Ginyu Force… sound off!'],
      ['recoome', 'Recoome!'],
      ['burter', 'Burter!'],
      ['jeice', 'Jeice!'],
      ['guldo', 'Guldo!'],
      ['ginyucap', 'And Captain Ginyu! Together we are… the GINYU FORCE!'],
      ['frieza', 'Yes, yes, very nice poses. Now go.'],
    ] },
    outro: { bg: 'namek', place: 'Planet Namek', left: ['goku', 'krillin', 'gohan'], right: ['vegeta', 'ginyucap'], lines: [
      ['ginyucap', 'Ribbit… ribbit…'],
      ['krillin', 'Did the Captain just… swap bodies with a frog?'],
      ['vegeta', 'Kakarot. Where did a low-class warrior get that kind of power?'],
      ['goku', 'I trained at a hundred times gravity on the way here! Now, where is Frieza?'],
      ['gohan', 'The Dragon Balls! If we hurry, we can make a wish before he finds us!'],
    ] },
  },
  m5: {
    intro: { bg: 'frieza_ship', place: 'A dying planet', left: ['goku', 'piccolo', 'gohan'], right: ['frieza'], lines: [
      ['frieza', 'You used MY Dragon Balls to make a wish? Unforgivable.'],
      ['piccolo', 'I fused with Nail, Namek’s greatest warrior. Today, Frieza, you face a Namekian at full strength.'],
      ['frieza', 'How cute. Shall I show you my second form? Or perhaps my third?'],
      ['goku', 'Everyone, back me up. Gohan, stay close to Piccolo.'],
      ['gohan', 'Dad… be careful.'],
    ] },
    outro: { bg: 'space', place: 'Namek, falling apart', left: ['goku', 'gohan'], right: ['frieza', 'kingkai'], lines: [
      ['frieza', 'A monkey… beat me?'],
      ['goku', 'It’s over, Frieza. Leave, and never hurt anyone again.'],
      ['gohan', 'Dad! The planet is breaking apart!'],
      ['goku', 'Go! Get everyone off Namek. I’ll find a way out.'],
      ['kingkai', 'Goku escaped in one of Frieza’s pods… but Frieza survived too. His father is rebuilding him with machines. They are coming to Earth.'],
    ] },
  },
  m5b: {
    intro: { bg: 'wasteland', place: 'A rocky plain on Earth', left: ['trunks', 'piccolo'], right: ['mecha', 'kingcold'], lines: [
      ['kingcold', 'So this is the backwater planet that humiliated my son.'],
      ['mecha', 'Father, I will burn this rock myself. But first, the Saiyan will watch his friends die.'],
      ['piccolo', 'That energy… it’s Frieza! But how?'],
      ['trunks', 'Excuse me. I’ll be the one fighting you.'],
      ['mecha', 'A boy with a sword? How amusing.'],
      ['trunks', 'I am a Super Saiyan too. This is where your story ends.'],
    ] },
    outro: { bg: 'mountains', place: 'Three hours later', left: ['trunks'], right: ['goku', 'vegeta'], lines: [
      ['trunks', 'You must be Goku. I came from twenty years in the future.'],
      ['goku', 'From the future? Neat! So, why the visit?'],
      ['trunks', 'In three years, two androids built by Dr. Gero will destroy everything. And you… you will die of a heart virus before they appear.'],
      ['trunks', 'This medicine will cure it. Please, be ready on the morning of May 12th.'],
      ['goku', 'Androids, huh? Thanks, Trunks. We’ll be ready.'],
      ['vegeta', 'Hmph. Who is this brat with a Super Saiyan’s hair?'],
      ['trunks', '…No one important. Not yet.'],
    ] },
  },
  m6: {
    intro: { bg: 'city', place: 'Near South City — three years later', left: ['gokussj', 'piccolo', 'gohan'], right: ['a19', 'gero20'], lines: [
      ['gero20', 'Android 19, drain their energy. The Red Ribbon Army never forgets Son Goku.'],
      ['a19', 'Target identified: Son Goku. Energy absorption ready.'],
      ['gokussj', 'So these are the androids Trunks warned us about. I took his medicine, so I feel great!'],
      ['gero20', 'Hmph. Retreat to the laboratory, 19. I will wake the others.'],
      ['piccolo', 'He is running north, to his lab in the mountains. If he wakes more androids, we are in trouble.'],
      ['gohan', 'Then we have to get there first!'],
    ] },
    outro: { bg: 'lab', place: 'Dr. Gero’s laboratory', left: ['trunks', 'piccolo'], right: ['a17', 'a18'], lines: [
      ['a18', 'Tch. You hit harder than the data said.'],
      ['a17', 'Let’s go, 18. The world is big, and this was only the warm-up.'],
      ['trunks', 'They got away… and there was something else in that lab. A computer, growing a creature.'],
      ['piccolo', 'I felt it too. Something to the south is feeding on whole towns.'],
    ] },
  },
  m6b: {
    intro: { bg: 'lookout', place: 'Kami’s Lookout', left: ['piccolo', 'tien', 'krillin'], right: ['kami', 'popo'], lines: [
      ['kami', 'Piccolo. The creature in Gingertown absorbs people like water. Alone, neither of us can stop it.'],
      ['piccolo', 'Then we become one again. Old man… I never thought I would say that.'],
      ['kami', 'Our split was a mistake I made long ago. Let us mend it.'],
      ['popo', 'Goodbye, Kami. The Lookout will wait for its next guardian.'],
      ['piccolo', 'I am no longer Kami or Piccolo. Just a Namekian who has forgotten his name.'],
      ['tien', 'Gingertown is a ghost town. Only empty clothes in the streets.'],
      ['krillin', 'It has a tail with a needle. Keep everyone away from it!'],
    ] },
    outro: { bg: 'city', place: 'Nicky Town', left: ['piccolo', 'trunks', 'vegeta'], right: ['cell'], lines: [
      ['cell', 'Solar Flare! You have only delayed the inevitable. Once I absorb the androids… I will be perfect.'],
      ['piccolo', 'He burrowed underground. He is going after 17 and 18.'],
      ['trunks', 'He came from another future… he stole my time machine to get here.'],
      ['vegeta', 'Kakarot and his son are in the Hyperbolic Time Chamber. Whatever that insect becomes, I will beat it first.'],
    ] },
  },
  m7: {
    intro: { bg: 'arena', place: 'The Cell Games', left: ['goku', 'gohan', 'piccolo'], right: ['cell', 'a16'], lines: [
      ['cell', 'I have become perfect. Now, a tournament: the Cell Games. Bring me your best.'],
      ['goku', 'A year of training in a single day. Cell, Gohan is going to fight you.'],
      ['gohan', 'Me?!'],
      ['piccolo', 'Goku! You are sending a child to fight a monster!'],
      ['goku', 'He’s stronger than all of us, Piccolo. He just needs a reason to stop holding back.'],
      ['a16', 'Gohan… the birds, the trees, the people. Protect what you love.'],
    ] },
    outro: { bg: 'arena', place: 'After the Cell Games', left: ['gohan', 'krillin', 'trunks'], right: ['goku'], lines: [
      ['gohan', 'It’s over, Cell.'],
      ['goku', 'You did it, Gohan. I’m so proud of you.'],
      ['krillin', 'With the Dragon Balls we can bring back everyone Cell killed.'],
      ['trunks', 'And I’ll go home to my future… and finish the androids there. Thank you, everyone.'],
      ['gohan', 'Goodbye, Trunks!'],
    ] },
  },
  m8: {
    intro: { bg: 'tournament', place: 'World Martial Arts Tournament — seven years later', left: ['goku', 'gohan', 'videl'], right: ['satan', 'supremekai', 'babidi'], lines: [
      ['satan', 'I am the champion! Ha ha! Never forget: I am the one who defeated Cell!'],
      ['videl', 'Gohan… you are the Great Saiyaman, aren’t you?'],
      ['goku', 'One day back from the Other World and there is already trouble!'],
      ['supremekai', 'I am the Supreme Kai. A wizard named Babidi wants to free Majin Buu, a monster that destroyed galaxies. Please, follow me.'],
      ['babidi', 'Steal their energy! Every fighter’s energy goes to my Majin Buu!'],
      ['vegeta', 'Kakarot. I did not come for a tournament. I came to settle things between us.'],
    ] },
    outro: { bg: 'babidi', place: 'The wreck of Babidi’s ship', left: ['vegeta', 'goku'], right: ['fatbuu', 'babidi'], lines: [
      ['babidi', 'My ship! …No matter. The shell has cracked. Wake up, my Majin Buu!'],
      ['fatbuu', 'Buu is free! Buu wants candy!'],
      ['vegeta', 'Kakarot, get the children out of here. This one is mine.'],
      ['goku', 'Vegeta, wait!'],
      ['vegeta', 'Trunks… take care of your mother. Kakarot… you were always one step ahead of me.'],
      ['gokussj3', 'He gave everything… Buu, let me show you Super Saiyan 3. It won’t last, but it will buy us time.'],
      ['piccolo', 'Goten and Trunks will have to learn the Fusion Dance.'],
    ] },
  },
  m8b: {
    intro: { bg: 'lookout', place: 'Kami’s Lookout', left: ['goku', 'goten', 'kidtrunks'], right: ['piccolo', 'popo', 'superbuu'], lines: [
      ['goku', 'Goten, Trunks: copy me exactly. Fu… sion… HA!'],
      ['goten', 'Like this?'],
      ['kidtrunks', 'Ha! Your fingers are all wrong, Goten!'],
      ['popo', 'Hurry. Buu has split in two, and the evil one is coming here.'],
      ['superbuu', 'Bring me the strong ones… or I eat the whole world.'],
      ['piccolo', 'You two practice inside the Hyperbolic Time Chamber. We will hold the Lookout.'],
    ] },
    outro: { bg: 'lookout', place: 'Kami’s Lookout', left: ['gotenks', 'gohan'], right: ['superbuu', 'supremekai'], lines: [
      ['gotenks', 'Ha! I am the coolest fighter in the whole universe!'],
      ['superbuu', 'You were fun. I will come back… and I will eat you.'],
      ['gohan', 'Sorry I’m late. The Elder Kai unlocked my hidden power.'],
      ['supremekai', 'Buu is changing again… his original form is waking up. Kid Buu, the purest evil.'],
      ['goku', 'Then this time we’ll need the whole Earth’s help.'],
    ] },
  },
  m9: {
    intro: { bg: 'lookout', place: 'Earth’s last stand', left: ['goku', 'vegeta'], right: ['buu', 'satan'], lines: [
      ['buu', 'Hee hee hee! Boom! Boom!'],
      ['vegeta', 'Kakarot, the Spirit Bomb. You charge it. I will keep him busy.'],
      ['goku', 'Vegeta…'],
      ['vegeta', 'You are the best, Kakarot. Number one. Now go!'],
      ['satan', 'People of Earth! It is me, Mr. Satan! Raise your hands to the sky and lend us your energy!'],
      ['goku', 'Everyone… I need your power!'],
    ] },
    outro: { bg: 'kamehouse', place: 'Peace, at last', left: ['goku', 'vegeta'], right: ['satan', 'kingkai'], lines: [
      ['goku', 'Goodbye, Buu. Come back as a good guy, okay? Then we’ll fight again, one on one.'],
      ['vegeta', 'One day I will surpass you, Kakarot.'],
      ['goku', 'I’m counting on it!'],
      ['satan', 'Ha ha! The whole world is cheering for… me! Again!'],
      ['kingkai', 'And so peace returns to the universe… for now.'],
    ] },
  },
};

// ---------- new missions that fill the gaps in the saga ----------
// A unit leaves the story without dying (escapes, fuses): it drops what it carries and gives no kill.
const vanish = e => { if (!e || e.dead) return; if (e.carryBall) dropBall(e); if (e.carryRelic) dropRelic(e); e.dead = true; G.sel = G.sel.filter(s => s !== e); };
const MISSION_GINYU = { id: 'm4b', saga: 'Namek Saga', title: 'The Ginyu Force', biome: 'namek', size: 84, seed: 454, connect: [{ x: 20, y: 66 }, { x: 62, y: 18 }],
  blurb: "Hold out against Frieza's elite squad until Goku lands.",
  story: ['Frieza has summoned his special forces: Captain Ginyu, Recoome, Burter, Jeice and Guldo. They are coming for the Dragon Balls you hid.', 'Gohan, Krillin and a reluctant Vegeta must hold the camp. Goku is on his way, training at a hundred times gravity in his ship.'],
  goals: ['Defeat all five members of the Ginyu Force', 'Hold out until Goku lands', 'Do not let all your heroes be knocked out at once', 'Keep your Town Center or villagers'],
  cast: [['gohan', 'krillin', 'vegeta'], ['ginyucap', 'recoome', 'jeice']],
  players: [EARTH, { faction: 'ff', major: 'frieza', name: 'Ginyu Force', team: 2, ai: null, color: 3 }],
  terrain(S) { S.nature({ forests: 8, keep: [[20, 66, 12], [62, 16, 11], [40, 40, 5]] }); S.clear(20, 66, 10, T_DIRT); S.clear(62, 16, 9, T_DIRT); },
  setup(S) {
    S.tc(1, 20, 66); S.units('colonist', 1, 23, 69, 8); S.resAround(20, 66, { hunt: 'frog' });
    for (const [k, x, y] of [['house', 13, 71], ['house', 27, 72], ['barracks', 11, 60], ['temple', 27, 58], ['tower', 30, 64]]) S.bld(k, 1, x, y);
    S.vars.gohan = S.hero('gohan', 1, 24, 60, 'gohan_base'); S.vars.krillin = S.hero('krillin', 1, 22, 61); S.vars.vegeta = S.hero('vegeta', 1, 26, 62, 'vegeta_base', 'Vegeta');
    S.units('namekwarrior', 1, 19, 58, 3); S.units('fighter', 1, 17, 60, 4); S.units('gunner', 1, 18, 62, 3);
    const P = G.players[1]; P.res = { food: 500, wood: 500, gold: 400, ki: 40 }; P.age = 2; P.minors = ['piccolo']; P.powers.beamcannon = { state: 'ready' }; recomputeMods(P);
    G.players[2].age = 3;
    S.vars.ship = S.bld('ship', 2, 60, 6); S.vars.ship.name = "Frieza's Spaceship"; S.vars.ship.invuln = 1e12;
    S.units('soldier', 2, 60, 22, 5); S.units('saiyan', 2, 64, 22, 3);
    S.vars.force = [];
    S.lock('wonder', 'tc', 'fortress', 'market'); S.maxAge = 2;
    S.vars.down = 0; S.vars.gokuAt = { easy: 240, normal: 300, hard: 360 }[S.diffKey];
    S.obj('force', 'Defeat the Ginyu Force', { counter: () => `${S.vars.down}/5` });
    S.obj('hold', 'Hold out until Goku lands', { counter: () => fmtTime(Math.max(0, S.vars.gokuAt - S.t)) });
  },
  start(S) {
    S.say('ginyucap', 'Ginyu Force… ATTACK!', { pause: true });
    S.say('vegeta', 'Listen, Earthlings. Guldo freezes time, Recoome is a brute, Burter is fast and Jeice hides behind him. Do not let them gang up on you.');
    const add = (k, x, y) => { const u = S.hero(k, 2, x, y); S.vars.force.push(u); return u; };
    S.after(30, () => { const a = add('guldo', 60, 26), b = add('recoome', 62, 26); S.attack([a, b], 22, 62); S.say('guldo', 'Me first! I can stop time, you know!'); });
    S.after(150, () => { const a = add('burter', 60, 26), b = add('jeice', 62, 26); S.attack([a, b], 22, 62); S.say('jeice', 'Burter and Jeice! The Purple Comet Crushers!'); });
    S.after(260, () => { const c = add('ginyucap', 61, 24); S.vars.ginyu = c; S.attack([c], 22, 62); S.say('ginyucap', 'Enough! The Captain will handle this personally.'); });
    S.every({ easy: 110, normal: 90, hard: 70 }[S.diffKey], () => { if (S.vars.down >= 5) return false; S.wave(2, [['soldier', 3 * S.d], ['saiyan', 2 * S.d]], 60, 24, 22, 62); });
    S.every(1, () => { S.vars.down = Math.min(5, S.vars.force.filter(u => u.dead || u.owner !== 2).length); });
    S.when(() => S.vars.force.some(u => u.key === 'guldo' && u.dead), () => S.say('vegeta', 'Guldo is finished. One down, Earthlings.'));
    S.when(() => S.vars.force.some(u => u.key === 'recoome' && u.dead), () => S.say('krillin', 'The big one is down! Who is next?!'));
    S.when(() => S.t >= S.vars.gokuAt, () => {
      S.setObj('hold', 'done');
      const g = S.hero('goku', 1, 16, 74, 'goku_base'); g.flying = true; g.lift = 1; S.vars.goku = g;
      S.say('goku', 'Sorry I’m late! I trained at a hundred times gravity on the way!'); S.say('krillin', 'GOKU! Perfect timing!');
    });
    S.when(() => S.vars.ginyu && S.alive(S.vars.ginyu) && S.vars.ginyu.hp < maxHp(S.vars.ginyu) * .4, () => {
      const gy = S.vars.ginyu;
      S.say('ginyucap', 'Your body will be mine! BODY… CHANGE!', { pause: true });
      S.say(S.alive(S.vars.goku) ? 'goku' : 'vegeta', S.alive(S.vars.goku) ? 'Oh no you don’t! Here, catch… a frog!' : 'Ha! He swapped into a frog. How fitting.');
      fxPush({ type: 'flash', x: gy.x, y: gy.y, z: 20, t: 0, dur: .6, color: '#d08aff', r: 2 });
      const f = spawnUnit('frog', 0, gy.x, gy.y); f.nick = 'Captain Ginyu (frog)';
      kill(gy, null, { absorbed: true });
    });
    S.when(() => S.vars.down >= 5, () => S.setObj('force', 'done'));
  },
  check(S) {
    if (S.done('force')) S.win();
    if (![S.vars.gohan, S.vars.krillin, S.vars.vegeta, S.vars.goku].some(u => S.alive(u)) && !G.over) S.lose('All your heroes were knocked out at once.');
    lostCheck(S);
  },
  win: 'The Ginyu Force is finished. Captain Ginyu will spend the rest of his days as a frog.' };

const MISSION_TRUNKS = { id: 'm5b', saga: 'Android Saga', title: 'A Warrior from the Future', biome: 'wasteland', size: 84, seed: 556, connect: [{ x: 42, y: 72 }, { x: 42, y: 14 }],
  blurb: 'Mecha Frieza and King Cold land on Earth. A stranger with a sword answers.',
  story: ['Frieza survived Namek. Rebuilt with machine parts, he lands on Earth with his father, King Cold, and an army, to take revenge on Goku.', 'A young man with a sword and Capsule Corp jacket steps out to meet them. He says he is a Super Saiyan.'],
  goals: ['Defeat Mecha Frieza', 'Defeat King Cold', 'Optional: destroy their spaceship', 'Keep your Town Center or villagers'],
  cast: [['trunks', 'piccolo', 'vegeta'], ['mecha', 'kingcold']],
  players: [EARTH, { faction: 'ff', major: 'frieza', name: 'King Cold', team: 2, ai: null, color: 3 }],
  terrain(S) { S.nature({ ridges: 8, forests: 6, keep: [[42, 72, 12], [42, 12, 13]] }); S.clear(42, 72, 10, T_ROAD); S.clear(42, 12, 11, T_SAND); },
  setup(S) {
    S.tc(1, 42, 72); S.units('colonist', 1, 45, 75, 8); S.resAround(42, 72, { hunt: 'boar' });
    for (const [k, x, y] of [['house', 36, 76], ['house', 48, 76], ['barracks', 34, 68], ['temple', 50, 66], ['stable', 52, 72]]) S.bld(k, 1, x, y);
    S.vars.trunks = S.hero('trunks', 1, 42, 62); S.vars.trunks.hpMul = 1.4; S.vars.trunks.hp = maxHp(S.vars.trunks); S.vars.trunks.buffs.push({ until: 1e9, atk: 1.25 }); S.units('fighter', 1, 40, 64, 4); S.units('gunner', 1, 44, 64, 4);
    const P = G.players[1]; P.res = { food: 600, wood: 600, gold: 500, ki: 40 }; P.age = 3; P.minors = ['piccolo', 'kingkai']; P.techs.add('ssj1'); P.powers.beamcannon = { state: 'ready' }; P.powers.kaiosurge = { state: 'ready' }; recomputeMods(P);
    G.players[2].age = 4;
    S.vars.ship = S.bld('ship', 2, 40, 3); S.vars.ship.name = "King Cold's Spaceship";
    S.vars.mecha = S.hero('mecha', 2, 42, 14);
    S.vars.cold = S.hero('kingcoldh', 2, 46, 13);
    S.units('soldier', 2, 38, 18, 6); S.units('saiyan', 2, 46, 18, 4); S.units('arcosian', 2, 42, 20, 1);
    S.lock('wonder', 'tc'); S.maxAge = 3;
    S.obj('mecha', 'Defeat Mecha Frieza'); S.obj('cold', 'Defeat King Cold');
    S.obj('ship', 'Destroy their spaceship', { optional: true });
  },
  start(S) {
    S.say('mecha', 'Soldiers! Find the Saiyan’s friends and bring me their heads.', { pause: true });
    S.say('trunks', 'I won’t let you touch this planet. Not again.');
    S.after(95, () => { S.say('mecha', 'Enough waiting. I will deal with the boy myself.'); S.attack([S.vars.mecha, ...G.units.filter(u => u.owner === 2 && u.def.cls !== 'hero').slice(0, 6)], 42, 64); });
    S.every({ easy: 110, normal: 90, hard: 70 }[S.diffKey], () => { if (!S.alive(S.vars.ship)) return false; S.wave(2, [['soldier', 3 * S.d], ['saiyan', 2 * S.d]], 42, 16, 42, 66); });
    S.after(130, () => {
      S.hero('piccolo', 1, 30, 80); S.hero('vegeta', 1, 54, 80, 'vegeta_base', 'Vegeta'); S.hero('gohan', 1, 36, 82, 'gohan_base'); S.hero('krillin', 1, 48, 82);
      S.say('piccolo', 'We felt the energy from miles away. Who is that boy?'); S.say('vegeta', 'A Super Saiyan… That should be impossible.');
    });
    S.when(() => S.alive(S.vars.mecha) && S.vars.mecha.hp < maxHp(S.vars.mecha) * .5, () => { S.say('mecha', 'Then die with this planet! Death Ball!'); S.say('trunks', 'I can hold it… and throw it right back!'); });
    S.when(() => !S.alive(S.vars.mecha), () => {
      S.setObj('mecha', 'done'); S.say('kingcold', 'W-wait! Boy, that sword of yours… join me, and I will give you a planet of your own!'); S.say('trunks', 'Keep your planets.');
      if (S.alive(S.vars.cold)) S.attack([S.vars.cold], S.vars.trunks.x || 42, S.vars.trunks.y || 60);
    });
    S.when(() => !S.alive(S.vars.cold), () => S.setObj('cold', 'done'));
    S.when(() => !S.alive(S.vars.ship), () => S.setObj('ship', 'done'));
  },
  check(S) {
    if (S.done('mecha') && S.done('cold')) S.win();
    lostCheck(S);
  },
  win: 'Frieza and King Cold are gone. And then, out of the sky, Goku lands… right where Trunks said he would.' };

const MISSION_CELL1 = { id: 'm6b', saga: 'Cell Saga', title: 'The Monster of Gingertown', biome: 'earth', size: 90, seed: 667, connect: [{ x: 45, y: 78 }, { x: 16, y: 30 }, { x: 74, y: 30 }, { x: 45, y: 12 }],
  blurb: 'Imperfect Cell is absorbing whole towns. Drive him away before he grows too strong.',
  story: ['A creature built from the cells of the greatest fighters is draining entire towns, leaving only empty clothes behind. His name is Cell.', 'Piccolo has fused with Kami to fight him. Protect the townspeople in Gingertown, Nicky Town and the northern village, and wear Cell down until he flees.'],
  goals: ['Wear Imperfect Cell down until he flees', 'Do not let Cell absorb too many people', 'Optional: protect all three towns', 'Keep your Town Center or villagers'],
  cast: [['piccolo', 'tien', 'krillin'], ['cell']],
  players: [EARTH, { faction: 'rr', major: 'gero', name: 'Cell', team: 2, ai: null, color: 4 }],
  terrain(S) { S.nature({ lakes: 2, ridges: 5, forests: 18, dirt: true, keep: [[45, 78, 12], [16, 30, 8], [74, 30, 8], [45, 12, 8]] }); S.clear(45, 78, 10, T_ROAD); for (const [x, y] of [[16, 30], [74, 30], [45, 12]]) S.clear(x, y, 7, T_DIRT); },
  setup(S) {
    S.tc(1, 45, 78); S.units('colonist', 1, 48, 81, 10); S.resAround(45, 78);
    for (const [k, x, y] of [['house', 38, 82], ['house', 52, 82], ['barracks', 36, 72], ['temple', 52, 70], ['tower', 45, 66]]) S.bld(k, 1, x, y);
    const pic = S.hero('piccolo', 1, 44, 68); pic.nick = 'Piccolo (fused with Kami)'; pic.hpMul = 1.5; pic.hp = maxHp(pic); pic.buffs.push({ until: 1e9, atk: 1.35 });
    S.vars.piccolo = pic; S.hero('tien', 1, 46, 68); S.hero('krillin', 1, 42, 69); S.hero('trunks', 1, 48, 69);
    S.units('fighter', 1, 44, 64, 5); S.units('gunner', 1, 46, 63, 4);
    const P = G.players[1]; P.res = { food: 600, wood: 600, gold: 500, ki: 40 }; P.age = 3; P.minors = ['piccolo', 'dende']; P.powers.beamcannon = { state: 'ready' }; P.powers.restoration = { state: 'ready' }; recomputeMods(P);
    S.vars.people = [];
    for (const [x, y] of [[16, 30], [74, 30], [45, 12]]) {
      for (const [dx, dy] of [[-4, -3], [3, -4], [-3, 3], [4, 2]]) S.bld('hut', 0, x + dx, y + dy);
      for (let k = 0; k < 12; k++) { const f = freeTileNear(x + (k % 4) - 1, y + Math.floor(k / 4) - 1, 4); if (f) { const v = spawnUnit('villagerNPC', 0, f.x + .5, f.y + .5); v.home = { x, y }; S.vars.people.push(v); } }
    }
    S.vars.cell = S.hero('cell', 2, 10, 54, 'cell_imperfect'); Object.assign(S.vars.cell, { hpMul: 4, unkillable: true, noEvolve: true }); S.vars.cell.hp = maxHp(S.vars.cell); S.vars.cell.buffs.push({ until: 1e9, atk: 1.4 });
    S.lock('wonder'); S.maxAge = 3;
    S.vars.absorbed = 0; S.vars.limit = { easy: 28, normal: 22, hard: 16 }[S.diffKey]; S.vars.fled = 0; S.vars.huntAt = 30;
    S.obj('cell', 'Wear Imperfect Cell down until he flees');
    S.obj('people', 'Do not let Cell absorb too many people', { counter: () => `${S.vars.absorbed}/${S.vars.limit}` });
    S.obj('towns', 'Protect all three towns', { optional: true });
  },
  start(S) {
    S.say('cell', 'Such delicious life energy… I can feel how close I am to perfection.', { pause: true });
    S.say('piccolo', 'Spread out and guard the towns. If he gets close to the people, he drains them.');
    S.mark(16, 30); S.mark(74, 30); S.mark(45, 12);
    const C = () => S.vars.cell;
    S.every(.5, () => {
      const c = C(); if (!S.alive(c) || S.vars.gone) return false;
      if (S.t < S.vars.huntAt) return;
      // draining takes time: the victim is held for 2.5 s, and stunning Cell breaks his grip
      const v = S.vars.drain;
      if (v) {
        if (!S.alive(v) || c.stun > 0 || Math.hypot(v.x - c.x, v.y - c.y) > 2.2) { S.vars.drain = null; c.stance = 'aggressive'; return; }
        v.stun = Math.max(v.stun || 0, 1);
        if (S.t < S.vars.drainEnd) return;
        S.vars.drain = null; c.stance = 'aggressive';
        kill(v, c, { absorbed: true }); S.vars.absorbed++; c.hp = Math.min(maxHp(c), c.hp + maxHp(c) * .06);
        fxPush({ type: 'aura', uid: c.id, x: c.x, y: c.y, z: 0, t: 0, dur: .8, color: '#9cff57' });
        if (S.vars.absorbed === 8) { S.say('cell', 'Delicious! I can feel myself growing stronger!'); c.buffs.push({ until: 1e9, atk: 1.2 }); }
        return;
      }
      // hunt the nearest townsperson, unless a fighter blocks the way
      const foe = G.units.find(u => u.owner === 1 && !u.garrison && !u.dead && Math.hypot(u.x - c.x, u.y - c.y) < 4);
      if (foe && c.hp > maxHp(c) * .5) { if (c.order.type !== 'attack') setOrder(c, { type: 'attack', tid: foe.id }); return; }
      let prey = null, bd = 1e9; for (const p of S.vars.people) if (S.alive(p)) { const d = Math.hypot(p.x - c.x, p.y - c.y); if (d < bd) { bd = d; prey = p; } }
      if (!prey) return;
      if (bd < 1.6) { S.vars.drain = prey; S.vars.drainEnd = S.t + 2.5; prey.stun = 1; idleOrder(c); c.stance = 'passive'; fxPush({ type: 'aura', uid: prey.id, x: prey.x, y: prey.y, z: 0, t: 0, dur: 2.5, color: '#9cff57' }); }
      else if (c.order.type !== 'move' || Math.hypot(c.order.x - prey.x, c.order.y - prey.y) > 2) setOrder(c, { type: 'move', x: prey.x, y: prey.y });
    });
    S.when(() => S.alive(C()) && C().hp < maxHp(C()) * .35 && !S.vars.fled, () => {
      const c = C(); S.vars.fled = 1;
      S.say('cell', 'Solar Flare! You will not catch me so easily!');
      forUnitsNear(c.x, c.y, 8, u => { if (u.owner === 1) u.stun = Math.max(u.stun, 3); });
      fxPush({ type: 'flash', x: c.x, y: c.y, z: 20, t: 0, dur: .8, color: '#ffffff', r: 4 });
      const far = [[16, 30], [74, 30], [45, 12]].sort((a, b) => Math.hypot(b[0] - c.x, b[1] - c.y) - Math.hypot(a[0] - c.x, a[1] - c.y))[0];
      c.x = far[0]; c.y = far[1]; c.px = c.x; c.py = c.y; c.path = null; c.hp = maxHp(c) * .6;
      S.say('tien', 'He fled to another town! Go! I will slow him down if I have to!');
    });
    S.when(() => S.alive(C()) && S.vars.fled && C().hp < maxHp(C()) * .15, () => {
      const c = C(); S.vars.gone = true;
      S.say('cell', 'This is not over! Once I absorb the androids, I will be perfect!');
      fxPush({ type: 'flash', x: c.x, y: c.y, z: 20, t: 0, dur: .8, color: '#9cff57', r: 3 });
      vanish(c); S.setObj('cell', 'done');
    });
    S.when(() => S.vars.absorbed >= 10, () => S.say('krillin', 'He’s getting stronger with every person he drains! Hurry!'));
  },
  check(S) {
    if (!S.alive(S.vars.cell) && !S.done('cell')) S.setObj('cell', 'done');
    if (S.done('cell')) { if (S.vars.people.filter(v => S.alive(v)).length >= 24) S.setObj('towns', 'done'); S.win(); }
    if (S.vars.absorbed >= S.vars.limit && !G.over) { S.setObj('people', 'failed'); S.lose('Cell absorbed too many people and escaped to hunt the androids.'); }
    lostCheck(S);
  },
  win: 'Cell slips underground, still imperfect. But now everyone knows his name.' };

const MISSION_FUSION = { id: 'm8b', saga: 'Buu Saga', title: 'Fusion!', biome: 'highlands', size: 88, seed: 858, connect: [{ x: 44, y: 76 }, { x: 44, y: 14 }],
  blurb: 'Hold Kami’s Lookout while Goten and Trunks learn the Fusion Dance.',
  story: ['Majin Buu has split in two, and the evil half has absorbed the good: Super Buu. He is coming to Kami’s Lookout for the strongest fighters on Earth.', 'Goten and Trunks need time in the Hyperbolic Time Chamber to master the Fusion Dance. Hold the Lookout until Gotenks is born, then drive Buu away.'],
  goals: ["Keep Kami's Lookout standing", 'Hold out while Goten and Trunks master the Fusion Dance', 'Drive Super Buu away with Gotenks', 'Keep your Town Center or villagers'],
  cast: [['goten', 'kidtrunks', 'piccolo'], ['superbuu']],
  players: [EARTH, { faction: 'ff', major: 'frieza', name: 'Super Buu', team: 2, ai: null, color: 4 }],
  terrain(S) { S.nature({ ridges: 8, forests: 18, snow: true, keep: [[44, 70, 15], [44, 14, 8]] }); S.clear(44, 70, 12, T_ROAD); S.clear(44, 14, 6, T_DIRT); },
  setup(S) {
    S.tc(1, 44, 76); S.units('colonist', 1, 47, 79, 12); S.resAround(44, 76);
    S.vars.lookout = S.bld('temple', 1, 43, 60); S.vars.lookout.name = "Kami's Lookout"; S.vars.lookout.hpMul = 2; S.vars.lookout.hp = maxHp(S.vars.lookout);
    for (const [k, x, y] of [['house', 37, 80], ['house', 51, 80], ['house', 35, 74], ['barracks', 33, 66], ['stable', 54, 74], ['fortress', 51, 64], ['tower', 40, 54], ['tower', 48, 54], ['armory', 36, 60]]) S.bld(k, 1, x, y);
    S.vars.goten = S.hero('goten', 1, 42, 64); S.vars.kidtrunks = S.hero('kidtrunks', 1, 46, 64);
    for (const k of [S.vars.goten, S.vars.kidtrunks]) { k.invuln = 1e12; k.stance = 'passive'; }
    S.vars.piccolo = S.hero('piccolo', 1, 44, 56); S.hero('satan', 1, 50, 70);
    S.units('fighter', 1, 42, 52, 6); S.units('gunner', 1, 46, 52, 6); S.units('rider', 1, 38, 56, 3); S.units('cannon', 1, 50, 58, 2);
    const P = G.players[1]; P.res = { food: 900, wood: 900, gold: 900, ki: 60 }; P.age = 4; P.minors = ['piccolo', 'kingkai', 'elderkai']; P.techs.add('ssj1');
    P.powers.beamcannon = { state: 'ready' }; P.powers.kaiosurge = { state: 'ready' }; P.powers.potential = { state: 'ready' }; recomputeMods(P);
    G.players[2].age = 4;
    S.vars.buu = S.hero('superbuu', 2, 44, 12); Object.assign(S.vars.buu, { unkillable: true, noRegen: true }); S.vars.buu.hp = maxHp(S.vars.buu);
    S.lock('wonder', 'buu'); S.maxAge = 4;
    S.vars.fuseAt = { easy: 150, normal: 180, hard: 210 }[S.diffKey];
    S.obj('lookout', "Keep Kami's Lookout standing");
    S.obj('fusion', 'Hold out while Goten and Trunks practice', { counter: () => fmtTime(Math.max(0, S.vars.fuseAt - S.t)) });
    S.obj('buu', 'Drive Super Buu away', { hidden: true });
  },
  start(S) {
    S.say('superbuu', 'You are hiding the strong ones up there. Buu is bored of waiting.', { pause: true });
    S.say('piccolo', 'Everyone, hold the line in front of the Lookout. Buu must not reach the Hyperbolic Time Chamber.');
    S.say('satan', 'Leave it to me! The champion will… uh… guard the villagers!');
    const B0 = () => S.vars.buu;
    S.vars.buu.buffs.push({ until: 1e9, atk: .55, bored: true });
    S.after(50, () => { S.say('superbuu', 'Ready or not, here I come!'); S.attack([B0()], 44, 60); });
    S.every({ easy: 90, normal: 75, hard: 60 }[S.diffKey], () => { if (!S.alive(B0()) || S.done('buu')) return false; S.wave(2, [['saibaman', 4 * S.d], ['spopovich', S.diffKey === 'hard' ? 1 : 0]].filter(w => w[1] > 0), 44, 16, 44, 62); });
    S.when(() => S.t >= S.vars.fuseAt, () => {
      S.setObj('fusion', 'done'); S.showObj('buu');
      const a = S.vars.goten, b = S.vars.kidtrunks, x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
      for (const k of [a, b]) { fxPush({ type: 'flash', x: k.x, y: k.y, z: 20, t: 0, dur: .6, color: '#ffe066', r: 2 }); vanish(k); }
      const g = S.hero('gotenks', 1, x, y); S.vars.gotenks = g; g.buffs.push({ until: 1e9, atk: 1.6 }); announce('Gotenks!');
      S.say('goten', 'Fu…'); S.say('kidtrunks', '…sion…'); S.say('gotenks', 'HA! Gotenks is here! Buu, you are going down!', { pause: true });
      const bb = B0(); S.vars.resting = false;
      if (S.alive(bb)) { bb.buffs = bb.buffs.filter(q => !q.bored); S.attack([bb], 44, 60); }
      S.attack([g], S.alive(bb) ? bb.x : 44, S.alive(bb) ? bb.y : 30);
    });
    S.after({ easy: 240, normal: 270, hard: 300 }[S.diffKey], () => {
      const go = S.hero('gohan', 1, 44, 84, 'gohan_ssj2', 'Ultimate Gohan'); go.flying = true; go.lift = 1;
      S.say('gohan', 'I’m back. The Elder Kai unlocked my hidden power. Buu, step away from my brother.');
    });
    S.when(() => !S.vars.gotenks && S.alive(B0()) && B0().hp < maxHp(B0()) * .5, () => {
      S.vars.resting = true; S.say('superbuu', 'Boring! Buu goes home to wait for the strong ones.'); setOrder(B0(), { type: 'move', x: 44, y: 12 });
      S.say('piccolo', 'He is regenerating. We only bought time… the boys must finish that fusion.');
    });
    S.every(1, () => { const bb = B0(); if (!S.alive(bb) || S.vars.gotenks) return false; if (S.vars.resting) bb.hp = Math.min(maxHp(bb), bb.hp + maxHp(bb) * .02); });
    // once Gotenks exists, Buu only wants to fight the strong ones: he hunts your heroes before the Lookout
    S.every(2, () => {
      const bb = B0(); if (!S.alive(bb)) return false; if (!S.vars.gotenks || bb.stun > 0) return;
      const cur = bb.order.type === 'attack' && byId(bb.order.tid);
      if (cur && cur.kind === 'unit' && cur.def.cls === 'hero') return;
      let best = null, bd = 30; for (const u of G.units) if (u.owner === 1 && u.def.cls === 'hero' && !u.garrison) { const d = Math.hypot(u.x - bb.x, u.y - bb.y) - (u === S.vars.gotenks ? 8 : 0); if (d < bd) { bd = d; best = u; } }
      if (best) setOrder(bb, { type: 'attack', tid: best.id });
    });
    S.when(() => S.alive(B0()) && S.vars.gotenks && B0().hp < maxHp(B0()) * .4, () => {
      const bb = B0(); S.say('superbuu', 'You were fun. Buu will come back… and eat you all.');
      fxPush({ type: 'boom', x: bb.x, y: bb.y, z: 0, t: 0, dur: 1, color: '#ff8fd0', r: 3 });
      vanish(bb); S.setObj('buu', 'done');
    });
  },
  check(S) {
    if (!S.alive(S.vars.buu) && !S.done('buu')) S.setObj('buu', 'done');
    if (S.done('buu')) { S.setObj('lookout', 'done'); S.win(); }
    if (!S.alive(S.vars.lookout) && !G.over) { S.setObj('lookout', 'failed'); S.lose("Super Buu destroyed Kami's Lookout."); }
    lostCheck(S);
  },
  win: 'Super Buu retreats in a cloud of pink smoke. But something older and worse is waking inside him.' };

// place the new missions in story order
CAMPAIGN.splice(CAMPAIGN.findIndex(m => m.id === 'm5'), 0, MISSION_GINYU);
CAMPAIGN.splice(CAMPAIGN.findIndex(m => m.id === 'm6'), 0, MISSION_TRUNKS);
CAMPAIGN.splice(CAMPAIGN.findIndex(m => m.id === 'm7'), 0, MISSION_CELL1);
CAMPAIGN.splice(CAMPAIGN.findIndex(m => m.id === 'm9'), 0, MISSION_FUSION);
for (const m of CAMPAIGN) if (STORY_SCENES[m.id]) Object.assign(m, STORY_SCENES[m.id]);

// ---------- extra character moments inside the original missions ----------
const MORE_MOMENTS = {
  m1(S) {
    S.after(25, () => S.say('kami', 'Tip: in these battles your heroes are never killed. A knocked-out hero gets back up when one of your units stands next to them and no enemy soldier is near.'));
  },
  m2(S) {
    // Yamcha, Tien and Chiaotzu fight alongside Piccolo and Gohan
    const y = S.hero('yamcha', 1, 36, 70), t = S.hero('tien', 1, 44, 70), c = S.hero('chiaotzu', 1, 45, 72);
    S.vars.yam = y; S.vars.tien = t; S.vars.chi = c;
    S.when(() => !S.alive(y), () => S.say('krillin', 'YAMCHA! Those Saibamen will pay for that!'));
    S.when(() => !S.alive(c), () => { S.say('tien', 'CHIAOTZU! …Nappa, I will give everything I have left!'); if (S.alive(t)) t.buffs.push({ until: G.time + 40, atk: 1.6 }); });
    S.when(() => { const g = G.units.find(u => u.owner === 1 && u.key === 'gohan'); return g && g.hp < maxHp(g) * .3; }, () => {
      const g = G.units.find(u => u.owner === 1 && u.key === 'gohan'), p = G.units.find(u => u.owner === 1 && u.key === 'piccolo');
      if (g && p) { S.say('piccolo', 'Gohan, get behind me!'); g.invuln = G.time + 4; S.say('gohan', 'Mister Piccolo!'); }
    });
  },
  m3(S) {
    S.after(240, () => {
      const y = S.hero('yajirobe', 1, 20, 74); S.say('yajirobe', 'Don’t mind me. Just a samurai with a bag of Senzu Beans.');
      for (const u of G.units) if (u.owner === 1 && u.def.cls === 'hero') u.hp = maxHp(u);
      S.say('krillin', 'Yajirobe! The Senzu Beans healed everyone!');
      S.when(() => S.vars.ape && S.alive(S.vars.ape) && y && S.alive(y) && Math.hypot(y.x - S.vars.ape.x, y.y - S.vars.ape.y) < 4, () => { S.say('yajirobe', 'Eat this, big monkey! Tail cut!'); S.vars.ape.hp -= maxHp(S.vars.ape) * .25; });
    });
  },
  m5(S) {
    S.when(() => G.units.some(u => u.owner === 1 && u.key === 'piccolo' && u.order.type === 'attack' && byId(u.order.tid) === S.vars.frieza), () => S.say('piccolo', 'Nail’s power flows through me now. Let’s see you dodge this, Frieza!'));
    S.when(() => S.vars.frieza && S.vars.frieza.form === 'frieza_final', () => S.say('gohan', 'His power… it’s like nothing I’ve ever felt. Dad, be careful!'));
  },
  m6(S) {
    S.after(120, () => {
      const v = S.hero('vegeta', 1, 50, 80, 'vegeta_ssj', 'Vegeta'); v.flying = true; v.lift = 1; S.hero('trunks', 1, 46, 80);
      S.say('vegetassj', 'Out of my way, Kakarot. Watch what a real Super Saiyan can do.'); S.say('trunks', 'The lab is up in the mountains. Let’s end this before the others wake up.');
    });
    S.when(() => S.vars.a19 && !S.alive(S.vars.a19), () => S.say('piccolo', 'Android 19 is scrap. Now the lab!'));
  },
  m8(S) {
    // Babidi's henchmen guard the ship, as on its floors in the saga
    S.vars.puipui = S.hero('puipui', 2, 40, 10); S.vars.yakon = S.hero('yakon', 2, 50, 9);
    S.when(() => !S.alive(S.vars.puipui), () => S.say('babidi', 'Pui Pui?! Useless! Yakon, swallow their light!'));
    S.when(() => !S.alive(S.vars.yakon), () => { S.say('babidi', 'Yakon too?! Dabura, do something!'); S.say('gokussj', 'Babidi is running out of monsters. Hit the ship!'); });
  },
  m9(S) {
    S.when(() => S.vars.spirit >= 30, () => { S.say('satan', 'Hey, everyone! This is Mr. Satan! Raise your hands and give your energy to my friends!'); S.vars.spirit += 10; S.say('goku', 'Whoa! Thanks, Mr. Satan!'); });
  },
};
for (const m of CAMPAIGN) if (MORE_MOMENTS[m.id]) { const orig = m.start; m.start = S => { if (orig) orig(S); MORE_MOMENTS[m.id](S); }; }
