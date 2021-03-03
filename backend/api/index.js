import user from './route/user';

module.exports = function router(app) {
  app.use('/api/user', user);
};
