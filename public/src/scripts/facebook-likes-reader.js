(function (ACCESS_TOKEN, $, document, setTimeout, window) {
    var WAIT_TIME = 2000;
    var baseUrl = 'divastore.herokuapp.com' + '/contestants/';

    function getRequestObject(https, participantId) {
        var protocol = https ? 'https://' : 'http://';

        /* eslint-disable camelcase */
        return {
            access_token: ACCESS_TOKEN,
            id: protocol + baseUrl + participantId,
            fields: 'og_object{engagement{count}}'
        };
    }

    function getLikesCount(participantId, successHandler) {
        var resonseOne = {
                finished: false
            },
            responseTwo = {
                finished: false
            },
            resolve = function () {
                if (resonseOne.finished && responseTwo.finished) {
                    if (resonseOne.likes > responseTwo.likes) {
                        successHandler(resonseOne.likes);
                    } else {
                        successHandler(responseTwo.likes);
                    }
                }
            };

        window.FB.api('/', getRequestObject(true, participantId), function (response) {
            resonseOne.likes = response.og_object.engagement.count;
            resonseOne.finished = true;
            resolve();
        });

        window.FB.api('/', getRequestObject(false, participantId), function (response) {
            responseTwo.likes = response.og_object.engagement.count;
            responseTwo.finished = true;
            resolve();
        });
    }

    function getParticipantIdFromLink(link) {
        return link.getAttribute('data-participant');
    }

    function transformLinkToLikeCount(index, link) {
        getLikesCount(getParticipantIdFromLink(link), function (likeCount) {
            $(link).parent().parent().find('.like-count').html(likeCount);
        });
    }

    function getLinksWithParticipantsInfo() {
        var $links = $('a[data-participant]');
        $links.each(transformLinkToLikeCount);
    }

    if (ACCESS_TOKEN) {
        $(document).ready(setTimeout(getLinksWithParticipantsInfo, WAIT_TIME));
    }
}(window.ACCESS_TOKEN, window.$, document, setTimeout, window));
