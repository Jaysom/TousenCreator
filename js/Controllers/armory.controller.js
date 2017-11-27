(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('ArmoryController', ArmoryController);

		ArmoryController.$inject = ['ArmoryService'];

    function ArmoryController(ArmoryService) {
		var vm = this;
    }
})();
