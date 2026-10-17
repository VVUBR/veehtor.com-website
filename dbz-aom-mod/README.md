# Dragon Ball Z: Age of Mythology (Retold data mod), vertical slice v0.1

A total-conversion data mod for **Age of Mythology: Retold** that re-skins the four
cultures as Dragon Ball Z factions. This slice contains:

| Piece | Where |
|---|---|
| Goku: Early, Flying Nimbus, Kaio-ken, SSJ1 (+air), SSJ3 (+air) | `game/data/gameplay/proto_mods.xml` |
| Cell: Imperfect, Semi-Perfect, Perfect (each with an air twin) | `proto_mods.xml` |
| Saibaman (myth unit), Kid Buu (Titan) | `proto_mods.xml` |
| Dragon Balls 1-Star to 7-Star (relics) | `proto_mods.xml` |
| Combat/animation bindings for every unit above | `game/data/gameplay/tactics/*.tactics` |
| Flight and Kaio-ken buttons, Shenron god power | `powers_mods.xml`, `abilities/abilities_mods.xml` |
| Legal stance and saga transformations | `unit_transform_mods.xml` |
| Culture hooks, SSJ1/SSJ3 techs, Cell Incubation | `techtree_mods.xml` |
| Names and tooltips | `game/data/strings/english/stringmods.txt` |
| Ki upkeep, Cell evolution, Dragon Balls/Shenron, Saibaman, Kid Buu | `game/trigger/dbz/dbz_core.xs` |

Everything is **additive** (`*_mods.xml` files with `mergeMode="add"`), so it does not
overwrite vanilla files and can sit next to other mods.

## Install and test

