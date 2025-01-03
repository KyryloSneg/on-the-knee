import "./styles/MyFooter.css";
import { Link } from "react-router-dom";

const MyFooter = () => {
  const now = new Date();
  const currentYear = now.getFullYear();

  return (
    <footer className="my-footer">
      {/* contains some unexisting links because i won't implement pages related to them */}
      <nav>
        <ul className="my-footer-cols">
          <li>
            <section>
              <h2>Company</h2>
              <ul>
                <li>
                  <Link to="#" className="link-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="link-colors">
                    Contacts
                  </Link>
                </li>
                <li>
                  <Link to="#" className="link-colors">
                    Vacancies
                  </Link>
                </li>
              </ul>
            </section>
          </li>
          <li>
            <section>
              <h2>Support</h2>
              <ul>
                <li>
                  <Link to="#" className="link-colors">
                    Credit
                  </Link>
                </li>
                <li>
                  <Link to="#" className="link-colors">
                    Delivery
                  </Link>
                </li>
                <li>
                  <Link to="#" className="link-colors">
                    Payment
                  </Link>
                </li>
                <li>
                  <Link to="#" className="link-colors">
                    Device return
                  </Link>
                </li>
                <li>
                  <Link to="#" className="link-colors">
                    Report an issue
                  </Link>
                </li>
              </ul>
            </section>
          </li>
          <li>
            <section>
              <h2>Apps</h2>
              <ul>
                <li>
                  <Link to="#" className="link-colors">
                    Mobile
                  </Link>
                </li>
                <li>
                  <Link to="#" className="link-colors">
                    Desktop
                  </Link>
                </li>
              </ul>
            </section>
          </li>
          <li>
            <section>
              <h2>Services</h2>
              <ul>
                <li>
                  <Link to="#" className="link-colors">
                    Our card
                  </Link>
                </li>
                <li>
                  <Link to="#" className="link-colors">
                    For partners
                  </Link>
                </li>
              </ul>
            </section>
          </li>
        </ul>
      </nav>
      <p>
        <span>
          <span className="footer-copyright-symbol">&copy;</span>2023-{currentYear}
        </span> Someone's production. All rights aren't reserved.
      </p>
    </footer>
  );
}

export default MyFooter;
