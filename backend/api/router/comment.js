import express from 'express';
import { CommentService } from '../../service';
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
  .get('/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const { page, size } = req.query;
      const info = await CommentService.list({ page: Number(page), size: Number(size), user_id });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })
  .post('/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const { body, userInfo } = req;
      const info = await CommentService.addComment({ user_id, body, userInfo });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })
  .delete('/:comment_id', async (req, res) => {
    try {
      const { comment_id } = req.params;
      await CommentService.findByIdAndDelete(comment_id);
      res.json(CommentService.success('delete success'));
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })
  .put('/reply/:id', async (req, res) => {
    try { 
      const { id: comment_id } = req.params;
      const { body, userInfo } = req;
      const info = await CommentService.replyComment({ comment_id, body, userInfo });
      res.json(info);
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  });
