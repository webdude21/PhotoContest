(function imageVerifier() {
    var INVALID_IMAGE_ERROR = 'Моля уверете се, че сте избрали валидно ' +
            'изображение от следните формати (gif, jpg, jpeg, tiff, png)!',
        PERMITTED_FORMATS = ['gif', 'jpg', 'jpeg', 'tiff', 'png'],
        $uploadInput = $('#file-0');

    function _fileHasValidExtension(filename, permittedFormats, inputDelimiter) {
        var delimiter = inputDelimiter || '.';
        var indexOfDelimiter = filename.lastIndexOf(delimiter);
        return filename && indexOfDelimiter > 0 && permittedFormats.indexOf(filename.slice(indexOfDelimiter) > -1);
    }

    function verifyImage() {
        var fileName = $uploadInput.val();
        if (_fileHasValidExtension(fileName, PERMITTED_FORMATS)) {
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
}());


