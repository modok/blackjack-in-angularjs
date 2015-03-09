/// <reference path="../../../../scripts/jasmine/jasmine.js" />
/// <reference path="../../../../scripts/jquery-2.1.3.min.js" />
/// <reference path="../../../../scripts/angular.js" />
/// <reference path="../../../../scripts/angular-mocks.js" />
/// <reference path="../../app/modules.js" />
/// <reference path="../../app/directives/cardDirective.js" />
/// <reference path="../../app/views/directives/cardDirective.html" />

describe('cardDirective:', function () {
	var target, scope, compile;

	beforeEach(function () {
		module('blackjack.directives');
		inject(function ($rootScope, $templateCache, $compile) {
			compile = $compile;
			var view = $templateCache.get('/AppJs/v1.0/app/views/directives/cardDirective.html');
			if (!view) {
				$.ajax({
					async: false,
					url: '../../app/views/directives/cardDirective.html'
				}).done(function (data) {
					$templateCache.put('/AppJs/v1.0/app/views/directives/cardDirective.html', data);
				});
			}
			scope = $rootScope.$new();
			scope.value = 1;
			scope.seed = 1;

			target = $compile('<card value="value" seed="seed"></card>')(scope);
			scope.$digest();
		});
	});

	it('should be possible to draw it', function () {
		expect(target.hasClass('card-1')).toBeTruthy();
		expect(target.hasClass('card')).toBeTruthy();
		expect(target.find('div').html()).toEqual(scope.value.toString());
	});

	it('should be possible draw a card of every seed', function () {
		scope.seed = 1;
		var clubsCard = compile('<card value="value" seed="seed"></card>')(scope);
		scope.$digest();
		expect(clubsCard.hasClass('clubs')).toBeTruthy();

		scope.seed = 2;
		var diamondsCard = compile('<card value="value" seed="seed"></card>')(scope);
		scope.$digest();
		expect(diamondsCard.hasClass('diamonds')).toBeTruthy();

		scope.seed = 3;
		var heartsCard = compile('<card value="value" seed="seed"></card>')(scope);
		scope.$digest();
		expect(heartsCard.hasClass('hearts')).toBeTruthy();

		scope.seed = 4;
		var spadesCard = compile('<card value="value" seed="seed"></card>')(scope);
		scope.$digest();
		expect(spadesCard.hasClass('spades')).toBeTruthy();
	});
});