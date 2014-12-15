var sinon = require('sinon');
var expect = require('chai').expect;
var contestantController = require('../../server/controllers/contestants-controller');

function getExpressMock() {
    var req, res, spy;

    req = res = {};
    req.query = {};
    spy = res.render = sinon.spy();

    return {
        req: req, res: res, spy: spy
    };
}

describe("#Contestants Controller", function () {
    describe("Get Approved Contestants", function () {
        it("should render some the result", function () {
            var mock = getExpressMock();
            contestantController.getAllApproved(mock.req, mock.res);
            setTimeout(function () {
                mock.spy.render.should.toHaveBeenCalled();
            }, 100);
        });
    });

    describe("Get Register Contestant", function () {
        it("should return register form", function () {
            var mock = getExpressMock();
            contestantController.getRegister(mock.req, mock.res);
            setTimeout(function () {
                mock.spy.render.should.toHaveBeenCalled();
            }, 100);
        });
    })
});
