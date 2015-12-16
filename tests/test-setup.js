/**
 * Created by webdude on 16.12.15.
 */
require('../server/config/mongoose')({config: require('../server/config/config').development});
var sinon = require('sinon'),
    chai = require('chai'),
    SHOULD_RENDER_VIEW = 'should render the correct view with the data from the service',
    sinonChai = require('sinon-chai'),
    controllers = require('../server/controllers');
chai.should();
chai.use(sinonChai);

var getExpressMock = function () {
    var req, res;

    req = res = {};
    req.query = {};
    res.render = sinon.spy();

    return {
        request: req, response: res
    };
}, isPromise = function (actionResult) {
    return actionResult && actionResult.then;
}, callingActionReturnsView = function (action, expectedView, expectData) {
    return function () {
        it(SHOULD_RENDER_VIEW, function (testDoneCallBack) {
            var express = getExpressMock(),
                successhandler = function (resultData) {
                    if (expectData) {
                        express.response.render.should.have.been.calledWith(expectedView, resultData);
                    } else {
                        express.response.render.should.have.been.calledWith(expectedView);
                    }
                    testDoneCallBack();
                },
                actionResult = action(express.request, express.response);

            if (isPromise(actionResult)) {
                actionResult.then(successhandler).done(null, testDoneCallBack);
            } else {
                express.response.render.should.have.been.calledWith(expectedView);
                testDoneCallBack();
            }
        });
    };
};

module.exports = {callingActionReturnsView, controllers}