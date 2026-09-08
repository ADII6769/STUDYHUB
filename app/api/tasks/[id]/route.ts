import { connectDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";
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
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const task = await Task.findByIdAndUpdate(
      id,
      {
        ...(body.title !== undefined && {
          title: body.title.trim(),
        }),
        ...(body.description !== undefined && {
          description: body.description.trim(),
        }),
        ...(body.completed !== undefined && {
          completed: body.completed,
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json(task);
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    return Response.json(
      { error: "Failed to update task" },
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
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    return Response.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}