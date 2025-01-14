import { NextResponse } from "next/server";

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
    const lambdaEndpoint = process.env.AWS_LAMBDA_FUNCTION_URL;

    if (!lambdaEndpoint) {
      throw new Error("AWS_LAMBDA_ENDPOINT environment variable is not set");
    }

    const response = await fetch(lambdaEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: query }),
    });

    if (!response.ok) {
      throw new Error(
        `Lambda invocation failed with status: ${response.status}`,
      );
    }

    const responseBody = await response.json();

    return NextResponse.json(responseBody); // Forward the parsed response to the frontend
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    return NextResponse.json(
      { error: "Error fetching data from Lambda" },
      { status: 500 },
    );
  }
}
