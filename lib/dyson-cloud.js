const axios = require('axios');
const https = require('https');
const decryptPassword = require('./decrypt-password.util');

const dysonApiBase = 'https://api.cp.dyson.com';

const DysonApi = Object.freeze({
  AUTHENTICATE: '/v1/userregistration/authenticate',
  GET_DEVICES: '/v2/provisioningservice/manifest'
});

class DysonCloud {
  /**
   * Create Dyson Cloud instance.
   * @param {string} email - Dyson Account e-mail.
   * @param {string} password  - Dyson Account e-mail
   */
  static build(email, password) {
    return new DysonCloud(email, password);
  }

  static _createInstance() {
    return axios.create({
      baseURL: dysonApiBase,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Create Dyson Cloud instance.
   * @param {string} email - Dyson Account e-mail.
   * @param {string} password  - Dyson Account e-mail
   */
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this._authToken = null;
    this._axios = DysonCloud._createInstance();

    this._axios.interceptors.request.use(config => {
      if (config.url !== DysonApi.AUTHENTICATE) {
        return this._getToken().then(token => {
          config.headers.Authorization = token;

          return config;
        });
      } else {
        return config;
      }
    });
  }

  /**
   * PUBLIC API
   */

  /**
   * Fetches all device information from Dyson Cloud
   *
   * @returns {Promise<Array<DysonDeviceManifest>>} list of devices
   */
  getDevices() {
    return this._axios
      .get(DysonApi.GET_DEVICES)
      .then(response => response.data.map(deviceManifest => this._transformDeviceManifest(deviceManifest)))
      .catch(error => Promise.reject(error.response.data));
  }

  /**
   * PRIVATE API
   */

  /**
   * Authenticates with the Dyson Cloud server
   *
   * @param {string} email - Dyson Account e-mail address
   * @param {string} password - Dyson Account password
   * @returns {Promise<string>} authToken
   */
  _authenticate() {
    const data = {
      Email: this.email,
      Password: this.password
    };

    return this._axios.post(DysonApi.AUTHENTICATE, data).then(response => {
      const { Account, Password } = response.data;
      return this._createAuthToken(Account, Password);
    });
  }

  /**
   * Returns authToken if available, otherwise authToken
   * gets loaded.
   *
   * @returns {Promise<string>} authToken
   */
  _getToken() {
    if (!this._authToken) {
      return this._authenticate(this.email, this.password, this.country).then(authToken => {
        this._authToken = authToken;

        return this._authToken;
      });
    } else {
      return Promise.resolve(this._authToken);
    }
  }

  /**
   * Creates authToken
   *
   * @param {string} account
   * @param {string} password
   * @returns {string} authToken
   */
  _createAuthToken(account, password) {
    const buffer = Buffer.from(`${account}:${password}`).toString('base64');
    return `Basic ${buffer}`;
  }

  /**
   * Transforms the deviceManifest and applies the decrypted local credentials
   *
   * @param {any} deviceManifest
   */
  _transformDeviceManifest(deviceManifest) {
    const credentials = JSON.parse(decryptPassword(deviceManifest.LocalCredentials));

    return {
      autoUpdate: deviceManifest.AutoUpdate,
      localCredentials: {
        username: credentials.serial,
        password: credentials.apPasswordHash
      },
      name: deviceManifest.Name,
      newVersionAvailable: deviceManifest.NewVersionAvailable,
      productType: deviceManifest.ProductType,
      serial: deviceManifest.Serial,
      version: deviceManifest.Version
    };
  }
}

module.exports = DysonCloud;
