import express from 'express';
import multer from 'multer';
import path from 'path';
import UserService from '../../service/UserService';
const router = express.Router();

const upload = multer({ dest: path.join(__dirname, '../../', 'public', 'uploads/') });

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
      response.status(403).json({ code: 403, msg: 'Authorization not allowed' });
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
      response.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
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
  })
  // update user profile information
  .put(
    '/profile',
    upload.fields([
      { name: 'image', maxCount: 5 },
      { name: 'video', maxCount: 8 },
    ]),
    async (request, response) => {
      try {
        const { files, body, userInfo } = request;
        response.json({ files, body, userInfo });
      } catch (ex) {
        response.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
      }
    },
  );
