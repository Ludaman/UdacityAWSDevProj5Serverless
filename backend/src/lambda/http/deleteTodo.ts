import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseAuthorization } from '../../auth/utils'
import { deleteItemById } from '../dyndbcalls/deleteitem'
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

  await deleteItemById(params)

  return {
    statusCode: 201,
    headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
    },
    body: "Deleted item"
  }
}