import MessageToUser from "./UI/messageToUser/MessageToUser";

const AuthentificationModalErrorMsg = ({ error }) => {
  let errorMessage = error?.response?.data?.message;
  if (!errorMessage) return <div style={{ display: "none" }} />;

  return <MessageToUser messageText={errorMessage} />;
}

export default AuthentificationModalErrorMsg;
