import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link href="/" className="logo">
          StudyHub
        </Link>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/notes">Notes</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/router-demo">Router Demo</Link>
        </div>
      </div>
    </nav>
  );
}