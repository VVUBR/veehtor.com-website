//==============================================================================
// DRAGON BALL Z: AGE OF MYTHOLOGY | Random map: Dragon Ball Hunt | v0.1
//
// Open grassland with a standard start for every culture, plus seven guarded
// Dragon Ball sites spread across the map. Each site has broken columns, two
// crocodiles (the "dinosaurs") and an Automaton (the Red Ribbon mech), all owned
// by Mother Nature. The map loads game\trigger\dbz\dbz_core.xs and hands it the
// site coordinates, so the Dragon Balls appear exactly where the guards are.
//==============================================================================
include "lib2/rm_core.xs";

const int cDragonBallCount = 7;
const float cDragonBallAvoidPlayerMeters = 60.0;
const float cDragonBallAvoidSiteMeters = 45.0;

void generate()
{
   rmSetProgress(0.0);

   // Terrain mix: green Earth-like fields.
   int baseMixID = rmCustomMixCreate();
   rmCustomMixSetPaintParams(baseMixID, cNoiseFractalSum, 0.1, 5, 0.5);
   rmCustomMixAddPaintEntry(baseMixID, cTerrainGreekGrass2, 3.0);
   rmCustomMixAddPaintEntry(baseMixID, cTerrainGreekGrass1, 4.0);
   rmCustomMixAddPaintEntry(baseMixID, cTerrainGreekGrassDirt1, 3.0);
   rmCustomMixAddPaintEntry(baseMixID, cTerrainGreekGrassDirt2, 2.0);

   // Map size and terrain init.
   int axisTiles = getScaledAxisTiles(136);
   rmSetMapSize(axisTiles, axisTiles);
   rmInitializeMix(baseMixID);

   // Player placement.
   if(gameIs1v1() == true)
   {
      rmPlacePlayersOnCircle(0.375);
   }
   else
   {
      rmSetTeamSpacingModifier(xsRandFloat(0.8, 0.85));
      rmPlacePlayersOnCircle(0.36);
   }

   // Finalize player placement and do post-init things.
   postPlayerPlacement();

   // Mother Nature's civ and lighting.
   rmSetNatureCivFromCulture(cCultureGreek);
   rmSetLighting(cLightingSetRmMediterranean01);

   rmSetProgress(0.1);

   // Gentle rolling hills.
   rmAddGlobalHeightNoise(cNoiseFractalSum, 5.0, 0.05, 2, 0.5);

   placeKotHObjects();

   rmSetProgress(0.2);

   // Starting town centers and towers.
   placeStartingTownCenters();

   int startingTowerID = rmObjectDefCreate("starting tower");
   rmObjectDefAddItem(startingTowerID, cUnitTypeSentryTower, 1);
   addObjectLocsPerPlayer(startingTowerID, true, 4, cStartingTowerMinDist, cStartingTowerMaxDist, cStartingTowerAvoidanceMeters);
   generateLocs("starting tower locs");

   // Settlements.
   int firstSettlementID = rmObjectDefCreate("first settlement");
   rmObjectDefAddItem(firstSettlementID, cUnitTypeSettlement, 1);
   rmObjectDefAddConstraint(firstSettlementID, vDefaultSettlementAvoidEdge);
   rmObjectDefAddConstraint(firstSettlementID, vDefaultAvoidTowerLOS);
   rmObjectDefAddConstraint(firstSettlementID, vDefaultAvoidCorner40);

   int secondSettlementID = rmObjectDefCreate("second settlement");
   rmObjectDefAddItem(secondSettlementID, cUnitTypeSettlement, 1);
   rmObjectDefAddConstraint(secondSettlementID, vDefaultSettlementAvoidEdge);
   rmObjectDefAddConstraint(secondSettlementID, vDefaultAvoidTowerLOS);
   rmObjectDefAddConstraint(secondSettlementID, vDefaultAvoidCorner40);

   if(gameIs1v1() == true)
   {
      addSimObjectLocsPerPlayerPair(firstSettlementID, false, 1, 60.0, 80.0, cSettlementDist1v1, cBiasBackward);
      addSimObjectLocsPerPlayerPair(secondSettlementID, false, 1, 80.0, 120.0, cSettlementDist1v1, cBiasAggressive);
   }
   else
   {
      addObjectLocsPerPlayer(firstSettlementID, false, 1, 60.0, 80.0, cCloseSettlementDist, cBiasBackward | cBiasAllyInside);
      addObjectLocsPerPlayer(secondSettlementID, false, 1, 70.0, 90.0, cFarSettlementDist, cBiasAggressive | cBiasAllyOutside);
   }
   generateLocs("settlement locs");

   rmSetProgress(0.3);

   // Starting gold.
   int startingGoldID = rmObjectDefCreate("starting gold");
   rmObjectDefAddItem(startingGoldID, cUnitTypeMineGoldMedium, 1);
   rmObjectDefAddConstraint(startingGoldID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(startingGoldID, vDefaultAvoidImpassableLand20);
   rmObjectDefAddConstraint(startingGoldID, vDefaultStartingGoldAvoidTower);
   rmObjectDefAddConstraint(startingGoldID, vDefaultForceStartingGoldNearTower);
   addObjectLocsPerPlayer(startingGoldID, false, 1, cStartingGoldMinDist, cStartingGoldMaxDist, cStartingObjectAvoidanceMeters);
   generateLocs("starting gold locs");

   // Starting food: berries (Senzu crops), hunt (wild rations), chickens, pigs.
   int startingBerriesID = rmObjectDefCreate("starting berries");
   rmObjectDefAddItem(startingBerriesID, cUnitTypeBerryBush, xsRandInt(6, 9), cBerryClusterRadius);
   rmObjectDefAddConstraint(startingBerriesID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(startingBerriesID, vDefaultBerriesAvoidAll);
   rmObjectDefAddConstraint(startingBerriesID, vDefaultAvoidImpassableLand20);
   addObjectLocsPerPlayer(startingBerriesID, false, 1, cStartingBerriesMinDist, cStartingBerriesMaxDist, cStartingObjectAvoidanceMeters);

   int startingHuntID = rmObjectDefCreate("starting hunt");
   rmObjectDefAddItem(startingHuntID, cUnitTypeAurochs, 3);
   rmObjectDefAddConstraint(startingHuntID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(startingHuntID, vDefaultFoodAvoidAll);
   rmObjectDefAddConstraint(startingHuntID, vDefaultAvoidImpassableLand20);
   addObjectLocsPerPlayer(startingHuntID, false, 1, cStartingHuntMinDist, cStartingHuntMaxDist, cStartingObjectAvoidanceMeters);

   int startingChickenID = rmObjectDefCreate("starting chicken");
   rmObjectDefAddItem(startingChickenID, cUnitTypeChicken, xsRandInt(6, 9));
   rmObjectDefAddConstraint(startingChickenID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(startingChickenID, vDefaultFoodAvoidAll);
   rmObjectDefAddConstraint(startingChickenID, vDefaultAvoidImpassableLand20);
   addObjectLocsPerPlayer(startingChickenID, false, 1, cStartingChickenMinDist, cStartingChickenMaxDist, cStartingObjectAvoidanceMeters);

   int startingHerdID = rmObjectDefCreate("starting herd");
   rmObjectDefAddItem(startingHerdID, cUnitTypePig, xsRandInt(2, 3));
   rmObjectDefAddConstraint(startingHerdID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(startingHerdID, vDefaultHerdAvoidAll);
   addObjectLocsPerPlayer(startingHerdID, true, 1, cStartingHerdMinDist, cStartingHerdMaxDist);
   generateLocs("starting food locs");

   rmSetProgress(0.4);

   // Zeni veins (gold).
   float avoidGoldMeters = 50.0;

   int closeGoldID = rmObjectDefCreate("close gold");
   rmObjectDefAddItem(closeGoldID, cUnitTypeMineGoldLarge, 1);
   rmObjectDefAddConstraint(closeGoldID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(closeGoldID, vDefaultGoldAvoidAll);
   rmObjectDefAddConstraint(closeGoldID, vDefaultAvoidImpassableLand20);
   rmObjectDefAddConstraint(closeGoldID, vDefaultAvoidTowerLOS);
   rmObjectDefAddConstraint(closeGoldID, vDefaultAvoidSettlementRange);
   addObjectDefPlayerLocConstraint(closeGoldID, 65.0);
   addObjectLocsPerPlayer(closeGoldID, false, 1, 65.0, 80.0, avoidGoldMeters);

   int farGoldID = rmObjectDefCreate("far gold");
   rmObjectDefAddItem(farGoldID, cUnitTypeMineGoldLarge, 1);
   rmObjectDefAddConstraint(farGoldID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(farGoldID, vDefaultGoldAvoidAll);
   rmObjectDefAddConstraint(farGoldID, vDefaultAvoidImpassableLand20);
   rmObjectDefAddConstraint(farGoldID, vDefaultAvoidTowerLOS);
   rmObjectDefAddConstraint(farGoldID, vDefaultAvoidSettlementRange);
   addObjectDefPlayerLocConstraint(farGoldID, 85.0);
   addObjectLocsPerPlayer(farGoldID, false, 2 * getMapSizeBonusFactor(), 85.0, -1.0, avoidGoldMeters);
   generateLocs("gold locs");

   rmSetProgress(0.5);

   // Wildlife rations (hunt) and more Senzu crops (berries).
   float avoidFoodMeters = 50.0;

   int huntID = rmObjectDefCreate("hunt");
   if(xsRandBool(0.5) == true)
   {
      rmObjectDefAddItem(huntID, cUnitTypeDeer, xsRandInt(6, 8));
   }
   else
   {
      rmObjectDefAddItem(huntID, cUnitTypeBoar, xsRandInt(3, 4));
   }
   rmObjectDefAddConstraint(huntID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(huntID, vDefaultFoodAvoidAll);
   rmObjectDefAddConstraint(huntID, vDefaultAvoidImpassableLand20);
   rmObjectDefAddConstraint(huntID, vDefaultAvoidTowerLOS);
   rmObjectDefAddConstraint(huntID, vDefaultAvoidSettlementRange);
   addObjectDefPlayerLocConstraint(huntID, 60.0);
   addObjectLocsPerPlayer(huntID, false, 2 * getMapSizeBonusFactor(), 60.0, -1.0, avoidFoodMeters);

   int berriesID = rmObjectDefCreate("berries");
   rmObjectDefAddItem(berriesID, cUnitTypeBerryBush, xsRandInt(5, 8), cBerryClusterRadius);
   rmObjectDefAddConstraint(berriesID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(berriesID, vDefaultBerriesAvoidAll);
   rmObjectDefAddConstraint(berriesID, vDefaultAvoidImpassableLand20);
   rmObjectDefAddConstraint(berriesID, vDefaultAvoidTowerLOS);
   rmObjectDefAddConstraint(berriesID, vDefaultAvoidSettlementRange);
   addObjectDefPlayerLocConstraint(berriesID, 70.0);
   addObjectLocsPerPlayer(berriesID, false, 1 * getMapSizeBonusFactor(), 70.0, -1.0, avoidFoodMeters);
   generateLocs("food locs");

   rmSetProgress(0.6);

   // Dragon Ball sites: seven guarded camps, away from every player's base.
   int dragonBallSiteID = rmObjectDefCreate("dragon ball site");
   rmObjectDefAddItem(dragonBallSiteID, cUnitTypeColumnsBroken, 2, 3.0, 5.0);
   rmObjectDefAddItem(dragonBallSiteID, cUnitTypeCrocodile, 2, 4.0, 7.0);
   rmObjectDefAddItem(dragonBallSiteID, cUnitTypeAutomaton, 1, 4.0, 7.0);
   rmObjectDefAddConstraint(dragonBallSiteID, vDefaultAvoidEdge);
   rmObjectDefAddConstraint(dragonBallSiteID, vDefaultRelicAvoidAll);
   rmObjectDefAddConstraint(dragonBallSiteID, vDefaultAvoidImpassableLand20);
   rmObjectDefAddConstraint(dragonBallSiteID, vDefaultAvoidTowerLOS);
   rmObjectDefAddConstraint(dragonBallSiteID, vDefaultAvoidSettlementRange);
   rmObjectDefAddConstraint(dragonBallSiteID, rmCreateTypeDistanceConstraint(cUnitTypeColumnsBroken, cDragonBallAvoidSiteMeters));
   addObjectDefPlayerLocConstraint(dragonBallSiteID, cDragonBallAvoidPlayerMeters);
   rmObjectDefPlaceAnywhere(dragonBallSiteID, 0, cDragonBallCount);

   // Hand the site coordinates and lighting to the trigger library.
   rmTriggerAddScriptInclude("dbz/dbz_core.xs");
   rmTriggerAddScriptLine("rule _dbzMapConfig");
   rmTriggerAddScriptLine("active");
   rmTriggerAddScriptLine("highFrequency");
   rmTriggerAddScriptLine("runImmediately");
   rmTriggerAddScriptLine("{");
   rmTriggerAddScriptLine("gDBZMapLightingSet = \"" + cLightingSetRmMediterranean01 + "\";");

   int numSites = rmObjectDefGetNumberCreatedObjects(dragonBallSiteID);
   int siteIndex = 0;
   for(int i = 0; i < numSites; i++)
   {
      int siteObjectID = rmObjectDefGetCreatedObject(dragonBallSiteID, i);
      vector siteLoc = rmObjectGetLoc(siteObjectID);
      if(siteLoc == cInvalidVector)
      {
         continue;
      }
      if(siteIndex < cDragonBallCount)
      {
         rmTriggerAddScriptLine("dbzSetBallSite(" + siteIndex + ", " + siteLoc.x + ", " + siteLoc.z + ");");

         // Mark the site with a dirt clearing.
         int siteAreaID = rmAreaCreate("dragon ball clearing " + siteIndex);
         rmAreaSetLoc(siteAreaID, siteLoc);
         rmAreaSetTerrainType(siteAreaID, cTerrainGreekDirt1);
         rmAreaSetSize(siteAreaID, rmTilesToAreaFraction(16));
         rmAreaAddConstraint(siteAreaID, vDefaultAvoidImpassableLand8);
         rmAreaBuild(siteAreaID);

         siteIndex++;
      }
   }
   rmTriggerAddScriptLine("xsDisableSelf();");
   rmTriggerAddScriptLine("}");

   rmSetProgress(0.7);

   // Forests (Capsule Alloy comes from wood).
   float avoidForestMeters = 25.0;
   int forestDefID = rmAreaDefCreate("forest");
   rmAreaDefSetSizeRange(forestDefID, rmTilesToAreaFraction(60), rmTilesToAreaFraction(80));
   rmAreaDefSetForestType(forestDefID, cForestGreekMediterraneanLush);
   rmAreaDefSetAvoidSelfDistance(forestDefID, avoidForestMeters);
   rmAreaDefAddConstraint(forestDefID, vDefaultForestAvoidAll);
   rmAreaDefAddConstraint(forestDefID, vDefaultAvoidImpassableLand16);
   rmAreaDefAddConstraint(forestDefID, vDefaultAvoidSettlementWithFarm);
   rmAreaDefAddConstraint(forestDefID, vDefaultForestAvoidTownCenter);

   if(gameIs1v1() == true)
   {
      addSimAreaLocsPerPlayerPair(forestDefID, 3, cStartingForestMinDist, cStartingForestMaxDist, avoidForestMeters);
   }
   else
   {
      addAreaLocsPerPlayer(forestDefID, 3, cStartingForestMinDist, cStartingForestMaxDist, avoidForestMeters);
   }
   generateLocs("starting forest locs");

   rmAreaDefAddConstraint(forestDefID, vDefaultAvoidOwnerPaths, 0.0);
   buildAreaDefInTeamAreas(forestDefID, 8 * getMapAreaSizeFactor());

   placeStartingStragglers(cUnitTypeTreeCypress);

   rmSetProgress(0.8);

   // Rocky ground under the gold mines.
   buildAreaUnderObjectDef(startingGoldID, cTerrainGreekGrassRocks2, cTerrainGreekGrassRocks1, 6.0);
   buildAreaUnderObjectDef(closeGoldID, cTerrainGreekGrassRocks2, cTerrainGreekGrassRocks1, 6.0);
   buildAreaUnderObjectDef(farGoldID, cTerrainGreekGrassRocks2, cTerrainGreekGrassRocks1, 6.0);

   // Embellishment.
   int randomTreeID = rmObjectDefCreate("random tree");
   rmObjectDefAddItem(randomTreeID, cUnitTypeTreeCypress, 1);
   rmObjectDefAddConstraint(randomTreeID, vDefaultTreeAvoidAll);
   rmObjectDefAddConstraint(randomTreeID, vDefaultTreeAvoidCollideable);
   rmObjectDefAddConstraint(randomTreeID, vDefaultTreeAvoidTree);
   rmObjectDefAddConstraint(randomTreeID, vDefaultAvoidSettlementWithFarm);
   rmObjectDefPlaceAnywhere(randomTreeID, 0, 4 * cNumberPlayers * getMapAreaSizeFactor());

   int flowersID = rmObjectDefCreate("flowers");
   rmObjectDefAddItem(flowersID, cUnitTypeFlowers, 2, 4.0);
   rmObjectDefAddConstraint(flowersID, vDefaultEmbellishmentAvoidAll);
   rmObjectDefAddConstraint(flowersID, vDefaultAvoidImpassableLand8);
   rmObjectDefPlaceAnywhere(flowersID, 0, 10 * cNumberPlayers * getMapAreaSizeFactor());

   int rockSmallID = rmObjectDefCreate("rock small");
   rmObjectDefAddItem(rockSmallID, cUnitTypeRockGreekSmall, 1);
   rmObjectDefAddConstraint(rockSmallID, vDefaultEmbellishmentAvoidAll);
   rmObjectDefAddConstraint(rockSmallID, vDefaultAvoidImpassableLand8);
   rmObjectDefPlaceAnywhere(rockSmallID, 0, 15 * cNumberPlayers * getMapAreaSizeFactor());

   int plantBushID = rmObjectDefCreate("plant bush");
   rmObjectDefAddItem(plantBushID, cUnitTypePlantGreekBush, 1);
   rmObjectDefAddConstraint(plantBushID, vDefaultEmbellishmentAvoidAll);
   rmObjectDefPlaceAnywhere(plantBushID, 0, 20 * cNumberPlayers * getMapAreaSizeFactor());

   int birdID = rmObjectDefCreate("bird");
   rmObjectDefAddItem(birdID, cUnitTypeHawk, 1);
   rmObjectDefPlaceAnywhere(birdID, 0, 2 * cNumberPlayers * getMapAreaSizeFactor());

   rmSetProgress(1.0);
}
