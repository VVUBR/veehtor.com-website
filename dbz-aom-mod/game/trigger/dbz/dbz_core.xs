//==============================================================================
// DRAGON BALL Z: AGE OF MYTHOLOGY | dbz_core.xs | VERTICAL SLICE v0.1
//
// Trigger-side state machines for everything the data files cannot express:
//   1. FLIGHT + KI      0.5 Ki/s per airborne fighter, forced landing at 0 Ki,
//                       Super Saiyan 3 form upkeep (1.5 Ki/s), Kaio-ken HP strain.
//   2. CELL BIOMASS     Tail Absorption executes wounded biological enemies,
//                       10 absorptions per stage: Imperfect > Semi-Perfect > Perfect.
//   3. DRAGON BALLS     Temple tracking, passive Ki/Zeni trickle, Shenron unlock,
//                       3-wish dialog (Immortality / Ultimate Wealth / Restored Youth).
//   Slice support:      Saibaman self-destruct on landing, Kid Buu Titan Gate swap
//                       and HP floor.
//
// Load it from a random map script (path is relative to game\trigger\):
//   rmTriggerAddScriptInclude("dbz/dbz_core.xs");
//
// The map script may also tell the library which lighting set to restore after
// Shenron leaves (defaults to "default"):
//   rmTriggerAddScriptLine("rule _dbzMapConfig active highFrequency { gDBZMapLightingSet = \"rm_mediterranean01\"; xsDisableSelf(); }");
//
// API reference: AoM Retold XS function list (JeHathor/AoM-Retold, "reference"
// branch) and MythTRConstants.txt. Unit types, unit stats, action types and
// player types below are the engine's own constants.
//==============================================================================

//==============================================================================
// Tunables
//==============================================================================
const float cDBZFlightKiPerSec = 0.5;
const float cDBZSSJ3KiPerSec = 1.5;
const float cDBZKaiokenHPPerSec = 5.0;
const float cDBZKaiokenReleaseRatio = 0.10;
const float cDBZExhaustionHPPerSec = 5.0;
const float cDBZExhaustionFloorRatio = 0.10;

const int cDBZCellBiomassPerStage = 10;
const float cDBZCellAbsorbRange = 3.0;
const float cDBZCellAbsorbMaxHPRatio = 0.35;
const float cDBZCellAndroidAbsorbMaxHPRatio = 0.20;
const float cDBZCellAbsorbHealRatio = 0.25;
const int cDBZCellAbsorbCooldownMs = 4000;

const int cDBZSaibamanScanMs = 200;

const float cDBZKidBuuFloorRatio = 0.02;
const float cDBZKidBuuFinisherRange = 12.0;
const int cDBZKidBuuScanMs = 250;

const int cDBZBallCount = 7;
const float cDBZBallKiPerSec = 0.2;
const float cDBZBallZeniPerSec = 0.5;
const int cDBZBallTickSeconds = 2;
const int cDBZBallScatterSeconds = 180;
const float cDBZBallRingRatio = 0.32;

const float cDBZImmortalRegenPerSec = 5.0;
const int cDBZWishTimeoutSeconds = 60;
const int cDBZGodPowerSlotsScanned = 12;

const int cDBZEventWishImmortality = 9101;
const int cDBZEventWishMore = 9102;
const int cDBZEventWishWealth = 9103;
const int cDBZEventWishYouth = 9104;

const string cDBZShenronPower = "DBZ_SummonEternalDragon";
const string cDBZShenronLighting = "gp_eclipse";

//==============================================================================
// State
//==============================================================================
string gDBZMapLightingSet = "default";

int gDBZQueryA = -1;
int gDBZQueryB = -1;

// Flight stance pairs: gDBZLandProtos[i] <-> gDBZAirProtos[i].
string[] gDBZLandProtos = default;
string[] gDBZAirProtos = default;
int[] gDBZAirProtoIDs = default;

// Cell protos in evolution order (land, air) per stage.
string[] gDBZCellProtos = default;
int[] gDBZCellProtoIDs = default;

int gDBZProtoGokuEarly = -1;
int gDBZProtoGokuKaioken = -1;
int gDBZProtoGokuSSJ3 = -1;
int gDBZProtoGokuSSJ3Air = -1;
int gDBZProtoSaibaman = -1;
int gDBZProtoKidBuu = -1;
int gDBZProtoAndroid17 = -1;
int gDBZProtoAndroid18 = -1;

// Per-player state, indexed by player ID.
float[] gDBZKiDebt = default;
float[] gDBZBallKiAcc = default;
float[] gDBZBallZeniAcc = default;
int[] gDBZBallsHeld = default;
int[] gDBZCellBiomass = default;
int[] gDBZCellNextAbsorbMs = default;
int[] gDBZImmortal = default;

int gDBZNextSaibaScanMs = 0;
int[] gDBZSaibaLeaping = default;

int gDBZNextBuuScanMs = 0;

// Dragon Balls.
string[] gDBZBallProtos = default;
int[] gDBZBallIDs = default;
int gDBZBallRespawnAtSec = -1;
int gDBZShenronPowerID = -1;
int gDBZShenronOwner = -1;
int gDBZShenronUsedBaseline = 0;
int gDBZWishPlayer = -1;
bool gDBZWishPending = false;
int gDBZWishDeadlineSec = -1;

// Hero registry: one row per (player, hero line). Alive is 0/1.
int[] gDBZHeroRegPlayer = default;
string[] gDBZHeroRegLine = default;
string[] gDBZHeroRegProto = default;
int[] gDBZHeroRegAlive = default;

// God power ledger: every power ever seen in a player's slots.
int[] gDBZPowerLedgerPlayer = default;
string[] gDBZPowerLedgerName = default;

//==============================================================================
// Engine helpers
//==============================================================================
void dbzSelect(int unitID = -1)
{
   trUnitSelectClear();
   trUnitSelectByID(unitID);
}

int dbzRunQuery(int queryID = -1, int playerID = -1, int unitType = -1)
{
   kbUnitQueryResetData(queryID);
   kbUnitQuerySetPlayerID(queryID, playerID, false);
   kbUnitQuerySetUnitType(queryID, unitType);
   kbUnitQuerySetState(queryID, cUnitStateAlive);
   return(kbUnitQueryExecute(queryID));
}

