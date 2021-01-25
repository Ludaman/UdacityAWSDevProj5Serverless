import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'



const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
//const todoIdIndex = process.env.INDEX_NAME


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('updateTodos.ts Processing event: ', event)

    const todoId = event.pathParameters.todoId

    console.log('Attempting to update todoID: ', todoId)

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  console.log('Parsed into: ', updatedTodo)

    const newitem = await docClient.update({
        TableName: todosTable,
        Key: {
            userId: "Jeff",
            todoId: todoId
        },
        ExpressionAttributeNames: {"#name": "name"},
        UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: {
            ":name":"BOB",
            ":dueDate":"anotehrnewDate",
            ":done":"stillnotdone"
        },
        ReturnValues: "UPDATED_NEW"
      }).promise()
  
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
