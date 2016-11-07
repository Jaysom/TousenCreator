(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('MainController', MainController);

		MainController.$inject = ['CharacterService'];

	function MainController(CharacterService) {
		var vm = this;
		var minor = "Menor";
		vm.character = {};
		vm.advantages = {
			father:[],
			mother:[],
			disadvantages:[]
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
			GetMinors();
		}

		vm.loadFamilies = function()
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
		
		vm.handleRace = function(selectedRace)
		{
			vm.selectedRace = selectedRace;
			_handleCharacter(selectedRace);
		}

		vm.handleFatherFamily = function(res)
		{
			vm.selectedFatherFamily = res;
			ResetAdvantages();
			if(vm.selectedMotherFamily !== undefined){
				if(vm.selectedMotherFamily.Familia === minor && res.Familia === minor){
					ResetSelectors();
				}
			}
			vm.advantages.father = [];
			vm.advantages.father[0] = res.vent.big;
			vm.advantages.disadvantages[0] = res.vent.dis;
			if (res.Familia !== minor) {
				vm.advantages.father[1] = res.vent.med;
			} else {
				GetMinorAdvantages(vm.advantages.father, vm.ListMinors);
			}		
		}
		
		vm.handleMotherFamily = function(res)
		{
			vm.selectedMotherFamily = res;
			ResetAdvantages();
			if (vm.selectedFatherFamily !== undefined){
				if(vm.selectedFatherFamily.Familia === minor && res.Familia === minor){
					ResetSelectors();
				}
			}
			vm.advantages.mother = [];
			vm.advantages.mother[0] = res.vent.big;
			vm.advantages.disadvantages[1] = res.vent.dis;
			if (res.Familia !== minor) {
				vm.advantages.mother[1] = res.vent.med;
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
			if(motherAdvantage.effect != null) {
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
			vm.armors = clan.vals.Clothes;
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

		function _handleMinors(res){
			vm.ListMinors = res.Families.find(a => a.Familia === minor).vent.med;
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
					selectedPlayer[k] = vm.selectedRace.attrs[k] + adv.effect[k];
					break;
			}			
		}
		
		function _checkFamilies(fam) 
		{
			return fam.indexOf(vm.selectedFatherFamily.Familia) != -1 || fam.indexOf(vm.selectedMotherFamily.Familia) != -1;
		}
		
		function GetMinorAdvantages(destiny, minorList)
		{
			angular.forEach(minorList, function(value){
				destiny.push(value);
			});
		}

		function ResetAdvantages()
		{
			vm.fatherAdvantage = null;
			vm.motherAdvantage = null;
			vm.disAvantage = null;
		}

		function ResetSelectors()
		{
			vm.advantages.father = [];
			vm.advantages.mother = [];
			vm.advantages.disadvantages = [];
		}

		function SetDefaultAdvantages(family){
			vm.majorAvantage =  family === true ? vm.selectedFatherFamily.vent.big : vm.selectedFatherFamily.vent.big;
			vm.minorAvantage =  family === true ? vm.selectedFatherFamily.vent.med : vm.selectedFatherFamily.vent.med;
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
			if(!_checkHonorAdvantage()) vm.character.honor = 0;
			if(!_checkRichnessAdvantage) vm.character.richness = 0;
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
		
		vm.loadKinds();
		};
})();