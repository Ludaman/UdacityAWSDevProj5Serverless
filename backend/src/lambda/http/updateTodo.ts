import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'



const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const todoIdIndex = process.env.INDEX_NAME


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)


  console.log('updateTodos.ts Processing event: ', event)
//must update to use query instead when I start querying by userID
  const result = await docClient.query({
    TableName : todosTable,
    IndexName : todoIdIndex,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
        ':todoId': todoId
    }
}).promise()

console.log('updateTodos.ts found thid many matching items', result.Count)

if(result.Count == 1){
    // const replacementItem = { 
    //     todoId: ,
    //     createdAt: ,
    //     userId: ,
    //     attachmentURL: result.,
    //     ...updatedTodo//includes name, duedate and done
    // }//assume that attachmentURL will come via update only
    const newitem = await docClient.update({
        TableName: todosTable,
        Key: {
            userId: "Jeff",
            todoId: todoId
        },
        UpdateExpression: "set #name = :name, dueDate=:dueDate, done=:done",
        ExpressionAttributeValues: updatedTodo
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
return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: 'Failed to update or find an item'
  }


  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

}
