const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // TODO implement
    
    if (event.httpMethod == "OPTIONS") {
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify('done'),
        };
        return response;
    }
    

    event = JSON.parse(event.body);
    //const rr = { statusCode: 200, body: JSON.stringify(event.httpMethod) }; return rr;
    
    //event = event.body;
  
    let p = [];
    
    p.push(ddb.put({
        TableName: 'Certifications',
        Item: {
            title: event.certTitle,
            provider: event.certProvider,
            examDesc: event.examDesc,
            examQuestionCount: event.examQuestionCount
        }
    }).promise());

    p.push(ddb.put({
        TableName: 'CertProviders',
        Item: {
            provider: event.certProvider,
            title: event.certProvider
        }
    }).promise());
    
    for (let i = 0; i < event.questions.length; i++) {
        p.push(ddb.put({
            TableName: 'CertExamQuestions',
            Item: event.questions[i],
        }).promise());
    }

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify("Loaded"),
    };
    await Promise.all(p);
    
    return response;
};
