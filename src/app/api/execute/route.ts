import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, message } = await request.json();
    const safeName = typeof name === "string" ? name : "Guest";
    const safeMessage =
      typeof message === "string" ? message : "No message provided";

    // Generate an HTML string.
    const html = `<div class="response">
      <p>Hello, ${safeName}!</p>
      <p>Your message: ${safeMessage}</p>
    </div>`;

    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }
}
