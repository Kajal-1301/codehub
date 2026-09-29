require("dotenv").config();

const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION
});

const S3_BUCKET = process.env.AWS_BUCKET_NAME;

module.exports = {
    s3,
    S3_BUCKET
};


