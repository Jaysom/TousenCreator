angular
	.module('TousenApp')
	.service('CharacterService', CharacterService);

	CharacterService.$inject = ['$http'];

function CharacterService($http){
		this.getKinds = function(){
		return $http.get('js/Data/kind.json');
	}
	
	this.getFamilies = function(){
		return $http.get('js/Data/families.json');
	}
	
	this.getCreatures = function() {
		return $http.get('js/Data/creatures.json');
	}
	
	this.getOrganizations = function() {
		return $http.get('js/Data/organizations.json');
	}
}
    