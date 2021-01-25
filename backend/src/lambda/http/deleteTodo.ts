import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('deleteTodo.ts Processing event: ', event)

  const todoId = event.pathParameters.todoId

  console.log('attempting to delete ID: ', todoId)

  await docClient.delete({
      TableName: todosTable,
      Key: {
        userId: "Jeff",
        todoId: todoId
    }      
  })

  console.log('Deleted ID and returning status: ', todoId)


  return {
    statusCode: 201,
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
    },
    body: "Deleted item"
  }

}
