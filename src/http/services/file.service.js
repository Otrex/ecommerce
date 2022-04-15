const AWS = require('aws-sdk');
const { ServiceError } = require('../lib/exceptions');
const config = require('../../config');
const { generateNumbers } = require('../../scripts/utils');

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(config.s3.endpoint),
  accessKeyId: config.s3.accessKey,
  secretAccessKey: config.s3.secretKey,
});

class FileService {
  static fileHandler = async ({ contentType }) => {
    try {
      const key = `${generateNumbers(34)}-${
        new Date().toISOString().split('.')[0]
      }`;

      const s3Params = {
        Key: key,
        Expires: 300,
        Bucket: config.s3.bucket,
        ContentType: contentType,
        ACL: 'public-read',
      };

      const url = await s3.getSignedUrlPromise('putObject', s3Params);

      return {
        key,
        url,
      };
    } catch (e) {
      throw new ServiceError('failed to generate signed url');
    }
  };
}

module.exports = FileService;
