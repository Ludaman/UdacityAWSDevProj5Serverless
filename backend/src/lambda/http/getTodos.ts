import 'source-map-support/register'
import { getFromDynDB } from '../dyndbcalls/gettodos'  //call to dynDB functions
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { parseAuthorization } from '../../auth/utils'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user , doing for all users now
  //need to do this per user by using query properly
  console.log('getTodos.ts Processing event: ', event)
  const userId = parseAuthorization(event.headers.Authorization)

//This will scan for all results in the table and can be used for testing if desired
  // const result = await docClient.scan({
  //   TableName: todosTable
  // }).promise()

  const result = await getFromDynDB(userId)

  const items = result.Items
  console.log('getTodos.ts returning these items : ', items)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}


