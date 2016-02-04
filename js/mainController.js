'use strict';
var TousenApp = angular.module('TousenApp', []);

TousenApp.controller('mainController', ['$scope','CardService', function(scope, CardService){

	scope.Message =  "Welcome to The TousenApp Character builder!";
	
	scope.vent = [];
	scope.med = [];
	scope.dis = [];
	
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

	function _handlerError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}

	function _handlerFamilySuccess(res) {
		scope.families = res.Families;
	}
	
	scope.handleFatherFamily = function(res){
		scope.selectedFatherFamily = res;
		scope.vent.push(Object.keys(res.vent.big));
		scope.med.push(Object.keys(res.vent.med));
		scope.dis.push(Object.keys(res.vent.dis))
		console.log(res);
	}
	
	scope.handleMotherFamily = function(res){
		scope.selectedMotherFamily = res;
		scope.vent.push(Object.keys(res.vent.big));
		scope.med.push(Object.keys(res.vent.med));
		scope.dis.push(Object.keys(res.vent.dis))
		console.log(res);
	}

	scope.LoadKinds();
	scope.LoadFamilies();
}]);
