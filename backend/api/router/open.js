import express from 'express';
const router = express.Router();
module.exports = router;

router.get('/', async (req, res) => {
  try {
    res.json({ code: 200, data: { method: req.headers.method } });
  } catch (ex) {
    res.status(400).json({ code: 400, msg: ex.message || ex });
  }
});
