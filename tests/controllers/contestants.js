var config = require('../../server/config/config')['development'];
require('../../server/config/mongoose')(config);
var data = require('../../server/data');
var sinon = require('sinon');
var controllers = require('../../server/controllers');

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
            controllers.contestants.getAllApproved(mock.req, mock.res)
                .then(function () {
                    mock.spy.render.should.toHaveBeenCalled();
                });
        });
    });

    describe("Get Register Contestant", function () {
        it("should return register form", function () {
            var mock = getExpressMock();
            controllers.contestants.getRegister(mock.req, mock.res)
                .then(function () {
                    mock.spy.render.should.toHaveBeenCalled();
                });
        });
    });
});