1. Copy this folder's `game` directory into
   `%USERPROFILE%\Games\Age of Mythology Retold\<your id>\mods\local\DBZ_AoM\`
   so you end up with `...\mods\local\DBZ_AoM\game\data\gameplay\proto_mods.xml` and so on.
2. Make a test map that loads the trigger library:
   1. Extract the vanilla `game\random_maps\mediterranean.xs` and `mediterranean.xml`
      (Resource Manager or CryBarEditor, with "convert .xmb to .xml" on).
   2. Save them as `...\DBZ_AoM\game\random_maps\dbz_test_mediterranean.xs` / `.xml`.
   3. Inside `void generate()` of the `.xs`, add these two lines (anywhere before the end):
      ```c
      rmTriggerAddScriptInclude("dbz/dbz_core.xs");
      rmTriggerAddScriptLine("rule _dbzMapConfig active highFrequency { gDBZMapLightingSet = \"rm_mediterranean01\"; xsDisableSelf(); }");
      ```
   4. If the map does not appear in the lobby list, add `<map>dbz_test_mediterranean</map>`
      to a copy of the vanilla `randommaps.set` in the same folder.
3. Turn on data validation and the debug output in `user.cfg` so load errors are reported.
4. Enable the mod in the in-game Mods menu, start a skirmish on the test map, and run the
   checklist at the bottom of this file.

Culture mapping used by the slice:

| Retold culture | DBZ faction | Slice content |
|---|---|---|
| Greek | Earth and Other World Defenders | Goku at the Town Center (row 2), SSJ techs at the Temple |
| Norse | Frieza Force and Saiyan Empire | Saibaman at the Temple |
| Egyptian | Red Ribbon and Bio-Tech Collective | Cell Incubation Chamber at the Temple (Heroic Age), then Cell |
| Atlantean | Babidi's Cabal and Makyo Realm | Any Titan from the Titan Gate becomes Kid Buu |

## How the spec maps onto the real engine

Some things in the design brief are not engine features. This is how each one is built:

| Spec | Real implementation |
|---|---|
| `<flag>CanPickUpRelics</flag>` | Retold has no such flag. Relic carrying is the `Pickup` / `DropOff` protoactions plus `<contain external="1">LogicalTypePickable</contain>`, the same pattern vanilla-style heroes use. The Dragon Balls carry `LogicalTypePickable`. |
| `<action name="ToggleFlight">` | Each flying fighter is a pair of protos (land and air). A named `DelayedTransform` protoaction (`FlightTransform`) swaps between them, fired by the `DBZ_AbilityToggleFlight` UnitAction power on the unit's ability card. This is the mechanism the MCMT mod uses for its grounded Pegasus and landing Roc, built on Retold's own `DelayedTransform` action. |
| +25% MaxVelocity in the air | Air twins have exactly 1.25x the land `maxvelocity`. |
| "Cannot block melee" in the air | Air twins have Hack armor 0.15 lower. Melee units can still hit fliers (DBZ fights happen in the air). |
| 0.5 Ki/s drain, forced landing at 0 | `dbzKiUpkeep` rule in `dbz_core.xs`. It counts airborne protos per player each second, charges Favor in whole units (the engine's grant call is integer-only, fractions are carried over), and swaps every air proto back to land when the pool runs dry. |
| Kaio-ken toggle, 5 HP/s | Third Goku Early proto, toggled with its own `KaiokenTransform`. `dbzKaiokenStrain` applies the damage. |
| Early -> SSJ1 -> SSJ3 | `TransformUnit` effects in the `DBZ_SuperSaiyanAwakening` and `DBZ_SuperSaiyan3` techs. Each tech also swaps the Town Center button so a fallen Goku is retrained in his current form. Every form has `buildlimit` 1 plus the `UnitTransformBuildLimit` flag, which should count all forms toward one limit (inferred from the flag name; see the checklist). |
| Namekian Regeneration 10 HP/s, Kid Buu 40 HP/s | Native `<unitregen>`. |
| Cell Biomass Absorption, evolve at 10 kills | `dbzCellBiomass` rule. Cell automatically executes one adjacent wounded biological enemy at a time. Each absorption counts as one kill toward evolution. |
| Saibaman Self-Destruct Leap | Native `JumpAttack` (120 Hack + 150 Crush, 4m). `dbzSaibamanDetonation` kills the Saibaman as soon as its jump ends. |
| Kid Buu from the Titan Gate | `dbzKidBuu` converts any Atlantean-culture Titan into `DBZ_KidBuu`, whatever vanilla Titan the gate produced. |
| 7 Dragon Balls, Temple buff, Shenron | `dbzDragonBalls` rule: finds or places the 7 balls, counts balls inside each player's Temples, pays the trickle, and runs the Shenron state machine (Idle, Ready, Wish, Scattered). |
| 3-wish modal | The engine's choice dialog has two buttons, so it is two steps: "Immortality" or "Another wish...", then "Ultimate Wealth" or "Restored Youth". |
| Hero 5.0x vs myth, 2.5x vs Titan | `damagebonus` on every hero attack against `LogicalTypeMythUnitNotTitan` (5.0) and `AbstractTitan` (2.5), so the two bonuses never stack. |
| Myth 3.0x vs HumanSoldier + knockback, 0.25x vs Hero | `damagebonus` plus `onhiteffect type="Throw"` on Saibaman and Kid Buu attacks. |

## Design decisions the brief left open

Change any of these in the tunables block at the top of `dbz_core.xs` or in the XML:

- **Kaio-ken safety release**: Kaio-ken switches off by itself at 10% HP, so it can never kill Goku.
- **SSJ3 at 0 Ki**: the form keeps going, but the strain costs 5 HP/s instead, never below 10% HP.
- **Cell's absorption rule**: targets within 3m that are biological (human soldiers, villagers, non-Titan myth units) and at or below 35% HP. One absorption every 4 seconds, healing Cell by 25% of the victim's max HP. Heroes are immune, except a badly wounded (20% HP or less) Android 17 or 18, which pushes Cell straight to his next stage. The Android rule turns on when the Faction 3 module defines those two units.
- **Kid Buu's "cannot drop below 1 HP"**: his HP is held at 2% unless an enemy Major Hero is within 12m (the hero lands the finishing blow) or the quest variable `dbzTitanVulnerableUntilMs` is in the future. The Universal Spirit Bomb power will set that variable.
- **Dragon Ball trickle**: each ball in your Temple gives 0.2 Ki/s and 0.5 Zeni (Gold)/s.
- **After a wish**: the balls turn to stone and are gone for 180 seconds, then respawn scattered across the map.
- **Unanswered Shenron**: a human who does not pick within 60 seconds gets Ultimate Wealth. AI players pick Immortality if they have fallen heroes, otherwise Wealth.
- **Restored Youth**: refreshes every spent god power the player has held, Age I included (the brief says Ages I to IV). Shenron himself is excluded.
- **Fallback Dragon Ball placement**: if the map script placed no balls, they appear on a ring at 32% of the map size around the centre. The random map module will place them properly, with guards.
- **Stand-in visuals**: Goku uses Heracles, Cell uses Kemsyt, the Saibaman uses the Dryad, Kid Buu uses the Xing Tian Titan, and the Dragon Balls use the sky lantern. Swap `animfile`, `icon` and `soundsetfile` when DBZ art exists.

## Verification status

Checked in this repository, without the game:

- All XML and `.tactics` files parse as well-formed XML.
- Every one of the 65 engine functions called in `dbz_core.xs` exists in the community-maintained
  Retold XS function reference (JeHathor/AoM-Retold), with matching argument counts.
- Every engine constant used exists in Retold's `MythTRConstants.txt`.
- Every cross-reference resolves: proto names, tactics files, tactic action names vs protoactions,
  transform pairs, ability-to-power bindings, tech names and string IDs.
- File formats, tag names and folder layout follow a published, working Retold mod (MCMT by akinizer).

**Not checked: the mod has not been loaded in Age of Mythology: Retold yet.** Expect a short fix
pass after the first launch. The parts most likely to need adjustment:

1. Retold XS syntax for typed arrays (`string[]`, `float[]`, `new string(0, "")`). Only `int[]` is
   confirmed by a published example.
2. Whether two differently named `DelayedTransform` actions on one unit (Goku Early's
   `FlightTransform` and `KaiokenTransform`) both work. If not, move Kaio-ken to a
   `ChargedModify` protoaction.
3. Whether the Dragon Balls can be picked up with only `LogicalTypePickable`. If heroes ignore them,
   copy the unit types and flags from the vanilla `Relic` entry in the extracted `proto.xml`.
4. `trShowChoiceDialogForPlayer` and its event handlers. Test in single player first; multiplayer
   sync of the player's choice is a separate, later test.
5. `UnitTransformBuildLimit`: confirm you cannot train a second Goku while the first is flying or
   in Kaio-ken. If you can, the fix is a small XS rule that hides the Town Center button while
   any Goku form is alive.
6. Animation names (`Transform`, `JumpAttack`) on the stand-in models. A missing animation
   should not break the action, but it will look wrong until DBZ models exist.

### First-launch checklist

- [ ] Mod loads with data validation on and no errors in the log.
- [ ] Greek: Goku trains at the Town Center, Take Flight and Kaio-ken buttons work, Favor drains in
      the air and Goku lands at 0 Favor. A second Goku cannot be trained while the first is flying.
- [ ] Greek, Heroic Age: Super Saiyan Awakening transforms Goku. Mythic Age: Super Saiyan 3 works,
      and Favor drains even on the ground.
- [ ] Norse: Saibamen train at the Temple, leap onto targets and die on landing.
- [ ] Egyptian, Heroic Age: Cell Incubation, then Cell absorbs wounded enemies and evolves at 10 and 20.
- [ ] Atlantean: the Titan from the Titan Gate becomes Kid Buu and cannot be killed without a Major
      Hero nearby.
- [ ] 7 Dragon Balls appear. A hero carries one into a Temple, Favor and Gold trickle in. With all 7,
      the sky darkens and Summon the Eternal Dragon appears; casting it opens the wish dialog;
      the balls scatter and return after 3 minutes.

## Legal note

This is a free, non-commercial fan mod. Age of Mythology belongs to Microsoft; Dragon Ball belongs
to Bird Studio/Shueisha and Toei Animation. Build your own art (or use clearly licensed fan art)
rather than ripping models or audio out of Dragon Ball games, and don't sell the mod.

## Module roadmap

1. Faction 1: Earth and Other World Defenders, full `proto_mods.xml` (all heroes Sagas 1-9,
   soldiers, myth units, buildings).
2. Faction 2: Frieza Force and Saiyan Empire.
3. Faction 3: Red Ribbon and Bio-Tech Collective.
4. Faction 4: Babidi's Cabal and Makyo Demon Realm.
5. `techtree_mods.xml`: ages, major deities and minor patrons, upgrades, saga transformations.
6. `powers_mods.xml`: every Saga god power.
7. Random map scripts: Dragon Ball maps with guarded relic placement.
8. Faction economy rules in XS: Ki from combat (Frieza), Bio-Reactors (Red Ribbon),
   teleporting resources (Majin), hero revival halos (Earth).
9. AI script support for the new units and powers.
