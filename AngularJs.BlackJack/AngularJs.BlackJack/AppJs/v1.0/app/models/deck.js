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