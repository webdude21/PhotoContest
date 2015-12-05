(function (PARTICIPANTS_BASE_URL, $, document, FB) {
    'use strict';

    function getLikesCount(participantId) {
        return Math.random();
    }

    function getLinksWithParticipantsInfo() {
        var $links = $('a[data-participant]');
        debugger;

        $links.each(function (index, link) {

            FB.api( "/",
                {
                    "id": "http:\/\/www.imdb.com\/title\/tt2015381\/"
                },
                function (response) {
                    if (response && !response.error) {
                        /* handle the result */
                    }
                }
            );
        });
    }

    if (PARTICIPANTS_BASE_URL) {
        $(document).ready(getLinksWithParticipantsInfo);
    }

}(window.PARTICIPANTS_BASE_URL, window.$, document, FB));
