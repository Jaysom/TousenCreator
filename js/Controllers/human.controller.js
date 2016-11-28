(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('HumanController', HumanController);

		HumanController.$inject = ['CharacterService'];

	function HumanController(CharacterService) {
        var vm = this;
        var minor = "Menor";

        vm.loadHumanData = function(){
            loadFamilies();
			GetMinors();
        }

        function _handlerFamilySuccess(res) 
		{
			vm.families = res.Families;
			vm.honor = 0;
			vm.richness = 0;
		}

        vm.handleFatherFamily = function(res)
		{
			vm.selectedFatherFamily = res;
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
			vm.selectedMotherFamily = res;
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
			vm.Advantage = vm.advantages.father.find(i => i.key == fatherAdvantage.key);
			if (fatherAdvantage.isBig){
				vm.advantages.mother.shift();
			}
			if (fatherAdvantage.effect != null) {
				_applyAdvantage(vm.character, fatherAdvantage);
			} else {
				_checkCalculatedAttributes();
			}
		}
		
		vm.setMed = function(motherAdvantage)
		{
			vm.Minor = vm.advantages.mother.find(i => i.key == motherAdvantage.key);
			if (motherAdvantage.isBig){
				vm.advantages.father.shift();
			}
			if (motherAdvantage.effect != null) {
				_applyAdvantage(vm.character, motherAdvantage);
			} else {
				_checkCalculatedAttributes();
			} 
		}
		
		vm.setDis = function(disAdvantage)
		{
			vm.Disadvantage = vm.advantages.disadvantages.find(i => i.key == disAdvantage.key);
			if(disAdvantage.effect != null) { 
				_applyAdvantage(vm.character, disAdvantage);
			} else {
				_checkCalculatedAttributes();
			}
		}

        function _checkFamilies(fam) 
		{
			return fam.indexOf(vm.selectedFatherFamily.Family) != -1 || fam.indexOf(vm.selectedMotherFamily.Family) != -1;
		}

        function SetDefaultAdvantages(family){
			vm.majorAvantage =  family === true ? vm.selectedFatherFamily.advantages.big : vm.selectedFatherFamily.advantages.big;
			vm.minorAvantage =  family === true ? vm.selectedFatherFamily.advantages.med : vm.selectedFatherFamily.advantages.med;
		}

        function _handleMinors(res){
			vm.ListMinors = res.Families.find(a => a.Family === minor).advantages.med;
		}

        function LoadFamilies()
		{
			CharacterService.getFamilies()
				.success(_handlerFamilySuccess)
				.error(_handlerError);
		}

        function GetMinors(){
			CharacterService.getFamilies()
				.success(_handleMinors)
				.error(_handlerError);
		}

        function ResetSelectors()
		{
			vm.advantages.father = [];
			vm.advantages.mother = [];
			vm.advantages.disadvantages = [];
		}

        function GetMinorAdvantages(destiny, minorList)
		{
			angular.forEach(minorList, function(value){
				destiny.push(value);
			});
		}
    };
})();