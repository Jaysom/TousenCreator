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
		scope.initiative = selectedRace.attrs.int + selectedRace.attrs.ate;
        _handleCharacter(selectedRace);
	}
    
    function _handleCharacter(res) {
        console.table(res);
        debugger;
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
	
	scope.setAdv = function(){
		scope.advSelected = scope.majorAvantage;
		scope.vents =  [scope.selectedFatherFamily.vent.big, scope.selectedMotherFamily.vent.big];
		scope.advDes = scope.vents.find(i => i.key == scope.advSelected);
        applyVentajas(scope.selectedRace, scope.vents.find(i => i.key == scope.advSelected));
	}
	
	scope.setMed = function(){
		scope.medSelected = scope.minorAvantage;
		scope.meds =  [scope.selectedFatherFamily.vent.med, scope.selectedMotherFamily.vent.med];
		scope.medDes = scope.meds.find(i => i.key == scope.medSelected);
        applyVentajas(scope.selectedRace, scope.medSelected);
	}
	
	scope.setDis = function(){
		scope.disSelected = scope.disAvantage;
		scope.disavs =  [scope.selectedFatherFamily.vent.dis, scope.selectedMotherFamily.vent.dis];
		scope.disDes = scope.disavs.find(i => i.key == scope.disSelected);
        applyVentajas(scope.selectedRace, scope.disSelected);
	}	
	
	function _handlerError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}
	
	function _handlerFamilySuccess(res) {
		scope.families = res.Families;
		scope.honor = 0;
		scope.richness = 0;
	}
    
    var applyVentajas = function(selectedPlayer, adv)  {
        if (adv) {
            if (adv.effect) {
                    for (var k in adv.effect) {
                    selectedPlayer.attrs[k] += adv.efecte[k];
                }
            }
        }
        debugger;  
    }
    
	scope.LoadKinds();
}]);
