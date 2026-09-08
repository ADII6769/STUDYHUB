import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="hero page-transition">
        <div className="floating-shape shape-one" />
        <div className="floating-shape shape-two" />
        <div className="floating-shape shape-three" />

        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            STUDENT PRODUCTIVITY PLATFORM
          </p>

          <h1 className="hero-title">
            Study smarter.
            <br />
            <span>Stay organized.</span>
          </h1>

          <p className="hero-text">
            StudyHub helps you manage study tasks, save revision
            notes, track your progress and discover useful learning
            resources.
          </p>

          <div className="hero-buttons">
            <Link href="/tasks" className="button hero-button">
              Start Studying
            </Link>

            <Link
              href="/dashboard"
              className="button secondary hero-button"
            >
              View Dashboard
            </Link>
          </div>

          <div className="hero-features">
            <div>
              <strong>✓</strong>
              Tasks
            </div>

            <div>
              <strong>✓</strong>
              Notes
            </div>

            <div>
              <strong>✓</strong>
              Progress
            </div>

            <div>
              <strong>✓</strong>
              Resources
            </div>
          </div>
        </div>
      </main>
    </>
  );
}