import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { parseAuthorization } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
import { modifyImage } from '../dyndbcalls/modifyImage'  //call to dynDB functions


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const logger = createLogger('modifyimagehandler')

  logger.info('modifyimagehandler.ts Processing event: ', event)

  const todoId = event.pathParameters.todoId

  logger.info('todoId event: ', todoId)

  modifyImage(todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      stats: "successful call to modifyImage"
    })
  }
}