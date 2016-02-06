(function (ACCESS_TOKEN, $, document, setTimeout, window) {
  var WAIT_TIME = 2000;
  var baseUrl = 'divastore.herokuapp.com' + '/contestants/';

  function getRequestObject(participantId) {
    /* eslint-disable camelcase */
    return {
      access_token: ACCESS_TOKEN,
      id: 'https://' + baseUrl + participantId,
      fields: 'og_object{engagement{count}}'
    };
  }

  function getLikesCount(participantId, successHandler) {
    window.FB.api('/', getRequestObject(participantId), function (response) {
      successHandler(response.og_object.engagement.count);
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
