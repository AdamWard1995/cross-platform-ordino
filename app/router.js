import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('sign-up');
  this.route('sign-in');
  this.route('reset-password');

  this.authenticatedRoute('user', {
    path: ':user'
  }, function() {
    this.route('index', {path: '/'});
    this.route('account');
    this.route('workflow');
    this.route('terms', function() {
      this.route('index', {path: '/'});
      this.route('term', {path: ':term'});
    });
    this.route('courses', function() {
      this.route('index', {path: '/'});
      this.route('course', {path: ':course'}, function() {
        this.route('index', {path: '/'});
        this.route('report');
      });
    });
    this.route('categories');
    this.route('timetable');
  });
  this.route('about');
});

export default Router;
