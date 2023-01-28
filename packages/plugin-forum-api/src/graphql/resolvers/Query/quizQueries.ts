//forumQuizzes(sort: JSON, offset: Int, limit: Int): [ForumQuiz!]

import { IContext } from '../..';
import { IObjectTypeResolver } from '@graphql-tools/utils';
import { moduleRequireLogin } from '@erxes/api-utils/src/permissions';
import { Types } from 'mongoose';

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

const cpQuizQueries: IObjectTypeResolver<any, IContext> = {
  async forumCpPostRelatedQuizzes(
    _,
    { _id, offset = 0, limit = 0 },
    { models: { Quiz, Post } }
  ) {
    const post = await Post.findByIdOrThrow(_id);
    const aggregation: any[] = [
      {
        $match: {
          $or: [
            { postId: Types.ObjectId(_id) },
            { tagIds: { $in: post.tagIds || [] } }
          ],
          state: 'PUBLISHED'
        }
      },
      {
        $addFields: {
          postRelatedScore: {
            $cond: {
              if: {
                $eq: ['$postId', Types.ObjectId(_id)]
              },
              then: 1,
              else: 0
            }
          }
        }
      },
      {
        $sort: {
          postRelatedScore: -1,
          _id: -1
        }
      },
      {
        $skip: offset
      }
    ];
    if (limit) {
      aggregation.push({
        $limit: limit
      });
    }

    const res = await Quiz.aggregate(aggregation);
    return res;
  }
};

moduleRequireLogin(quizQueries);

export default { ...quizQueries, ...cpQuizQueries };
