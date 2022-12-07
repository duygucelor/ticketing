import Link from "next/link";

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", path: "/auth/signup" },
    !currentUser && { label: "Sign In", path: "/auth/signin" },
    currentUser && { label: "Sign Out", path: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, path }) => {
      return (
        <li key={path} className="nav-item">
          <Link class="" href={path} className="nav-link">
            {label}
          </Link>
        </li>
      );
    });
  return (
    <nav class="navbar navbar-light bg-light p-2">
      <Link href="/" className="navbar-brand">
        Tix
      </Link>
      <div class="d-flex justify content-end">
        <ul class="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
