import express from 'express';
const router = express.Router();
module.exports = router;

router
  .use(async (req, res, next) => {
    const { userInfo } = req;
    if (!userInfo) {
      response.status(403).json({ code: 403, msg: 'Authorization not allowed' });
      return;
    }
    next();
  })
  .get('/', async (req, res) => {
    try {
      res.json({ code: 200, data: { method: req.headers.method } });
    } catch (ex) {
      res.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  });
