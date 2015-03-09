describe('blackjack game', function () {
	it('should be possible to play a match passing immediately the turn and getting a result', function () {
		browser.get('http://localhost:7764/');

		var playerCards = element.all(by.repeater('card in playerCards'));
		var passBtn = element(by.css('.btn.btn-success'));

		expect(playerCards.count()).toEqual(2);

		passBtn.click();

		var playerScore = element(by.css('.player .score')).getText();
		var dealerScore = element(by.css('.dealer .score')).getText();

		playerScore.then(function (pS) {
			dealerScore.then(function (dS) {
				expect(parseInt(pS) <= parseInt(dS)).toBeTruthy();
				element(by.css('.game-over .text')).getText().then(function (endText) {
					if (dS > 21) {
						expect(endText).toEqual('YOU WIN');
					} else if (pS < dS) {
						expect(endText).toEqual('YOU LOSE');
					} else if (pS == dS) {
						expect(endText).toEqual('TIE: YOU LOSE');
					}
				});
			});
		});
	});

	it('should be possible to draw card till going to bust', function () {

		function goingToBust(playerScore, expectation) {
			playerScore.getText().then(function (ps) {
				if (parseInt(ps) <= 21) {
					drawBtn.click();
					expectedPlayerCards++;
					expect(playerCards.count()).toEqual(expectedPlayerCards);
					goingToBust(playerScore, expectation);
				} else {
					element(by.css('.game-over .text')).getText().then(function (endText) {
						expect(endText).toEqual(expectation);
					});
				}
			});

		}

		browser.get('http://localhost:7764/');

		var expectedPlayerCards = 2;
		var playerCards = element.all(by.repeater('card in playerCards'));
		var drawBtn = element(by.css('.btn.btn-danger'));

		expect(playerCards.count()).toEqual(expectedPlayerCards);

		drawBtn.click();
		expectedPlayerCards++;

		expect(playerCards.count()).toEqual(expectedPlayerCards);

		goingToBust(element(by.css('.player .score')), 'YOU BUST');
	});

});