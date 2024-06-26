import { useState } from "react";
import "./CommentReply.css";
import useGettingOneUser from "../../../hooks/useGettingOneUser";
import getDateStr from "../../../utils/getDateStr";

const CommentReply = ({ reply, type }) => {
  const [user, setUser] = useState(null);
  useGettingOneUser(reply.userId, setUser, true, !reply.isAnonymously && !user);

  const createdAtDate = new Date(reply.date);
  const createdAtDateStr = getDateStr(createdAtDate);

  let commentReplyLabelWord = "Reply";
  if (type === "deviceQuestions") {
    commentReplyLabelWord = "Answer";
  }

  return (
    <section className="comment-reply">
      <div className="comment-username-date-wrap">
        <div>
          <p className="comment-reply-reply-p">
            {commentReplyLabelWord}
          </p>
          <p className="comment-username">
            {user?.name || "Mock"} {user?.surname || "User"}
          </p>
        </div>
        <p className="comment-date">
          {createdAtDateStr}
        </p>
      </div>
      <p>
        {reply.message}
      </p>
    </section>
  );
}

export default CommentReply;
