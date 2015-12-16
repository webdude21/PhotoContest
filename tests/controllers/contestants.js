var testSetup = require('../test-setup'),
    callingActionReturnsView = testSetup.callingActionReturnsView,
    controller = testSetup.controllers.contestants,
    CONTROLLER_NAME = controller.CONTROLLER_NAME;

describe('#contestants controller', function () {
    describe('get approved contestants',
        callingActionReturnsView(controller.getAllApproved, `${CONTROLLER_NAME}/all`, true));
    describe('get register contestant',
        callingActionReturnsView(controller.getRegister, `${CONTROLLER_NAME}/register`));
    //describe('get contestant by non existing id',
    //    callingActionReturnsView(controller.getById, `${CONTROLLER_NAME}/contestant`, true, {params: {id: '124124'}}));
});

