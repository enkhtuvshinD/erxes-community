//forumQuizzes(sort: JSON, offset: Int, limit: Int): [ForumQuiz!]

import { IContext } from '../..';
import { IObjectTypeResolver } from '@graphql-tools/utils';
import { requireLogin } from '@erxes/api-utils/src';
import { moduleRequireLogin } from '@erxes/api-utils/src/permissions';

const quizQueries: IObjectTypeResolver<any, IContext> = {
  forumQuizzes(_, { sort = {}, offset = 0, limit = 0 }, { models: { Quiz } }) {
    return Quiz.find()
      .sort(sort)
      .skip(offset)
      .limit(limit);
  }
};

moduleRequireLogin(quizQueries);

export default quizQueries;
