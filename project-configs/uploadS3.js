const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

// eslint-disable-next-line import/prefer-default-export
// export { s3 };
module.exports.s3 = s3;
