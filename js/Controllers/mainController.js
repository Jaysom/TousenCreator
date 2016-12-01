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
		
		function GetKinds(){
			CharacterService.LoadKinds()
				.then(function (data) {
					vm.races = data.data.kinds;
				});
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
			vm.organizations = CharacterService.LoadOrganizations(vm.selectedRace)
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
		
		function _handlerError(data, status) 
		{
			console.log(data || "Request failed");
			console.log(status);
		}
	
		GetKinds();
	};
})();