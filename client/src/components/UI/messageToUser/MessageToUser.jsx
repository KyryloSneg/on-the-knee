import "./MessageToUser.css";

// we can use either messageText or children
const MessageToUser = ({ messageText = null, children = null }) => {
  return (
    <div className="message-to-user">
      {messageText && <p>{messageText}</p>}
      {!!children && children}
    </div>
  );
}

export default MessageToUser;
