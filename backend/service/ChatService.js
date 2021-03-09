import { ModelChat } from '../model';
import BaseService from './BaseService';

class ChatService extends BaseService {
  constructor() {
    super(ModelChat);
  }
}

export default new ChatService();
