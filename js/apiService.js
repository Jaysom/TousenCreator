TousenApp.service('ApiService', ['$http', function($http) {
	this.requestApi = function(method, url, data, headers) {

		var configRequest = {
			method: method,
			url: url,
			headers: headers || {}
		};
		configRequest[method === 'get' ? 'params': 'data'] = data;
		return $http(configRequest);
	}


}]);