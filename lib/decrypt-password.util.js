const crypto = require('crypto');

module.exports = function decryptPassword(encryptedPassword) {
  // Adapted from: https://github.com/CharlesBlonde/libpurecoollink/blob/master/libpurecoollink/utils.py
  const key = Uint8Array.from(Array(32), (val, index) => index + 1);
  const initVector = new Uint8Array(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, initVector);
  let decryptedPassword = decipher.update(encryptedPassword, 'base64', 'utf8');
  decryptedPassword = decryptedPassword + decipher.final('utf8');

  return decryptedPassword;
};
