import { createLogger } from '../../utils/logger'
var AWS = require('aws-sdk');


export async function invokeLambda(todoId: string) {
    const logger = createLogger('lambdainvoker')
    const otherLambda = new AWS.Lambda();
    const params = {
      FunctionName: 'ModifyImage', 
      Payload: todoId
    }
    otherLambda.invoke(params, function(err, data){
      if(err) logger.info(err, err.stack)
      else logger.info (data)
    })
  }