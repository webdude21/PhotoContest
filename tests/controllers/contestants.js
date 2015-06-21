require('../../server/config/mongoose')(require('../../server/config/config')['development']);
var data = require('../../server/data'),
    sinon = require('sinon'),
    controllers = require('../../server/controllers');

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
            var express = getExpressMock();
            controllers.contestants.getAllApproved(express.req, express.res)
                .then(function () {
                    express.spy.render.should.toHaveBeenCalled();
                });
        });
    });

    describe("Get Register Contestant", function () {
        it("should return register form", function () {
            var express = getExpressMock();
            controllers.contestants.getRegister(express.req, express.res)
                .then(function () {
                    express.spy.render.should.toHaveBeenCalled();
                });
        });
    });
});
