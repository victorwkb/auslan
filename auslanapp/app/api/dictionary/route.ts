import { NextResponse } from "next/server";

import AWS from "aws-sdk";

const lambda = new AWS.Lambda({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is missing" },
      { status: 400 },
    );
  }

  try {
    const lambdaEndpoint = process.env.AWS_LAMBDA_ENDPOINT;
    
    if (!lambdaEndpoint) {
        throw new Error("AWS_LAMBDA_ENDPOINT environment variable is not set");
    }

    // Simulating Lambda response
    const lambdaResponse = await lambda
      .invoke({
        FunctionName: lambdaEndpoint,  // Safely use lambdaEndpoint
        Payload: JSON.stringify({ body: query }),
      })
      .promise();

    // Parse the response from the Lambda function
    const parsedResponse = JSON.parse(lambdaResponse.Payload as string);

    // Assuming the Lambda returns a body with stringified JSON, parse it too
    const responseBody = JSON.parse(parsedResponse.body);

    return NextResponse.json(responseBody); // Forward the parsed response to the frontend
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return NextResponse.json(
      { error: "Error fetching data from Lambda" },
      { status: 500 },
    );
  }
}
