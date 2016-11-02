(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('ArmoryController', ArmoryController);

		ArmoryController.$inject = ['ArmoryService'];

    function ArmoryController(ArmoryService) {
		var vm = this;
        function loadArmory()
        {
            loadWeapons();
            loadArmors();
            loadExtras();
        }

        function loadWeapons()
        {
            ArmoryService.getweapons()
                .success(_handlerWeapons)
                .error(_handlerError);
        }

        function loadArmors()
        {
            ArmoryService.getArmors()
                .success(_handlerArmors)
                .error(_handlerError);
        }

        function loadExtras()
        {
            ArmoryService.getExtras()
                .success(_handlerExtras)
                .error(_handlerError);
        }


        function _handlerWeapons(res)
        {
            scope.weapons = res.weapons;
        }

        function _handlerArmors(res)
        {
            scope.armors = res.weapons;
        }

        function _handleResult(res)
        {
            scope.weapons = res.weapons;
        }

        function _handlerError(data, status) 
        {
            console.log(data || "Request failed");
            console.log(status);
        }

    }
})();
