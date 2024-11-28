import io
import json
import os

import boto3
import pandas as pd

s3 = boto3.client("s3")


def handler(event, context):
    try:
        # Define s3 bucket and object key
        bucket_name = os.getenv("S3_BUCKET")
        src_prefix = os.getenv("S3_SRC_PREFIX")
        dest_prefix = os.getenv("S3_DEST_PREFIX")

        src_object_key = f"{src_prefix}/auslan_dictionary.json"
        dest_object_key = f"{dest_prefix}/transformed.csv"

        # Load the JSON data
        response = s3.get_object(Bucket=bucket_name, Key=src_object_key)

        json_data = json.loads(response["Body"].read().decode("utf-8"))
        json_data = json_data["data"]

        # Apply transformations
        df = pd.json_normalize(
            json_data,
            ["sub_entries"],
            ["entry_in_english"],
            record_prefix="sub_entries_",
            max_level=0,
        )
        df["definitions"] = df["sub_entries_definitions"].apply(
            lambda x: ";".join([f"{k}: {'; '.join(v)}" for k, v in x.items()])
        )
        df = df.drop(
            columns=[
                "sub_entries_regions",
                "sub_entries_video_links",
                "sub_entries_keywords",
                "sub_entries_definitions",
            ]
        )
        df = df.rename(columns={"entry_in_english": "word"})
        df["word_id"] = pd.factorize(df["word"])[0] + 1

        # Create buffer to hold CSV data
        csv_buffer = io.StringIO()
        df.to_csv(csv_buffer, index=False)

        s3.put_object(
            Bucket=bucket_name,
            Key=dest_object_key,
            Body=csv_buffer.getvalue(),
        )

        # Parquet file for final data retrieval
        db_df = pd.json_normalize(json_data, max_level=1)
        db_df["word_id"] = pd.factorize(db_df["entry_in_english"])[0] + 1

        # convert columns to string
        columns_to_convert = [
            "entry_in_english",
            "sub_entries",
            "entry_type",
            "categories",
        ]
        for column in columns_to_convert:
            db_df[column] = db_df[column].astype(str)

        parquet_buffer = io.BytesIO()
        db_df.to_parquet(parquet_buffer, index=False)

        s3.put_object(
            Bucket=bucket_name,
            Key="gold/dictionary.parquet",
            Body=parquet_buffer.getvalue(),
        )

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "Transformation successful",
                }
            ),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "An error occurred", "error": str(e)}),
        }
