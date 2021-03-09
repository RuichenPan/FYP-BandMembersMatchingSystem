import { ModelFavorite } from '../model';
import BaseService from './BaseService';

class FavoriteService extends BaseService {
  constructor() {
    super(ModelFavorite);
  }
}
export default new FavoriteService();
