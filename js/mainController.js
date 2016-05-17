'use strict';
var TousenApp = angular.module('TousenApp', []);

TousenApp.controller('mainController', ['$scope','CardService', function(scope, CardService){

	scope.Message =  "Welcome to The TousenApp Character builder!";
    
    scope.character = {};
    scope.character.initiative = 0;
    scope.character.health = 0;
	scope.richness = 0;
	scope.honor = 0;
	scope.orgs = [];
	scope.clans = [];

	scope.LoadKinds = function(){
		CardService.getKinds()
			.success(_handerKindsuccess)
			.error(_handlerError);
		scope.LoadFamilies();
	}

	scope.LoadFamilies = function(){
		CardService.getFamilies()
			.success(_handlerFamilySuccess)
			.error(_handlerError);
	}

	function _handerKindsuccess(res) {
		scope.races = res.kinds;
	}
	
	function getOrganizationClans(org){
		angular.forEach(org.values.clans, function(vals,clan){
			if(vals.Limit != null){
				if(vals.Limit == scope.selectedFatherFamily.Familia || vals.Limit == scope.selectedMotherFamily.Familia){
					scope.clans.push({clan,vals});	
				}
			}else{
				scope.clans.push({clan,vals});	
			}	
		});
	}
	
	function _handleOrganizationsSuccess(res){
		angular.forEach(res.Organizations, function(val){
			debugger;
			if(val.values.kinds == scope.selectedRace.name){
				scope.orgs.push(val);
				debugger;
			}
		});
	}
	
	scope.handleRace = function(selectedRace){
		scope.selectedRace = selectedRace;
        _handleCharacter(selectedRace);
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
    }

	scope.handleFatherFamily = function(res){
		scope.selectedFatherFamily = res;
		scope.fatherVent = [res.vent.big.key,res.vent.med.key,res.vent.dis.key];
	}
	
	scope.handleMotherFamily = function(res){
		scope.selectedMotherFamily = res;
		scope.motherVent = [res.vent.big.key,res.vent.med.key,res.vent.dis.key];
	}
	
	scope.handleClan = function(clan) {
		scope.clanSelected = clan;
		scope.richness = scope.clanSelected.vals.richness + scope.character.richness;
		_handleCharacterHonor(scope.clanSelected.vals.Honor);
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
	
	function _handlerError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}
	
	function _handlerFamilySuccess(res) {
		scope.families = res.Families;
		scope.character.honor = 0;
		scope.character.richness = 0;
	}
	
	function _handleCharacterHonor(honor) {
		var a = Object.keys(honor);
		if((a.indexOf(scope.selectedFatherFamily.Familia) != -1 || a.indexOf(scope.selectedMotherFamily.Familia) != -1) == true){
			scope.honor = honor[scope.selectedFatherFamily.Familia] + scope.character.honor;
			scope.honor = honor[scope.selectedMotherFamily.Familia] + scope.character.honor;
		}
		else {
			scope.honor = honor["Default"];
		}
	}
    
    scope.setAbbiltyEffects = function() {
        applyAdvantage(scope.character, scope.vents.find(i => i.key == scope.advSelected));
        applyAdvantage(scope.character, scope.meds.find(i => i.key == scope.minorAvantage));
        applyAdvantage(scope.character, scope.disavs.find(i => i.key == scope.disAvantage));
        scope.character.initiative = scope.character.intelligence + scope.character.atention;
        scope.character.health = scope.character.constitution + scope.character.perseverance;
        scope.disableButton = true;
		scope.LoadOrganizations();
    }

	scope.LoadOrganizations = function(){
		CardService.getOrganizations()
			.success(_handleOrganizationsSuccess)
			.error(_handlerError);
	}
	
    var applyAdvantage = function(selectedPlayer, adv)  {
        if (adv.effect) {
                for (var k in adv.effect) {
                selectedPlayer[k] += adv.effect[k];
            }
        }
    }

	scope.LoadKinds();
}]);
