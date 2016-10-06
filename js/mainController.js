'use strict';
var TousenApp = angular.module('TousenApp', []);

TousenApp.controller('mainController', ['$scope','CardService', function(scope, CardService){
	scope.character = {};
	scope.advantages = {}
	scope.character.richness = 0;
	scope.character.honor = 0;
	scope.orgs = [];
	scope.clans = [];

	scope.loadKinds = function()
	{
		CardService.getKinds()
			.success(_handerKindsuccess)
			.error(_handlerError);
		scope.loadFamilies();
	}

	scope.loadFamilies = function()
	{
		CardService.getFamilies()
			.success(_handlerFamilySuccess)
			.error(_handlerError);
	}
	
	scope.handleRace = function(selectedRace)
	{
		scope.selectedRace = selectedRace;
        _handleCharacter(selectedRace);
	}

	scope.handleFatherFamily = function(res){
		scope.selectedFatherFamily = res;
		scope.fatherVent = [res.vent.big.key,res.vent.med.key,res.vent.dis.key];
	}
	
	scope.handleMotherFamily = function(res){
		scope.selectedMotherFamily = res;
		scope.motherVent = [res.vent.big.key,res.vent.med.key,res.vent.dis.key];
	}
	
	scope.setAdv = function()
	{
        scope.vents =  [scope.selectedFatherFamily.vent.big, scope.selectedMotherFamily.vent.big];
		scope.advDes = scope.vents.find(i => i.key == scope.majorAvantage);
		if(scope.advDes.effect != null) 
		{
			_applyAdvantage(scope.character, scope.advDes);
			scope.advantages.big = _getAdvantageEffect(scope.advDes);
		}
		else 
		{
			_checkCalculatedAttributes();
			scope.advantages.big
		}
	}
	
	scope.setMed = function()
	{
		scope.meds =  [scope.selectedFatherFamily.vent.med, scope.selectedMotherFamily.vent.med];
		scope.medDes = scope.meds.find(i => i.key == scope.minorAvantage);
		if(scope.medDes.effect != null)
		{
			_applyAdvantage(scope.character, scope.medDes);
			scope.advantages.med = _getAdvantageEffect(scope.medDes);
		}
		else
		{
			scope.advantages.med = null;
			_checkCalculatedAttributes();
		} 
	}
	
	scope.setDis = function()
	{
        scope.disavs =  [scope.selectedFatherFamily.vent.dis, scope.selectedMotherFamily.vent.dis];
		scope.disDes = scope.disavs.find(i => i.key == scope.disAvantage);
		if(scope.disDes.effect !=null)
		{ 
			_applyAdvantage(scope.character, scope.disDes);
			scope.advantages.dis = _getAdvantageEffect(scope.disDes);
		}
		else
		{
			scope.advantages.dis = null;
			 _checkCalculatedAttributes();
		}
	}
	
	scope.getOrganizationClans = function(org)
	{
		scope.clans = [];
		scope.organizationSelected = org;
		angular.forEach(org.values.clans, function(vals,clan)
		{
			if(vals.Limit != null)
			{
				if(_checkFamilies(vals.Limit)) scope.clans.push({clan,vals});	
			 } else {
				scope.clans.push({clan,vals});	
			}	
		});
	}

	scope.loadOrganizations = function(){
		CardService.getOrganizations()
			.success(_handleOrganizationsSuccess)
			.error(_handlerError);
	}
		
	scope.handleClan = function(clan) 
	{
		scope.clanSelected = clan;
		if(Object.keys(clan.vals.Honor).length > 1) scope.honor = _handleCharacterHonor(scope.clanSelected.vals.Honor);	
		else scope.honor = scope.clanSelected.vals.Honor.Default;
		if(Object.keys(clan.vals.Richness).length > 1) scope.richness = _handleCharacterRichness(scope.clanSelected.vals.Richness);
		else scope.richness = scope.clanSelected.vals.Richness.Default;
		scope.weapons = clan.vals.Weapons;
		scope.clothes = clan.vals.Clothes;
		scope.character.mainWay = clan.vals.Principal;
		scope.character.secondaryWay = clan.vals.Secundaria;		
	}

	function _handerKindsuccess(res) 
	{
		scope.races = res.kinds;
	}

	
	function _handleCharacter(res) 
	{
        scope.character.mov = res.attrs.mov;
        scope.character.int = res.attrs.int;
        scope.character.ate = res.attrs.ate;
        scope.character.rea = res.attrs.rea;
        scope.character.ser = res.attrs.ser;
        scope.character.con = res.attrs.con;
        scope.character.per = res.attrs.per;
        scope.character.tam = res.attrs.tam;
		scope.character.initiative = 0
        scope.character.health = 0;
    }
	
	function _handlerFamilySuccess(res) 
	{
		scope.families = res.Families;
		scope.honor = 0;
		scope.richness = 0;
	}
	
	function _handleOrganizationsSuccess(res)
	{
		angular.forEach(res.Organizations, function(val){
			if(val.values.kinds == scope.selectedRace.name && val.values.families === undefined){
				scope.orgs.push(val);
			}else{
				if(_checkFamilies(val.values.families)) scope.orgs.push(val);
			}
		});
	}
	
	function _handleCharacterHonor(honor) 
	{
		var a = Object.keys(honor);
		if(_checkFamilies(a))
		{
			if(a.indexOf(scope.selectedFatherFamily.Familia) != -1)
			{
				return honor[scope.selectedFatherFamily.Familia]; 
			} else if(fam.indexOf(scope.selectedMotherFamily.Familia) != -1)
			{
				return honor[scope.selectedMotherFamily.Familia];
			}
		} else {
			return scope.clanSelected.vals.Honor.Default;
		}
	}
	
	function _handleCharacterRichness(rich) 
	{
		var a = Object.keys(rich);
		if(_checkFamilies(a))
		{
			if(a.indexOf(scope.selectedFatherFamily.Familia) != -1)
			{
				return rich[scope.selectedFatherFamily.Familia];
			}else if(a.indexOf(scope.selectedMotherFamily.Familia) != -1)
			{
				return rich[scope.selectedMotherFamily.Familia];
			}
		}else{
			return scope.clanSelected.vals.Richness.Default;
		}
	}
    
    function _applyAdvantage(selectedPlayer, adv)  
	{
        var k = _getAdvantageEffect(adv);
		switch(k){
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
				selectedPlayer[k] = scope.selectedRace.attrs[k] + adv.effect[k];
				_checkCalculatedAttributes();
				break;
		}			
    }
	
	function _checkFamilies(fam) {
		return fam.indexOf(scope.selectedFatherFamily.Familia) != -1 || fam.indexOf(scope.selectedMotherFamily.Familia) != -1;
	}

	function _getAdvantageEffect(advantage)
	{
		for (var k in advantage.effect)
		{
			return k;
		}
	}

	function _checkCalculatedAttributes()
	{
		if(!_checkHealthAdvantage()) scope.character.health = 0;
		if(!_checkInitiativeAdvantage()) scope.character.initiative = 0;
	}

	function _checkHealthAdvantage()
	{
		if(scope.majorAvantage != undefined && scope.minorAvantage != undefined && scope.disAvantage != undefined)
		{
			return (scope.advantages.big == "health" || scope.advantages.med == "health" || scope.advantages.dis == "health");	
		}
		return false;
	}

	function _checkInitiativeAdvantage()
	{
		if(scope.majorAvantage != undefined && scope.minorAvantage != undefined && scope.disAvantage != undefined)
		{
			return (scope.advantages.big  == "initiative" || scope.advantages.med  == "initiative" || scope.advantages.dis == "initiative");
		}	
		return false;
	}
	
	function _handlerError(data, status) 
	{
		console.log(data || "Request failed");
		console.log(status);
	}
	
	scope.loadKinds();
}]);
