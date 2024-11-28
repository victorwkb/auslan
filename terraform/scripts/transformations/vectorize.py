import json
import os

import boto3
import lancedb
from langchain_aws import BedrockEmbeddings
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.vectorstores import LanceDB

BEDROCK_ACCESS_KEY_ID = os.getenv("BEDROCK_ACCESS_KEY_ID")
BEDROCK_SECRET_ACCESS_KEY = os.getenv("BEDROCK_SECRET_ACCESS_KEY")
BEDROCK_REGION = os.getenv("BEDROCK_REGION")

s3 = boto3.client("s3")

bedrock_client = boto3.client(
    service_name="bedrock-runtime",
    region_name=BEDROCK_REGION,
    aws_access_key_id=BEDROCK_ACCESS_KEY_ID,
    aws_secret_access_key=BEDROCK_SECRET_ACCESS_KEY,
)

embeddings = BedrockEmbeddings(
    client=bedrock_client,
    model_id="amazon.titan-embed-text-v2:0",
)


def handler(event, context):
    try:
        # Define s3 bucket and object key
        bucket_name = os.getenv("S3_BUCKET")
        prefix = os.getenv("S3_DEST_PREFIX")
        pre_object_key = f"{prefix}/transformed.csv"
        post_object_key = f"{prefix}/vectorized"
        local_path = "/tmp/transformed.csv"

        # Download the file to tmp directory
        s3.download_file(bucket_name, pre_object_key, local_path)

        # Initialize LanceDB connection
        uri = f"s3://{bucket_name}/{post_object_key}"
        db_conn = lancedb.connect(uri, region="ap-southeast-2")
        loader = CSVLoader(local_path, metadata_columns=["word_id"])
        docs = loader.load()

        LanceDB.from_documents(
            docs, embeddings, connection=db_conn, table_name="vectorstore"
        )

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "Vectorization successful",
                }
            ),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "An error occurred", "error": str(e)}),
        }
