'use strict';
var TousenApp = angular.module('TousenApp', []);

TousenApp.controller('mainController', ['$scope','CardService', function(scope, CardService){

	/*scope.init = function() {
		
    };*/
	
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
	
	if(scope.selected == "Humano"){
		scope.enableFamilies = true;
		scope.LoadFamilies();
	}else{
		scope.enableFamilies = false;
	}

	function _handerKindsuccess(res) {
		scope.todos = res.kinds;
		scope.selected = scope.todos[0];
	}	

	function _handerKindError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}
	
	function _handlerFamilySuccess(res) {
		scope.families = res.Families;
		scope.selected = scope.families[0];
	}	

	function _handlerFamilyError(data, status) {
		console.log(data || "Request failed");
		console.log(status);
	}

	
}]);

