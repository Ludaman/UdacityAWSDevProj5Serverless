import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { parseAuthorization } from '../../auth/utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('deleteTodo.ts Processing event: ', event)

  const todoId = event.pathParameters.todoId
  const userId = parseAuthorization(event.headers.Authorization)

  console.log('attempting to delete ID: ', todoId)

  const params = {
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId
  }      
}

  await docClient.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item", JSON.stringify(err))
    }
    else {
        console.log("DeleteItem succeeded", JSON.stringify(data))
    }
  }).promise()

  return {
    statusCode: 201,
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
    },
    body: "Deleted item"
  }

}
