export async function GET() {
  try {
    const response = await fetch(
      "https://openlibrary.org/search.json?q=computer%20science&limit=12",
      {
        cache: "no-store",
        headers: {
          "User-Agent": "StudyHub/1.0 student-project",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Open Library response:", response.status, text);

      return Response.json(
        { error: `Open Library returned ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    const books = (data.docs || []).map((book: any) => ({
      id: book.key,
      title: book.title || "Untitled",
      author: book.author_name?.[0] || "Unknown Author",
      year: book.first_publish_year || "Unknown",
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
    }));

    return Response.json(books);
  } catch (error) {
    console.error("RESOURCES API ERROR:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch learning resources",
      },
      { status: 500 }
    );
  }
}