int dbzRunAreaQuery(int queryID = -1, int relation = -1, int unitType = -1, vector center = cInvalidVector, float radius = 0.0)
{
   kbUnitQueryResetData(queryID);
   kbUnitQuerySetPlayerRelation(queryID, relation);
   kbUnitQuerySetUnitType(queryID, unitType);
   kbUnitQuerySetState(queryID, cUnitStateAlive);
   kbUnitQuerySetPosition(queryID, center);
   kbUnitQuerySetMaximumDistance(queryID, radius);
   kbUnitQuerySetAscendingSort(queryID, true);
   return(kbUnitQueryExecute(queryID));
}

float dbzMaxHP(int unitID = -1)
{
   return(kbUnitGetStatFloat(unitID, cUnitStatMaxHP));
}

float dbzHPRatio(int unitID = -1)
{
   float maxHP = dbzMaxHP(unitID);
   if (maxHP <= 0.0)
   {
      return(0.0);
   }
   return(kbUnitGetStatFloat(unitID, cUnitStatCurrHP) / maxHP);
}

string dbzProtoName(int unitID = -1)
{
   return(kbProtoUnitGetName(kbUnitGetProtoUnitID(unitID)));
}

float dbzFavor(int playerID = -1)
{
   int previous = xsGetContextPlayer();
   xsSetContextPlayer(playerID);
   float favor = kbResourceGet(cResourceFavor);
   xsSetContextPlayer(previous);
   return(favor);
}

// Whole part of a non-negative amount (trPlayerGrantResources only takes ints).
int dbzWholeUnits(float amount = 0.0)
{
   int whole = 0;
   float rest = amount;
   while (rest >= 1.0)
   {
      whole++;
      rest = rest - 1.0;
   }
   return(whole);
}

void dbzNotify(int playerID = -1, string message = "")
{
   trChatSendToPlayer(0, playerID, message);
}

void dbzNotifyAll(string message = "")
{
   for (int p = 1; p < cNumberPlayers; p++)
   {
      trChatSendToPlayer(0, p, message);
   }
}

//==============================================================================
// Hero lines (a "line" survives stance swaps and saga transformations)
//==============================================================================
string dbzHeroLine(string protoName = "")
{
   if ((protoName == "DBZ_GokuEarly") || (protoName == "DBZ_GokuEarlyNimbus") || (protoName == "DBZ_GokuEarlyKaioken") ||
       (protoName == "DBZ_GokuSSJ1") || (protoName == "DBZ_GokuSSJ1Air") || (protoName == "DBZ_GokuSSJ3") || (protoName == "DBZ_GokuSSJ3Air"))
   {
      return("Goku");
   }
   if ((protoName == "DBZ_CellImperfect") || (protoName == "DBZ_CellImperfectAir") || (protoName == "DBZ_CellSemiPerfect") ||
       (protoName == "DBZ_CellSemiPerfectAir") || (protoName == "DBZ_CellPerfect") || (protoName == "DBZ_CellPerfectAir"))
   {
      return("Cell");
   }
   return(protoName);
}

string dbzHeroLandForm(string protoName = "")
{
   if ((protoName == "DBZ_GokuEarlyNimbus") || (protoName == "DBZ_GokuEarlyKaioken"))
   {
      return("DBZ_GokuEarly");
   }
   for (int i = 0; i < gDBZAirProtos.size(); i++)
   {
      if (gDBZAirProtos[i] == protoName)
      {
         return(gDBZLandProtos[i]);
      }
   }
   return(protoName);
}

int dbzHeroRegFind(int playerID = -1, string line = "")
{
   for (int i = 0; i < gDBZHeroRegPlayer.size(); i++)
   {
      if ((gDBZHeroRegPlayer[i] == playerID) && (gDBZHeroRegLine[i] == line))
      {
         return(i);
      }
   }
   return(-1);
}

void dbzRefreshHeroRegistry()
{
   int count = 0;
   int unitID = -1;
   int row = -1;
   string protoName = "";
   string line = "";
   int previous = xsGetContextPlayer();

   for (int r = 0; r < gDBZHeroRegAlive.size(); r++)
   {
      gDBZHeroRegAlive[r] = 0;
   }

   for (int p = 1; p < cNumberPlayers; p++)
   {
      xsSetContextPlayer(p);
      count = dbzRunQuery(gDBZQueryA, p, cUnitTypeHero);
      for (int i = 0; i < count; i++)
      {
         unitID = kbUnitQueryGetResult(gDBZQueryA, i);
         protoName = dbzProtoName(unitID);
         line = dbzHeroLine(protoName);
         row = dbzHeroRegFind(p, line);
         if (row < 0)
         {
            gDBZHeroRegPlayer.add(p);
            gDBZHeroRegLine.add(line);
            gDBZHeroRegProto.add(dbzHeroLandForm(protoName));
            gDBZHeroRegAlive.add(1);
         }
         else
         {
            gDBZHeroRegProto[row] = dbzHeroLandForm(protoName);
            gDBZHeroRegAlive[row] = 1;
         }
      }
   }
   xsSetContextPlayer(previous);
}

//==============================================================================
// God power ledger (feeds the Restored Youth wish)
//==============================================================================
bool dbzPowerLedgerHas(int playerID = -1, string powerName = "")
{
   for (int i = 0; i < gDBZPowerLedgerPlayer.size(); i++)
   {
      if ((gDBZPowerLedgerPlayer[i] == playerID) && (gDBZPowerLedgerName[i] == powerName))
      {
         return(true);
      }
   }
   return(false);
}

bool dbzPowerInSlots(int playerID = -1, int powerID = -1)
{
   for (int s = 0; s < cDBZGodPowerSlotsScanned; s++)
   {
      if (kbGodPowerGetIDInSlot(s, playerID) == powerID)
      {
         return(true);
      }
   }
   return(false);
}

