angular
	.module('TousenApp')
	.service('CreatureDataService', CreatureDataService);

CreatureDataService.$inject = ['$http'];

function CreatureDataService($http){

	var creatures = {
		GetCreatures: GetCreatures
	};

    function GetCreatures() {
		return $http.get('js/Data/creatures.json');
	}

	return creatures;
}