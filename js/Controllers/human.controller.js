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

		function LoadFamilies() {
			CharacterService.LoadFamilies()
				.then(function(data){
					vm.families = data.data.families;
				});
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

		function SetDefaultAdvantages(family){
			vm.majorAvantage =  family === true ? vm.selectedFatherFamily.advantages.big : vm.selectedFatherFamily.advantages.big;
			vm.minorAvantage =  family === true ? vm.selectedFatherFamily.advantages.med : vm.selectedFatherFamily.advantages.med;
		}

		function _applyAdvantage(selectedPlayer, adv)  
		{
			_checkCalculatedAttributes();
			var k = _getAdvantageEffect(adv);
			switch(k) {
				case "health":
					selectedPlayer[k] = adv.effect[k];
					break;
				case "initiative":
					selectedPlayer[k] = adv.effect[k];
					break;
				case "honor":
					selectedPlayer[k] = adv.effect[k];
					break;
				case "richness":
					selectedPlayer[k] = adv.effect[k];
					break;
				default:
					selectedPlayer[k] = vm.selectedRace.attributes[k] + adv.effect[k];
					break;
			}			
		}

		function _getAdvantageEffect(advantage)
		{
			for (var k in advantage.effect) {
				return k;
			}
		}

		function _checkCalculatedAttributes()
		{
			if (!_checkHealthAdvantage()) {
				vm.character.health = 0;
			}
			if (!_checkInitiativeAdvantage()) {
				vm.character.initiative = 0;
			}
			if (!_checkHonorAdvantage()) {
				vm.character.honor = 0;
			}
			if (!_checkRichnessAdvantage) {
				vm.character.richness = 0;
			}
		}

		function _checkHealthAdvantage()
		{
			if(_checkAllAdvantages()) {
				return (_getAdvantageEffect(vm.majorAvantage) === "health" || _getAdvantageEffect(vm.minorAvantage) === "health" || _getAdvantageEffect(vm.disAvantage) === "health");	
			}
			return false;
		}

		function _checkInitiativeAdvantage()
		{
			if(_checkAllAdvantages()) {
				return (_getAdvantageEffect(vm.majorAvantage) === "initiative" || _getAdvantageEffect(vm.minorAvantage) === "initiative" || _getAdvantageEffect(vm.disAvantage) === "initiative");
			}	
			return false;
		}

		function _checkHonorAdvantage()
		{
			if(_checkAllAdvantages()){
				return (_getAdvantageEffect(vm.majorAvantage) === "honor" || _getAdvantageEffect(vm.minorAvantage) === "honor" || _getAdvantageEffect(vm.disAvantage) === "honor");
			}
			return false;
		}

		function _checkRichnessAdvantage(){
			if(_checkAllAdvantages()){
				return (_getAdvantageEffect(vm.majorAvantage) === "richness" || _getAdvantageEffect(vm.minorAvantage) === "richness" || _getAdvantageEffect(vm.disAvantage) === "richness");
			}
			return false;
		}

		function _checkAllAdvantages(){
			return vm.majorAvantage != undefined && vm.minorAvantage != undefined && vm.disAvantage != undefined; 
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