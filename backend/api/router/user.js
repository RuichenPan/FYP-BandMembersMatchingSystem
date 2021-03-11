import express from 'express';
import multer from 'multer';
import path from 'path';
import UserService from '../../service/UserService';
const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, '../../', 'public', 'uploads/'),
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../', 'public', 'uploads/'));
    },
    filename: function (req, file, cb) {
      cb(null, `${UserService.format(Date.now(), 'yyyyMMddHHmmssS')}_${file.originalname}`);
    },
  }),
});

module.exports = router;
router
  .use(async (request, res, next) => {
    const { userInfo, url } = request;

    const excludeUrl = ['/signin', '/signup', '/test', '/'];
    if (excludeUrl.includes(url)) {
      await next();
      return;
    }

    if (!userInfo) {
      res.status(403).json({ code: 403, msg: 'Authorization not allowed' });
      return;
    }

    await next();
  })
  // user login
  .post('/signin', async (request, res) => {
    try {
      const item = await UserService.signIn(request.body);
      res.json(item);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })
  // user signup
  .post('/signup', async (request, res) => {
    try {
      const item = await UserService.signUp(request.body || {});
      res.json(item);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })
  // update user profile information
  .put('/profile', upload.any(), async (request, res) => {
    try {
      const { videos, images, body, userInfo, files } = request;
      const info = await UserService.updateProfile({ files, videos, images, body, userInfo });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  });
