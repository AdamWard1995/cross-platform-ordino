import {expect} from 'chai';
import {afterEach, beforeEach, describe, it} from 'mocha';
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import sinon from 'sinon';

const test = unit('create-category-modal');
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

  describe('Actions', function () {
    describe('Close handler provided', function () {
      describe('close()', function () {
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
        beforeEach(function () {
          component.set('onClose', undefined);
        });

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

      describe('no label entered', function () {
        beforeEach(function () {
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('You need to enter a label.');
        });
      });

      describe('no icon selected', function () {
        beforeEach(function () {
          component.set('label', 'Assignment');
          component.actions.submit.apply(component);
        });

        it('should not have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(0);
        });

        it('should have set errorMessage', function () {
          expect(component.get('errorMessage')).to.eql('You need to select an icon.');
        });
      });

      describe('all values entered', function () {
        beforeEach(function () {
          component.set('label', 'Assignment');
          component.set('selectedIcon', 'file-text');
          component.actions.submit.apply(component);
        });

        it('should have called onSubmit handler', function () {
          expect(onSubmitStub).to.have.callCount(1);
        });

        it('should have passed correct values to onSubmit handler', function () {
          expect(onSubmitStub).to.have.been.calledWithExactly('Assignment', 'file-text');
        });
      });

      describe('No submit handler provided', function () {
        beforeEach(function () {
          component.set('label', 'Assignment');
          component.set('selectedIcon', 'file-text');
          component.set('onSubmit', undefined);
        });

        it('should have not thrown a exception', function () {
          expect(() => component.actions.submit.apply(component)).to.not.throw();
        });
      });
    });

    describe('show()', function () {
      describe('icon selected', function () {
        let scrollIntoView;
        beforeEach(function () {
          scrollIntoView = sinon.stub();
          sandbox.stub(window, '$')
            .withArgs('.create-category-modal .selected').returns([{scrollIntoView}]);
          component.actions.show.apply(component);
        });

        it('should have scrolled selected icon into view handler', function () {
          expect(scrollIntoView).to.have.callCount(1);
        });
      });

      describe('no icon selected', function () {
        beforeEach(function () {
          sandbox.stub(window, '$')
            .withArgs('.create-category-modal .selected').returns([]);
        });

        it('should not have thrown an exception', function () {
          expect(() => component.actions.show.apply(component)).to.not.throw();
        });
      });
    });
  });
});
