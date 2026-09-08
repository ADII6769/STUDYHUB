import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import mongoose from "mongoose";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  { params }: Context
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.title?.trim() || !body.content?.trim()) {
      return Response.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const note = await Note.findById(id);

    if (!note) {
      return Response.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    note.title = body.title.trim();
    note.content = body.content.trim();

    await note.save();

    return Response.json({
      _id: note._id.toString(),
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
  } catch (error) {
    console.error("UPDATE NOTE ERROR:", error);

    return Response.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Context
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { error: "Invalid note ID" },
        { status: 400 }
      );
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return Response.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NOTE ERROR:", error);

    return Response.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
