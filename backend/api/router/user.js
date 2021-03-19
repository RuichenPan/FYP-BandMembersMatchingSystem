import express, { response } from 'express';
import multer from 'multer';
import path from 'path';
import UserService from '../../service/UserService';
const router = express.Router();

const a = multer({ dest: path.join(__dirname, '../../', 'public', 'uploads/') });

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
  .use(async (req, res, next) => {
    const { userInfo, url } = req;

    const excludeUrl = ['/signin', '/signup', '/test', '/', '/checkemail'];
    if (excludeUrl.includes(url.toLowerCase())) {
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
  .post('/signin', async (req, res) => {
    try {
      const item = await UserService.signIn(req.body);
      res.json(item);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })
  // user signup
  .post('/signup', async (req, res) => {
    try {
      const item = await UserService.signUp(req.body || {});
      res.json(item);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })

  .post('/upload', upload.single('file'), async (req, res) => {
    try {
      res.json(UserService.success({ path: req.file.filename }));
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })

  // get user info
  .get('/info', async (req, res) => {
    try {
      const info = await UserService.findById(req.userInfo.id);
      res.json(UserService.success(info));
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })

  // update user profile information
  .put('/profile', upload.any(), async (req, res) => {
    try {
      const { videos, images, body, userInfo, files } = req;
      const info = await UserService.updateProfile({ files, videos, images, body, userInfo });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })

  .put('/checkemail', async (req, res) => {
    try {
      const { email, token } = req.body;
      const info = await UserService.verificationEmail(email, token);
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  });
