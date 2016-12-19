angular
	.module('TousenApp')
	.service('CreatureService', CreatureService);

CreatureService.$inject = ['CreatureDataService'];

function CreatureService(CreatureDataService){

	var creatures = {
		GetCreatures : GetCreatures
	};

    function GetCreatures() {
		return CreatureDataService.GetCreatures();
	}

	return creatures;
}