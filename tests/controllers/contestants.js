require('../../server/config/mongoose')({config: require('../../server/config/config')['development']});
var sinon = require('sinon'),
    chai = require('chai'),
    SHOULD_RENDER_VIEW = 'should render the correct view with the data from the service',
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
    beforeEach(function () {
        this.express = getExpressMock();
    });
    describe('Get Approved Contestants', function () {
        it(SHOULD_RENDER_VIEW, function (testDoneCallBack) {
            var express = this.express;
            controllers
                .contestants
                .getAllApproved(express.request, express.response)
                .then(function (resultData) {
                    express.response.render.should.have.been.calledWith('contestants/all', resultData);
                    testDoneCallBack();
                })
                .done(null, testDoneCallBack);
        });
    });
    describe('Get Register Contestant', function () {
        it(SHOULD_RENDER_VIEW, function (testDoneCallBack) {
            var express = this.express;
            controllers
                .contestants
                .getRegister(express.request, express.response)
                .then(function () {
                    express.response.render.should.have.been.calledWith('contestants/register');
                    testDoneCallBack();
                }).done(null, testDoneCallBack);
        });
    });
});

describe('#Passed Contest Controller', function () {
    beforeEach(function () {
        this.express = getExpressMock();
    });
    describe('Get Add Winner', function () {
        it(SHOULD_RENDER_VIEW, function (testDoneCallBack) {
            var express = this.express;
            controllers.passedContests.getAddWinner(express.request, express.response)
                .then(function () {
                    express.response.render.should.have.been.calledWith('passed-contests/addWinner');
                    testDoneCallBack();
                }).done(null, testDoneCallBack);
        });
    });

    describe('Get Delete Contest', function () {
        it(SHOULD_RENDER_VIEW, function (testDoneCallBack) {
            var express = this.express;
            controllers.passedContests.getDeleteContestConfirm(this.express.request, this.express.response);
            express.response.render.should.have.been.calledWith('confirm');
            testDoneCallBack();
        });
    });
});