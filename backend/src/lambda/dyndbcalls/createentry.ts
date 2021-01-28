import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE

export async function createEntry(newItem: { name: string; dueDate: string; todoId: any; createdAt: string; userId: string; done: boolean }) {
    await docClient.put({
      TableName: todoTable,
      Item: newItem
    }).promise()
  }