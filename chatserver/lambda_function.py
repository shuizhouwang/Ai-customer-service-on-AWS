import json
import urllib.parse
import boto3
from watson_developer_cloud import ToneAnalyzerV3
import smtplib
import email.mime.multipart
import email.mime.text

print('Loading function')

s3 = boto3.client('s3')

def lambda_handler(event, context):
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print(response)
        response2 = response['Body'].read().decode('utf-8')
        print(response2)
        message = json.loads(response2)
        print(message)
        message2 = message['con_con']
        message3 = {}
        message4=message['slots']['email']
        message3['text'] = message2
        print(message3)

        tone_analyzer = ToneAnalyzerV3(
            username='',
            password='',
            version=''
        )
        tone = tone_analyzer.tone(message3, tones='emotion', content_type='application/json')

        print(tone)



        msg = email.mime.multipart.MIMEMultipart()
        print("start sending email")
        msg['Subject'] = ''
        msg['From'] = ''
        msg['To'] = message4
        content = tone['document_tone']['tones'][0]['tone_id']
        print(msg)
        print(content)
        txt = email.mime.text.MIMEText(content)
        print("1")
        msg.attach(txt)
        print("2")
        # smtp = smtplib
        smtp = smtplib.SMTP()
        print("3")
        smtp.connect('smtp.163.com', '25')
        print("4")
        smtp.login('', '')
        print("5")
        smtp.sendmail('', message4, msg.as_string())
        print("6")
        smtp.quit()
        print('email has send out !')

        return response['ContentType']
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e


# with open('tone.json') as json_data:
