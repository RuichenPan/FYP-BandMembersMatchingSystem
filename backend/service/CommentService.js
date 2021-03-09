import { ModelComment } from '../model';
import BaseService from './BaseService';

class CommentService extends BaseService {
  constructor() {
    super(ModelComment);
  }
}

export default new CommentService();
