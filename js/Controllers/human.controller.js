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
		vm.Families;
		vm.Minors = CharacterService.GetMinors()
		vm.advantages = {
			father:[],
			mother:[],
			disadvantages:[]
		}
		vm.families = {}

		function LoadFamilies() {
			CharacterService.LoadFamilies()
				.then(function(data){
					vm.Families = data.data.families;
				});
		}

		vm.handleFatherFamily = function(res)
		{
			vm.families.father = res;
			ResetAdvantages();
			if(vm.selectedMotherFamily !== undefined){
				if(vm.selectedMotherFamily.Family === minor && res.Family === minor){
					ResetSelectors();
				}
			}
			vm.advantages.father = [];
			vm.advantages.father[0] = res.advantages.big;
			vm.advantages.disadvantages[0] = res.advantages.disadvantage;
			if (res.Family !== minor) {
				vm.advantages.father[1] = res.advantages.medium;
			} else {
				GetMinorAdvantages(vm.advantages.father, vm.ListMinors);
			}		
		}
			
		vm.handleMotherFamily = function(res)
		{
			vm.families.mother = res;
			ResetAdvantages();
			if (vm.selectedFatherFamily !== undefined){
				if(vm.selectedFatherFamily.Family === minor && res.Family === minor){
					ResetSelectors();
				}
			}
			vm.advantages.mother = [];
			vm.advantages.mother[0] = res.advantages.big;
			vm.advantages.disadvantages[1] = res.advantages.disadvantage;
			if (res.Family !== minor) {
				vm.advantages.mother[1] = res.advantages.medium;
			} else {
				GetMinorAdvantages(vm.advantages.mother, vm.ListMinors);
			}	
		}

		vm.setAdv = function(fatherAdvantage)
		{
			if (fatherAdvantage.isBig){
				vm.advantages.mother.shift();
			}
			vm.advantages.fatherSelected = fatherAdvantage;
		}
		
		vm.setMed = function(motherAdvantage)
		{
			if (motherAdvantage.isBig){
				vm.advantages.father.shift();
			}
			vm.advantages.motherSelected = motherAdvantage;
		}
		
		vm.setDis = function(disAdvantage)
		{
			vm.advantages.disAdvantage = disAdvantage;
		}

		vm.setAdvantages = function(){
			$scope.$emit('sendAdvantages',vm.advantages, vm.families);
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
	};
})();