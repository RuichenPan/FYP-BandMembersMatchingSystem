const { ModelComment } = require('../model');
const { default: BaseService } = require('./BaseService');

class CommentService extends BaseService {
  constructor() {
    super(ModelComment);
  }
}

export default new CommentService();
