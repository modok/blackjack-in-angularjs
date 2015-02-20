/// <reference path="../../../../scripts/jasmine/jasmine.js" />
/// <reference path="../../../../scripts/jquery-2.1.3.min.js" />
/// <reference path="../../../../scripts/angular.js" />
/// <reference path="../../../../scripts/angular-mocks.js" />
/// <reference path="../../app/modules.js" />
/// <reference path="../../app/services/dealerService.js" />

describe('dealerService:', function() {
	var target;

	beforeEach(function () {
		module('blackjack.services');
		inject(function($injector) {
			target = $injector.get('dealerService');
		});
	});

	it('should draw a random card', function() {
		expect(target.giveCard() > 0).toBeTruthy();
	});

	it('should draw a random card with value between 1 and 10', function () {
		var card = target.giveCard();
		expect(card).toBeGreaterThan(0);
		expect(card).toBeLessThan(12);
	});

	it('should draw a specific card', function () {
		expect(target.giveCard(2)).toBe(2);
	});

	it('should calculate an ace as 11', function () {
		expect(target.giveCard(1)).toBe(11);
	});

	it('should draw a specific card in a range between 1 and 10', function () {
		expect(function () { target.giveCard(11); }).toThrow(new RangeError());
		expect(function () { target.giveCard(0); }).toThrow(new RangeError());
		expect(function () { target.giveCard(1); }).not.toThrow(new RangeError());
	});

	it('should count the score', function () {
		expect(target.giveCard(2)).toBe(2);
		expect(target.giveCard(6)).toBe(8);
	});

	it('should return 0 if the score goes over 21', function () {
		expect(target.giveCard(2)).toBe(2);
		expect(target.giveCard(6)).toBe(8);
		expect(target.giveCard(6)).toBe(14);
		expect(target.giveCard(6)).toBe(20);
		expect(target.giveCard(6)).toBe(0);
	});

	it('should be possible start a new turn', function () {
		expect(target.giveCard(2)).toBe(2);
		expect(target.newTurn()).toBe(0);
	});

	it('should be possible to get all the card drawn', function () {
		target.giveCard(2);
		target.giveCard(4);
		var cards = target.getCards();
		expect(cards.length).toEqual(2);
		expect(cards[0]).toEqual(2);
		expect(cards[1]).toEqual(4);
	});

	it('the 1 should value 1 or 11 depending of the score without busting', function () {
		expect(target.giveCard(1)).toBe(11);
		expect(target.giveCard(7)).toBe(18);
		expect(target.giveCard(1)).toBe(19);
		expect(target.giveCard(1)).toBe(20);

		target.newTurn();
		expect(target.giveCard(1)).toBe(11);
		expect(target.giveCard(6)).toBe(17);
		expect(target.giveCard(6)).toBe(13);

		target.newTurn();
		expect(target.giveCard(1)).toBe(11);
		expect(target.giveCard(1)).toBe(12);
		expect(target.giveCard(6)).toBe(18);
		expect(target.giveCard(6)).toBe(14);

		target.newTurn();
		expect(target.giveCard(1)).toBe(11);
		expect(target.giveCard(1)).toBe(12);
		expect(target.giveCard(1)).toBe(13);
		expect(target.giveCard(6)).toBe(19);

		target.newTurn();
		expect(target.giveCard(1)).toBe(11);
		expect(target.giveCard(6)).toBe(17);
		expect(target.giveCard(1)).toBe(18);
		expect(target.giveCard(1)).toBe(19);

	});

});