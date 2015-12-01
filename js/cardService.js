TousenApp.service('CardService', ['$http', function($http) {

	this.getKinds = function(){
		return $http.get('js/kind.json');
	}
	
	this.getFamilies = function(){
		return $http.get('js/families.json');
	}
}]);
    