import json
import os

import boto3
import lancedb

s3 = boto3.client("s3")


def handler(event, context):
    try:
        # Define s3 bucket and object key
        bucket_name = os.getenv("S3_BUCKET")
        prefix = os.getenv("S3_DEST_PREFIX")
        post_object_key = f"{prefix}/vectorized"

        # Initialize LanceDB connection
        uri = f"s3://{bucket_name}/{post_object_key}"
        db_conn = lancedb.connect(uri, region="ap-southeast-2")

        tb = db_conn.open_table("vectorstore")

        # Create a full-text search index
        tb.create_fts_index(
            field_names="text",
            use_tantivy=False,
            language="English",
            stem=True,
            replace=True,
            with_position=True,
        )

        # Create vector index
        tb.create_index(
            metric="cosine",
            num_sub_vectors=128,
            replace=True,
            index_type="IVF_HNSW_PQ",
        )

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "Indexing is successful",
                }
            ),
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "An error occurred", "error": str(e)}),
        }
