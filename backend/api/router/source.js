import express from 'express';
import { SourceService } from '../../service';
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
  .get('/:type/:user_id', async (req, res) => {
    try {
      const { type, user_id } = req.params;
      const page = Number(req.query.page);
      const size = Number(req.query.size);
      const info = await SourceService.list({ type, page, size, user_id });
      res.json({ code: 200, data: info });
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  });
