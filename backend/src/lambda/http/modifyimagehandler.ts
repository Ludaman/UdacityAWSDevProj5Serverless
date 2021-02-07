import 'source-map-support/register'
//import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { modifyImage } from '../dyndbcalls/modifyImage'  //call to dynDB functions


//export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
export const handler = function (event) {

  const logger = createLogger('modifyimagehandler')

  logger.info('modifyimagehandler.ts Processing event: ', event)
  console.log('LOG modifyimagehandler.ts Processing event: ', event)

  const todoId = event.todoId
  const userId = event.userId

    console.log("EVENT details received: ", event)
  logger.info('todoId event: ', todoId)

  modifyImage(todoId, userId)

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
// exports.handler = function(event, context) {
//     console.log('Lambda B received event : ' , JSON.stringify(event, null, 2))
//     context.succeed('Hello world 1 ' + event.todoId)
// }