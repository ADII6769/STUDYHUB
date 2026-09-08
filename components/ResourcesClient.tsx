"use client";

import { FormEvent, useEffect, useState, type CSSProperties } from "react";

type Resource = {
  key: string;
  title: string;
  author: string;
  year: number | string;
  cover: string | null;
};

export default function ResourcesClient() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchText, setSearchText] = useState("computer science");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadResources(searchQuery: string) {
    try {
      setLoading(true);
      setError("");

      const encodedQuery = encodeURIComponent(searchQuery);

      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodedQuery}&limit=12`
      );

      if (!response.ok) {
        throw new Error("Open Library request failed");
      }

      const data = await response.json();

      const books: Resource[] = (data.docs || []).map(
        (book: any) => ({
          key: book.key,
          title: book.title || "Untitled",
          author: book.author_name?.[0] || "Unknown Author",
          year: book.first_publish_year || "Unknown",
          cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : null,
        })
      );

      setResources(books);
    } catch (error) {
      console.error(error);
      setError("Unable to load learning resources.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResources("computer science");
  }, []);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (!searchText.trim()) {
      setError("Enter something to search.");
      return;
    }

    await loadResources(searchText.trim());
  }

  return (
    <main className="container page-transition">
      <div className="section-heading">
        <div>
          <p className="eyebrow">OPEN LIBRARY</p>
          <h1>Learning Resources</h1>
          <p>
            Discover computer science books and learning material.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="resource-search">
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search books..."
        />

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="loading-state">
          <span className="large-spinner" />
          <p>Finding books...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">?</div>
          <h2>No books found</h2>
          <p>Try another search.</p>
        </div>
      ) : (
        <section className="resource-grid">
          {resources.map((resource, index) => (
            <article
              className="resource-card resource-animate"
              key={resource.key}
              style={
                {
                  "--delay": `${index * 70}ms`,
                } as CSSProperties
              }
            >
              <div className="cover-wrapper">
                {resource.cover ? (
                  <img
                    src={resource.cover}
                    alt={resource.title}
                  />
                ) : (
                  <div className="no-cover">
                    No Cover
                  </div>
                )}
              </div>

              <h2>{resource.title}</h2>

              <p>
                <strong>Author:</strong> {resource.author}
              </p>

              <p>
                <strong>First published:</strong> {resource.year}
              </p>

              <a
                href={`https://openlibrary.org${resource.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                View Book <span>→</span>
              </a>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}