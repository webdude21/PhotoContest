var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var contestantController = require('../../server/controllers/contestants-controller');

describe("#Contestants Controller", function() {
    describe("Get Approved Contestants", function() {
        it("should render some the result", function() {
            var req,res,spy;

            req = res = {};
            req.query = {};
            spy = res.render = sinon.spy();

            contestantController.getAllApproved(req, res);
            setTimeout(function(){
                spy.render.should.toHaveBeenCalled();
            }, 500);
        });
    });
});
