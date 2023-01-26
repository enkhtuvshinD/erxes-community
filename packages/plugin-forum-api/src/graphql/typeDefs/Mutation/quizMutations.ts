const quizMutations = `
    forumQuizCreate(
        postId: ID
        companyId: ID
        categoryId: ID
        tagIds: [ID!]
      
        name: String
        description: String
    ): ForumQuiz!

    forumQuizDelete(_id: ID!): ForumQuiz!
`;

export default quizMutations;
