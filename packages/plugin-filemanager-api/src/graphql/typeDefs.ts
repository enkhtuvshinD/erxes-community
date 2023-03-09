import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar JSON
  scalar Date

  type FileManagerFolder {
    _id: String!
    createdAt: Date
    createdUserId: String
    name: String!
    parentId: String
    parent: FileManagerFolder
    permissionUserIds: [String]
    permissionUnitId: String
    hasChild: Boolean
  }

  type FileManagerFile {
    _id: String!
    createdAt: Date
    createdUserId: String
    name: String!
    type: String!
    folderId: String!
    url: String
    info: JSON
    contentType: String
    contentTypeId: String
    documentId: String
    permissionUserIds: [String]
    permissionUnitId: String
  }

  type FileManagerLog {
    _id: String!
    createdAt: Date
    contentType: String
    contentTypeId: String
    userId: String
    description: String
  }

  extend type Query {
    filemanagerFolders(parentId: String): [FileManagerFolder]
    filemanagerFiles(folderId: String!, search: String): [FileManagerFile]
    filemanagerLogs(contentTypeId: String!): [FileManagerLog]
  }

  extend type Mutation {
    filemanagerFolderSave(
      _id: String
      name: String!
      parentId: String
    ): FileManagerFolder

    filemanagerFolderRemove(_id: String!): JSON

    filemanagerFileCreate(
      name: String!
      type: String!
      folderId: String!
      url: String
      info: JSON
      contentType: String
      contentTypeId: String
      documentId: String
    ): FileManagerFile

    filemanagerFileRemove(_id: String!): JSON

    filemanagerChangePermission(
      type: String!
      _id: String!
      userIds: [String]
      unitId: String
    ): JSON
  }
`;

export default typeDefs;