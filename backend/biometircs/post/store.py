def lambda_handler(event, context):
 import boto3
 import base64
 s3 = boto3.resource('s3')
 bucket = s3.Bucket('pictureshuizhou')
 name_define=event['userId']
 print(name_define)
 image_64_encode=event['base64Image']
 image_64_decode=base64.b64decode(image_64_encode) 
 object = bucket.put_object(
 	ACL='public-read-write',
    Body=image_64_decode,
    Bucket='pictureshuizhou',
    Key=name_define+'valid',
    Metadata={
        'ID': name_define,
    })
 s3_key=name_define+'valid'
 dynamodb = boto3.resource('dynamodb')
 table = dynamodb.Table('Users')
 table.put_item(
   Item={
        'userid': name_define,
        's3key':name_define+'valid'})
 item_data={'s3_key':name_define+'valid'}
 null=None
 return ({'status':'success','massage':'The biometric has been successfully addded to the database.'})
 #return (null,{'status':'success','massage':'The biometric has been successfully addded to the database.'})