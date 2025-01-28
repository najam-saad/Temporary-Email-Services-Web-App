import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json(
      { error: "Email is required!" },
      { status: 400 }
    );
  }

  // Perform some logic, e.g., save email to the database
  console.log("Received email:", email);

  return NextResponse.json(
    { message: "Email received successfully!" },
    { status: 200 }
  );
}
