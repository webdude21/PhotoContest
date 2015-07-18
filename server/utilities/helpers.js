'use strict';
module.exports = {
    fileHasValidExtension: function (filename, permittedFormats, inputDelimiter) {
        var delimiter = inputDelimiter || '.';
        var indexOfDelimiter = filename.lastIndexOf(delimiter);
        return filename && indexOfDelimiter > 0 && permittedFormats.indexOf(filename.slice(indexOfDelimiter) > -1);
    },
    formatWinner: function (winner) {
        var formattedWinner = winner;
        formattedWinner.text = winner.prize.slice(0, 1).toLocaleUpperCase() + winner.prize.slice(1) +
            ', ' + winner.award.toLocaleLowerCase() + ' спечели ';
        formattedWinner.text += winner.fullName;

        if (winner.age) {
            formattedWinner.text += ' на ' + winner.age;
        }

        if (winner.town) {
            formattedWinner.text += ' от ' + winner.town;
        }

        return formattedWinner;
    },
    autoRequireFiles: function (dirPath) {
        var fileSystem = require('fs'),
            pathDelimiter = require('path').sep,
            fileExtensionToRequire = '.js',
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
