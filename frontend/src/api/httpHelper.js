import cryptoJS from 'crypto-js';

const cfg = {
  development: { baseUrl: 'http://127.0.0.1:5300' },
  production: { baseUrl: '' },
}[process.env.NODE_ENV || 'development'];

const baseUrl = cfg.baseUrl || '';
// console.log('NODE_ENV:', process.env.NODE_ENV, baseUrl);

class HttpHelper {
  get WebSite() {
    return baseUrl;
  }

  /**
   * convert params to url queryString
   *
   * @param {*} params
   * @returns
   * @memberof HttpHelper
   */
  getQuery(params) {
    return Object.keys(params || {})
      .map((key) => `${key}=${params[key] || ''}`)
      .join('&');
  }
  initFunction(context) {
    this.context = context;
  }

  /**
   *
   *
   * @param {*} { method, url, params, data, headers }
   * @returns
   * @memberof HttpHelper
   */
  async __request({ method, url, params, data, headers }) {
    const opt = {
      method,
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
    };
    const token = this.token;

    if (token) {
      opt.headers.token = token;
    }
    const query = this.getQuery(params);
    const _url = query ? `${url}?${query}` : url;
    if (data) {
      opt.body = JSON.stringify(data);
    }

    return new Promise((resolve, reject) => {
      fetch(`${baseUrl}${_url}`, opt)
        .then(async (response) => {
          const body = await response.json();
          const { status } = response;

          if (status > 300) {
            this.context.alertMsg(body.msg);
            if (status === 403) {
              this.context.switchPage('/login');
            }
            reject(body.msg);
          } else {
            resolve(body.data || body);
          }
        })
        .catch((ex) => {
          console.log(ex);

          reject(ex.message);
        });
    });
  }

  /**
   * api get resource request
   *
   * @param {*} url
   * @param {*} params
   * @returns
   * @memberof HttpHelper
   */
  apiGet(url, params) {
    return this.__request({ method: 'get', url, params });
  }
  /**
   * api post submit request
   *
   * @param {*} url
   * @param {*} data
   * @returns
   * @memberof HttpHelper
   */
  apiPost(url, data) {
    return this.__request({ method: 'post', url, data });
  }
  /**
   * api put request
   *
   * @param {*} url
   * @param {*} params
   * @param {*} data
   * @returns
   * @memberof HttpHelper
   */
  apiPut(url, params, data) {
    return this.__request({ method: 'put', url, params, data });
  }
  /**
   * api delete request
   *
   * @param {*} url
   * @param {*} params
   * @returns
   * @memberof HttpHelper
   */
  apiDelete(url, params) {
    return this.__request({ method: 'delete', url, params });
  }

  apiUpload(url, data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    return new Promise((resolve, reject) => {
      fetch(`${baseUrl}${url}`, {
        method: 'post',
        body: formData,
        headers: {
          token: this.token,
        },
      })
        .then(async (response) => {
          const body = await response.json();
          const { status } = response;

          if (status > 300) {
            if (status === 403) {
              this.context.alertMsg(body.msg);
              this.context.switchPage('/login');
            }
            reject(body.msg);
          } else {
            resolve(body.data || body);
          }
        })
        .catch((ex) => {
          console.log(ex);

          reject(ex.message);
        });
    });
  }
  /**
   * MD5
   *
   * @param {*} val
   * @returns
   * @memberof HttpHelper
   */
  md5(val) {
    if (!val) {
      return;
    }
    return cryptoJS.MD5(val).toString();
  }
  clone(data) {
    if (!data) {
      return;
    }
    return JSON.parse(JSON.stringify(data));
  }

  setStorage(key, value) {
    if (!value) {
      window.sessionStorage.removeItem(key);
      return;
    }
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  getStorage(key) {
    const info = window.sessionStorage.getItem(key);
    if (!info) {
      return null;
    }
    try {
      return JSON.parse(info);
    } catch (ex) {
      console.log(ex);
      this.setStorage(key, null);
      return null;
    }
  }

  set userInfo(value) {
    this.setStorage('REACT_USER_INFO', value);
  }
  get userInfo() {
    return this.getStorage('REACT_USER_INFO');
  }

  set token(value) {
    this.setStorage('REACT_TOKEN', value);
  }

  get token() {
    return this.getStorage('REACT_TOKEN');
  }
}

export default new HttpHelper();
