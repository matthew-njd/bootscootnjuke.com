function Nav() {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-xl">
          Boot Scoot 'n Juke
        </a>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/owners">Owners</a>
          </li>
          <li>
            <a href="/matchups">Matchups</a>
          </li>
          <li>
            <a href="/leaderboards">Leaderboards</a>
          </li>
          <li>
            <a href="/drafts">Drafts</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
