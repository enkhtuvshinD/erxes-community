"use strict";

const Random = require("meteor-random");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const path = require("path");

const {
  connect,
  disconnect,
  Customers,
  Companies,
  ClientPortalUsers,
  ForumPermissionGroupUsers,
} = require("./db/index.js");
const randomColorCode = require("./randomColorCode");
const additionalInfoById = require("./additionalAuthorInfo");
const { ObjectId } = require("mongodb");

const {
  MIG_DATA_DIR,
  CLIENT_PORTAL_ID,
  CONTRIBUTOR_PERMISSION_GROUP_ID,
} = process.env;

function readAllUsersFromFile() {
  const filePath = path.join(MIG_DATA_DIR, "authors-00001.txt");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const authors = fileContents
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const author = JSON.parse(line);
      const { company, mergeInto } = additionalInfoById[author["external-id"]];

      author.type = company ? "company" : "customer";
      author.mergeInto = mergeInto;
      return author;
    });

  return authors;
}

const handleContacts = async (
  clientPortalId,
  email,
  type,
  username,
  externalId
) => {
  let qry = {};
  let user;

  qry = { email, clientPortalId };

  if (type === "customer") {
    let customer = await Customers().findOne({
      $or: [{ emails: { $in: [email] } }, { primaryEmail: email }],
    });

    if (customer) {
      qry = { erxesCustomerId: customer._id, clientPortalId };
    }

    user = await ClientPortalUsers().findOne(qry);

    if (user) {
      throw new Error("User already exists");
    }

    const sameUsername = await ClientPortalUsers().countDocuments({
      username,
    });

    user = await ClientPortalUsers().insertOne({
      _id: Random.id(),
      type,
      isPhoneVerified: false,
      isEmailVerified: true,
      deviceTokens: [],
      notificationSettings: {
        receiveByEmail: false,
        receiveBySms: false,
        configs: [],
      },
      email,
      username: sameUsername ? `${username}2` : username,
      clientPortalId,
      password: "$2a$10$q.BdF/MeRs9Dy2M0o4VjlOLZ/Qx2P7pPXhMiiampvlp3oMdQvypV6",
      createdAt: new Date(),
      __v: 0,
      isOnline: false,
      lastSeenAt: null,
      sessionCount: 0,
      externalId,
    });

    customer = await Customers().insertOne({
      _id: Random.id(),
      state: "lead",
      sex: 0,
      emails: [email],
      emailValidationStatus: "unknown",
      phones: [],
      phoneValidationStatus: "unknown",
      status: "Active",
      hasAuthority: "No",
      doNotDisturb: "No",
      isSubscribed: "Yes",
      relatedIntegrationIds: [],
      tagIds: [],
      mergedIds: [],
      deviceTokens: [],
      scopeBrandIds: [],
      createdAt: new Date(),
      modifiedAt: new Date(),
      primaryEmail: email,
      customFieldsData: [],
      profileScore: 15,
      searchText: email,
      trackedData: [],
      __v: 0,
    });

    await ClientPortalUsers().updateOne(
      { _id: user._id },
      { $set: { erxesCustomerId: customer._id } }
    );
  }

  if (type === "company") {
    let company = await Companies().findOne({
      $or: [{ emails: { $in: [email] } }, { primaryEmail: email }],
    });

    if (company) {
      qry = { erxesCompanyId: company._id, clientPortalId };
    }

    user = await ClientPortalUsers().findOne(qry);

    if (user) {
      throw new Error("User already exists");
    }

    user = ClientPortalUsers().insertOne({
      _id: Random.id(),
      type,
      isPhoneVerified: false,
      isEmailVerified: true,
      deviceTokens: [],
      notificationSettings: {
        receiveByEmail: false,
        receiveBySms: false,
        configs: [],
      },
      email,
      username,
      clientPortalId,
      password: "$2a$10$q.BdF/MeRs9Dy2M0o4VjlOLZ/Qx2P7pPXhMiiampvlp3oMdQvypV6",
      createdAt: new Date(),
      __v: 0,
      isOnline: false,
      lastSeenAt: null,
      sessionCount: 0,
      externalId,
    });

    company = Companies().insertOne({
      _id: Random.id(),
      names: [username],
      primaryName: username,
      emails: [email],
      phones: [],
      status: "Active",
      doNotDisturb: "No",
      isSubscribed: "Yes",
      tagIds: [],
      mergedIds: [],
      scopeBrandIds: [],
      primaryEmail: email,
      trackedData: [],
      customFieldsData: [],
      createdAt: new Date(),
      modifiedAt: new Date(),
      searchText: `${username} ${email}`,
      __v: 0,
      externalId,
    });

    await ClientPortalUsers().updateOne(
      { _id: user._id },
      { $set: { erxesCompanyId: company._id } }
    );
  }

  return user;
};

const example1 = {
  "external-id": "1629349",
  name: "Г. Галбадрах",
  username: "Г. Галбадрах",
  email: "gala_mn@yahoo.com",
  type: "customer",
  mergeInto: "",
  metadata: { id: 1629349 },
};

const example2 = {
  "external-id": "1625108",
  name: "Б. Хатанбаатар",
  username: "Б. Хатанбаатар",
  email: "b.hatnaa02@gmail.com",
  type: "company",
  mergeInto: "",
  metadata: {
    id: 1625108,
    "contributor-role": { id: 4390, name: "Author", type: "system" },
  },
};

const migrateUsers = async () => {
  const authors = readAllUsersFromFile();

  await connect();

  const allExternalIds = authors.map((a) => String(a["external-id"]));

  await Customers().deleteMany({ externalId: { $in: allExternalIds } });
  await Companies().deleteMany({ externalId: { $in: allExternalIds } });

  const usersToDelete = await ClientPortalUsers().find({ externalId: { $in: allExternalIds } }).toArray();
  await ClientPortalUsers().deleteMany({ externalId: { $in: allExternalIds } });

  await ForumPermissionGroupUsers().deleteMany({ userId : { $in : usersToDelete.map(u => u._id) }});

  const authorsToMerge = [];

  const contributorsExternalIds = [];

  for (const author of authors) {
    if (author.metadata["contributor-role"]?.id === 4390) {
      contributorsExternalIds.push(String(author["external-id"]));
    }

    if (author.mergeInto) {
      authorsToMerge.push(author);
      continue;
    }
    await handleContacts(
      CLIENT_PORTAL_ID,
      author.email,
      author.type,
      author.username,
      [String(author["external-id"])]
    );
  }

  await handleContacts(
    CLIENT_PORTAL_ID,
    "admin@presscenter.mn",
    "company",
    "Пресс Центр",
    authorsToMerge.map((a) => String(a["external-id"]))
  );

  const contributors = await ClientPortalUsers()
    .find({
      externalId: { $in: contributorsExternalIds },
    })
    .toArray();

  const permissionGroupId = ObjectId(CONTRIBUTOR_PERMISSION_GROUP_ID);

  for (const contributor of contributors) {
    const doc = {
      userId: contributor._id,
      permissionGroupId,
    };

    await ForumPermissionGroupUsers().updateOne(doc, { $set : doc }, { upsert: true });
  }

  await disconnect();
};

module.exports = migrateUsers;
