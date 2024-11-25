import boto3
import json
import urllib.request
import os

s3 = boto3.client("s3")


def handler(event, context):
    json_url = "https://raw.githubusercontent.com/banool/auslan_dictionary/master/assets/data/data.json"

    try:
        with urllib.request.urlopen(json_url) as response:
            if response.status != 200:
                raise Exception(f"HTTP Error: {response.status}")
            data = response.read()

        # Define s3 bucket and object key
        bucket_name = os.getenv("S3_BUCKET")
        prefix = os.getenv("S3_PREFIX")
        object_key = f"{prefix}/auslan_dictionary.json"

        s3.put_object(
            Bucket=bucket_name,
            Key=object_key,
            Body=data,
        )

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "Data fetched successfully",
                    "s3_object_key": object_key,
                    "s3_bucket": bucket_name,
                }
            ),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "An error occurred", "error": str(e)}),
        }
