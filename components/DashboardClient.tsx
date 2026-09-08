"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Stats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalNotes: number;
};

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);

  const [animatedStats, setAnimatedStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalNotes: 0,
  });

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/dashboard", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load dashboard"
          );
        }

        setStats(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      }
    }

    loadStats();
  }, []);

  useEffect(() => {
    if (stats === null) {
      return;
    }

    const currentStats = stats;
    const duration = 900;
    const startTime = performance.now();

    const finalProgress =
      currentStats.totalTasks === 0
        ? 0
        : Math.round(
            (currentStats.completedTasks /
              currentStats.totalTasks) *
              100
          );

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const percentage = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - percentage, 3);

      setAnimatedStats({
        totalTasks: Math.round(
          currentStats.totalTasks * easeOut
        ),
        completedTasks: Math.round(
          currentStats.completedTasks * easeOut
        ),
        pendingTasks: Math.round(
          currentStats.pendingTasks * easeOut
        ),
        totalNotes: Math.round(
          currentStats.totalNotes * easeOut
        ),
      });

      setProgress(
        Math.round(finalProgress * easeOut)
      );

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [stats]);

  return (
    <main className="container page-transition">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">YOUR PROGRESS</p>

          <h1>Dashboard</h1>

          <p>
            Track your StudyHub progress.
          </p>
        </div>

        <div className="dashboard-badge">
          STUDYHUB
        </div>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {stats === null ? (
        <div className="loading-state">
          <span className="large-spinner" />
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <section className="stats-grid">
            <div
              className="stat-card stat-animate"
              style={
                {
                  "--delay": "0ms",
                } as CSSProperties
              }
            >
              <span className="stat-label">
                TOTAL TASKS
              </span>

              <h2>
                {animatedStats.totalTasks}
              </h2>

              <p>
                Study goals created
              </p>
            </div>

            <div
              className="stat-card stat-animate"
              style={
                {
                  "--delay": "100ms",
                } as CSSProperties
              }
            >
              <span className="stat-label">
                COMPLETED
              </span>

              <h2>
                {animatedStats.completedTasks}
              </h2>

              <p>
                Goals completed
              </p>
            </div>

            <div
              className="stat-card stat-animate"
              style={
                {
                  "--delay": "200ms",
                } as CSSProperties
              }
            >
              <span className="stat-label">
                PENDING
              </span>

              <h2>
                {animatedStats.pendingTasks}
              </h2>

              <p>
                Still to finish
              </p>
            </div>

            <div
              className="stat-card stat-animate"
              style={
                {
                  "--delay": "300ms",
                } as CSSProperties
              }
            >
              <span className="stat-label">
                NOTES
              </span>

              <h2>
                {animatedStats.totalNotes}
              </h2>

              <p>
                Revision notes saved
              </p>
            </div>
          </section>

          <section className="progress-panel">
            <div className="progress-header">
              <div>
                <span className="stat-label">
                  STUDY PROGRESS
                </span>

                <h2>
                  Keep going 🚀
                </h2>
              </div>

              <strong>
                {progress}%
              </strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p>
              {stats.totalTasks === 0
                ? "Create your first task to start tracking progress."
                : `${stats.completedTasks} of ${stats.totalTasks} tasks completed.`}
            </p>
          </section>
        </>
      )}
    </main>
  );
}