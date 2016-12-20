(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('CreatureController', CreatureController);

		CreatureController.$inject = ['CreatureService', '$scope'];

    function CreatureController(CreatureService, $scope) {
		var vm = this;

        $scope.$on('SetCreatures', function (event, name) {
            return CreatureService.GetCreatures()
            .then(function(data) {
                return data.data.Creatures.find(a => a.Name == name).Kind;
            }).then(function(creature) {
                $scope.$emit('FilterCreatures', creature);
            })
            .catch(_handlerError);
        });
        

        function _handlerError(data, status) 
        {
            console.log(data || "Request failed");
            console.log(status);
        }
    }
})();