void dbzRefreshPowerLedger()
{
   int powerID = -1;
   string powerName = "";
   for (int p = 1; p < cNumberPlayers; p++)
   {
      for (int s = 0; s < cDBZGodPowerSlotsScanned; s++)
      {
         powerID = kbGodPowerGetIDInSlot(s, p);
         if (powerID >= 0)
         {
            if (kbGodPowerGetIsIDValid(powerID) == true)
            {
               powerName = kbGodPowerGetName(powerID);
               if ((powerName != cDBZShenronPower) && (dbzPowerLedgerHas(p, powerName) == false))
               {
                  gDBZPowerLedgerPlayer.add(p);
                  gDBZPowerLedgerName.add(powerName);
               }
            }
         }
      }
   }
}

//==============================================================================
// 1. FLIGHT STANCE + KI UPKEEP
//==============================================================================
void dbzAddStancePair(string landProto = "", string airProto = "")
{
   gDBZLandProtos.add(landProto);
   gDBZAirProtos.add(airProto);
   gDBZAirProtoIDs.add(kbProtoUnitGetID(airProto));
}

// Ki hit zero: every airborne fighter of this player is pulled back to land.
void dbzForceLanding(int playerID = -1)
{
   bool landedAny = false;
   for (int i = 0; i < gDBZAirProtos.size(); i++)
   {
      if (kbUnitCount(gDBZAirProtoIDs[i], playerID, cUnitStateAlive) > 0)
      {
         trPlayerChangeProtoUnit(playerID, gDBZAirProtos[i], gDBZLandProtos[i], true, false);
         landedAny = true;
      }
   }
   if (landedAny == true)
   {
      dbzNotify(playerID, "Out of Ki! Your fighters drop out of the sky.");
   }
}

// Super Saiyan 3 with an empty Ki pool burns HP instead (never below 10%).
void dbzSSJ3Exhaustion(int playerID = -1)
{
   int count = 0;
   int unitID = -1;
   int previous = xsGetContextPlayer();
   xsSetContextPlayer(playerID);

   count = dbzRunQuery(gDBZQueryA, playerID, gDBZProtoGokuSSJ3);
   for (int i = 0; i < count; i++)
   {
      unitID = kbUnitQueryGetResult(gDBZQueryA, i);
      if (dbzHPRatio(unitID) > cDBZExhaustionFloorRatio)
      {
         dbzSelect(unitID);
         trDamageUnit(cDBZExhaustionHPPerSec);
      }
   }
   count = dbzRunQuery(gDBZQueryA, playerID, gDBZProtoGokuSSJ3Air);
   for (int j = 0; j < count; j++)
   {
      unitID = kbUnitQueryGetResult(gDBZQueryA, j);
      if (dbzHPRatio(unitID) > cDBZExhaustionFloorRatio)
      {
         dbzSelect(unitID);
         trDamageUnit(cDBZExhaustionHPPerSec);
      }
   }
   xsSetContextPlayer(previous);
}

rule dbzKiUpkeep
   inactive
   minInterval 1
{
   float airborne = 0.0;
   float ssj3 = 0.0;
   float drain = 0.0;
   int due = 0;
   int available = 0;

   for (int p = 1; p < cNumberPlayers; p++)
   {
      airborne = 0.0;
      for (int i = 0; i < gDBZAirProtoIDs.size(); i++)
      {
         airborne = airborne + kbUnitCount(gDBZAirProtoIDs[i], p, cUnitStateAlive);
      }
      ssj3 = kbUnitCount(gDBZProtoGokuSSJ3, p, cUnitStateAlive) + kbUnitCount(gDBZProtoGokuSSJ3Air, p, cUnitStateAlive);
      drain = (airborne * cDBZFlightKiPerSec) + (ssj3 * cDBZSSJ3KiPerSec);

      if (drain <= 0.0)
      {
         gDBZKiDebt[p] = 0.0;
      }
      else
      {
         gDBZKiDebt[p] = gDBZKiDebt[p] + drain;
         due = dbzWholeUnits(gDBZKiDebt[p]);
         if (due > 0)
         {
            available = dbzWholeUnits(dbzFavor(p));
            if (available >= due)
            {
               trPlayerGrantResources(p, "Favor", 0 - due);
               gDBZKiDebt[p] = gDBZKiDebt[p] - due;
            }
            else
            {
               if (available > 0)
               {
                  trPlayerGrantResources(p, "Favor", 0 - available);
               }
               gDBZKiDebt[p] = 0.0;
               dbzForceLanding(p);
               dbzSSJ3Exhaustion(p);
            }
         }
      }
   }
}

// Kaio-ken: 5 HP/s strain, automatic release at 10% HP so it can never self-kill.
rule dbzKaiokenStrain
   inactive
   minInterval 1
{
   int count = 0;
   int unitID = -1;
   int previous = xsGetContextPlayer();

   for (int p = 1; p < cNumberPlayers; p++)
   {
      xsSetContextPlayer(p);
      count = dbzRunQuery(gDBZQueryA, p, gDBZProtoGokuKaioken);
      for (int i = 0; i < count; i++)
      {
         unitID = kbUnitQueryGetResult(gDBZQueryA, i);
         dbzSelect(unitID);
         if (dbzHPRatio(unitID) <= cDBZKaiokenReleaseRatio)
         {
            trUnitChangeProtoUnit("DBZ_GokuEarly", true, false);
            dbzNotify(p, "Goku's body can't take any more. Kaio-ken released.");
         }
         else
         {
            trDamageUnit(cDBZKaiokenHPPerSec);
         }
      }
   }
   xsSetContextPlayer(previous);
}

//==============================================================================
// 2. CELL: TAIL BIOMASS ABSORPTION + EVOLUTION
//==============================================================================
bool dbzIsBiological(int unitID = -1)
{
   if (kbUnitIsType(unitID, cUnitTypeAbstractSiegeWeapon) == true)
   {
      return(false);
   }
   if (kbUnitIsType(unitID, cUnitTypeAbstractTitan) == true)
   {
      return(false);
   }
   if (kbUnitIsType(unitID, cUnitTypeHumanSoldier) == true)
   {
      return(true);
   }
   if (kbUnitIsType(unitID, cUnitTypeAbstractVillager) == true)
   {
      return(true);
   }
   if (kbUnitIsType(unitID, cUnitTypeLogicalTypeMythUnitNotTitan) == true)
   {
      return(true);
   }
   return(false);
}

