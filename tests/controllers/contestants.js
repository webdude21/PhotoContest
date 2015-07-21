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

describe('#Contestants Controller', function () {
    before(function () {
        this.express = getExpressMock();
    });
    describe('Get Approved Contestants', function () {
        it('should render the correct view with the data from the service', function (testDoneCallBack) {
            var express = this.express;
            controllers.contestants.getAllApproved(express.request, express.response)
                .then(function (resultData) {
                    express.response.render.should.have.been.calledWith('contestants/all', resultData);
                    testDoneCallBack();
                }).done(null, testDoneCallBack);
        });
    });
    describe('Get Register Contestant', function () {
        it('should render the register form', function (testDoneCallBack) {
            var express = this.express;
            controllers.contestants.getRegister(express.request, express.response)
                .then(function () {
                    express.response.render.should.have.been.calledWith('contestants/register');
                    testDoneCallBack();
                }).done(null, testDoneCallBack);
        });
    });
});
