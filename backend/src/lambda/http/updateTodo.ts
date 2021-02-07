import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda' //required for lambda
import { parseAuthorization } from '../../auth/utils'  //call to authentication used for Lambda
import { updateDynDB } from '../dyndbcalls/update'  //call to dynDB functions
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest' //keep formats consistent between files
import { createLogger } from '../../utils/logger'
import { invokeLambda } from '../lambdacalls/invokelambda'  //call to function able to invoke another lambdaFunction


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const logger = createLogger('updatetodo')


 // console.log('updateTodos.ts Processing event: ', event)
  logger.info('updateTodos.ts Processing event: ', event)

  const todoId = event.pathParameters.todoId

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
  const userId = parseAuthorization(event.headers.Authorization)

  const newitem = await updateDynDB(userId, todoId, updatedTodo)

  //await invokeLambda(todoId)
  await invokeLambda(todoId, userId)

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


