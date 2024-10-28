import { getUser } from "http/UserAPI";

export default class CommentsActions {

    /**
      * fetching users to already use it in the comments 
      * without unnecessarily big amount of fetches inside the comments list
      * 
      * @param {Object[]} comments - device feedbacks or device questions.
      * @param {"device-feedbacks" | "device-questions" | "seller-feedbacks"} type
      * @param {Object} options
      * @param {boolean} options.isToFetchFeedbacksUsers - is to set user field for each feedback
      * @param {boolean} options.isToFetchResponsesUsers - is to set user field for each feedback response
      */
  static async setCommentsUsers(comments, type, options = { isToFetchFeedbacksUsers: true, isToFetchResponsesUsers: true }) {
    if (Array.isArray(comments)) {
      for (let comment of comments) {
        if (options.isToFetchFeedbacksUsers) {
          if (!comment.isAnonymously && (comment.userId !== null && comment.userId !== undefined)) {
            const commentAuthor = await getUser(comment.userId, true);
            if (commentAuthor) comment.user = commentAuthor;
          };
        };

        if (options.isToFetchResponsesUsers) {
          let responsesField = null;

          if (type === "device-feedbacks") {
            responsesField = "device-feedback-replies";
          } else if (type === "device-questions") {
            responsesField = "device-answers";
          }

          const responses = comment?.[responsesField]
          if (Array.isArray(responses)) {
            for (let response of responses) {
              if (response.userId !== null && response.userId !== undefined) {
                const responseAuthor = await getUser(response.userId, true);
                if (responseAuthor) response.user = responseAuthor;
              }
            };
          };
        };
      };
    };
  }

};