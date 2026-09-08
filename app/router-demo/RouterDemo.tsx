"use client";

import {
  HashRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { useEffect, useState } from "react";

function RouterHome() {
  return (
    <div className="router-demo-content">
      <p className="eyebrow">REACT ROUTER</p>

      <h1>Router Home</h1>

      <p>
        This page demonstrates client-side routing
        with React Router.
      </p>
    </div>
  );
}

function RouterTasks() {
  return (
    <div className="router-demo-content">
      <p className="eyebrow">REACT ROUTER</p>

      <h1>Router Tasks</h1>

      <p>
        This route is handled by React Router inside
        the Next.js application.
      </p>
    </div>
  );
}

function RouterApplication() {
  return (
    <HashRouter>
      <main className="container page-transition">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ROUTING DEMO</p>

            <h1>React Router Demo</h1>

            <p>
              A demonstration of React Router working
              alongside Next.js routing.
            </p>
          </div>
        </div>

        <div className="router-nav">
          <Link to="/">
            Router Home
          </Link>

          <Link to="/tasks">
            Router Tasks
          </Link>
        </div>

        <section className="card router-demo-card">
          <Routes>
            <Route
              path="/"
              element={<RouterHome />}
            />

            <Route
              path="/tasks"
              element={<RouterTasks />}
            />
          </Routes>
        </section>
      </main>
    </HashRouter>
  );
}

export default function RouterDemo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="container page-transition">
        <div className="loading-state">
          <span className="large-spinner" />

          <p>
            Loading router demo...
          </p>
        </div>
      </main>
    );
  }

  return <RouterApplication />;
}