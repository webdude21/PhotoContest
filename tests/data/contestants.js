var env = process.env.NODE_ENV || 'development';
var config = require('../../server/config/config')[env];
var mongoose = require('../../server/config/mongoose')(config);
var data = require('../../server/data');
var expect = require('chai').expect;

describe('Contestants', function () {
    it('get all approved contestants in db should return all approved contestants', function () {
        var onlyApproved = true;

        data.contestants.getAllApproved(function(err){
        }, function(data){
            data.forEach(function(contestant){
                if (!contestant.approved){
                    onlyApproved = false;
                }
            });
        });

        var result = expect(onlyApproved).to.be.true;
    });

    it('get all when no contestants in db should return all contestants', function () {

    });
});