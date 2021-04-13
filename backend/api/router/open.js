import express from 'express';
import { CommentService, ConfigService, SourceService, UserService } from '../../service';
const router = express.Router();
module.exports = router;

router
  .get('/', async (req, res) => {
    try {
      res.json({ code: 200, data: { method: req.headers.method } });
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.message || ex });
    }
  })
  .post('/sendemail', async (req, res) => {
    try {
      const info = await UserService.sendEmail(req.body);
      res.json({ code: 200, data: info });
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.message || ex });
    }
  })
  .get('/sendemail/:email', async (req, res) => {
    try {
      const info = await UserService.checkEmail(req.params.email);
      res.json({ code: 200, data: info });
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.message || ex });
    }
  })
  .get('/home', async (req, res) => {
    try {
      const { userInfo } = req;
      const { page = 1, size = 20, keyword, i_am_a, music_style } = req.query;
      const info = await UserService.list({ userInfo, page: Number(page), size: Number(size), keyword, i_am_a, music_style });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.message || ex });
    }
  })
  .get('/config/:name', async (req, res) => {
    try {
      const { name } = req.params;
      if (!name) {
        res.json({ code: 200, data: [] });
      } else {
        const info = await ConfigService.find({ name }, {}, { sort: { sort: 1 } });
        res.json(info);
      }
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.message || ex });
    }
  })

  .get('/comment/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const { page = 1, size = 20 } = req.query;
      const info = await CommentService.list({ page: Number(page), size: Number(size), user_id });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.message || ex });
    }
  })
  .get('/person/:user_id', async (req, res) => {
    try {
      const info = await UserService.getUserInfo(req.params.user_id);
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })
  .get('/:type/:user_id', async (req, res) => {
    try {
      const { type, user_id } = req.params;
      const page = Number(req.query.page);
      const size = Number(req.query.size);

      const info = await SourceService.list({ type, page, size, user_id });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  });
