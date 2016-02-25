'use strict';
var TousenApp = angular.module('TousenApp', []);

TousenApp.controller('mainController', ['$scope','CardService', function(scope, CardService){

	scope.Message =  "Welcome to The TousenApp Character builder!";
		
	scope.LoadKinds = function(){
		CardService.getKinds()
			.success(_handerKindsuccess)
			.error(_handlerError);
	}

	scope.LoadFamilies = function(){
		CardService.getFamilies()
			.success(_handlerFamilySuccess)
			.error(_handlerError);
	}

	function _handerKindsuccess(res) {
		scope.races = res.kinds;
	}
	
	function handleRace(selectedRace){
		scope.selectedRace = selectedRace;
	}

	function _handlerError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}

	function _handlerFamilySuccess(res) {
		scope.families = res.Families;
	}
	
	scope.handleFatherFamily = function(res){
		scope.selectedFatherFamily = res;
		scope.fatherVent = [Object.keys(res.vent.big)[0],Object.keys(res.vent.med)[0],Object.keys(res.vent.dis)[0]];
	}
	
	scope.handleMotherFamily = function(res){
		scope.selectedMotherFamily = res;
		scope.motherVent = [Object.keys(res.vent.big)[0],Object.keys(res.vent.med)[0],Object.keys(res.vent.dis)[0]];
	}
	
	scope.LoadKinds();
	scope.LoadFamilies();
}]);
