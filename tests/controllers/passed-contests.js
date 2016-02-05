var testSetup = require('../test-setup'),
  callingActionReturnsView = testSetup.callingActionReturnsView,
  controllers = testSetup.controllers;

describe('#passed contest controller', function () {
  describe('get add winner',
    callingActionReturnsView(controllers.passedContests.getAddWinner, 'passed-contests/addWinner'));
  describe('get delete contest',
    callingActionReturnsView(controllers.passedContests.getDeleteContestConfirm, 'confirm'));
});
