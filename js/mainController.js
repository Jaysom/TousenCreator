'use strict';
var TousenApp = angular.module('TousenApp', []);

TousenApp.controller('mainController', ['$scope','CardService', function(scope, CardService){

	scope.Message =  "Welcome to The TousenApp Character builder!";
    
    scope.character = {};

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
        scope.character.initiative = scope.character.intelligence + scope.character.atention;
        scope.character.health = scope.character.constitution + scope.character.perseverance;
        
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
        applyAdvantage(scope.character, scope.vents.find(i => i.key == scope.advSelected));
	}
	
	scope.setMed = function(){
		scope.medSelected = scope.minorAvantage;
		scope.meds =  [scope.selectedFatherFamily.vent.med, scope.selectedMotherFamily.vent.med];
		scope.medDes = scope.meds.find(i => i.key == scope.medSelected);
        applyAdvantage(scope.character, scope.meds.find(i => i.key == scope.minorAvantage));
	}
	
	scope.setDis = function(){
		scope.disSelected = scope.disAvantage;
		scope.disavs =  [scope.selectedFatherFamily.vent.dis, scope.selectedMotherFamily.vent.dis];
		scope.disDes = scope.disavs.find(i => i.key == scope.disSelected);
        applyAdvantage(scope.character, scope.disavs.find(i => i.key == scope.disAvantage));
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
    
    var applyAdvantage = function(selectedPlayer, adv)  {
        if (adv.effect) {
            debugger;
                for (var k in adv.effect) {
                selectedPlayer[k] += adv.effect[k];
            }
        }
    }

	scope.LoadKinds();
}]);
