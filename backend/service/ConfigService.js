import { ModelConfig } from '../model';
import BaseService from './BaseService';

class ConfigService extends BaseService {
  constructor() {
    super(ModelConfig);
  }

  async getSendGridKey() {
    const row = this.findOne('SendGrid');
    return row.SendGrid;
  }
}

export default new ConfigService();
