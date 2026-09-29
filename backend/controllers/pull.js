const fs = require("fs").promises;
const path = require("path");

const { ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");   // To see and download objects from s3 bucket

const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {

    const repoPath = path.resolve(process.cwd(), ".git");

    try {

        // 1. Get all objects from S3
        const command = new ListObjectsV2Command({
            Bucket: S3_BUCKET,
            Prefix: "commits/"
        });

        const data = await s3.send(command);

        const objects = data.Contents || [];

        if (objects.length === 0) {
            console.log("No commits found in S3.");
            return;
        }

        // 2. Download each object
        for (const object of objects) {

            const key = object.Key;

            const command = new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: key
            });

            const response = await s3.send(command);

            const fileContent = await response.Body.transformToByteArray();    // Convert AWS response body into a Buffer

            // Example:
            // key = commits/abc123/index.js
            //
            // filePath =
            // .apnaGit/commits/abc123/index.js

            const filePath = path.join(repoPath, key);         // Create local file path

            await fs.mkdir(path.dirname(filePath), {           // It make sure parent directory exists
                recursive: true
            });

            await fs.writeFile(filePath, fileContent);        // Write file to local repository

            console.log(`Downloaded: ${key}`);
        }

        console.log("All commits pulled from S3.");

    } catch (err) {

        console.error("Unable to pull:", err);

    }
}


module.exports = { pullRepo };