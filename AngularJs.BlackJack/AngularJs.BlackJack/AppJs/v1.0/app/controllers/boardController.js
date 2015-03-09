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