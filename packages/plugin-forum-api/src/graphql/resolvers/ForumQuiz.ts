import { IContext } from '..';
import { IObjectTypeResolver } from '@graphql-tools/utils';
import { IPost } from '../../db/models/post';

const ForumQuiz: IObjectTypeResolver<IPost, IContext> = {
  __resolveReference({ _id }, { models: { Quiz } }: IContext) {
    return Quiz.findById({ _id });
  },
  questions({ _id }, _, { models: { QuizQuestion } }) {
    return QuizQuestion.find({ quizId: _id }).sort({ listOrder: 1 });
  }
};

export default ForumQuiz;
