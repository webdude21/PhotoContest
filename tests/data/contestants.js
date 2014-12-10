var config = require('../../server/config/config')['development'];
require('../../server/config/mongoose')(config);
var data = require('../../server/data');
var expect = require('chai').expect;

describe('#Contestants', function () {
    it('adding a contestant in db should add the contestant and should return it', function () {
        var contestant = {
            fullName: "Кирил Иванов",
            аге: 10,
            approved: true,
            pictures: [
                {
                    serviceId: "af12431241",
                    url: 'someUrl',
                    fileName: 'someImg.jpg'
                }
            ]
        };

        var dbContestant = data.contestants.addContestant(contestant);

        expect(dbContestant.fullName).to.equal(contestant.fullName);
        expect(dbContestant.age).to.equal(contestant.age);
        expect(dbContestant.pictures[0].serviceId).to.equal("af12431241");
        expect(dbContestant.pictures[0].url).to.equal("someUrl");
        expect(dbContestant.pictures[0].fileName).to.equal("someImg.jpg");
        expect(dbContestant.approved).to.be.true();
        expect(dbContestant.registerDate).to.exist();
    });

    it('get all approved contestants in db should return all approved contestants', function () {
        var onlyApproved = true;

        data.contestants.getAllApproved(function (err) {
        }, function (data) {
            data.forEach(function (contestant) {
                if (!contestant.approved) {
                    onlyApproved = false;
                }
            });
        });

        expect(onlyApproved).to.be.true();
    });

    it('get all when no contestants in db should return all contestants', function () {

    });
});
