import { Document, Schema, Model, Connection, Types } from 'mongoose';
import { IModels } from './index';
import * as _ from 'lodash';
import { ICpUser } from '../../graphql';
import { LoginRequiredError } from '../../customErrors';

export interface Quiz {
  _id: any;

  postId?: string | null;
  companyId?: string | null;
  tagIds?: string[] | null;
  categoryId?: string | null;

  name?: string | null;
  description?: string | null;

  isLocked: boolean;
}

export interface QuizQuestion {
  _id: any;
  quizId: string;
  text?: string | null;
  imageUrl?: string | null;
  isMultipleChoice: boolean;
  listOrder: number;
}

export interface QuizChoice {
  _id: any;
  quizId: string;
  questionId: string;
  text?: string | null;
  imageUrl?: string | null;
  isCorrect: boolean;
  listOrder: number;
}

export type QuizDocument = Quiz & Document;
export type QuizQuestionDocument = QuizQuestion & Document;
export type QuizChoiceDocument = QuizChoice & Document;

export interface QuizModel extends Model<QuizDocument> {
  findByIdOrThrow(_id: string): Promise<QuizDocument>;
  createQuiz(input: Omit<Quiz, '_id' | 'isLocked'>): Promise<QuizDocument>;
  patchQuiz(
    _id: string,
    patch: Partial<Omit<Quiz, '_id' | 'isLocked'>>
  ): Promise<QuizDocument>;
  deleteQuiz(_id: string): Promise<QuizDocument>;
}

export interface QuizQuestionModel extends Model<QuizQuestionDocument> {}

export interface QuizChoiceModel extends Model<QuizChoiceDocument> {}

export const quizSchema = new Schema<QuizDocument>({
  postId: { type: Schema.Types.ObjectId, index: true, sparse: true },
  companyId: { type: Schema.Types.ObjectId, index: true, sparse: true },
  tagIds: { type: Schema.Types.ObjectId, index: true, sparse: true },
  categoryId: { type: Schema.Types.ObjectId, index: true, sparse: true },
  isLocked: { type: Boolean, default: false, required: true },

  name: String,
  description: String
});

export const quizQuestionSchema = new Schema<QuizQuestionDocument>({
  quizId: { type: Schema.Types.ObjectId, index: true, required: true },
  text: String,
  imageUrl: String,
  isMultipleChoice: { type: Boolean, default: false, required: true },
  listOrder: { type: Number, default: 0, required: true }
});

/*
  quizId: string;
  questionId: string;
  text?: string | null;
  imageUrl?: string | null;
  isCorrect: boolean;
  listOrder: number;
  */

export const quizChoiceSchema = new Schema<QuizChoiceDocument>({
  quizId: { type: Schema.Types.ObjectId, index: true, required: true },
  questionId: { type: Schema.Types.ObjectId, index: true, required: true },
  text: String,
  imageUrl: String,
  isCorrect: { type: Boolean, default: false, required: true },
  listOrder: { type: Number, default: 0, required: true }
});

export const generateQuizModels = (
  subdomain: string,
  con: Connection,
  models: IModels
): void => {
  class QuizStatics {
    public static async findByIdOrThrow(_id: string) {
      const quiz = await models.Quiz.findById(_id);
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      return quiz;
    }
    public static async createQuiz(
      input: Omit<Quiz, '_id' | 'isLocked'>
    ): Promise<QuizDocument> {
      return models.Quiz.create(input);
    }
    public static async patchQuiz(
      _id: string,
      patch: Partial<Omit<Quiz, '_id' | 'isLocked'>>
    ): Promise<QuizDocument> {
      const quiz = await models.Quiz.findByIdOrThrow(_id);
      _.merge(quiz, patch);
      return quiz.save();
    }
    public static async deleteQuiz(_id: string): Promise<QuizDocument> {
      const quiz = await models.Quiz.findByIdOrThrow(_id);
      await models.QuizChoice.deleteMany({ quizId: _id });
      await models.QuizQuestion.deleteMany({ quizId: _id });
      return quiz.remove();
    }
  }
  quizSchema.loadClass(QuizStatics);

  class QuizQuestionStatics {}
  quizQuestionSchema.loadClass(QuizQuestionStatics);

  class QuizChoiceStatics {}
  quizChoiceSchema.loadClass(QuizChoiceStatics);

  models.Quiz = con.model<QuizDocument, QuizModel>('forum_quiz', quizSchema);
  models.QuizQuestion = con.model<QuizQuestionDocument, QuizQuestionModel>(
    'forum_quiz_question',
    quizQuestionSchema
  );
  models.QuizChoice = con.model<QuizChoiceDocument, QuizChoiceModel>(
    'forum_quiz_choice',
    quizChoiceSchema
  );
};
