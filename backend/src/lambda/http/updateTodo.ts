import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda' //required for lambda
import { parseAuthorization } from '../../auth/utils'  //call to authentication used for Lambda
import { updateDynDB } from '../dyndbcalls/update'  //call to dynDB functions
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest' //keep formats consistent between files


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('updateTodos.ts Processing event: ', event)

  const todoId = event.pathParameters.todoId

  console.log('Attempting to update todoID: ', todoId)

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = parseAuthorization(event.headers.Authorization)

  console.log('Parsed into: ', updatedTodo)

    const newitem = await updateDynDB(userId, todoId, updatedTodo)
  
      //return to client application that write succeeded
    return {
        statusCode: 201,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            newitem
        })
    }
}


