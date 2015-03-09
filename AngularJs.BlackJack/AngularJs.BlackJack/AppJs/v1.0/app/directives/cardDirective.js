angular.module('blackjack.directives')
	.directive('card', [function () {
		return {
			replace: true,
			restrict: 'E',
			scope: {
				value: '=',
				seed: '='
			},
			templateUrl: '/AppJs/v1.0/app/views/directives/cardDirective.html',
			link: function (scope) {
				scope.getSeed = function () {
					if (scope.seed == 1) {
						return "clubs";
					}
					if (scope.seed == 2) {
						return "diamonds";
					}
					if (scope.seed == 3) {
						return "hearts";
					}
					if (scope.seed == 4) {
						return "spades";
					}

				};
			}
		};
	}]);