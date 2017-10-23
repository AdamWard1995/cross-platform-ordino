import Ember from 'ember';

export default Ember.Mixin.create({
  email: '',
  password: '',
  passwordHasDigit: Ember.computed('password', function() {
    return this.get('password') && /\d/.test(this.get('password'));
  }),
  passwordHas6Characters: Ember.computed('password', function() {
    return this.get('password') && this.get('password').length >= 6;
  }),
  passwordHasLowercaseLetter: Ember.computed('password', function() {
    return this.get('password') && /[a-z]/.test(this.get('password'));
  }),
  passwordHasUppercaseLetter: Ember.computed('password', function() {
    return this.get('password') && /[A-Z]/.test(this.get('password'));
  }),
  validEmail: Ember.computed('email', function() {
    const email = this.get('email')
    const regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
    return email && regex.test(email);
  }),
  validPassword: Ember.computed('passwordHas6Characters', 'passwordHasDigit',
    'passwordHasLowercaseLetter', 'passwordHasUppercaseLetter', function () {
    return this.get('passwordHas6Characters') && this.get('passwordHasDigit') && this.get('passwordHasLowercaseLetter') && this.get('passwordHasUppercaseLetter');
  })
});
