# Serverless CAPSTONE Project for Jeff Choate

I expect the grader to use the APIID and react front end to connect to this application.

# Functionality of the application

This application is a small extension to the Serverless project designed to allow me to explore the tieing together of Lambda's and what I could do on images via a Lmabda.

Main functionality is to invert colors of an image ONLY if the image is less than 250KB via click of the checkbox

# USING APPLICATION
1) Log in
2) UPload image less than 250Kb in size via pencil button
3) click checkbox
4) reload webpage
5) login
6) see your image is inverted

# Delta of work for this project
Added ability to invoke other Lambda functions
Added new lambda function to Serverless file with appropriate IAM permsissions to modify images on the S3 store
Modified existing function to call new Lmabda function directly and modified its IAM permissions in Serverless file

# Learning
This project allowed me to learn about the restrictions of Lambda functions.  They can not easily execute on images due to the sixe of many images.  This would be better done via an application on an actual EC2 host with real resources.

I explored various ways of invoking lambdas and various ways of retrieving information from S3 and DynamoDB.  

# FUTURE IMPROVEMENTs
I recognize that this application should use alerts or SNS to notify the new fucntion to execute its task and it is not wise to chain lambda functions together.  However, I wanted to explore chaining lambdas together.  

Also, imagery modifications is not a great application to lambda functions due to amount of memory that imagery tends to use and the low restrictions of Lambda functions.

