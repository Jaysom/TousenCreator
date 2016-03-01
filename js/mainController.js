'use strict';
var TousenApp = angular.module('TousenApp', []);

TousenApp.controller('mainController', ['$scope','CardService', function(scope, CardService){

	scope.Message =  "Welcome to The TousenApp Character builder!";
		
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
	
	function _handlerError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}
	
	function _handlerFamilySuccess(res) {
		scope.families = res.Families;
		scope.honor = 0;
		scope.richness = 0;
	}
	

	scope.LoadKinds();
}]);
