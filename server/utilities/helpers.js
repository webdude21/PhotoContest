'use strict';
module.exports = {
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
    }
};
