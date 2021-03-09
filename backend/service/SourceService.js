import { ModelSource } from '../model';
import BaseService from './BaseService';

class SourceService extends BaseService {
  constructor() {
    super(ModelSource);
  }
}

export default new SourceService();
