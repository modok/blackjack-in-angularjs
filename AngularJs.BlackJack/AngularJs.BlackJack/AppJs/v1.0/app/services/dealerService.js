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