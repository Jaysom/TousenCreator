(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('MainController', MainController);

		MainController.$inject = ['CharacterService'];

	function MainController(CharacterService) {
		var vm = this;
		vm.character = {};
		vm.advantages = {
			big:[],
			med:[],
			dis:[]
		}
		vm.character.richness = 0;
		vm.character.honor = 0;
		vm.orgs = [];
		vm.clans = [];
		vm.Dishonor = [];

		vm.loadKinds = function()
		{
			CharacterService.getKinds()
				.success(_handerKindsuccess)
				.error(_handlerError);
			vm.loadFamilies();
		}

		vm.loadFamilies = function()
		{
			CharacterService.getFamilies()
				.success(_handlerFamilySuccess)
				.error(_handlerError);
		}
		
		vm.handleRace = function(selectedRace)
		{
			vm.selectedRace = selectedRace;
			_handleCharacter(selectedRace);
		}

		vm.handleFatherFamily = function(res)
		{
			vm.selectedFatherFamily = res;
			if(vm.selectedFatherFamily.Familia === "Menor") {
				vm.advantages.dis = [];
				_checkOpositeFamily(vm.selectedFatherFamily);
				angular.forEach(res.vent.dis, function(value){
					vm.advantages.dis.push(value);
				});
			} else {
				vm.advantages.big.push(res.vent.big);
				vm.advantages.med.push(res.vent.med);
				vm.advantages.dis.push(res.vent.dis);
			} 		
		}
		
		vm.handleMotherFamily = function(res)
		{
			vm.selectedMotherFamily = res;
			if(vm.selectedMotherFamily.Familia === "Menor") {
				vm.advantages.dis = [];
				_checkOpositeFamily(vm.selectedFatherFamily);
				angular.forEach(res.vent.dis, function(value){
					vm.advantages.dis.push(value);
				});
			} else {
				vm.advantages.big.push(res.vent.big);
				vm.advantages.med.push(res.vent.med);
				vm.advantages.dis.push(res.vent.dis);
			}
		}
		
		vm.setAdv = function()
		{
		 	vm.Advantage = vm.advantages.big.find(i => i.key == vm.majorAvantage.key);
			if(vm.Advantage.effect != null) {
				_applyAdvantage(vm.character, vm.Advantage);
			} else {
				_checkCalculatedAttributes();
			}
		}
		
		vm.setMed = function()
		{
			vm.Minor = vm.advantages.med.find(i => i.key == vm.minorAvantage.key);
			if(vm.Minor.effect != null) {
				_applyAdvantage(vm.character, vm.Minor);
			} else {
				_checkCalculatedAttributes();
			} 
		}
		
		vm.setDis = function()
		{
			vm.Disadvantage = vm.advantages.dis.find(i => i.key == vm.disAvantage.key);
			if(vm.Disadvantage.effect != null) { 
				_applyAdvantage(vm.character, vm.Disadvantage);
			} else {
				_checkCalculatedAttributes();
			}
		}
		
		vm.getOrganizationClans = function(org)
		{
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

		vm.loadOrganizations = function()
		{
			CharacterService.getOrganizations()
				.success(_handleOrganizationsSuccess)
				.error(_handlerError);
		}
			
		vm.handleClan = function(clan) 
		{
			vm.clanSelected = clan;
			if (Object.keys(clan.vals.Honor).length > 1) vm.honor = _handleCharacterHonor(vm.clanSelected.vals.Honor);
			else vm.honor = vm.clanSelected.vals.Honor.Default;
			if (Object.keys(clan.vals.Richness).length > 1) vm.richness = _handleCharacterRichness(vm.clanSelected.vals.Richness);
			else vm.richness = vm.clanSelected.vals.Richness.Default;
			vm.weapons = clan.vals.Weapons;
			vm.clothes = clan.vals.Clothes;
			vm.character.mainWay = clan.vals.Principal;
			if (clan.vals.Secondary.length == 1) vm.character.secondaryWay = clan.vals.Secondary[0];
			vm.Dishonor = clan.vals.Dishonor;
		}

		function _handerKindsuccess(res) 
		{
			vm.races = res.kinds;
		}
		
		function _handleCharacter(res) 
		{
			vm.character.mov = res.attrs.mov;
			vm.character.int = res.attrs.int;
			vm.character.ate = res.attrs.ate;
			vm.character.rea = res.attrs.rea;
			vm.character.ser = res.attrs.ser;
			vm.character.con = res.attrs.con;
			vm.character.per = res.attrs.per;
			vm.character.tam = res.attrs.tam;
			vm.character.initiative = 0
			vm.character.health = 0;
		}
		
		function _handlerFamilySuccess(res) 
		{
			vm.families = res.Families;
			vm.honor = 0;
			vm.richness = 0;
		}
		
		function _checkOpositeFamily(family)
		{
			if(family != undefined) {
				vm.advantages.big = [];
				vm.advantages.med = [];
				vm.advantages.big.push(family.vent.big);
				vm.advantages.med.push(family.vent.med);
				vm.advantages.dis.push(family.vent.dis);
			}			
		}

		function _handleOrganizationsSuccess(res)
		{
			angular.forEach(res.Organizations, function(val) 
			{
				if(val.values.kinds == vm.selectedRace.name) {
					if(val.values.families === undefined) vm.orgs.push(val);
					else {
						if(_checkFamilies(val.values.families)) vm.orgs.push(val);
					}
				}
			});
			vm.organizationsEnabled = true;
		}
		
		function _handleCharacterHonor(honor)
		{
			var a = Object.keys(honor);
			if(_checkFamilies(a)) {
				if(a.indexOf(vm.selectedFatherFamily.Familia) != -1){
					return honor[vm.selectedFatherFamily.Familia]; 
				} else if (a.indexOf(vm.selectedMotherFamily.Familia) != -1) {
					return honor[vm.selectedMotherFamily.Familia];
				}
			} else {
				return vm.clanSelected.vals.Honor.Default;
			}
		}
		
		function _handleCharacterRichness(rich) 
		{
			var a = Object.keys(rich);
			if(_checkFamilies(a)) {
				if(a.indexOf(vm.selectedFatherFamily.Familia) != -1) {
					return rich[vm.selectedFatherFamily.Familia];
				} else if (a.indexOf(vm.selectedMotherFamily.Familia) != -1) {
					return rich[vm.selectedMotherFamily.Familia];
				}
			} else {
				return vm.clanSelected.vals.Richness.Default;
			}
		}
		
		function _applyAdvantage(selectedPlayer, adv)  
		{
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
					selectedPlayer[k] = vm.selectedRace.attrs[k] + adv.effect[k];
					_checkCalculatedAttributes();
					break;
			}			
		}
		
		function _checkFamilies(fam) 
		{
			return fam.indexOf(vm.selectedFatherFamily.Familia) != -1 || fam.indexOf(vm.selectedMotherFamily.Familia) != -1;
		}

		function _getAdvantageEffect(advantage)
		{
			for (var k in advantage.effect) {
				return k;
			}
		}

		function _checkCalculatedAttributes()
		{
			if(!_checkHealthAdvantage()) vm.character.health = 0;
			if(!_checkInitiativeAdvantage()) vm.character.initiative = 0;
		}

		function _checkHealthAdvantage()
		{
			if(vm.majorAvantage != undefined && vm.minorAvantage != undefined && vm.disAvantage != undefined) {
				return (_getAdvantageEffect(vm.majorAvantage) === "health" || _getAdvantageEffect(vm.minorAvantage) === "health" || _getAdvantageEffect(vm.disAvantage) === "health");	
			}
			return false;
		}

		function _checkInitiativeAdvantage()
		{
			if(vm.majorAvantage != undefined && vm.minorAvantage != undefined && vm.disAvantage != undefined) {
				return (_getAdvantageEffect(vm.majorAvantage) === "initiative" ||_getAdvantageEffect(vm.minorAvantage) === "initiative" || _getAdvantageEffect(vm.disAvantage) === "initiative");
			}	
			return false;
		}
		
		function _handlerError(data, status) 
		{
			console.log(data || "Request failed");
			console.log(status);
		}
		
		vm.loadKinds();
		}
})();