bool dbzIsAbsorbableAndroid(int unitID = -1)
{
   int protoID = kbUnitGetProtoUnitID(unitID);
   if ((gDBZProtoAndroid17 >= 0) && (protoID == gDBZProtoAndroid17))
   {
      return(true);
   }
   if ((gDBZProtoAndroid18 >= 0) && (protoID == gDBZProtoAndroid18))
   {
      return(true);
   }
   return(false);
}

// 0 = Imperfect, 1 = Semi-Perfect, 2 = Perfect.
int dbzCellStage(string protoName = "")
{
   if ((protoName == "DBZ_CellSemiPerfect") || (protoName == "DBZ_CellSemiPerfectAir"))
   {
      return(1);
   }
   if ((protoName == "DBZ_CellPerfect") || (protoName == "DBZ_CellPerfectAir"))
   {
      return(2);
   }
   return(0);
}

// Keeps the Temple's Cell button on the stage he has reached, so a fallen Cell
// returns in his evolved form.
void dbzSyncCellTrainButton(int playerID = -1, string landProto = "")
{
   trProtounitRemoveTrain("Temple", playerID, "DBZ_CellImperfect");
   trProtounitRemoveTrain("Temple", playerID, "DBZ_CellSemiPerfect");
   trProtounitRemoveTrain("Temple", playerID, "DBZ_CellPerfect");
   trProtounitAddTrain("Temple", playerID, landProto, 2, 1);
}

void dbzCellCheckEvolution(int playerID = -1, int cellID = -1)
{
   string protoName = dbzProtoName(cellID);
   string nextProto = "";
   string nextLand = "";
   int needed = 0;

   if (protoName == "DBZ_CellImperfect")
   {
      nextProto = "DBZ_CellSemiPerfect";
      nextLand = "DBZ_CellSemiPerfect";
      needed = cDBZCellBiomassPerStage;
   }
   if (protoName == "DBZ_CellImperfectAir")
   {
      nextProto = "DBZ_CellSemiPerfectAir";
      nextLand = "DBZ_CellSemiPerfect";
      needed = cDBZCellBiomassPerStage;
   }
   if (protoName == "DBZ_CellSemiPerfect")
   {
      nextProto = "DBZ_CellPerfect";
      nextLand = "DBZ_CellPerfect";
      needed = 2 * cDBZCellBiomassPerStage;
   }
   if (protoName == "DBZ_CellSemiPerfectAir")
   {
      nextProto = "DBZ_CellPerfectAir";
      nextLand = "DBZ_CellPerfect";
      needed = 2 * cDBZCellBiomassPerStage;
   }

   if ((nextProto != "") && (gDBZCellBiomass[playerID] >= needed))
   {
      dbzSelect(cellID);
      trUnitChangeProtoUnit(nextProto, false, false);
      dbzSelect(cellID);
      trHealUnitPercent(100.0);
      dbzSyncCellTrainButton(playerID, nextLand);
      if (nextLand == "DBZ_CellPerfect")
      {
         dbzNotifyAll(kbPlayerGetName(playerID) + "'s Cell has achieved his PERFECT form!");
      }
      else
      {
         dbzNotifyAll(kbPlayerGetName(playerID) + "'s Cell has evolved into his Semi-Perfect form.");
      }
   }
}

void dbzCellAbsorb(int playerID = -1, int cellID = -1, int victimID = -1, bool android = false)
{
   float heal = dbzMaxHP(victimID) * cDBZCellAbsorbHealRatio;
   int stage = dbzCellStage(dbzProtoName(cellID));

   dbzSelect(victimID);
   trUnitDelete(false);
   dbzSelect(cellID);
   trHealUnit(heal);

   if (android == true)
   {
      if (gDBZCellBiomass[playerID] < ((stage + 1) * cDBZCellBiomassPerStage))
      {
         gDBZCellBiomass[playerID] = (stage + 1) * cDBZCellBiomassPerStage;
      }
      dbzNotifyAll(kbPlayerGetName(playerID) + "'s Cell has absorbed an Android!");
   }
   else
   {
      gDBZCellBiomass[playerID] = gDBZCellBiomass[playerID] + 1;
   }
   gDBZCellNextAbsorbMs[playerID] = xsGetTimeMS() + cDBZCellAbsorbCooldownMs;
   dbzCellCheckEvolution(playerID, cellID);
}

