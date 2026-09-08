"use client";

import { FormEvent, useEffect, useState, type CSSProperties } from "react";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function NotesClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newNoteId, setNewNoteId] = useState<string | null>(null);

  async function fetchNotes() {
    try {
      const response = await fetch("/api/notes", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load notes");
      }

      setNotes(data);
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
    fetchNotes();
  }, []);

  async function addNote(event: FormEvent) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setError("");
      setSaving(true);

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create note");
      }

      setTitle("");
      setContent("");

      await fetchNotes();

      setNewNoteId(data._id);

      setTimeout(() => {
        setNewNoteId(null);
      }, 700);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(note: Note) {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim() || !editContent.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setError("");

      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update note");
      }

      cancelEditing();
      await fetchNotes();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }

  async function deleteNote(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingId(id);

      await new Promise((resolve) => setTimeout(resolve, 350));

      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== id)
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

  return (
    <main className="container page-transition">
      <div className="section-heading">
        <div>
          <p className="eyebrow">KNOWLEDGE BASE</p>
          <h1>Study Notes</h1>
          <p>Save important concepts and revision notes.</p>
        </div>
      </div>

      <form onSubmit={addNote} className="form-card">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note title"
        />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your note..."
          rows={7}
        />

        <button type="submit" disabled={saving}>
          {saving ? (
            <>
              <span className="spinner" />
              Saving Note...
            </>
          ) : (
            "Save Note"
          )}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="list">
        {loading ? (
          <div className="loading-state">
            <span className="large-spinner" />
            <p>Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✎</div>
            <h2>No notes yet</h2>
            <p>Create your first revision note.</p>
          </div>
        ) : (
          notes.map((note, index) => (
            <article
              key={note._id}
              className={`card note-card ${
                newNoteId === note._id ? "task-enter" : ""
              } ${
                deletingId === note._id ? "task-deleting" : ""
              }`}
              style={
                {
                  "--delay": `${index * 70}ms`,
                } as CSSProperties
              }
            >
              {editingId === note._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(event) =>
                      setEditTitle(event.target.value)
                    }
                  />

                  <textarea
                    value={editContent}
                    onChange={(event) =>
                      setEditContent(event.target.value)
                    }
                    rows={6}
                  />

                  <div className="button-row">
                    <button
                      type="button"
                      onClick={() => saveEdit(note._id)}
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
                  <h2>{note.title}</h2>

                  <p>{note.content}</p>

                  <small className="task-date">
                    Created{" "}
                    {new Date(note.createdAt).toLocaleDateString()}
                  </small>

                  <div className="button-row">
                    <button
                      type="button"
                      onClick={() => startEditing(note)}
                      className="secondary-button"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteNote(note._id)}
                      className="danger-button"
                      disabled={deletingId === note._id}
                    >
                      {deletingId === note._id
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