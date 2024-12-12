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
      // { id: user }
      let cachedUsers = {};

      for (let comment of comments) {
        if (options.isToFetchFeedbacksUsers) {
          if (comment.userId !== null && comment.userId !== undefined) {
            let cachedUser = cachedUsers[comment.userId]
            const commentAuthor = (!!cachedUser || cachedUser === null) ? cachedUser : await getUser(comment.userId, true);
            
            cachedUser = commentAuthor;
            if (!!commentAuthor || commentAuthor === null) comment.user = commentAuthor;
          } else {
            comment.user = null;
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
                let cachedUser = cachedUsers[response.userId];
                const responseAuthor = (
                  (!!cachedUser || cachedUser === null) ? cachedUser : await getUser(response.userId, true)
                );
                
                cachedUsers[response.userId] = responseAuthor;
                if (!!responseAuthor || responseAuthor === null) response.user = responseAuthor;
              } else {
                response.user = null;
              };
            };
          };
        };
      };
    };
  }

};