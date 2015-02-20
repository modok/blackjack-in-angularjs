angular.module('blackjack.directives')
	.directive('card', [function () {
		return {
			replace: true,
			restrict:'E',
			scope: {
				type:'='
			},
			templateUrl: '/AppJs/v1.0/app/views/directives/cardDirective.html',
		};
	}]);