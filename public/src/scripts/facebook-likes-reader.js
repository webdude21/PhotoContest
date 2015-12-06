(function (PARTICIPANTS_BASE_URL, $, document, FB) {
    'use strict';

    function getLikesCount(participantId) {
        return Math.random();
    }

    function getLinksWithParticipantsInfo() {
        var $links = $('a[data-participant]');
        debugger;

        $links.each(function (index, link) {
        });
    }

    if (PARTICIPANTS_BASE_URL) {
        $(document).ready(getLinksWithParticipantsInfo);
    }

}(window.PARTICIPANTS_BASE_URL, window.$, document));
