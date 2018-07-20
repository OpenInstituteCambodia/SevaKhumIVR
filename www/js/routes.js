angular.module('selfivr')
.config(
['$stateProvider', '$urlRouterProvider', '$locationProvider',
function($stateProvider, $urlRouterProvider, $locationProvider) {
	// $urlRouterProvider.otherwise('/page/');
	$urlRouterProvider.when('', '/');
	$urlRouterProvider.when('/page', '/page/');

	$stateProvider
	.state('start', {
		url: '/',
		templateUrl: 'startup.html',
		controller: 'StartupCtrl'
	})
	.state('page', {
		url: '/page/{pageId}',
		templateProvider: ["$templateCache", "$stateParams", function($templateCache, $stateParams) {
			var param = $stateParams.pageId;
			var html = "";
			if(param === "") {
				html = $templateCache.get('main.html');
			} else {
				html = $templateCache.get($stateParams.pageId);
			}
			return html;
		}]
	});
}]);
