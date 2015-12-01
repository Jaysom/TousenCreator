'use strict';
var TousenApp = angular.module('TousenApp', []);

TousenApp.controller('mainController', ['$scope','CardService', function(scope, CardService){

	scope.Message =  "Welcome to The TousenApp Character builder!";
	scope.LoadKinds = function(){
		CardService.getKinds()
			.success(_handerKindsuccess)
			.error(_handerKindError);
	}

	scope.LoadFamilies = function(){
		CardService.getFamilies()
			.success(_handlerFamilySuccess)
			.error(_handlerFamilyError);
	}

	function _handerKindsuccess(res) {
		scope.races = res.kinds;
		scope.selectedRace = scope.races[0];
	}

	function _handerKindError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}

	function _handlerFamilySuccess(res) {
		scope.families = res.Families;
		scope.selectedFatherFamily = scope.families[0];
		scope.selectedMotherFamily = scope.families[0];
		
	}

	function _handlerFamilyError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}

	scope.LoadKinds();
	scope.LoadFamilies();
}]);
