(function ($) {
	$.fn.preBind = function (type, fn) {
		this.each(function () {
			this.addEventListener('click', fn, true);
		});
		return this;
	};


	var TMDB = function () {
		var _self = this;
		var _login_dialog = new LoginDialog({
			title: 'Error Rating Movie',
			error: 'Unable to rate TMDB',
			error_msg: 'Click "Open Login Page" to login to TMDB and return to this page'
		});
		var _login_url = 'https://www.themoviedb.org/login';
		this.rate = function (tmdb_id, rating) {

			var promise = $.ajax('http://www.imdb.com/title/' + tmdb_id + '/remote/rating', {
				data:{rating:rating},
				type:'POST'
			});
			promise.done(function (data) {
				if (data.success) {
					console.log('success', data);
				} else {
					_login_dialog.open(_login_url, function () {
						_self.rate(tmdb_id, rating);
					});
				}

			});
			promise.fail(function (error) {
				console.log('fail', error);
			});

		}
	};

	var IMDB = function () {
		var _self = this;
		var _login_dialog = new LoginDialog({
			title: 'Error Rating Movie',
			error: 'Unable to rate TMDB',
			error_msg: 'Click "Open Login Page" to login to TMDB and return to this page'
		});
		var _login_url = 'https://www.themoviedb.org/login';
		this.rate = function (imdb_id, rating) {
			var promise = $.ajax('http://www.imdb.com/title/' + imdb_id);
			promise.done(function (data) {
				if (data) {
					var $html = $(data);
					console.log($html.find('[data-auth]').eq(0).attr('data-auth'));
				} else {
					_login_dialog.open(_login_url, function () {
						_self.rate(tmdb_id, rating);
					});
				}

			});
			promise.fail(function (error) {
				console.log('fail', error);
			});

		}
	};


	var LoginDialog = function (params) {
		var _$e = $('<div class="overlay-popup wide dark" style="margin-left: -259px; display: block;"><div class="overlay-close"></div>' +
			'<div class="title"><span>Error Rating Movie</span></div>' +
			'<fieldset class="overlay">' +
			'<div class="alert-message error">Unable to rate TMDB</div>' +
			'<div class="info">' +
			'<div class="name" style="color:white;font-size: 20px;">Please login to TMDB and return to this page</div>' +
			'</div>' +
			'</fieldset>' +
			'<div class="buttons right">' +
			'<a class="button cancel">Don\'t Rate</a>' +
			'<a class="button open-login" >Open Login Page!</a>' +
			'<a class="button try-again" style="display: none;">Try Again!</a>' +
			'</div>' +
			'</div>');
		var _$try_again = _$e.find('.try-again');
		var _$cancel = _$e.find('.cancel');
		var _$open_login = _$e.find('.open-login');
		var _callback = null;
		var _login_url = null;

		var _init = function () {
			_$e.find('.title span').text(params.title);
			_$e.find('.error').text(params.error);
			_$e.find('.name').text(params.error_msg);

			_bindEvents();
		};

		var _bindEvents = function () {
			_$e.on('click', '.open-login', function () {
				window.open(_login_url, '', 'width=1015,height=670');
				_$try_again.show();
				_$open_login.hide();
			});
			_$e.on('click', '.try-again', function () {
				_$e.detatch();
				_callback();

			});
			_$e.on('click', '.cancel', function () {
				_$e.detatch();
			});

		};

		var _reset = function () {
			_$try_again.hide();
			_$open_login.show();
			_login_url = null;
			_callback = null;
		};

		this.open = function (login_url, callback) {
			_reset();
			$('body').append(_$e);
			_callback = callback;
			_login_url = login_url;
			if (!_login_url) {
				_$try_again.show();
				_$open_login.hide();
			}
		};

		_init();
	};

	var tmdb = new TMDB();
	var imdb = new IMDB();

	$("[id^=rate-]").preBind('click', function () {
		var tmdb_id = $('#meta-tmdb-id').val();
		var imdb_id = $('#meta-imdb-id').val();
		var rating = parseInt(this.id.substr(5));
		//tmdb.rate(tmdb_id, rating);
		imdb.rate(imdb_id, rating);
	});

})(jQuery);







