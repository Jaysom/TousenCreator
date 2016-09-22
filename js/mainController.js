'use strict';
var TousenApp = angular.module('TousenApp', []);

TousenApp.controller('mainController', ['$scope','CardService', function(scope, CardService){
	scope.character = {};
	scope.richness = 0;
	scope.honor = 0;
	scope.orgs = [];
	scope.clans = [];

	scope.loadKinds = function(){
		CardService.getKinds()
			.success(_handerKindsuccess)
			.error(_handlerError);
		scope.loadFamilies();
	}

	scope.loadFamilies = function(){
		CardService.getFamilies()
			.success(_handlerFamilySuccess)
			.error(_handlerError);
	}
	
	scope.handleRace = function(selectedRace){
		scope.selectedRace = selectedRace;
        _handleCharacter(selectedRace);
	}

	scope.handleFatherFamily = function(res){
		scope.selectedFatherFamily = res;
		scope.fatherVent = [res.vent.big.key,res.vent.med.key,res.vent.dis.key];
	}
	
	scope.handleMotherFamily = function(res){
		scope.selectedMotherFamily = res;
		scope.motherVent = [res.vent.big.key,res.vent.med.key,res.vent.dis.key];
	}
	
	scope.setAdv = function(){
		scope.advSelected = scope.majorAvantage;
        scope.vents =  [scope.selectedFatherFamily.vent.big, scope.selectedMotherFamily.vent.big];
		scope.advDes = scope.vents.find(i => i.key == scope.advSelected);
	}
	
	scope.setMed = function(){
		scope.medSelected = scope.minorAvantage;
		scope.meds =  [scope.selectedFatherFamily.vent.med, scope.selectedMotherFamily.vent.med];
		scope.medDes = scope.meds.find(i => i.key == scope.medSelected);
	}
	
	scope.setDis = function(){
		scope.disSelected = scope.disAvantage;
        scope.disavs =  [scope.selectedFatherFamily.vent.dis, scope.selectedMotherFamily.vent.dis];
		scope.disDes = scope.disavs.find(i => i.key == scope.disSelected);
	}
	
	scope.getOrganizationClans = function(org){
		scope.clans = [];
		scope.organizationSelected = org;
		angular.forEach(org.values.clans, function(vals,clan){
			if(vals.Limit != null){
				if(checkFamilies(vals.Limit)) scope.clans.push({clan,vals});	
			}else{
				scope.clans.push({clan,vals});	
			}	
		});
	}
		
	scope.handleClan = function(clan) {
		scope.clanSelected = clan;
		if(Object.keys(clan.vals.Honor).length > 1) scope.honor = _handleCharacterHonor(scope.clanSelected.vals.Honor);	
		else scope.honor = scope.clanSelected.vals.Honor.Default + scope.character.honor;
		if(Object.keys(clan.vals.Richness).length > 1) scope.richness = _handleCharacterRichness(scope.clanSelected.vals.Richness);
		else scope.richness = scope.clanSelected.vals.Richness.Default + scope.character.richness;
		scope.weapons = clan.vals.Weapons;
		scope.clothes = clan.vals.Clothes;
		scope.character.mainWay = clan.vals.Principal;
		scope.character.secondaryWay = clan.vals.Secundaria;		
	}
	
	scope.setAbbiltyEffects = function() {
        applyAdvantage(scope.character, scope.vents.find(i => i.key == scope.advSelected));
        applyAdvantage(scope.character, scope.meds.find(i => i.key == scope.minorAvantage));
        applyAdvantage(scope.character, scope.disavs.find(i => i.key == scope.disAvantage));
        scope.disableButton = true;
		_loadOrganizations();
    }

	function _handerKindsuccess(res) {
		scope.races = res.kinds;
	}

	function _loadOrganizations(){
		CardService.getOrganizations()
			.success(_handleOrganizationsSuccess)
			.error(_handlerError);
	}
	
	function _handleCharacter(res) {
        scope.character.movement = res.attrs.mov;
        scope.character.intelligence = res.attrs.int;
        scope.character.atention = res.attrs.ate;
        scope.character.reaction = res.attrs.rea;
        scope.character.serenity = res.attrs.ser;
        scope.character.constitution = res.attrs.con;
        scope.character.perseverance = res.attrs.per;
        scope.character.size = res.attrs.tam;
		scope.character.initiative = scope.character.intelligence + scope.character.atention;
        scope.character.health = scope.character.constitution + scope.character.perseverance;
    }
	
	function _handlerFamilySuccess(res) {
		scope.families = res.Families;
		scope.character.honor = 0;
		scope.character.richness = 0;
	}
	
	function _handleOrganizationsSuccess(res){
		angular.forEach(res.Organizations, function(val){
			if(val.values.kinds == scope.selectedRace.name && val.values.families === undefined){
				scope.orgs.push(val);
			}else{
				if(checkFamilies(val.values.families)) scope.orgs.push(val);
			}
		});
	}
	
	function _handleCharacterHonor(honor) {
		var a = Object.keys(honor);
		if(checkFamilies(a)){
			if(a.indexOf(scope.selectedFatherFamily.Familia) != -1){
				return honor[scope.selectedFatherFamily.Familia] + scope.character.honor; 
			}else if(fam.indexOf(scope.selectedMotherFamily.Familia) != -1){
				return honor[scope.selectedMotherFamily.Familia] + scope.character.honor;;
			}
		} 
	}
	
	function _handleCharacterRichness(rich) {
		var a = Object.keys(rich);
		if(checkFamilies(a)){
			if(a.indexOf(scope.selectedFatherFamily.Familia) != -1){
				return rich[scope.selectedFatherFamily.Familia] + scope.character.richness;
			}else if(a.indexOf(scope.selectedMotherFamily.Familia) != -1){
				return rich[scope.selectedMotherFamily.Familia] + scope.character.richness;
			}
		}
	}
    
    function applyAdvantage(selectedPlayer, adv)  {
        if (adv.effect) {
                for (var k in adv.effect) {
                selectedPlayer[k] += adv.effect[k];
            }
        }
    }
	
	function checkFamilies(fam) {
		return fam.indexOf(scope.selectedFatherFamily.Familia) != -1 || fam.indexOf(scope.selectedMotherFamily.Familia) != -1;
	}
	
	function _handlerError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}
	
	scope.loadKinds();
}]);
