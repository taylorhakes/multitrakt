(function($) {
    $.fn.preBind = function (type, fn) {
        this.each(function () {
            this.addEventListener('click',fn,true);
        });
        return this;
    };

    window.LoginCallback = function() {
        alert('callback');
    };


    var TMDB = function() {
        var _self = this;
        var _login_url = 'https://www.themoviedb.org/login';
        this.rate = function(tmdb_id, rating) {
            var promise = $.ajax('http://www.themoviedb.org/movie/' + tmdb_id + '/remote/rating',{
                data: {rating: rating},
                type: 'POST'
            });
            promise.done(function(data) {
                if(data.success) {
                    console.log('success', data);
                } else {
                    dialog.open(function() {
                        _self.rate(tmdb_id, rating);
                    });
                }

            });
            promise.fail(function(error) {
                console.log('fail',error);
            });

        }
    };

    var IMDB = function() {


    };


    var LoginDialog = function() {
        var _$e = $('<div class="overlay-popup wide dark" style="margin-left: -259px; display: block;"><div class="overlay-close"></div>' +
                            '<div class="title"><span>Error Rating Movie</span></div>' +
                            '<fieldset class="overlay">' +
                            '<div class="alert-message error">Unable to rate TMDB</div>' +
                            '<div class="info">' +
                                '<div class="name" style="color:white;font-size: 20px;">Please login to TMDB and return to this page</div>' +
                            '</div>'+
                            '</fieldset>' +
                            '<div class="buttons right">' +
                                '<a class="button cancel">Don\'t Rate</a>' +
                                '<a class="button open-login" >Open Login Page!</a>' +
                                '<a class="button try-again" style="display: none;">Try Again!</a>' +
                            '</div>' +
                        '</div>');
       var _$try_again =  _$e.find('.try-again');
        var _$cancel =  _$e.find('.cancel');
        var _$open_login =  _$e.find('.open-login');
        var _callback = null;
        var _login_url = null;

        var _init = function() {
            _bindEvents();
        };

        var _bindEvents = function() {
            _$e.on('click','.open-login', function() {
                window.open(_login_url,'','width=1015,height=670');
                _$try_again.show();
                _$open_login.hide();
            });
            _$e.on('click','.try-again', function() {
                _callback();
            });
            _$e.on('click', '.cancel', function() {
                _$e.remove();
            });

        };

        var _reset = function() {
            _$try_again.hide();
            _$open_login.show();
            _login_url = null;
            _callback = null;
        };

        this.open = function(login_url,callback) {
            _reset();
            $('body').append(_$e);
            _callback = callback;
            _login_url = login_url;
            if(_login_url) {
                _$try_again.show();
                _$open_login.hide();
            }
        };

        _init();
    };


    var dialog = new LoginDialog();
    var tmdb = new TMDB();

    $("[id^=rate-]").preBind('click',function() {
        var tmdb_id = $('#meta-tmdb-id').val();
        var rating = parseInt(this.id.substr(5));
        tmdb.rate(tmdb_id,rating);
    });

})(jQuery);







