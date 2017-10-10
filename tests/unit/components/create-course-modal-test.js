import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import moment from 'moment';
import sinon from 'sinon';

const test = unit('create-course-modal');
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
        component.set('onSubmit', onSubmitStub);
      });

      describe('no course code entered', function () {
        beforeEach(function () {
          component.set('course-code', undefined);
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('You need to enter a course code.');
        });
      });

      describe('no start time entered', function () {
        beforeEach(function () {
          component.set('course-code', 'COMP 4004');
          component.set('createClassTimes', true);
          component.set('start-time', undefined);
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('You need to enter a start time that is before the end time.');
        });
      });

      describe('no end time entered', function () {
        beforeEach(function () {
          component.set('course-code', 'COMP 4004');
          component.set('createClassTimes', true);
          component.set('start-time', moment('10:05 am', 'hh:mm a'));
          component.set('end-time', undefined);
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('You need to enter a start time that is before the end time.');
        });
      });

      describe('start time is after end time', function () {
        beforeEach(function () {
          component.set('course-code', 'COMP 4004');
          component.set('createClassTimes', true);
          component.set('start-time', moment('11:25 am', 'hh:mm a'));
          component.set('end-time', moment('10:05 am', 'hh:mm a'));
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('You need to enter a start time that is before the end time.');
        });
      });

      describe('values entered', function () {
        describe('not creating class times', function () {
          beforeEach(function () {
            component.set('course-code', 'COMP 4004');
            component.set('createClassTimes', false);
            component.actions.submit.apply(component);
          });

          it('should have called onSubmit handler', function () {
            expect(onSubmitStub).to.have.callCount(1);
          });

          it('should have passed correct parameters to onSubmit handler', function () {
            expect(onSubmitStub).to.have.been.calledWithExactly('COMP 4004', 'N/A', null, null, []);
          });
        });

        describe('creating class times', function () {
          beforeEach(function () {
            component.set('course-code', 'COMP 4004');
            component.set('createClassTimes', true);
            component.set('location', 'TB 238');
            component.set('start-time', moment('10:05 am', 'hh:mm a'));
            component.set('end-time', moment('11:25 am', 'hh:mm a'));
            component.set('selectedDays', ['Tuesday', 'Thursday']);
            component.actions.submit.apply(component);
          });

          it('should have called onSubmit handler', function () {
            expect(onSubmitStub).to.have.callCount(1);
          });

          it('should have passed correct parameters to onSubmit handler', function () {
            expect(onSubmitStub).to.have.been.calledWithExactly('COMP 4004', 'TB 238', '10:05 am', '11:25 am', ['Tuesday', 'Thursday']);
          });
        });
      });

      describe('No submit handler provided', function () {
        beforeEach(function () {
          component.set('course-code', 'COMP 4004');
          component.set('createClassTimes', false);
          component.set('onSubmit', undefined);
        });

        it('should have not thrown a exception', function () {
          expect(() => component.actions.submit.apply(component)).to.not.throw();
        });
      });
    });
  });
});
