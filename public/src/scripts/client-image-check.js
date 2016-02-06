(function imageVerifier($, document) {
  var INVALID_IMAGE_ERROR = 'Моля уверете се, че сте избрали валидно ' +
    'изображение от следните формати (gif, jpg, jpeg, tiff, png)!',
    PERMITTED_FORMATS = ['gif', 'jpg', 'jpeg', 'tiff', 'png'],
    $uploadInput = $('#file-0');

  function fileHasValidExtension(filename, permittedFormats, inputDelimiter) {
    var delimiter = inputDelimiter || '.',
      indexOfDelimiter = filename.lastIndexOf(delimiter);

    return filename && indexOfDelimiter && (permittedFormats.indexOf(filename.slice(indexOfDelimiter + 1)) > -1);
  }

  function verifyImage() {
    var fileName = $uploadInput.val();

    if (!fileHasValidExtension(fileName, PERMITTED_FORMATS)) {
      /*eslint no-alert: 0*/
      alert(INVALID_IMAGE_ERROR);
      $uploadInput.val('');
      return false;
    } else {
      return true;
    }
  }

  $(document).ready(function () {
    $uploadInput.on('change', verifyImage);
  });
}(window.$, document));