rule dbzCellBiomass
   inactive
   minInterval 1
{
   int cellCount = 0;
   int targetCount = 0;
   int cellID = -1;
   int targetID = -1;
   bool absorbed = false;
   float ratio = 0.0;
   vector cellPos = cInvalidVector;
   int previous = xsGetContextPlayer();

   for (int p = 1; p < cNumberPlayers; p++)
   {
      if (xsGetTimeMS() >= gDBZCellNextAbsorbMs[p])
      {
         xsSetContextPlayer(p);
         absorbed = false;
         for (int c = 0; c < gDBZCellProtoIDs.size(); c++)
         {
            if (absorbed == false)
            {
               cellCount = dbzRunQuery(gDBZQueryA, p, gDBZCellProtoIDs[c]);
               for (int i = 0; i < cellCount; i++)
               {
                  if (absorbed == false)
                  {
                     cellID = kbUnitQueryGetResult(gDBZQueryA, i);
                     cellPos = kbUnitGetPosition(cellID);
                     targetCount = dbzRunAreaQuery(gDBZQueryB, cPlayerRelationEnemyNotGaia, cUnitTypeUnit, cellPos, cDBZCellAbsorbRange);
                     for (int t = 0; t < targetCount; t++)
                     {
                        if (absorbed == false)
                        {
                           targetID = kbUnitQueryGetResult(gDBZQueryB, t);
                           ratio = dbzHPRatio(targetID);
                           if (kbUnitIsType(targetID, cUnitTypeHero) == true)
                           {
                              // Heroes are immune, except a badly wounded Android 17 or 18.
                              if ((dbzIsAbsorbableAndroid(targetID) == true) && (ratio <= cDBZCellAndroidAbsorbMaxHPRatio))
                              {
                                 dbzCellAbsorb(p, cellID, targetID, true);
                                 absorbed = true;
                              }
                           }
                           else if ((dbzIsBiological(targetID) == true) && (ratio <= cDBZCellAbsorbMaxHPRatio))
                           {
                              dbzCellAbsorb(p, cellID, targetID, false);
                              absorbed = true;
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   }
   xsSetContextPlayer(previous);
}

//==============================================================================
// SAIBAMAN: detonate on landing
// The Self-Destruct Leap is a native JumpAttack that deals the blast damage on
// impact. This rule watches each Saibaman's action and kills it as soon as the
// jump ends.
//==============================================================================
bool dbzSaibaTracked(int unitID = -1)
{
   for (int i = 0; i < gDBZSaibaLeaping.size(); i++)
   {
      if (gDBZSaibaLeaping[i] == unitID)
      {
         return(true);
      }
   }
   return(false);
}

rule dbzSaibamanDetonation
   inactive
   highFrequency
{
   int unitID = -1;
   int count = 0;
   bool finished = false;
   int previous = xsGetContextPlayer();

   if (xsGetTimeMS() < gDBZNextSaibaScanMs)
   {
      return;
   }
   gDBZNextSaibaScanMs = xsGetTimeMS() + cDBZSaibamanScanMs;

   // Detonate tracked leapers whose jump has finished.
   for (int i = gDBZSaibaLeaping.size() - 1; i >= 0; i--)
   {
      unitID = gDBZSaibaLeaping[i];
      finished = false;
      if (kbUnitGetIsIDValid(unitID, false) == false)
      {
         finished = true;
      }
      else
      {
         xsSetContextPlayer(kbUnitGetPlayerID(unitID));
         if (kbUnitGetActionType(unitID) != cActionTypeJumpAttack)
         {
            dbzSelect(unitID);
            trUnitDelete(false);
            finished = true;
         }
      }
      if (finished == true)
      {
         gDBZSaibaLeaping.removeIndex(i);
      }
   }

   // Track Saibamen that have just started a leap.
   for (int p = 1; p < cNumberPlayers; p++)
   {
      xsSetContextPlayer(p);
      count = dbzRunQuery(gDBZQueryA, p, gDBZProtoSaibaman);
      for (int j = 0; j < count; j++)
      {
         unitID = kbUnitQueryGetResult(gDBZQueryA, j);
         if ((kbUnitGetActionType(unitID) == cActionTypeJumpAttack) && (dbzSaibaTracked(unitID) == false))
         {
            gDBZSaibaLeaping.add(unitID);
         }
      }
   }
   xsSetContextPlayer(previous);
}

//==============================================================================
// KID BUU: Titan Gate swap + "cannot drop below 1 HP" floor
// Babidi's Cabal (Atlantean culture) Titans are re-bodied as Kid Buu. Kid Buu can
// only be finished while an enemy Major Hero is within 12m (the hero lands the
// ultimate blow) or while the quest var "dbzTitanVulnerableUntilMs" is in the
// future (set by the Universal Spirit Bomb power module).
//==============================================================================
rule dbzKidBuu
   inactive
   highFrequency
{
   int count = 0;
   int unitID = -1;
   int finishers = 0;
   bool vulnerable = false;
   int previous = xsGetContextPlayer();

   if (xsGetTimeMS() < gDBZNextBuuScanMs)
   {
      return;
   }
   gDBZNextBuuScanMs = xsGetTimeMS() + cDBZKidBuuScanMs;
   vulnerable = (trQuestVarGet("dbzTitanVulnerableUntilMs") > xsGetTimeMS());

   for (int p = 1; p < cNumberPlayers; p++)
   {
      xsSetContextPlayer(p);

      if (kbPlayerGetCulture(p) == cCultureAtlantean)
      {
         count = dbzRunQuery(gDBZQueryA, p, cUnitTypeAbstractTitan);
         for (int i = 0; i < count; i++)
         {
            unitID = kbUnitQueryGetResult(gDBZQueryA, i);
            if (kbUnitGetProtoUnitID(unitID) != gDBZProtoKidBuu)
            {
               dbzSelect(unitID);
               trUnitChangeProtoUnit("DBZ_KidBuu", false, false);
               dbzNotifyAll("Majin Buu's seal is broken. KID BUU has awakened!");
            }
         }
      }

      count = dbzRunQuery(gDBZQueryA, p, gDBZProtoKidBuu);
      for (int j = 0; j < count; j++)
      {
         unitID = kbUnitQueryGetResult(gDBZQueryA, j);
         if ((vulnerable == false) && (dbzHPRatio(unitID) < cDBZKidBuuFloorRatio))
         {
            finishers = dbzRunAreaQuery(gDBZQueryB, cPlayerRelationEnemyNotGaia, cUnitTypeMajorHero, kbUnitGetPosition(unitID), cDBZKidBuuFinisherRange);
            if (finishers == 0)
            {
               dbzSelect(unitID);
               trUnitSetHitpoints(dbzMaxHP(unitID) * cDBZKidBuuFloorRatio);
            }
         }
      }
   }
   xsSetContextPlayer(previous);
}

//==============================================================================
// 3. THE 7 DRAGON BALLS + SHENRON
//==============================================================================
int dbzLocateDragonBall(int index = -1)
{
   int previous = xsGetContextPlayer();
   int found = -1;
   xsSetContextPlayer(0);
   if (dbzRunQuery(gDBZQueryB, 0, kbProtoUnitGetID(gDBZBallProtos[index])) > 0)
   {
      found = kbUnitQueryGetResult(gDBZQueryB, 0);
   }
   xsSetContextPlayer(previous);
   return(found);
}

// Fallback placement on a ring around the map centre. A Dragon Ball random map
// script places guarded balls itself; this only fills in any that are missing.
int dbzSpawnDragonBall(int index = -1, float angle = 0.0)
{
   float mapX = kbGetMapXSize();
   float mapZ = kbGetMapZSize();
   float radius = cDBZBallRingRatio * mapX;
   if (mapZ < mapX)
   {
      radius = cDBZBallRingRatio * mapZ;
   }
   float x = (mapX * 0.5) + (radius * cos(angle));
   float z = (mapZ * 0.5) + (radius * sin(angle));
   int unitID = trUnitCreate(gDBZBallProtos[index], x, 0.0, z, 0, 0, true);
   gDBZBallIDs[index] = unitID;
   return(unitID);
}

void dbzSpawnDragonBalls()
{
   float step = cTwoPi / cDBZBallCount;
   float angle = xsRandFloat(0.0, cTwoPi);
   for (int i = 0; i < cDBZBallCount; i++)
   {
      dbzSpawnDragonBall(i, angle);
      angle = angle + step;
   }
}

void dbzEnsureDragonBalls()
{
   float step = cTwoPi / cDBZBallCount;
   float angle = xsRandFloat(0.0, cTwoPi);
   for (int i = 0; i < cDBZBallCount; i++)
   {
      gDBZBallIDs[i] = dbzLocateDragonBall(i);
      if (gDBZBallIDs[i] < 0)
      {
         dbzSpawnDragonBall(i, angle);
      }
      angle = angle + step;
   }
}

// After a wish the balls turn to stone and scatter for cDBZBallScatterSeconds.
void dbzScatterDragonBalls()
{
   for (int i = 0; i < cDBZBallCount; i++)
   {
      if (gDBZBallIDs[i] >= 0)
      {
         if (kbUnitGetIsIDValid(gDBZBallIDs[i], false) == true)
         {
            dbzSelect(gDBZBallIDs[i]);
            trUnitDelete(true);
         }
      }
      gDBZBallIDs[i] = -1;
   }
   gDBZBallRespawnAtSec = xsGetTime() + cDBZBallScatterSeconds;
   trSetLighting(gDBZMapLightingSet, 4.0);
   dbzNotifyAll("Shenron departs. The Dragon Balls turn to stone and scatter across the world.");
}

void dbzShenronReady(int playerID = -1)
{
   gDBZShenronOwner = playerID;
   trGodPowerGrant(playerID, cDBZShenronPower, 1, 0, false, false);
   gDBZShenronUsedBaseline = kbGodPowerGetNumUsedTimes(gDBZShenronPowerID, playerID);
   trSetLighting(cDBZShenronLighting, 3.0);
   trOverlayText("THE SKY GROWS DARK...", 5.0, 40.0, 255, 210, 60);
   dbzNotifyAll(kbPlayerGetName(playerID) + " has gathered all seven Dragon Balls!");
   dbzNotify(playerID, "Cast 'Summon the Eternal Dragon' to call Shenron.");
}

void dbzShenronRevoke()
{
   trGodPowerSetUseCount(gDBZShenronOwner, cDBZShenronPower, 0);
   trSetLighting(gDBZMapLightingSet, 3.0);
   dbzNotifyAll("A Dragon Ball was lost. The sky clears.");
   gDBZShenronOwner = -1;
}

//------------------------------------------------------------------------------
// The three wishes
//------------------------------------------------------------------------------
void dbzGrantImmortality(int playerID = -1)
{
   int previous = xsGetContextPlayer();
   int anchorID = -1;
   vector anchor = cInvalidVector;
   float offset = 0.0;

   dbzRefreshHeroRegistry();
   xsSetContextPlayer(playerID);
   if (dbzRunQuery(gDBZQueryA, playerID, cUnitTypeAbstractTemple) > 0)
   {
      anchorID = kbUnitQueryGetResult(gDBZQueryA, 0);
   }
   else if (dbzRunQuery(gDBZQueryA, playerID, cUnitTypeAbstractTownCenter) > 0)
   {
      anchorID = kbUnitQueryGetResult(gDBZQueryA, 0);
   }
   if (anchorID >= 0)
   {
      anchor = kbUnitGetPosition(anchorID);
      for (int r = 0; r < gDBZHeroRegPlayer.size(); r++)
      {
         if ((gDBZHeroRegPlayer[r] == playerID) && (gDBZHeroRegAlive[r] == 0))
         {
            offset = offset + 2.0;
            trUnitCreate(gDBZHeroRegProto[r], anchor.x + offset, anchor.y, anchor.z + 4.0, 0, playerID, false);
            gDBZHeroRegAlive[r] = 1;
         }
      }
   }
   xsSetContextPlayer(previous);
   gDBZImmortal[playerID] = 1;
   dbzNotifyAll(kbPlayerGetName(playerID) + " wished for IMMORTALITY. Fallen heroes return, and all heroes now regenerate.");
}

void dbzGrantWealth(int playerID = -1)
{
   trPlayerGrantResources(playerID, "Food", 1500);
   trPlayerGrantResources(playerID, "Wood", 1500);
   trPlayerGrantResources(playerID, "Gold", 1500);
   trPlayerGrantResources(playerID, "Favor", 200);
   dbzNotifyAll(kbPlayerGetName(playerID) + " wished for ULTIMATE WEALTH.");
}

void dbzGrantRestoredYouth(int playerID = -1)
{
   int powerID = -1;
   int used = 0;
   int charges = 0;
   string powerName = "";

   dbzRefreshPowerLedger();
   for (int i = 0; i < gDBZPowerLedgerPlayer.size(); i++)
   {
      if (gDBZPowerLedgerPlayer[i] == playerID)
      {
         powerName = gDBZPowerLedgerName[i];
         powerID = kbGodPowerGetID(powerName);
         used = kbGodPowerGetNumUsedTimes(powerID, playerID);
         if (used > 0)
         {
            if (dbzPowerInSlots(playerID, powerID) == true)
            {
               charges = kbGodPowerGetNumCharges(powerID, playerID);
               trGodPowerSetUseCount(playerID, powerName, charges + used);
            }
            else
            {
               trGodPowerGrant(playerID, powerName, used, 0, false, false);
            }
            trGodPowerSetUsedTimes(playerID, powerName, 0);
         }
      }
   }
   dbzNotifyAll(kbPlayerGetName(playerID) + " wished for RESTORED YOUTH. Every spent god power is renewed.");
}

bool dbzHasFallenHeroes(int playerID = -1)
{
   dbzRefreshHeroRegistry();
   for (int r = 0; r < gDBZHeroRegPlayer.size(); r++)
   {
      if ((gDBZHeroRegPlayer[r] == playerID) && (gDBZHeroRegAlive[r] == 0))
      {
         return(true);
      }
   }
   return(false);
}

void dbzFinishWish()
{
   gDBZWishPending = false;
   gDBZWishPlayer = -1;
   gDBZWishDeadlineSec = -1;
   dbzScatterDragonBalls();
}

void dbzWishImmortality(int eventID = -1)
{
   if (gDBZWishPending == true)
   {
      dbzGrantImmortality(gDBZWishPlayer);
      dbzFinishWish();
   }
}

void dbzWishMore(int eventID = -1)
{
   if (gDBZWishPending == true)
   {
      trShowChoiceDialogForPlayer(gDBZWishPlayer, "Shenron: Then name your wish.", "Ultimate Wealth", cDBZEventWishWealth, "Restored Youth", cDBZEventWishYouth);
   }
}

void dbzWishWealth(int eventID = -1)
{
   if (gDBZWishPending == true)
   {
      dbzGrantWealth(gDBZWishPlayer);
      dbzFinishWish();
   }
}

void dbzWishYouth(int eventID = -1)
{
   if (gDBZWishPending == true)
   {
      dbzGrantRestoredYouth(gDBZWishPlayer);
      dbzFinishWish();
   }
}

void dbzOpenWish(int playerID = -1)
{
   gDBZShenronOwner = -1;
   gDBZWishPlayer = playerID;
   gDBZWishPending = true;
   gDBZWishDeadlineSec = xsGetTime() + cDBZWishTimeoutSeconds;
   trOverlayText("SHENRON HAS RISEN", 5.0, 48.0, 90, 255, 120);

   if (trPlayerGetType(playerID) == cPlayerTypeHuman)
   {
      trShowChoiceDialogForPlayer(playerID, "Shenron: I am the Eternal Dragon. I shall grant you one wish.", "Immortality", cDBZEventWishImmortality, "Another wish...", cDBZEventWishMore);
   }
   else if (dbzHasFallenHeroes(playerID) == true)
   {
      dbzWishImmortality(cDBZEventWishImmortality);
   }
   else
   {
      dbzWishWealth(cDBZEventWishWealth);
   }
}

rule dbzDragonBalls
   inactive
   minInterval 2
{
   int unitID = -1;
   int containerID = -1;
   int owner = -1;
   int grant = 0;
   int previous = xsGetContextPlayer();

   // A human who never answers Shenron gets Ultimate Wealth.
   if (gDBZWishPending == true)
   {
      if (xsGetTime() >= gDBZWishDeadlineSec)
      {
         dbzWishWealth(cDBZEventWishWealth);
      }
      return;
   }

   // Stone year: the balls are gone until the timer ends.
   if (gDBZBallRespawnAtSec >= 0)
   {
      if (xsGetTime() >= gDBZBallRespawnAtSec)
      {
         gDBZBallRespawnAtSec = -1;
         dbzSpawnDragonBalls();
         dbzNotifyAll("The Dragon Balls have turned back from stone. The hunt begins again!");
      }
      return;
   }

   // Count balls deposited in each player's Temples.
   for (int p = 0; p < cNumberPlayers; p++)
   {
      gDBZBallsHeld[p] = 0;
   }
   xsSetContextPlayer(0);
   for (int i = 0; i < cDBZBallCount; i++)
   {
      unitID = gDBZBallIDs[i];
      if ((unitID < 0) || (kbUnitGetIsIDValid(unitID, false) == false))
      {
         unitID = dbzLocateDragonBall(i);
         if (unitID < 0)
         {
            unitID = dbzSpawnDragonBall(i, xsRandFloat(0.0, cTwoPi));
         }
         gDBZBallIDs[i] = unitID;
      }
      containerID = kbUnitGetContainer(unitID);
      if (containerID >= 0)
      {
         if (kbUnitIsType(containerID, cUnitTypeAbstractTemple) == true)
         {
            owner = kbUnitGetPlayerID(containerID);
            if ((owner > 0) && (owner < cNumberPlayers))
            {
               gDBZBallsHeld[owner] = gDBZBallsHeld[owner] + 1;
            }
         }
      }
   }
   xsSetContextPlayer(previous);

   // Passive trickle per deposited ball.
   for (int q = 1; q < cNumberPlayers; q++)
   {
      if (gDBZBallsHeld[q] > 0)
      {
         gDBZBallKiAcc[q] = gDBZBallKiAcc[q] + (gDBZBallsHeld[q] * cDBZBallKiPerSec * cDBZBallTickSeconds);
         gDBZBallZeniAcc[q] = gDBZBallZeniAcc[q] + (gDBZBallsHeld[q] * cDBZBallZeniPerSec * cDBZBallTickSeconds);
         grant = dbzWholeUnits(gDBZBallKiAcc[q]);
         if (grant > 0)
         {
            trPlayerGrantResources(q, "Favor", grant);
            gDBZBallKiAcc[q] = gDBZBallKiAcc[q] - grant;
         }
         grant = dbzWholeUnits(gDBZBallZeniAcc[q]);
         if (grant > 0)
         {
            trPlayerGrantResources(q, "Gold", grant);
            gDBZBallZeniAcc[q] = gDBZBallZeniAcc[q] - grant;
         }
      }
   }

   // Shenron state machine: Idle -> Ready (7 held) -> Wish (power cast) -> Scattered.
   if (gDBZShenronOwner < 0)
   {
      for (int s = 1; s < cNumberPlayers; s++)
      {
         if ((gDBZShenronOwner < 0) && (gDBZBallsHeld[s] >= cDBZBallCount))
         {
            dbzShenronReady(s);
         }
      }
   }
   else if (gDBZBallsHeld[gDBZShenronOwner] < cDBZBallCount)
   {
      dbzShenronRevoke();
   }
   else if (kbGodPowerGetNumUsedTimes(gDBZShenronPowerID, gDBZShenronOwner) > gDBZShenronUsedBaseline)
   {
      dbzOpenWish(gDBZShenronOwner);
   }
}

// Wish for Immortality: permanent +5 HP/s on every hero of the wisher.
rule dbzImmortalRegen
   inactive
   minInterval 1
{
   int count = 0;
   int previous = xsGetContextPlayer();
   for (int p = 1; p < cNumberPlayers; p++)
   {
      if (gDBZImmortal[p] == 1)
      {
         xsSetContextPlayer(p);
         count = dbzRunQuery(gDBZQueryA, p, cUnitTypeHero);
         for (int i = 0; i < count; i++)
         {
            dbzSelect(kbUnitQueryGetResult(gDBZQueryA, i));
            trHealUnit(cDBZImmortalRegenPerSec);
         }
      }
   }
   xsSetContextPlayer(previous);
}

rule dbzRegistries
   inactive
   minInterval 3
{
   dbzRefreshHeroRegistry();
   dbzRefreshPowerLedger();
}

//==============================================================================
// Bootstrap
//==============================================================================
rule dbzInit
   active
   highFrequency
{
   gDBZQueryA = kbUnitQueryCreate("dbzQueryA");
   gDBZQueryB = kbUnitQueryCreate("dbzQueryB");

   gDBZLandProtos = new string(0, "");
   gDBZAirProtos = new string(0, "");
   gDBZAirProtoIDs = new int(0, -1);
   dbzAddStancePair("DBZ_GokuEarly", "DBZ_GokuEarlyNimbus");
   dbzAddStancePair("DBZ_GokuSSJ1", "DBZ_GokuSSJ1Air");
   dbzAddStancePair("DBZ_GokuSSJ3", "DBZ_GokuSSJ3Air");
   dbzAddStancePair("DBZ_CellImperfect", "DBZ_CellImperfectAir");
   dbzAddStancePair("DBZ_CellSemiPerfect", "DBZ_CellSemiPerfectAir");
   dbzAddStancePair("DBZ_CellPerfect", "DBZ_CellPerfectAir");

   gDBZCellProtos = new string(0, "");
   gDBZCellProtoIDs = new int(0, -1);
   gDBZCellProtos.add("DBZ_CellImperfect");
   gDBZCellProtos.add("DBZ_CellImperfectAir");
   gDBZCellProtos.add("DBZ_CellSemiPerfect");
   gDBZCellProtos.add("DBZ_CellSemiPerfectAir");
   gDBZCellProtos.add("DBZ_CellPerfect");
   gDBZCellProtos.add("DBZ_CellPerfectAir");
   for (int c = 0; c < gDBZCellProtos.size(); c++)
   {
      gDBZCellProtoIDs.add(kbProtoUnitGetID(gDBZCellProtos[c]));
   }

   gDBZProtoGokuEarly = kbProtoUnitGetID("DBZ_GokuEarly");
   gDBZProtoGokuKaioken = kbProtoUnitGetID("DBZ_GokuEarlyKaioken");
   gDBZProtoGokuSSJ3 = kbProtoUnitGetID("DBZ_GokuSSJ3");
   gDBZProtoGokuSSJ3Air = kbProtoUnitGetID("DBZ_GokuSSJ3Air");
   gDBZProtoSaibaman = kbProtoUnitGetID("DBZ_Saibaman");
   gDBZProtoKidBuu = kbProtoUnitGetID("DBZ_KidBuu");
   // Defined by the Faction 3 module; -1 until then, which disables the Android rule.
   gDBZProtoAndroid17 = kbProtoUnitGetID("DBZ_Android17");
   gDBZProtoAndroid18 = kbProtoUnitGetID("DBZ_Android18");

   gDBZKiDebt = new float(cNumberPlayers, 0.0);
   gDBZBallKiAcc = new float(cNumberPlayers, 0.0);
   gDBZBallZeniAcc = new float(cNumberPlayers, 0.0);
   gDBZBallsHeld = new int(cNumberPlayers, 0);
   gDBZCellBiomass = new int(cNumberPlayers, 0);
   gDBZCellNextAbsorbMs = new int(cNumberPlayers, 0);
   gDBZImmortal = new int(cNumberPlayers, 0);
   gDBZSaibaLeaping = new int(0, -1);

   gDBZHeroRegPlayer = new int(0, -1);
   gDBZHeroRegLine = new string(0, "");
   gDBZHeroRegProto = new string(0, "");
   gDBZHeroRegAlive = new int(0, 0);
   gDBZPowerLedgerPlayer = new int(0, -1);
   gDBZPowerLedgerName = new string(0, "");

   gDBZBallProtos = new string(0, "");
   gDBZBallProtos.add("DBZ_DragonBall1Star");
   gDBZBallProtos.add("DBZ_DragonBall2Star");
   gDBZBallProtos.add("DBZ_DragonBall3Star");
   gDBZBallProtos.add("DBZ_DragonBall4Star");
   gDBZBallProtos.add("DBZ_DragonBall5Star");
   gDBZBallProtos.add("DBZ_DragonBall6Star");
   gDBZBallProtos.add("DBZ_DragonBall7Star");
   gDBZBallIDs = new int(cDBZBallCount, -1);
   gDBZShenronPowerID = kbGodPowerGetID(cDBZShenronPower);
   dbzEnsureDragonBalls();

   trEventSetHandler(cDBZEventWishImmortality, "dbzWishImmortality");
   trEventSetHandler(cDBZEventWishMore, "dbzWishMore");
   trEventSetHandler(cDBZEventWishWealth, "dbzWishWealth");
   trEventSetHandler(cDBZEventWishYouth, "dbzWishYouth");

   xsEnableRule("dbzKiUpkeep");
   xsEnableRule("dbzKaiokenStrain");
   xsEnableRule("dbzCellBiomass");
   xsEnableRule("dbzSaibamanDetonation");
   xsEnableRule("dbzKidBuu");
   xsEnableRule("dbzDragonBalls");
   xsEnableRule("dbzImmortalRegen");
   xsEnableRule("dbzRegistries");
   xsDisableSelf();
}
