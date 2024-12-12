import { createQuestionDislike, createQuestionLike, removeQuestionDislike, removeQuestionLike } from "../http/DeviceQuestionsAPI";
import { createDislike, createLike, removeDislike, removeLike } from "../http/FeedbacksAPI";
import deleteFetchWithTryCatch from "./deleteFetchWithTryCatch";

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
    async function cb() {
      if (type === "deviceFeedbacks") {
        await removeLike(id);
      } else if (type === "deviceQuestions") {
        await removeQuestionLike(id);
      }
    }

    await deleteFetchWithTryCatch(async () => await cb(), isToThrowError);
  }

  static async removeDislikeRate(id, type, isToThrowError = false) {
    async function cb() {
      if (type === "deviceFeedbacks") {
        await removeDislike(id);
      } else if (type === "deviceQuestions") {
        await removeQuestionDislike(id);
      }
    }

    await deleteFetchWithTryCatch(async () => await cb(), isToThrowError);
  }

}