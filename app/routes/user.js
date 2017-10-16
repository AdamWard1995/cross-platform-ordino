import Ember from 'ember';

export default Ember.Route.extend({
  model (params, transition) {
    if (!this.get('session').get('isAuthenticated') ||
        this.get('session').get('currentUser').uid !== params.user) {
      this.accessDenied(transition);
      return;
    } else {
      const currentUser = this.get('session').get('currentUser');
      const userID = currentUser.uid;
      return this.store.findRecord('user', params.user).then(user => {
        if (user.get('accountChanged')) {
          this.get('session').close();
          return;
        }
        return this.store.query('term', {orderBy: 'uid', equalTo: userID}).then(terms => {
          return this.store.query('course', {orderBy: 'uid', equalTo: userID}).then(courses => {
            return this.store.query('course-work', {orderBy: 'uid', equalTo: userID}).then(work => {
              return this.store.query('class-time', {orderBy: 'uid', equalTo: userID}).then(classes => {
                return this.store.query('category', {orderBy: 'uid', equalTo: userID}).then(categories => {
                  return {
                    user,
                    courses: courses.toArray(),
                    courseWork: work.toArray(),
                    classTimes: classes.toArray(),
                    categories: categories.toArray(),
                    terms: terms.toArray()
                  };
                });
              });
            });
          });
        });
      });
    }
  }
});
