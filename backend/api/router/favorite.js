import express from 'express';
import { FavoriteService } from '../../service';
const router = express.Router();
module.exports = router;

router
  .use(async (req, res, next) => {
    const { userInfo } = req;
    if (!userInfo) {
      res.status(403).json({ code: 403, msg: 'Authorization not allowed' });
      return;
    }
    next();
  })
  .get('/mine', async (req, res) => {
    try {
      const { id: user_id } = req.userInfo;
      const { page = 1, size = 30 } = req.query;
      const info = await FavoriteService.list({ page, size, user_id });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.message || ex });
    }
  })
  .post('/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const info = await FavoriteService.add({ user_id, userInfo: req.userInfo });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.message || ex });
    }
  })
  .delete('/:favorite_user_id', async (req, res) => {
    try {
      const { favorite_user_id } = req.params;
      const { id: user_id } = req.userInfo;
      await FavoriteService.deleteOne({ user_id, favorite_user_id });
      res.json(FavoriteService.success('delete success'));
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.message || ex });
    }
  });
