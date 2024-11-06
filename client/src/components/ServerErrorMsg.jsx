import MessageToUser from "./UI/messageToUser/MessageToUser";

const ServerErrorMsg = ({ error }) => {
  let errorMessage = error?.response?.data?.message;
  if (!errorMessage) return <div style={{ display: "none" }} />;

  return <MessageToUser messageText={errorMessage} />;
}

export default ServerErrorMsg;
