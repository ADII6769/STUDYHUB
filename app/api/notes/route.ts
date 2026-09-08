import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const notes = await Note.find().sort({ createdAt: -1 });

    return Response.json(notes);
  } catch (error) {
    console.error("GET NOTES ERROR:", error);

    return Response.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.title?.trim() || !body.content?.trim()) {
      return Response.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const note = await Note.create({
      title: body.title.trim(),
      content: body.content.trim(),
    });

    return Response.json(note, { status: 201 });
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);

    return Response.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
