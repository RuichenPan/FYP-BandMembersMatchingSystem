import CryptoJS from 'crypto-js';

/**
 * Operation database base class
 *
 * @class BaseService
 */
module.exports = class BaseService {
  constructor(modal) {
    this.modal = modal;
  }

  md5(val) {
    if (!val) {
      return;
    }
    return CryptoJS.MD5(val).toString();
  }

  /**
   * console output log
   *
   * @memberof MongoDbHelper
   */
  log() {
    try {
      const _curDate = new Date();
      const info = `${_curDate.getFullYear()}-${_curDate.getMonth() + 1}-${_curDate.getDay()} ${_curDate.getHours()}:${_curDate.getMinutes()}:${_curDate.getSeconds()}.${_curDate.getMilliseconds()}`;
      console.log(`${info}-->`, ...arguments);
    } catch (ex) {
      console.log(ex);
      console.log(args);
    }
  }

  logJson(data) {
    this.log(JSON.stringify(data));
  }

  async findById(id) {
    const info = await this.modal.findById(id);
    return info ? JSON.parse(JSON.stringify(info)) : null;
  }

  /**
   * return record list
   *
   * @static
   * @param {any} condition  {field1:'conditionValue',type:4 ...}
   * @param {any} [fields={}]
   * @param {any} [options={}] {sort:{fiel4:-1,..}, limit:10, skip:0, ...}
   * @returns
   * @memberof BaseService
   */
  async find(condition = {}, fields = {}, options = {}) {
    try {
      const list = await this.modal.find(condition, fields, options);
      return list ? JSON.parse(JSON.stringify(list)) : [];
    } catch (ex) {
      this.log(ex);
      return [];
    }
  }

  /**
   * save document to db
   *
   * @param {any} fields
   * @returns
   * @memberof BaseService
   */
  async save(fields) {
    try {
      const result = await this.modal.create(fields);
      return result && result.toJSON ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `save doucment error:${ex.message}` });
    }
  }

  /**
   * create
   *
   * @param {*} docs
   * @return {*}
   */
  async create(docs) {
    return this.save(docs);
  }

  /**
   *  find first document  by condition
   *
   * @param {any} condition  {field1:'conditionValue',type:4 ...}
   * @param {any} [fields={}]
   * @param {any} [options={}] {sort:{fiel4:-1,..},...}
   * @returns
   * @memberof BaseService
   */
  async findOne(condition, fields = {}, options = {}) {
    try {
      const result = await this.modal.findOne(condition, fields, options);
      return result ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return null;
    }
  }

  /**
   * modify document by id
   *
   * @param {any} id      PK
   * @param {any} fields  {field1:'a',field2:'b'...}
   * @returns
   * @memberof BaseService
   */
  async findByIdAndUpdate(id, fields) {
    try {
      const condition = { _id: id };
      await this.modal.updateOne(condition, { $set: fields });
      const result = await this.modal.findById(id);
      return result ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   * Updates a Single Document
   *
   * @param {*} condition
   * @param {*} fields
   * @returns
   */
  async updateOne(condition, fields) {
    try {
      await this.modal.updateOne(condition, { $set: fields });
      const result = await this.modal.findOne(condition);
      return result ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   * Update Multiple Documents
   *
   * @param {*} condition
   * @param {*} fields
   * @returns
   */
  async updateMany(condition, fields) {
    try {
      await this.modal.updateMany(condition, { $set: fields });
      const result = await this.modal.find(condition);
      return result ? JSON.parse(JSON.stringify(result)) : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   * Delete a Single Document
   *
   * @param {*} condition
   * @returns
   */
  async deleteOne(condition) {
    try {
      return await this.modal.deleteOne(condition);
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   * Delete Multiple Documents
   *
   * @param {*} condition
   * @returns
   */
  async deleteMany(condition) {
    try {
      return await this.modal.deleteMany(condition);
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  async findByIdAndDelete(id) {
    return this.modal.findByIdAndDelete(id);
  }

  async count(condition) {
    return this.modal.countDocuments(condition);
  }

  async updateMany(condition, updateField) {
    try {
      await this.modal.updateMany({ ...condition }, { $set: { ...updateField } });
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  /**
   *
   *
   * @param {*} aggregations = [ {$group : {} } , {$project:{} }, {$match: {}} ]
   * @example
   * this.aggregate(
   * [
   *   {
   *     $group: {
   *       _id: { worker_id: '$worker_id' },
   *       totalPrice: { $sum: '$price' }
   *     }
   *   },
   *   {
   *     $project: { worker_id: '$_id.worker_id', total: '$totalPrice' }
   *   },
   *   {
   *     $match: { worker_id: '5f6eb0eb5025214504cd2377' }
   *   }
   * ])
   *
   * @return {*}
   */
  async aggregate(aggregations) {
    try {
      const result = await this.modal.aggregate(aggregations);
      return result && result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({ msg: `[${this.TableName}]update error :${ex.message}` });
    }
  }

  failure(msg) {
    throw Error(msg);
  }

  success(msg) {
    return { code: 200, data: msg };
  }
};
