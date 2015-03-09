///#source 1 1 /AppJs/v1.0/app/modules.js
angular.module('blackjack.services', []);
angular.module('blackjack.directives', []);
angular.module('blackjack.controllers', []);
angular.module('blackjack.models', []);
angular.module('blackjack', [
'blackjack.services',
'blackjack.directives',
'blackjack.controllers',
'blackjack.models'
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
					if (isFaceCard(cards[i].value)) {
						ret += 10;
					} else {
						ret += cards[i].value;
					}
				}
				return ret;
			}

			function isFaceCard(cardValue) {
				return cardValue === 11 || cardValue === 12 || cardValue === 13;
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
///#source 1 1 /AppJs/v1.0/app/models/deck.js
angular.module('blackjack.models')
.factory('deck', [function () {
	var deck = function () {
		this.draw = function (value, seed) {
			if (!!value && !!seed) {
				return {
					value: value,
					seed: seed
				}
			}
			if (!!value) {
				return {
					value: value,
					seed: ((Math.floor(Math.random() * 4)) + 1)
				}
			}
			return {
				value: (Math.floor(Math.random() * 13)) + 1,
				seed: ((Math.floor(Math.random() * 4)) + 1)
			};
		}
	};

	return new deck();
}]);
///#source 1 1 /AppJs/v1.0/app/services/dealerService.js
angular.module('blackjack.services')
.factory('dealerService', ['deck'
	, function (deck) {
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
					card = deck.draw();
					_card.push(card);
					_score = calculate();
					if (isBusted()) {
						_score = 0;
					}
					return _score;
				}

				if (isInRange(card)) {
					_card.push(deck.draw(card));
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
				return card > 0 && card < 14;
			}

			function isBusted() {
				return _score > 21 || _tempScore > 21;
			}

			function calculate() {
				setup();
				for (var i = 0, l = _card.length; i < l; i++) {
					var cardValue = _card[i].value;
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
					var card = _card[i].value;

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
				} else if (isFaceCard(cardValue)) {
					cardValue = 10;
				}

				return cardValue;
			}

			function isFaceCard(cardValue) {
				return cardValue === 11 || cardValue === 12 || cardValue === 13;
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
