from __future__ import print_function

import base64
import json
import boto3
from datetime import datetime
from collections import defaultdict

#print('Loading function')


def update_dynamo_event_counter(tableName, event_name, event_datetime, event_count=1, dynamodb = boto3.resource(service_name='dynamodb', region_name='us-east-1')):
        table = dynamodb.Table(tableName)
        response = table.put_item(
          Item={
                'EventName': event_name,
                'EventHour': event_datetime
            }
        )
        

def lambda_handler(event, context):
    hour_event_counter = defaultdict(int)    
    for record in event['Records']:
        payload = base64.b64decode(record['kinesis']['data'])
        payload_json = json.loads(payload)
        try: 
            event_type=event_type=str(payload_json['event'])
        except Exception as e:            
            print('Error no event type detected')
            event_type='NULL'
        try: 
            hour_event_time=str(payload_json['utc_timestamp'].split(':', 1)[0]+':00:00')
        except Exception as e:            
            print('Error no event time detected')
            hour_event_time='NULL'
    hour_event_counter[(event_type, hour_event_time)] += 1
    for key,val in hour_event_counter.iteritems():
        print("%s, %s = %s" % (str(key[0]), str(key[1]), str(val)))
        update_dynamo_event_counter('context_layer_table', key[0], key[1], int(val))   
    return 'Successfully processed {} records.'.format(len(event['Records']))