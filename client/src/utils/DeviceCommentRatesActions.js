import { createQuestionDislike, createQuestionLike, removeQuestionDislike, removeQuestionLike } from "../http/DeviceQuestionsAPI";
import { createDislike, createLike, removeDislike, removeLike } from "../http/FeedbacksAPI";

export default class DeviceCommentRatesActions {

  static async likeFeedback(likeObject, type, setIsChangingRate = null, isToThrowError = false) {
    try {
      if (setIsChangingRate) setIsChangingRate(true);
      
      if (type === "deviceFeedbacks") {
        await createLike(likeObject);
      } else if (type === "deviceQuestions") {
        await createQuestionLike(likeObject);
      }

    } catch (e) {
      if (isToThrowError) {
        throw e;
      } else {
        return e.message;
      }
    } finally {
      if (setIsChangingRate) setIsChangingRate(false);
    }
  }

  static async dislikeFeedback(dislikeObject, type, setIsChangingRate = null, isToThrowError = false) {
    try {
      if (setIsChangingRate) setIsChangingRate(true);
      
      if (type === "deviceFeedbacks") {
        await createDislike(dislikeObject);
      } else if (type === "deviceQuestions") {
        await createQuestionDislike(dislikeObject);
      }
    } catch (e) {
      if (isToThrowError) {
        throw e;
      } else {
        return e.message;
      }
    } finally {
      if (setIsChangingRate) setIsChangingRate(false);
    }
  }

  static async removeLikeRate(id, type, isToThrowError = false) {
    try {
      if (type === "deviceFeedbacks") {
        await removeLike(id);
      } else if (type === "deviceQuestions") {
        await removeQuestionLike(id);
      }
    } catch (e) {
      // there's weird error with status 500 that occurs in json-server
      // (like is deleted btw, so just handle the error in catch)
      if (e.response.status !== 500) {
        if (isToThrowError) {
          throw e;
        } else {
          return e.message;
        }
      }
    }
  }

  static async removeDislikeRate(id, type, isToThrowError = false) {
    try {
      if (type === "deviceFeedbacks") {
        await removeDislike(id);
      } else if (type === "deviceQuestions") {
        await removeQuestionDislike(id);
      }
    } catch (e) {
      if (e.response.status !== 500) {
        if (isToThrowError) {
          throw e;
        } else {
          return e.message;
        }
      }
    }
  }

}