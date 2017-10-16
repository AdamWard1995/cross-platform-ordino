import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import moment from 'moment';
import sinon from 'sinon';

const test = unit('create-course-work-modal');
describe(test.label, function () {
  test.setup();

  let component, sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    component = this.subject();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('Computed Properties', function () {
    describe('errorMessageClass', function () {
      describe('no error message set', function () {
        beforeEach(function () {
          component.set('errorMessage', '');
        });

        it('should use is-gone as class', function () {
          expect(component.get('errorMessageClass')).to.eql('is-gone');
        });
      });

      describe('an error message is set', function () {
        beforeEach(function () {
          component.set('errorMessage', 'There has been an error!');
        });

        it('should use is-visible as class', function () {
          expect(component.get('errorMessageClass')).to.eql('is-visible');
        });
      });
    });
  });

  describe('Actions', function () {
    describe('close()', function () {
      describe('Close handler provided', function () {
        let onCloseStub;
        beforeEach(function () {
          onCloseStub = sinon.stub();
          component.set('onClose', onCloseStub);
          component.actions.close.apply(component);
        });

        it('should have called onClose handler', function () {
          expect(onCloseStub).to.have.callCount(1);
        });
      });

      describe('No close handler provided', function () {
        it('should have not thrown a exception', function () {
          expect(() => component.actions.close.apply(component)).to.not.throw();
        });
      });
    });

    describe('submit()', function () {
      let onSubmitStub;
      beforeEach(function () {
        onSubmitStub = sinon.stub();
        component.set('course', 12345);
        component.set('onSubmit', onSubmitStub);
      });

      describe('no label entered', function () {
        beforeEach(function () {
          component.set('label', undefined);
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('You need to enter a label.');
        });
      });

      describe('no due date entered', function () {
        beforeEach(function () {
          component.set('category', 13579);
          component.set('course', 12345);
          component.set('label', 'Assignment 1');
          component.set('weight', 30);
          component.set('grade', 95);
          component.actions.submit.apply(component);
        });

        it('should have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(1);
        });

        it('should have passed correct parameters to onSubmit handler', function () {
          expect(onSubmitStub).to.have.been.calledWithExactly('Assignment 1', 30, 95, null, 13579, 12345);
        });
      });

      describe('all values entered', function () {
        beforeEach(function () {
          component.set('category', 13579);
          component.set('course', 12345);
          component.set('label', 'Assignment 1');
          component.set('weight', 30);
          component.set('grade', 95);
          component.set('due', moment('2017-09-29T03:59:00.000Z'));
          component.actions.submit.apply(component);
        });

        it('should have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(1);
        });

        it('should have passed correct parameters to onSubmit handler', function () {
          expect(onSubmitStub).to.have.been.calledWithExactly('Assignment 1', 30, 95, '2017-09-29T03:59:00.000Z', 13579, 12345);
        });
      });

      describe('No submit handler provided', function () {
        beforeEach(function () {
          component.set('onSubmit', undefined);
        });

        it('should have not thrown a exception', function () {
          expect(() => component.actions.submit.apply(component)).to.not.throw();
        });
      });
    });
  });
});
