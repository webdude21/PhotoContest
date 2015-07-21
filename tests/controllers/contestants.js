require('../../server/config/mongoose')(require('../../server/config/config')['development']);
var sinon = require('sinon'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    controllers = require('../../server/controllers');
chai.should();
chai.use(sinonChai);

function getExpressMock() {
    var req, res;

    req = res = {};
    req.query = {};
    res.render = sinon.spy();

    return {
        request: req, response: res
    };
}

describe("#Contestants Controller", function () {
    describe("Get Approved Contestants", function () {
        it("should render some the result", function (testDoneCallBack) {
            var express = getExpressMock();
            controllers.contestants.getAllApproved(express.request, express.response)
                .then(function () {
                    express.response.render.should.have.been.calledWith('contestants/all');
                    testDoneCallBack();
                }).done(null, testDoneCallBack);
        });
    });

    describe("Get Register Contestant", function () {
        it("should return register form", function (testDoneCallBack) {
            var express = getExpressMock();
            controllers.contestants.getRegister(express.request, express.response)
                .then(function () {
                    express.response.render.should.have.been.calledWith('contestants/register');
                    testDoneCallBack();
                }).done(null, testDoneCallBack);
        });
    });
});
