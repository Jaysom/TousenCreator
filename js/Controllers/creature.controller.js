(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('CreatureController', CreatureController);

		CreatureController.$inject = ['CreatureService'];

    function CreatureController(CreatureService) {
		var vm = this;

        vm.LoadCreatures = function(){
            CreatureService.GetCreatures()
                .then(function(data) {
                    vm.creatures = data.data;
                })
                .catch(_handlerError);
        }
        

        function _handlerError(data, status) 
        {
            console.log(data || "Request failed");
            console.log(status);
        }

        vm.LoadCreatures();
    }
})();
