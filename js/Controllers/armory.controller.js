(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('ArmoryController', ArmoryController);

		ArmoryController.$inject = ['ArmoryService'];

    function ArmoryController(ArmoryService) {
		var vm = this;
        function LoadArmory()
        {
            LoadWeapons();
            LoadArmors();
            LoadExtras();
            LoadProjectiles();
        }

        function LoadWeapons()
        {
            ArmoryService.GetWeapons()
                .then(function(data) {
                    vm.weapons = data.data.Weapons;
                })
                .catch(_handlerError);
        }

        function LoadArmors()
        {
            ArmoryService.GetArmors()
                .then(function(data) {
                    vm.armors = data.data.Armors;
                })
                .catch(_handlerError);
        }

        function LoadExtras()
        {
            ArmoryService.GetExtras()
                .then(function(data) {
                    vm.extras = data.data.Complements;
                })
                .catch(_handlerError);
        }

        function LoadProjectiles()
        {
            ArmoryService.GetProjectiles()
                .then(function(data) { 
                    vm.projectiles = data.data.Projectiles;
                })
                .catch(_handlerError);
        }

        function _handlerError(data, status) 
        {
            console.log(data || "Request failed");
            console.log(status);
        }

        LoadArmory();
    }
})();
