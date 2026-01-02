import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex gap-6 items-center">
          <li>
            <Link to="/" className="hover:text-accent transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-accent transition-colors">
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/test-error-boundary"
              className="hover:text-accent transition-colors"
            >
              Test Error
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}