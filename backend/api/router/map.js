import express from 'express';
import { MapService } from '../../service';
const router = express.Router();
module.exports = router;

router.get('/address/detail', async (req, res) => {
  try {
    const map = await MapService.addressDetail(req.query);
    res.json(map);
  } catch (ex) {
    res.status(400).json({ code: 400, msg: ex.message || ex });
  }
});
