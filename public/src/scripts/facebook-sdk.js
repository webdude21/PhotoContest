(function ($, document, facebookClientID, window) {
    'use strict';

    $(document).ready(function () {
        $.ajaxSetup({cache: true});
        $.getScript('//connect.facebook.net/bg_BG/sdk.js', function () {
            window.FB.init({
                appId: facebookClientID,
                xfbml: true,
                version: 'v2.5'
            });
        });
    });
}(window.$, document, window.facebookClientID, window));
