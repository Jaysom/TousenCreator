(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('HumanController', HumanController);

		HumanController.$inject = ['CharacterService', '$scope'];

	function HumanController(CharacterService, $scope) 
	{
        var vm = this;
        var minor = "Menor";
		vm.families = [];
		vm.minors = CharacterService.GetMinors();
		vm.advantages = {
			father:[],
			mother:[],
			disadvantages:[]
		};
		vm.families = {};

		function LoadFamilies() {
			CharacterService.LoadFamilies()
				.then(function(data){
					vm.Families = data.data.families;
				});
		}

		function ResetSelectors()
		{
			vm.advantages.father = [];
			vm.advantages.mother = [];
			vm.advantages.disadvantages = [];
		}

		function ResetAdvantages()
		{
			vm.fatherAdvantage = null;
			vm.motherAdvantage = null;
			vm.disAvantage = null;
		}

		function GetMinorAdvantages(destiny, minorList)
		{
			angular.forEach(minorList, function(value){
				destiny.push(value);
			});
		}

		function _handlerError(data, status) 
		{
			console.log(data || "Request failed");
			console.log(status);
		}

		LoadFamilies();
	}
})();