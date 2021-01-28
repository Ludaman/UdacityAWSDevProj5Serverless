import * as AWS  from 'aws-sdk'

const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
  
export function getUploadUrl(todoId: string, bucketName, urlExpiration) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
}