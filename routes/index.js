var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
const csv = require('fast-csv');


router.get('/results', function(req, res, next) {
    var params = {
        TableName : "SERVEME2",
        KeyConditionExpression: "#tool = :tool",
        ExpressionAttributeNames:{
            "#tool": "toolName"
        },
        ExpressionAttributeValues: {
            ":tool": req.query.tool
        }
    };
    var returnString = "something went wrong";
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            res.send(returnString)

        } else {
            console.log("Query succeeded.");
            var newData = {
                results: data.Items
            };
            res.json(newData)
        }
    });
});

router.get('/populateVA1807', function(req, res, next) {
    console.log(req.query.tool);
    const fileRows = [];

    // open uploaded file
    csv.fromPath("./VA_18_07.csv")
        .on("data", function (data) {
            fileRows.push(data); // push each row
        })
        .on("end", function () {
            //process "fileRows" and respond
            fileRows.forEach(function(item,index) {
                if(index == 0) {
                    return;
                }
                var params = {
                    TableName:"SERVEME2",
                    Item:{
                        "pKey": uuid.v4(),
                        "toolName": "fortifyOnDemand",
                        "vulnId": item[0],
                        "osvdbTitle": item[1],
                        "IP": item[2],
                        "formattedRisk": item[3],
                        "firstSeenDate": item[4],
                        "status": item[6]
                    }
                };
                docClient.put(params, function (err, data) {
                    if (err) {
                        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Added item:", JSON.stringify(data, null, 2));
                    }
                })
            });
        });
    res.send("finished");
});

router.get('/populateVA2', function(req, res, next) {
    console.log(req.query.tool);
    const fileRows = [];

    // open uploaded file
    csv.fromPath("./VA_18_08.csv")
        .on("data", function (data) {
            fileRows.push(data); // push each row
        })
        .on("end", function () {
            //process "fileRows" and respond
            fileRows.forEach(function(item,index) {
                if(index == 0) {
                    return;
                }
                var params = {
                    Item:{
                        "pKey": uuid.v4(),
                        "toolName": "vulnerabilities2",
                        "osvdbTitle": item[0],
                        "IP": item[1],
                        "status": item[2],
                        "lastSeenDate": item[3],
                        "assignedToUser": item[4],
                        "firstSeenDate": item[5],
                        "vulnId": item[6],
                        "formattedRisk": item[7]
                    },
                    TableName:"SERVEME2"
                };
                docClient.put(params, function (err, data) {
                    if (err) {
                        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Added item:", JSON.stringify(data, null, 2));
                    }
                })
            });
        });
    res.send("finished");
});

router.get('/populateVA3', function(req, res, next) {
    console.log(req.query.tool);
    const fileRows = [];

    // open uploaded file
    csv.fromPath("./VA_18_09.csv")
        .on("data", function (data) {
            fileRows.push(data); // push each row
        })
        .on("end", function () {
            //process "fileRows" and respond
            fileRows.forEach(function(item,index) {
                if(index == 0) {
                    return;
                }
                //osvdbTitle,IP,status,lastSeenDate,ports,assetId,firstSeenDate,vulnId,formattedRisk
                var params = {
                    Item:{
                        "pKey": uuid.v4(),
                        "toolName": "vulnerabilities3",
                        "osvdbTitle": item[0],
                        "IP": item[1],
                        "status": item[2],
                        "lastSeenDate": item[3],
                        "firstSeenDate": item[6],
                        "vulnId": item[7],
                        "formattedRisk": item[8]
                    },
                    TableName:"SERVEME2"
                };
                docClient.put(params, function (err, data) {
                    if (err) {
                        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                        console.log("Added item:", JSON.stringify(data, null, 2));
                    }
                })
            });
        });
    res.send("finished");
});

module.exports = router;
