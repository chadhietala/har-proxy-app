import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return fetch('api/profile.json').then(response => {
      return response.json()
    });
  }
});
