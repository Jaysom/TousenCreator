angular
	.module('TousenApp')
	.service('ArmoryService', ArmoryService);

ArmoryService.$inject = ['$http'];

function ArmoryService($http){

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
}