const quizMutations = `
    forumQuizCreate(
        postId: ID
        companyId: ID
        categoryId: ID
        tagIds: [ID!]
      
        name: String
        description: String
    ): ForumQuiz!
`;

export default quizMutations;
