"use client";

import { FormEvent, useEffect, useState, type CSSProperties } from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
};

type Filter = "all" | "pending" | "completed";

export default function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState<Filter>("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newTaskId, setNewTaskId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);

  async function fetchTasks() {
    try {
      const response = await fetch("/api/tasks", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load tasks");
      }

      setTasks(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setError("");
      setAdding(true);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      setTitle("");
      setDescription("");

      await fetchTasks();

      setNewTaskId(data._id);

      setTimeout(() => {
        setNewTaskId(null);
      }, 700);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setAdding(false);
    }
  }

  async function toggleTask(task: Task) {
    try {
      setError("");
      setCompletingId(task._id);

      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      await fetchTasks();

      setTimeout(() => {
        setCompletingId(null);
      }, 550);
    } catch (error) {
      setCompletingId(null);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }

  async function deleteTask(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingId(id);

      await new Promise((resolve) => setTimeout(resolve, 350));

      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id)
      );

      setDeletingId(null);
    } catch (error) {
      setDeletingId(null);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }

  function startEditing(task: Task) {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setError("");

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      cancelEditing();
      await fetchTasks();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    }

    if (filter === "pending") {
      return !task.completed;
    }

    return true;
  });

  return (
    <main className="container page-transition">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PRODUCTIVITY</p>
          <h1>Study Tasks</h1>
          <p>Create, complete, edit and delete your study tasks.</p>
        </div>

        <div className="task-summary">
          <strong>
            {tasks.filter((task) => task.completed).length}
          </strong>
          <span>/{tasks.length} completed</span>
        </div>
      </div>

      <form onSubmit={addTask} className="form-card">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Task description"
          rows={4}
        />

        <button type="submit" disabled={adding}>
          {adding ? (
            <>
              <span className="spinner" />
              Adding Task...
            </>
          ) : (
            "Add Task"
          )}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="filter-bar">
        <button
          type="button"
          className={
            filter === "all" ? "filter-active" : "filter-button"
          }
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          type="button"
          className={
            filter === "pending"
              ? "filter-active"
              : "filter-button"
          }
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>

        <button
          type="button"
          className={
            filter === "completed"
              ? "filter-active"
              : "filter-button"
          }
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <section className="list">
        {loading ? (
          <div className="loading-state">
            <span className="large-spinner" />
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <h2>No tasks here</h2>
            <p>Create a task to start studying.</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <article
              className={`card task-card ${
                newTaskId === task._id ? "task-enter" : ""
              } ${
                deletingId === task._id ? "task-deleting" : ""
              } ${
                completingId === task._id ? "task-completing" : ""
              }`}
              key={task._id}
              style={
                {
                  "--delay": `${index * 70}ms`,
                } as CSSProperties
              }
            >
              {editingId === task._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(event) =>
                      setEditTitle(event.target.value)
                    }
                  />

                  <textarea
                    value={editDescription}
                    onChange={(event) =>
                      setEditDescription(event.target.value)
                    }
                    rows={3}
                  />

                  <div className="button-row">
                    <button
                      type="button"
                      onClick={() => saveEdit(task._id)}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="secondary-button"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="task-title-row">
                    <h2 className={task.completed ? "completed" : ""}>
                      {task.completed && (
                        <span className="success-check">✓</span>
                      )}
                      {task.title}
                    </h2>
                  </div>

                  <p>{task.description}</p>

                  <small className="task-date">
                    Created{" "}
                    {new Date(task.createdAt).toLocaleDateString()}
                  </small>

                  <div className="button-row">
                    <button
                      type="button"
                      onClick={() => toggleTask(task)}
                      className={
                        task.completed
                          ? "complete-button completed-button"
                          : "complete-button"
                      }
                    >
                      {task.completed
                        ? "✓ Completed"
                        : "Complete"}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEditing(task)}
                      className="secondary-button"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTask(task._id)}
                      className="danger-button"
                      disabled={deletingId === task._id}
                    >
                      {deletingId === task._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}