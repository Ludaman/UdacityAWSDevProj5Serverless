import { createLogger } from '../../utils/logger'
var AWS = require('aws-sdk');
const service_name = process.env.SERVICE_NAME
const stage_name = process.env.STAGE_NAME
const function_name = "ModifyImage"

export async function invokeLambda(todoId: string, userId: string) {
    const logger = createLogger('lambdainvoker')
    const lambdaName= service_name + "-" + stage_name + "-" + function_name 

    var otherLambda = new AWS.Lambda();
    const params = {
      FunctionName: lambdaName, 
      Payload: `{"todoId" : "${todoId}",
                  "userId" : "${userId}" }`
    }
    logger.info('invoking lambda function with params ', params)

   const resultsofinvoke = await otherLambda.invoke(params, function(err, data) {
      if(err) {
        console.log('Found Error')

          logger.info(err, err.stack)
      }
      else {
        console.log('No Error')
          logger.info (data)
      }
    }).promise()
    logger.info('LEAVING InvokeLambda', resultsofinvoke)
  }