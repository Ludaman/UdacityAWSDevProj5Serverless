//this file is kept to bare minimum of calls surrounding accessing a DynamoDB table for an update
import * as AWS  from 'aws-sdk' //required to access dynamoDB
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'//keep formats consistent between files

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export async function updateDynDB(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
    return await docClient.update({
        TableName: todosTable,
        Key: {
            userId: userId,
            todoId: todoId
        },
        ExpressionAttributeNames: { "#name": "name" },
        UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: {
            ":name": updatedTodo.name,
            ":dueDate": updatedTodo.dueDate,
            ":done": updatedTodo.done
        },
        ReturnValues: "UPDATED_NEW"
    }).promise()
}