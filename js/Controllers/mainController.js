(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('MainController', MainController);

		MainController.$inject = ['CharacterService','$scope'];

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
		
		function GetKinds() 
		{
			CharacterService.LoadKinds().succes(function(data){
				vm.races = data.kinds; });
		}

		vm.HandleRace = function(selectedRace)
		{
			vm.selectedRace = selectedRace;
			_handleCharacter(selectedRace);
		}
		
		vm.getOrganizationClans = function(org)
		{
			if(org !== null){
				vm.clans = [];
				vm.organizationSelected = org;
				angular.forEach(org.values.clans, function(vals,clan)
				{
					if(vals.Limit != null) {
						if(_checkFamilies(vals.Limit)) vm.clans.push({clan,vals});	
					} else {
						vm.clans.push({clan,vals});	
					}	
				});
			}
		}

		vm.loadOrganizations = function()
		{
			vm.organizations = [];
			vm.clans = [];
			vm.organizationSelected = null;
			vm.clanSelected = null;
			vm.organizations = CharacterService.LoadOrganizations(vm.character)
		}
			
		vm.handleClan = function(clan) 
		{
			if(clan !== null){
				vm.clanSelected = clan;
				if (Object.keys(clan.vals.Honor).length > 1) vm.honor = _handleCharacterHonor(vm.clanSelected.vals.Honor);
				else vm.honor = vm.clanSelected.vals.Honor.Default;
				if (Object.keys(clan.vals.Richness).length > 1) vm.richness = _handleCharacterRichness(vm.clanSelected.vals.Richness);
				else vm.richness = vm.clanSelected.vals.Richness.Default;
				vm.weapons = clan.vals.Weapons;
				vm.armors = clan.vals.Clothes;
				vm.character.mainWay = clan.vals.Principal;
				if (clan.vals.Secondary.length == 1) vm.character.secondaryWay = clan.vals.Secondary[0];
				vm.Dishonor = clan.vals.Dishonor;
			}
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
		}
		
		function _handleCharacterHonor(honor)
		{
			var a = Object.keys(honor);
			if (_checkFamilies(a)) {
				if (a.indexOf(vm.selectedFatherFamily.Family) != -1) {
					return honor[vm.selectedFatherFamily.Family]; 
				} else if (a.indexOf(vm.selectedMotherFamily.Family) != -1) {
					return honor[vm.selectedMotherFamily.Family];
				}
			} else {
				return vm.clanSelected.vals.Honor.Default;
			}
		}
		
		function _handleCharacterRichness(rich) 
		{
			var a = Object.keys(rich);
			if (_checkFamilies(a)) {
				if (a.indexOf(vm.selectedFatherFamily.Family) != -1) {
					return rich[vm.selectedFatherFamily.Family];
				} else if (a.indexOf(vm.selectedMotherFamily.Family) != -1) {
					return rich[vm.selectedMotherFamily.Family];
				}
			} else {
				return vm.clanSelected.vals.Richness.Default;
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
		
		function _handlerError(data, status) 
		{
			console.log(data || "Request failed");
			console.log(status);
		}
	
		GetKinds();
	};
})();