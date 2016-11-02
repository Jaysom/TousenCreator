angular
	.module('TousenApp')
	.service('CharacterService', CharacterService);

	CharacterService.$inject = ['$http'];

function CharacterService($http){

	var character = {
		getKinds: getKinds,
		getFamilies: getFamilies,
		getCreatures: getCreatures,
		getOrganizations: getOrganizations

	};

	function getKinds(){
		return $http.get('js/Data/kind.json');
	}
	
	function getFamilies(){
		return $http.get('js/Data/families.json');
	}
	
	function getCreatures() {
		return $http.get('js/Data/creatures.json');
	}
	
	function getOrganizations() {
		return $http.get('js/Data/organizations.json');
	}

	return character;
}
    