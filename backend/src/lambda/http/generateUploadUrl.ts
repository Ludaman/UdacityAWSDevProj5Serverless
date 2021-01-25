import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'


const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId
  console.log('getULR.ts Processing event: ', event)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const imageId = uuid.v4()
  const url = getUploadUrl(imageId)

  return {
    statusCode: 201,
    body: url
  }
}

function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: urlExpiration
    })
}