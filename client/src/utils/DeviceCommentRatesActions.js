import { createQuestionDislike, createQuestionLike, removeQuestionDislike, removeQuestionLike } from "../http/DeviceQuestionsAPI";
import { createDislike, createLike, removeDislike, removeLike } from "../http/FeedbacksAPI";

export default class DeviceCommentRatesActions {

  static async likeFeedback(likeObject, type, setIsLiked = null, setIsChangingRate = null) {
    try {
      if (setIsChangingRate) setIsChangingRate(true);
      
      if (type === "deviceFeedbacks") {
        await createLike(likeObject);
      } else if (type === "deviceQuestions") {
        await createQuestionLike(likeObject);
      }
      
      if (setIsLiked) setIsLiked(true);
    } catch (e) {
      return e.message;
    } finally {
      if (setIsChangingRate) setIsChangingRate(false);
    }
  }

  static async dislikeFeedback(dislikeObject, type, setIsDisliked = null, setIsChangingRate = null) {
    try {
      if (setIsChangingRate) setIsChangingRate(true);
      
      if (type === "deviceFeedbacks") {
        await createDislike(dislikeObject);
      } else if (type === "deviceQuestions") {
        await createQuestionDislike(dislikeObject);
      }
      
      if (setIsDisliked) setIsDisliked(true);
    } catch (e) {
      return e.message;
    } finally {
      if (setIsChangingRate) setIsChangingRate(false);
    }
  }

  static async removeLikeRate(id, type, setIsLiked = null) {
    try {
      if (type === "deviceFeedbacks") {
        await removeLike(id);
      } else if (type === "deviceQuestions") {
        await removeQuestionLike(id);
      }

      if (setIsLiked) setIsLiked(false);
    } catch (e) {
      // there's weird error with status 500 that occurs in json-server
      // (like is deleted btw, so just handle the error in catch)
      if (e.response.status === 500) {
        if (setIsLiked) setIsLiked(false);
      } else {
        return e.message;
      }
    }
  }

  static async removeDislikeRate(id, type, setIsDisliked = null) {
    try {
      if (type === "deviceFeedbacks") {
        await removeDislike(id);
      } else if (type === "deviceQuestions") {
        await removeQuestionDislike(id);
      }
      
      if (setIsDisliked) setIsDisliked(false);
    } catch (e) {
      if (e.response.status === 500) {
        if (setIsDisliked) setIsDisliked(false);
      } else {
        return e.message;
      }
    }
  }

}