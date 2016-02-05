var testSetup = require('../test-setup'),
  testUtils = testSetup,
  controller = testSetup.controllers.contestants,
  CONTROLLER_NAME = controller.CONTROLLER_NAME,
  globalConstants = require('../../server/config/global-constants');

describe('#contestants controller', function () {
  describe('get approved contestants',
    testUtils.callingActionReturnsView(controller.getAllApproved, `${CONTROLLER_NAME}/all`, true));
  describe('get register contestant',
    testUtils.callingActionReturnsView(controller.getRegister, `${CONTROLLER_NAME}/register`));
  describe('get contestant by non existing id redirects to not found',
    testUtils.callingActionRedirectsTo(controller.getById, globalConstants.NOT_FOUND_ROUTE, { params: { id: 12 } }));
});
