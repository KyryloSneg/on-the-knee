import { createDislike, createLike, removeDislike, removeLike } from "../http/FeedbacksAPI";

export default class DeviceFeedbackRatesActions {

  static async likeFeedback(likeObject, setIsLiked = null) {
    try {
      await createLike(likeObject);
      if (setIsLiked) setIsLiked(true);
    } catch (e) {
      return e.message;
    }
  }

  static async dislikeFeedback(dislikeObject, setIsDisliked = null) {
    try {
      await createDislike(dislikeObject);
      if (setIsDisliked) setIsDisliked(true);
    } catch (e) {
      return e.message;
    }
  }

  static async removeLikeRate(id, setIsLiked = null) {
    try {
      await removeLike(id);
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

  static async removeDislikeRate(id, setIsDisliked = null) {
    try {
      await removeDislike(id);
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