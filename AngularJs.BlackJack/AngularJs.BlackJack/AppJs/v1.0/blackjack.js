///#source 1 1 /AppJs/v1.0/app/modules.js
angular.module('blackjack.services', []);
angular.module('blackjack.directives', []);
angular.module('blackjack.controllers', []);
angular.module('blackjack', [
'blackjack.services',
'blackjack.directives',
'blackjack.controllers'
]);
///#source 1 1 /AppJs/v1.0/app/controllers/boardController.js
angular.module('blackjack.controllers')
	.controller('boardController', ['$scope', 'dealerService'
		, function ($scope, dealerService) {

			$scope.score = 0;
			$scope.isBusted = false;
			$scope.theDealerWon = false;
			$scope.gameIsOver = false;
			$scope.gameIsStarted = false;
			$scope.dealerScore = 0;
			$scope.playerCards = [];
			$scope.dealerCards = [];

			$scope.start = function () {
				reset();
				$scope.score = dealerService.giveCard();
				$scope.score = dealerService.giveCard();
				$scope.playerCards = dealerService.getCards();
				$scope.gameIsStarted = true;
			};

			$scope.getCard = function () {
				$scope.score = dealerService.giveCard();
				$scope.playerCards = dealerService.getCards();
				if ($scope.score === 0) {
					$scope.isBusted = true;
					$scope.pass();
				}
				return $scope.score;
			};

			$scope.pass = function () {
				dealerService.newTurn();
				playTheDealer();
			};

			$scope.getResultMessage = function () {
				if ($scope.isBusted) {
					return "YOU BUST";
				}
				if ($scope.theDealerWon && $scope.score == $scope.dealerScore) {
					return "TIE: YOU LOSE";
				}
				if ($scope.theDealerWon) {
					return "YOU LOSE";
				}
				return "YOU WIN";
			};

			$scope.getPlayerScore = function () {
				if ($scope.score == 0) {
					return calculateCardsValue($scope.playerCards);
				}

				return $scope.score;
			};

			$scope.getDealerScore = function () {
				if ($scope.dealerScore == 0) {
					return calculateCardsValue($scope.dealerCards);
				}

				return $scope.dealerScore;
			};

			$scope.start();

			function calculateCardsValue(cards) {
				var ret = 0;
				for (var i = 0, l = cards.length; i < l; i++) {
					ret += cards[i];
				}
				return ret;
			}

			function playTheDealer() {
				$scope.dealerScore = dealerService.giveCard();
				$scope.dealerCards = dealerService.getCards();
				if ($scope.dealerScore < $scope.score && $scope.dealerScore != 0) {
					playTheDealer();
				} else {
					if ($scope.dealerScore >= $scope.score) {
						$scope.theDealerWon = true;
					}
					$scope.gameIsOver = true;
				}
			}

			function reset() {
				$scope.score = 0;
				$scope.isBusted = false;
				$scope.theDealerWon = false;
				$scope.gameIsOver = false;
				$scope.dealerScore = 0;
				$scope.playerCards = [];
				$scope.dealerCards = [];

				dealerService.newTurn();
			}
		}]);
///#source 1 1 /AppJs/v1.0/app/directives/cardDirective.js
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
///#source 1 1 /AppJs/v1.0/app/services/dealerService.js
angular.module('blackjack.services')
.factory('dealerService', [function () {
	var s = function () {
		var t = this,
			_score = 0,
			_card = [],
			_acesFound = 0,
			_acesToRecalculate = 0,
			_tempScore = 0,
			_aceFound = false;


		t.giveCard = function (card) {
			if (typeof card === "undefined") {
				card = draw();
				_card.push(card);
				_score = calculate();
				if (isBusted()) {
					_score = 0;
				}
				return _score;
			}

			if (isInRange(card)) {
				_card.push(card);
				_score = calculate();
				if (isBusted()) {
					_score = 0;
				}
				return _score;
			} else {
				throw new RangeError("");
			}
		};

		t.newTurn = function () {
			_score = 0;
			_card = [];
			_tempScore = 0,
			_aceFound = false;

			return _score;
		};

		t.getCards = function () {
			return _card;
		};

		function isInRange(card) {
			return card > 0 && card < 11;
		}

		function isBusted() {
			return _score > 21 || _tempScore > 21;
		}

		function draw() {
			return (Math.floor(Math.random() * 10)) + 1;
		}

		function calculate() {
			setup();
			for (var i = 0, l = _card.length; i < l; i++) {
				var cardValue = _card[i];
				_tempScore += calculateAces(cardValue);
			}
			if (isBusted() && acesCanBeenReCalculated()) {
				return recalculate();
			}
			return _tempScore;
		}

		function recalculate() {
			var recalculation = 0;
			_acesToRecalculate++;
			_tempScore = 0;

			for (var i = 0, l = _card.length; i < l; i++) {
				var card = _card[i];

				if (isAce(card) && recalculation < _acesToRecalculate) {
					_tempScore += card;
					recalculation++;
				} else {
					_tempScore += calculateAces(card);
				}
			}

			if (isBusted() && acesCanBeenReCalculated()) {
				return recalculate();
			}

			return _tempScore;
		}

		function acesCanBeenReCalculated() {
			return _acesFound > 0 && _acesToRecalculate < _acesFound;
		}

		function setup() {
			_tempScore = 0;
			_aceFound = false;
			_acesToRecalculate = 0;
			_acesFound = 0;
		}

		function calculateAces(cardValue) {
			if (isAce(cardValue) && !goingToBust(_tempScore)) {
				_acesFound++;
				cardValue = 11;
			} else if (isAce(cardValue)) {
				_acesFound++;
				cardValue = 1;
			}

			return cardValue;
		}

		function isAce(card) {
			return card === 1;
		}

		function goingToBust(score) {
			return (score + 11) > 21;
		}
	}

	return new s();
}]);
