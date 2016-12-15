angular
	.module('TousenApp')
	.service('ArmoryDataService', ArmoryDataService);

ArmoryDataService.$inject = ['$http'];

function ArmoryDataService($http){

	var armory = {
		GetWeapons: GetWeapons,
		GetArmors: GetArmors,
		GetExtras: GetExtras
	};

    function GetWeapons(){
		return $http.get('js/Data/weapons.json');
	}

     function GetArmors(){
		return $http.get('js/Data/armors.json');
	}

     function GetExtras(){
		return $http.get('js/Data/extras.json');
	}

	return armory;
}