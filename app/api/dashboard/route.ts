import { connectDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";
import { Note } from "@/models/Note";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({
      completed: true,
    });
    const pendingTasks = await Task.countDocuments({
      completed: false,
    });
    const totalNotes = await Note.countDocuments();

    return Response.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      totalNotes,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return Response.json(
      { error: "Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}
