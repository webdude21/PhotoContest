'use strict';
module.exports = {
    fileHasValidExtension: function (filename, permittedFormats, inputDelimiter) {
        var delimiter = inputDelimiter || '.';
        var indexOfDelimiter = filename.lastIndexOf(delimiter);
        return filename && indexOfDelimiter > 0 && permittedFormats.indexOf(filename.slice(indexOfDelimiter) > -1);
    },
    autoRequireFiles: function (dirPath, fileExtension) {
        var fileSystem = require('fs'),
            pathDelimiter = require('path').sep,
            fileExtensionToRequire = fileExtension || '.js',
            fileExtenstionLength = fileExtensionToRequire.length,
            resultObject = {},
            javaScriptFileTransform = function (fileName) {
                if (fileName.slice(-fileExtenstionLength, fileName.length) === fileExtensionToRequire) {
                    return fileName.slice(0, fileName.length - fileExtenstionLength);
                } else {
                    return false;
                }
            },
            convertFileNamesToKeys = function (fileName) {
                var charArray = fileName.split('');
                for (var index = 0; index < charArray.length; index++) {
                    if (charArray[index] === '-') {
                        charArray.splice(index, 1);
                        charArray[index] = charArray[index].toUpperCase();
                    }
                }

                return charArray.join('');
            },
            generateRequireKeyInObject = function (file) {
                var transformedFileName = javaScriptFileTransform(file);
                if (transformedFileName) {
                    resultObject[convertFileNamesToKeys(transformedFileName)] = require(dirPath + pathDelimiter + transformedFileName);
                }
            };


        fileSystem.readdirSync(dirPath).forEach(generateRequireKeyInObject);

        return resultObject;
    }
};
