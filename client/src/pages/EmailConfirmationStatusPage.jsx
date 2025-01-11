import "./styles/EmailConfirmationStatusPage.css";
import successIcon from "../assets/success_24x24_434343.svg";
import failureIcon from "../assets/failure_24x24_434343.svg";

const POSSIBLE_TYPES = ["success", "failure"];
const EmailConfirmationStatusPage = ({ type }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of EmailConfirmationStatusPage is not defined or incorrect");

  let imageProps = type === "success" ? { src: successIcon, alt: "Success" } : { src: failureIcon, alt: "Failure" };
  let headingContent = (
    type === "success" 
      ? "You have successfully confirmed the email" 
      : "Something went wrong in the email confirmation process"
  );

  let className = `email-confirmation-status-page ${type}-variation`

  return (
    <main className={className}>
      <section className="email-confirmation-status-card">
        <header>
          {/* i'm not certain about using the figure element here */}
          <figure className="email-confirmation-status-img-wrapper">
            {/* eslint-disable-next-line */}
            <img {...imageProps} draggable="false" />
          </figure>
          <h2>
            {headingContent}
          </h2>
        </header>
        {type === "success"
          ? (
            <p>
              Open the store in the browser you used to log in to this account and refresh the site or, if you want to use this one, follow the navigation links above
            </p>
          )
          : <p>Possibly, the confirmation link is outdated. Send a new one from the browser you used to log in to this account</p>
        }
      </section>
    </main>
  );
}

export default EmailConfirmationStatusPage;
