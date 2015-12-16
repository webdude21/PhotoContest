var testSetup = require('../test-setup'),
    callingActionReturnsView = testSetup.callingActionReturnsView,
    controllers = testSetup.controllers;

describe('#contestants controller', function () {
    describe('get approved contestants',
        callingActionReturnsView(controllers.contestants.getAllApproved, 'contestants/all', true));
    describe('get register contestant',
        callingActionReturnsView(controllers.contestants.getRegister, 'contestants/register'));
});

