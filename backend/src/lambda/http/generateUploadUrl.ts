import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
import * as AWS  from 'aws-sdk'
import { parseAuthorization } from '../../auth/utils'
import { TodoItem } from '../../models/TodoItem'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log('getULR.ts Processing event: ', event)
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const userId = parseAuthorization(event.headers.Authorization)

  const uploadUrl = getUploadUrl(todoId)
  console.log('url generated: ', uploadUrl)
  
  const newUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  
  console.log('new URL is: ', newUrl)

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

function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
}

async function updateTodosURL(newUrl, todoId: string,userId: string):Promise<TodoItem> {
    console.log('attempting to set URL in existing TODOID: ', todoId)
    console.log('attempting to set URL in existing newURL: ', newUrl)

    await docClient.update({
        TableName: todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        },
        ExpressionAttributeNames: {"#A": "attachmentUrl"},
        UpdateExpression: "set #A = :attachmentUrl",
        ExpressionAttributeValues: {
            ":attachmentUrl": newUrl
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()

      console.log('Successfully set URL in existing TODO, newUrl: ', newUrl)


      return null
}
