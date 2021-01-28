import 'source-map-support/register'


import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { parseAuthorization } from '../../auth/utils'
import { createEntry } from '../dyndbcalls/createentry'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    console.log('createTodo.ts Processing event: ', event)//indicate I got into the method

    const itemId = uuid.v4()
    const timestamp = new Date().toISOString()
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    const userId = parseAuthorization(event.headers.Authorization)

    //create JSON of data to be uploaded to dynamo DB
    const newItem = { 
        todoId: itemId,
        createdAt: timestamp,
        userId: userId,
        done: false,
        ...newTodo//includes name and duedate
    }//assume that attachmentURL will come via update only

    //actually write it to the dynamoDB
     await createEntry(newItem)
  
      //return to client application that write succeeded
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: `Item successfuly created ${newItem}`,
      item: newItem,
    },
    null,
    2,
    )
  }
}