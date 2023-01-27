//forumQuizzes(sort: JSON, offset: Int, limit: Int): [ForumQuiz!]

import { IContext } from '../..';
import { IObjectTypeResolver } from '@graphql-tools/utils';
import { moduleRequireLogin } from '@erxes/api-utils/src/permissions';

const quizQueries: IObjectTypeResolver<any, IContext> = {
  forumQuizzes(_, { sort = {}, offset = 0, limit = 0 }, { models: { Quiz } }) {
    return Quiz.find()
      .sort(sort)
      .skip(offset)
      .limit(limit);
  },
  forumQuiz(_, { _id }, { models: { Quiz } }) {
    return Quiz.findByIdOrThrow(_id);
  },
  forumQuizQuestion(_, { _id }, { models: { QuizQuestion } }) {
    return QuizQuestion.findByIdOrThrow(_id);
  }
};

moduleRequireLogin(quizQueries);

export default quizQueries;
