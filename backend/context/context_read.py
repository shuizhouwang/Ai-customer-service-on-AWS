from __future__ import print_function

import json
import boto3
from boto3.dynamodb.conditions import Key

name = "test-101"
hour = "2:00:00"

def lambda_handler(event, context):
    dynamodb = boto3.resource(service_name='dynamodb', region_name='us-east-1')
    table = dynamodb.Table('context_layer_table')
    response = table.get_item(
      Key={
            'EventName': name,
            'EventHour': hour
        }
    )
    return response["Item"]