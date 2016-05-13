TousenApp.service('CardService', ['$http', function($http) {

	this.getKinds = function(){
		return $http.get('js/kind.json');
	}
	
	this.getFamilies = function(){
		return $http.get('js/families.json');
	}
	
	this.getCreatures = function() {
		return $http.get('js/creatures.json');
	}
	
	this.getOrganizations = function() {
		return $http.get('js/organizations.json');
	}
}]);
    