import { IContext } from '../..';
import { IObjectTypeResolver } from '@graphql-tools/utils';
import { moduleRequireLogin } from '@erxes/api-utils/src/permissions';

const quizMutations: IObjectTypeResolver<any, IContext> = {
  forumQuizCreate(_, args, { models: { Quiz } }) {
    return Quiz.createQuiz(args);
  },
  forumQuizDelete(_, { _id }, { models: { Quiz } }) {
    return Quiz.deleteQuiz(_id);
  },
  forumQuizQuestionCreate(_, args, { models: { QuizQuestion } }) {
    return QuizQuestion.createQuestion(args);
  },
  forumQuizQuestionPatch(_, { _id, ...patch }, { models: { QuizQuestion } }) {
    return QuizQuestion.patchQuestion(_id, patch);
  },
  forumQuizChoiceCreate(_, args, { models: { QuizChoice } }) {
    return QuizChoice.createChoice(args);
  },
  forumQuizChoicePatch(_, { _id, ...patch }, { models: { QuizChoice } }) {
    return QuizChoice.patchChoice(_id, patch);
  },
  forumQuizChoiceDelete(_, { _id }, { models: { QuizChoice } }) {
    return QuizChoice.deleteChoice(_id);
  }
};

moduleRequireLogin(quizMutations);

export default quizMutations;
