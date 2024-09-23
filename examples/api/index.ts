import { Resource } from 'sst';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command
} from "@aws-sdk/client-s3";

const s3 = new S3Client({});


export async function upload() {
    const command = new PutObjectCommand({
        Bucket: Resource.MyBucket.name,
        Key: crypto.randomUUID()
    });

    return {
        statusCode: 200,
        body: await getSignedUrl(s3, command)
    };
}

export async function latest() {

    return {
        statusCode: 200,
        body: "Helllo Worldd!!"
    };


    const objects = await s3.send(
        new ListObjectsV2Command({
            Bucket: Resource.MyBucket.name
        })
    );

    const latestFile = objects.Contents!.sort(
        (a,b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0)
    )[0];

    const command = new GetObjectCommand({
        Key: latestFile.Key,
        Bucket: Resource.MyBucket.name
    });

    return  {   
        statusCode: 302,
        Headers:{
            Location: await getSignedUrl(s3, command)
        }
    };
}