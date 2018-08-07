[![npm version](https://badge.fury.io/js/dyson-cloud.svg)](http://badge.fury.io/js/dyson-cloud) [![Build Status](https://travis-ci.org/patrickvaler/dyson-cloud.svg?branch=master)](https://travis-ci.org/patrickvaler/dyson-cloud) [![Dependency Status](https://david-dm.org/patrickvaler/dyson-cloud/status.svg?style=flat)](https://david-dm.org/patrickvaler/dyson-cloud)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# dyson-cloud

JavaScript library to connect to the Dyson Cloud and fetch user account related information.

## Installation

```
npm install --save dyson-cloud
```

## Usage

```javascript
const DysonCloud = require('dyson-cloud');
const myAccount = DysonCloud.build('example@email.com', 'myPassword123'); // or new DysonCloud('example@email.com', 'myPassword123');
```

## API

### getDevices()

Fetches user account related device information from Dyson Cloud. LocalCredentials can be used to authenticate with the Dyson Device in the local network via `mqtt`.

#### Examples

```javascript
myAccount.getDevices()
  .then(devices => /* do something with the devices */ });
```

#### Returns

`Promise<Array<DeviceManifest>>`

**DeviceManifest**

```javascript
{
  autoUpdate: true,
  localCredentials: {
    username: 'VS8-EU-KDA1234A',
    password: 'a7lbLMDkPs74LK7qfWnLV9AXhTYoj0uIpLlj5N+KZkLxtlKGhDBJsVe2KgX8UQpyXxXRDuIEShHZWkQe4j000w=='
  }
  name: 'Living room',
  newVersionAvailable: false,
  productType: '438',
  serial: 'VS8-EU-KDA1234A',
  version: 'ECG2PF.02.05.001.0006'
}
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [semantic-release](https://github.com/semantic-release/semantic-release) for versioning. For the versions available, see the [tags on this repository](https://github.com/patrickvaler/dyson-cloud/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
