/// <reference path="../../../../scripts/jasmine/jasmine.js" />
/// <reference path="../../../../scripts/jquery-2.1.3.min.js" />
/// <reference path="../../../../scripts/angular.js" />
/// <reference path="../../../../scripts/angular-mocks.js" />
/// <reference path="../../app/modules.js" />
/// <reference path="../../app/controllers/boardController.js" />

describe('boardController', function () {

	var target, scope, dealerService, spyOnGiveCard, spyOnGetCards, spyOnNewTurn;


	beforeEach(function () {
		module('blackjack.controllers');

		dealerService = {
			giveCard: function () {
			},
			newTurn: function () {
			},
			getCards: function () {
			}
		};

		inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();
			target = $controller('boardController', { '$scope': scope, 'dealerService': dealerService });
		});

		spyOnGiveCard = spyOn(dealerService, 'giveCard');
		spyOnNewTurn = spyOn(dealerService, 'newTurn');
		spyOnGetCards = spyOn(dealerService, 'getCards');
	});

	function askForBust() {
		dealerService.giveCard = function () {
			return 0;
		};
		scope.getCard();
	}

	function makeThePlayerWin() {
		spyOnGiveCard.and.returnValue(21);
		scope.getCard();
	}

	function makeThePlayerLose() {
		spyOnGiveCard.and.returnValue(1);
		scope.getCard();
	}

	function setupDealerGame() {
		spyOnGiveCard.and.returnValue(10);

	}

	function makeDealerLose() {
		spyOnGiveCard.and.returnValue(0);
	}

	function makeDealerWin() {
		spyOnGiveCard.and.returnValue(21);
	}

	it('should be possible ask a card to the dealer', function () {
		spyOnGiveCard.and.returnValue(2);

		var card = scope.getCard();
		expect(card).toEqual(2);
		expect(dealerService.giveCard).toHaveBeenCalled();
	});

	it('should be possible to get the current score', function () {
		spyOnGiveCard.and.returnValue(2);
		scope.getCard();
		expect(scope.score).toEqual(2);
	});

	it('the game should end when you bust', function () {
		expect(scope.isBusted).toBeFalsy();
		askForBust();
		expect(scope.isBusted).toBeTruthy();
		expect(scope.gameIsOver).toBeTruthy();
		expect(scope.getResultMessage()).toEqual("YOU BUST");

	});

	it('should be possible get all the cards of the player', function () {
		spyOnGetCards.and.returnValue([1]);
		scope.getCard();
		expect(scope.playerCards.length).toEqual(1);
	});

	it('should be possible get all the cards of the dealer', function () {
		spyOnGetCards.and.returnValue([1]);

		scope.pass();
		expect(scope.dealerCards.length).toEqual(1);
	});

	it('should be possible re-start a new game', function () {
		spyOnGiveCard.and.returnValue(0);

		scope.start();
		expect(scope.gameIsStarted).toBeTruthy();
		expect(scope.gameIsOver).toBeFalsy();

		expect(scope.score).toEqual(0);
		expect(scope.isBusted).toBeFalsy();
		expect(scope.theDealerWon).toBeFalsy();
		expect(scope.dealerScore).toEqual(0);

		expect(dealerService.newTurn.calls.count()).toEqual(1);
	});

	it('should be possible to pass and let the dealer play till he wins or busting', function () {
		expect(scope.dealerScore).toEqual(0);
		spyOnGiveCard.and.returnValue(2);
		scope.getCard();
		expect(scope.gameIsOver).toBeFalsy();
		setupDealerGame();
		scope.pass();
		expect(scope.dealerScore).toEqual(10);
		expect(scope.theDealerWon).toBeTruthy();
		expect(scope.gameIsOver).toBeTruthy();
	});

	it('should be possible for the player to win the game', function () {
		expect(scope.dealerScore).toEqual(0);
		makeThePlayerWin();
		expect(scope.gameIsOver).toBeFalsy();
		makeDealerLose();
		scope.pass();
		expect(scope.theDealerWon).toBeFalsy();
		expect(scope.gameIsOver).toBeTruthy();
		expect(scope.getResultMessage()).toEqual("YOU WIN");
	});

	it('should be possible for the player to lose the game', function () {
		expect(scope.dealerScore).toEqual(0);
		makeThePlayerLose();
		expect(scope.gameIsOver).toBeFalsy();
		makeDealerWin();
		scope.pass();
		expect(scope.theDealerWon).toBeTruthy();
		expect(scope.gameIsOver).toBeTruthy();
		expect(scope.getResultMessage()).toEqual("YOU LOSE");

	});

	it('should win the dealer in case of tie', function () {
		expect(scope.dealerScore).toEqual(0);
		makeThePlayerWin();
		expect(scope.gameIsOver).toBeFalsy();
		makeDealerWin();
		scope.pass();
		expect(scope.theDealerWon).toBeTruthy();
		expect(scope.gameIsOver).toBeTruthy();
		expect(scope.getResultMessage()).toEqual("TIE: YOU LOSE");

	});

	it('should be possible get a score when someone is busting', function () {
		spyOnGetCards.and.returnValue([
			{ value: 8 },
			{ value: 8 },
			{ value: 6 },
			{ value: 11 },
			{ value: 12 },
			{ value: 13 },
			{ value: 1 }]);

		askForBust();

		expect(scope.getPlayerScore()).toEqual(53);
		expect(scope.getDealerScore()).toEqual(53);
	});
});