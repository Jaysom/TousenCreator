(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('MainController', MainController);

		MainController.$inject = ['CharacterService', '$scope'];

	function MainController(CharacterService, $scope) {
		var vm = this;
		vm.character = {};
		vm.character.richness = 0;
		vm.character.honor = 0;
		vm.honor = 0;
		vm.richness = 0;
		vm.organizations = [];
		vm.clans = [];
		vm.Dishonor = [];
		vm.organizationsEnabled = false;
		
		function GetKinds(){
			CharacterService.LoadKinds()
				.then(function (data) {
					vm.races = data.data.kinds;
				});
		}

		vm.SetCharacter = function(selectedRace)
		{
			vm.human = selectedRace.name === "Humano";
			vm.character.Race = selectedRace;
			_handleCharacter(selectedRace);
			if (!vm.human) {
				$scope.$broadcast('SetCreatures',selectedRace.name);
			}
		}

		vm.loadOrganizations = function()
		{
			vm.organizations = [];
			vm.clans = [];
			vm.organizationSelected = null;
			vm.clanSelected = null;
			CharacterService.FilterOrganizations(vm.character.Race, vm.familiesSelected).then(function(data){
				vm.organizations = data;
			});
		}

		vm.getOrganizationClans = function(org)
		{
			vm.clans = [];
			vm.organizationSelected = org;
			vm.clans = CharacterService.FilterClans(org, vm.familiesSelected);
		}
			
		vm.handleClan = function(clan) 
		{
			if(clan !== null){
				vm.clanSelected = clan;
				if (Object.keys(clan.vals.Honor).length > 1) {
					vm.honor = CharacterService.GetHonor(vm.clanSelected.vals.Honor, vm.familiesSelected);
				} else {
					vm.honor = vm.clanSelected.vals.Honor.Default;
				}
				
				if (Object.keys(clan.vals.Richness).length > 1) {
					vm.richness = CharacterService.GetRichness(vm.clanSelected.vals.Richness, vm.familiesSelected);
				} else {
					vm.richness = vm.clanSelected.vals.Richness.Default;
				}
				vm.weapons = clan.vals.Weapons;
				vm.armors = clan.vals.Clothes;
				vm.character.mainWay = clan.vals.Principal;
				if (clan.vals.Secondary.length == 1) {
					vm.character.secondaryWay = clan.vals.Secondary[0];
				}
				vm.Dishonor = clan.vals.Dishonor;
			}
		}

		function GetDescriptions()
		{
			CharacterService.LoadDescriptions();
		}
		
		function _handleCharacter(res) 
		{
			vm.character.movement = res.attributes.movement;
			vm.character.intelligence = res.attributes.intelligence;
			vm.character.atention = res.attributes.atention;
			vm.character.reaction = res.attributes.reaction;
			vm.character.serenity = res.attributes.serenity;
			vm.character.constitution = res.attributes.constitution;
			vm.character.perseverance = res.attributes.perseverance;
			vm.character. size = res.attributes.size;
			vm.character.initiative = 0
			vm.character.health = 0;
			vm.character.CurrentMoney = vm.Money;
			vm.character.CurrentExperience = vm.Experience;
		}
		
		function SetAdv()
		{
			if (vm.advantages.fatherSelected.effect != null) {
				_applyAdvantage(vm.character, vm.advantages.fatherSelected);
			} else {
				_checkCalculatedAttributes();
			}
		}
		
		function SetMed()
		{
			if (vm.advantages.motherSelected.effect != null) {
				_applyAdvantage(vm.character, vm.advantages.motherSelected);
			} else {
				_checkCalculatedAttributes();
			} 
		}
		
		function SetDis()
		{
			if(vm.advantages.disAdvantage.effect != null) { 
				_applyAdvantage(vm.character, vm.advantages.disAdvantage);
			} else {
				_checkCalculatedAttributes();
			}
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
					selectedPlayer[k] = vm.Race.attributes[k] + adv.effect[k];
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
		
		function _handlerError(data, status) 
		{
			console.log(data || "Request failed");
			console.log(status);
		}

		$scope.$on('SendAdvantages', function(event, advantages, families) 
		{
			vm.advantages = advantages;
			vm.familiesSelected = families;
			SetAdv();
			SetMed();
			SetDis();
			vm.organizationsEnabled = true;
			vm.loadOrganizations();
		});

		$scope.$on('FilterCreatures', function(event, data)
		{
			var kind = vm.character.Race.name;
			vm.creatures = data.find(a.Name == kind).Kinds;
		});
	
		GetKinds();
	};
})();