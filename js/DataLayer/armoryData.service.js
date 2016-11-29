angular
	.module('TousenApp')
	.service('ArmoryDataService', ArmoryDataService);

ArmoryDataService.$inject = ['$http'];

function ArmoryDataService($http){

	var armory = {
		getWeapons: getWeapons,
		getArmors: getArmors,
		getExtras: getExtras
	};

    function getWeapons(){
		return $http.get('js/Data/weapons.json');
	}

     function getArmors(){
		return $http.get('js/Data/armors.json');
	}

     function getExtras(){
		return $http.get('js/Data/extras.json');
	}

	return armory;
}