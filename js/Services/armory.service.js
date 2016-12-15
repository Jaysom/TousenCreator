angular
	.module('TousenApp')
	.service('ArmoryService', ArmoryService);

ArmoryService.$inject = ['ArmoryDataService'];

function ArmoryService(ArmoryDataService){

	var armory = {
		GetWeapons: GetWeapons,
		GetArmors: GetArmors,
		GetExtras: GetExtras
	};

    function GetWeapons(){
		return ArmoryDataService.GetWeapons();
	}

     function GetArmors(){
		return ArmoryDataService.GetArmors();
	}

     function GetExtras(){
		return ArmoryDataService.GetExtras();
	}

	return armory;
}