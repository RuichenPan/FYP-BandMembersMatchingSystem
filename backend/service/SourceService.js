import { ModelSource } from '../model';
import BaseService from './BaseService';

class SourceService extends BaseService {
  constructor() {
    super(ModelSource);
  }

  async list({ page, size, user_id, type }) {
    const list = await this.find({ type, user_id }, {}, { skip: (page - 1) * size, limit: size });
    const total = await this.count({ type, user_id });
    const info = { page, size, total, totalPage: Math.ceil(total / size), list };
    return this.success(info);
  }
}

export default new SourceService();
