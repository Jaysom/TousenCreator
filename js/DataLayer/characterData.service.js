angular
	.module('TousenApp')
	.service('CharacterDataService', CharacterDataService);

	CharacterDataService.$inject = ['$http'];

function CharacterDataService($http){

	var characterData = {
		GetKinds: GetKinds,
		GetFamilies: GetFamilies,
		GetCreatures: GetCreatures,
		GetOrganizations: GetOrganizations
	};

	function GetKinds(){
		return $http.get('js/Data/kind.json');
	}
	
	function GetFamilies(){
		return $http.get('js/Data/families.json');
	}
	
	function GetCreatures() {
		return $http.get('js/Data/creatures.json');
	}
	
	function GetOrganizations() {
		return $http.get('js/Data/organizations.json');
	}

	return characterData;
}
    