import user from './router/user';
import comment from './router/comment';
import open from './router/open';
import favorite from './router/favorite';
import source from './router/source';

module.exports = function router(app) {
  app.use('/api/open', open);
  app.use('/api/user', user);
  app.use('/api/comment', comment);
  app.use('/api/favorite', favorite);
  app.use('/api/source', source); //                      image, video
};
