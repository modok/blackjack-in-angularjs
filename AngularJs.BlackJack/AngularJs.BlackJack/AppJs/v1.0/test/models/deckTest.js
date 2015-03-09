/// <reference path="../../../../scripts/jasmine/jasmine.js" />
/// <reference path="../../../../scripts/jquery-2.1.3.min.js" />
/// <reference path="../../../../scripts/angular.js" />
/// <reference path="../../../../scripts/angular-mocks.js" />
/// <reference path="../../app/modules.js" />
/// <reference path="../../app/models/deck.js" />

describe('a deck:', function () {
	var deck;
	beforeEach(function () {

		module('blackjack.models');
		inject(function ($injector) {
			deck = $injector.get('deck');
		});

	});

	it('should be possible to draw a card', function () {
		for (var i = 0; i < 10000; i++) {
			var card = deck.draw();
			expect(card.value).toBeGreaterThan(0);
			expect(card.value).toBeLessThan(14);
			expect(card.seed).toBeGreaterThan(0);
			expect(card.seed).toBeLessThan(5);
		}
	});

	it('should be possible to draw a specific card', function () {
		var card = deck.draw(4, 1);
		expect(card.value).toEqual(4);
		expect(card.seed).toEqual(1);
	});

	it('should be possible to draw a specific card without specify a seed', function () {
		var card = deck.draw(4);
		expect(card.value).toEqual(4);
		expect(card.seed).toBeGreaterThan(0);
		expect(card.seed).toBeLessThan(5);
	});
});