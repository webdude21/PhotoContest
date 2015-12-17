/**
 * Created by webdude on 16.12.15.
 */
require('../server/config/mongoose')({config: require('../server/config/config').development});
var sinon = require('sinon'),
    chai = require('chai'),
    SHOULD_RENDER_VIEW = 'should render the correct view with the data from the service',
    SHOULD_REDIRECT_TO_ROUTE = 'should redirect to the correct route',
    sinonChai = require('sinon-chai'),
    controllers = require('../server/controllers');
chai.should();
chai.use(sinonChai);

var getExpressMock = function (request) {
    var request = request || {},
        response = {};

    request.query = {};
    response.render = sinon.spy();
    response.redirect = sinon.spy();

    return {request, response};
}, isPromise = function (actionResult) {
    return actionResult && actionResult.then;
}, callingActionReturnsView = function (action, expectedView, expectData, request) {
    return function () {
        it(SHOULD_RENDER_VIEW, function (testDoneCallBack) {
            var express = getExpressMock(request),
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
}, callingActionRedirectsTo = function (action, redirectRoute, request) {
    return function () {
        it(SHOULD_REDIRECT_TO_ROUTE, function (testDoneCallBack) {
            var express = getExpressMock(request),
                successhandler = function (resultData) {
                    express.response.redirect.should.have.been.calledWith(redirectRoute);
                    testDoneCallBack();
                },
                actionResult = action(express.request, express.response);

            if (isPromise(actionResult)) {
                actionResult.then(successhandler).done(null, testDoneCallBack);
            } else {
                express.response.redirect.should.have.been.calledWith(redirectRoute);
                testDoneCallBack();
            }
        });
    };
};

module.exports = {callingActionReturnsView, controllers, callingActionRedirectsTo};