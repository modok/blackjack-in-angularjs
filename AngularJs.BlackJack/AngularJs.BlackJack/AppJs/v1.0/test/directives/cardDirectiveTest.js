/// <reference path="../../../../scripts/jasmine/jasmine.js" />
/// <reference path="../../../../scripts/jquery-2.1.3.min.js" />
/// <reference path="../../../../scripts/angular.js" />
/// <reference path="../../../../scripts/angular-mocks.js" />
/// <reference path="../../app/modules.js" />
/// <reference path="../../app/directives/cardDirective.js" />
/// <reference path="../../app/views/directives/cardDirective.html" />

describe('cardDirective:', function() {
	var target, scope;

	beforeEach(function () {
		module('blackjack.directives');
		inject(function ($rootScope, $templateCache, $compile) {

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

			target = $compile('<card type="value"></card>')(scope);
			scope.$digest();
		});
	});

	it('should be possible to draw it', function() {
		expect(target.hasClass('card-1')).toBeTruthy();
		expect(target.hasClass('card')).toBeTruthy();
		expect(target.find('div').html()).toEqual(scope.value.toString());
	});

});