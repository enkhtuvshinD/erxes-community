const QuizTypes = `

type ForumQuiz @key(fields: "_id") @cacheControl(maxAge: 60) {
    _id: ID!

    postId: ID
    companyId: ID
    tagIds: [ID!]
    categoryId: [ID!]
  
    name: String
    description: String  
    isLocked: Boolean!

    questions: [ForumQuizQuestion!]
}

type ForumQuizQuestion @key(fields: "_id") @cacheControl(maxAge: 60) {
    _id: ID!
    quizId: ID!
    text: String
    imageUrl: String
    isMultipleChoice: Boolean!
    listOrder: Float!

    choices: [ForumQuizChoice!]
}

type ForumQuizChoice @key(fields: "_id") @cacheControl(maxAge: 60) {
    _id: ID!
    quizId: ID!
    questionId: ID!
    text: String
    imageUrl: String
    isCorrect: Boolean!
    listOrder: Float!
}

`;

export default QuizTypes;
