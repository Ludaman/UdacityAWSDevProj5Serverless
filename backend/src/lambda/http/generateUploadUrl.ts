import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
import { parseAuthorization } from '../../auth/utils'
import { updateTodosURL } from '../dyndbcalls/updateurl'
import { getUploadUrl } from '../s3calls/getsignedurl'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log('getULR.ts Processing event: ', event)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const userId = parseAuthorization(event.headers.Authorization)

  const uploadUrl = getUploadUrl(todoId, bucketName, urlExpiration)
  console.log('url generated: ', uploadUrl)
  
  const newUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  
  console.log('new URL is: ', newUrl)

  //const newItem = await updateTodosURL(newUrl, todoId, userId) 
  await updateTodosURL(newUrl, todoId, userId) 

  return {
    statusCode: 201,
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({uploadUrl})
  }
}




