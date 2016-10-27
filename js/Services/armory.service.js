TousenApp.service('ArmoryService', ['$http', function($http) {
    this.getWeapons = function(){
		return $http.get('js/Data/weapons.json');
	}

    this.getArmors = function(){
		return $http.get('js/Data/armors.json');
	}

    this.getExtras = function(){
		return $http.get('js/Data/extras.json');
	}
}]);