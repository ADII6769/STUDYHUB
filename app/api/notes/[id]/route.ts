import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import mongoose from "mongoose";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

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