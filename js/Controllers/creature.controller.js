(function(){
	'use strict';
	angular
		.module('TousenApp')
		.controller('CreatureController', CreatureController);

		CreatureController.$inject = ['CreatureService', '$scope'];

    function CreatureController(CreatureService, $scope) {
		var vm = this;
    }
})();
