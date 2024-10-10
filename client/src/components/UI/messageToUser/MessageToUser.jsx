import "./MessageToUser.css";

// we can use either messageText or children
const MessageToUser = ({ messageText = null, children = null, ...props }) => {
  let className = "message-to-user";

  if (props.className) {
    className += ` ${props.className}`;
    delete props.className;
  }

  return (
    <div className={className}>
      {messageText && <p>{messageText}</p>}
      {!!children && children}
    </div>
  );
}

export default MessageToUser;
