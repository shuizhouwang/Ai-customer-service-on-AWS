def lambda_handler(event, context):
  import boto3
  import base64
  import time
  dynamodb = boto3.client('dynamodb')
  rekog = boto3.client('rekognition')
  test_id=event['userId']
  print(test_id)
  test_picture=event['base64Image']
  image_64_decode = base64.b64decode(test_picture)

  s3 = boto3.resource('s3')
  bucket = s3.Bucket('pictureshuizhou')
  object = bucket.put_object(
   	  ACL='public-read-write',
      Body=image_64_decode,
      Bucket='pictureshuizhou',
      Key=test_id+'test',
      Metadata={
          'ID': test_id,
      })
  from boto3.dynamodb.conditions import Key, Attr
  table=boto3.resource('dynamodb').Table('Users') 
  get_user = table.query(KeyConditionExpression=Key('userid').eq(test_id))
  if get_user['Items']==[]:
    return({"message":"userid does not exsit"})
    #return("id does not much")
  else:
    s3key=get_user['Items'][0]['s3key']
    rekog = boto3.client('rekognition')
    response = rekog.compare_faces(
      SourceImage={
          'S3Object': {
              'Bucket':'pictureshuizhou',
              'Name': test_id+'test'
          }
      },
       TargetImage={
          'S3Object': {
              'Bucket':'pictureshuizhou',
              'Name': s3key
          }
      },
      SimilarityThreshold=0.0
  )
    tokenid=s3key
    #token ={
    #'tokenid':tokenid,
    #'userid':test_id,
    #'timestamp':time.time()}
    token={"tokenId":tokenid,
           "userId":test_id,
           "timestamp":time.time()}
    null=None
    if response['FaceMatches'][0]['Similarity']>=60: 
      print(response['FaceMatches'][0]['Similarity'])
      return(token)
      #return(null,token)
    else:
      return({"message":"id does not match"})
      #return("id does not match")
