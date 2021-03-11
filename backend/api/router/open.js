import express from 'express';
import { CommentService, UserService } from '../../service';
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

  .get('/home', async (req, res) => {
    try {
      const { page = 1, size = 20 } = req.query;
      const info = await UserService.list({ page: Number(page), size: Number(size) });
      res.json(info);
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
  });
