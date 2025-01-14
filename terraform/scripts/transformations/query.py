import ast
import io
import json
import os

import boto3
import lancedb
from lancedb.rerankers import LinearCombinationReranker
from langchain_aws import BedrockEmbeddings
import pandas as pd

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

reranker = LinearCombinationReranker(weight=0.7)

# Define s3 bucket and object key
bucket_name = os.getenv("S3_BUCKET")
prefix = os.getenv("S3_DEST_PREFIX")
post_object_key = f"{prefix}/vectorized"
parquet_object_key = "gold/dictionary.parquet"

# Connect to database
uri = f"s3://{bucket_name}/{post_object_key}"
db_conn = lancedb.connect(uri, region="ap-southeast-2")
tb = db_conn.open_table("vectorstore")


def handler(event, context):
    # parse read event json
    query = event.get("body", "{}")

    if not query:
        return {
            "statusCode": 400,
            "body": json.dumps({"Query can't be empty"}),
        }

    try:
        query_vec = embeddings.embed_query(query)
        res = (
            tb.search(query_type="hybrid")
            .rerank(reranker)
            .vector(query_vec)
            .text(query)
            .limit(20)
            .to_pandas()
        )

        # Get top 5 unique results (drop duplicates)
        unique_res = pd.json_normalize(res["metadata"])
        unique_res = unique_res.drop_duplicates(subset=["word_id"]).head(5)
        unique_res = unique_res.drop(columns=["source", "row"])

        # Get word_id from top 5 results
        rs = unique_res["word_id"].astype(int).to_list()

        # Load full dictionary data and retrieve by word_id
        df = load_parquet_to_df()
        filtered_df = df[df["word_id"].isin(rs)]
        filtered_df = parse_json_fields(filtered_df)

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(filtered_df.to_dict(orient="records")),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "An error occurred", "error": str(e)}),
        }


def load_parquet_to_df() -> pd.DataFrame:
    obj = s3.get_object(Bucket=bucket_name, Key=parquet_object_key)
    parquet_data = io.BytesIO(obj["Body"].read())
    df = pd.read_parquet(parquet_data)

    return df


def parse_json_fields(df):
    def parse_field(field):
        # Convert stringified Python structures to proper Python objects
        if isinstance(field, str):
            try:
                return ast.literal_eval(field)
            except Exception:
                return field
        return field

    df["sub_entries"] = df["sub_entries"].apply(parse_field)
    df["categories"] = df["categories"].apply(parse_field)
    return df
