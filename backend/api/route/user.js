import express from 'express';
import UserService from '../../service/UserService';
const router = express.Router();

module.exports = router;
router
  .use(async (request, response, next) => {
    const { userInfo, url } = request;

    const excludeUrl = ['/signin', '/signup', '/test', '/'];
    if (excludeUrl.includes(url)) {
      await next();
      return;
    }
    if (!userInfo) {
      response.status(403).json({ code: 401, msg: 'Authorization not allowed' });
      return;
    }
    await next();
  })
  // user login
  .post('/signin', async (request, response) => {
    try {
      const item = await UserService.SignIn(request.body);
      response.json(item);
    } catch (ex) {
      response.status(400).json({ code: 400, msg: ex.msg || ex.message });
    }
  })
  // user signup
  .post('/signup', async (request, response) => {
    try {
      const item = await UserService.SignUp(request.body || {});
      response.json(item);
    } catch (ex) {
      response.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  });
