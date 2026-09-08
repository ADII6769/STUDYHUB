import { connectDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const tasks = await Task.find().sort({ createdAt: -1 });

    return Response.json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    return Response.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.title?.trim()) {
      return Response.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title: body.title.trim(),
      description: body.description?.trim() || "",
      completed: false,
    });

    return Response.json(task, { status: 201 });
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    return Response.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
