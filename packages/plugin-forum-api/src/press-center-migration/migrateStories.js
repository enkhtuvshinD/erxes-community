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
  Tags,
} = require("./db/index.js");
const randomColorCode = require("./randomColorCode");
const { ObjectId } = require("mongodb");
const sectionCategory = require("./sectionCategory");

const {
  MIG_DATA_DIR,
  CLIENT_PORTAL_ID,
  CONTRIBUTOR_PERMISSION_GROUP_ID,
} = process.env;

function readExternalIdToContent() {
  const filePath = path.join(MIG_DATA_DIR, "story-id-to-content.json");
  const externalIdToContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return externalIdToContent;
}

async function getExternalId2Cpuid() {
  const externalIdToCPUserId = {};

  const cpUsers = await ClientPortalUsers()
    .find({})
    .toArray();
  cpUsers.forEach((cpUser) => {
    if (!cpUser.externalId) return;
    cpUser.externalId.forEach((id) => {
      externalIdToCPUserId[id] = cpUser._id;
    });
  });

  return externalIdToCPUserId;
}

async function getExternalId2Tagid() {
  const externalIdToTagId = {};

  const tags = await Tags()
    .find({})
    .toArray();
  tags.forEach((tag) => {
    if (!tag.externalId) return;
    externalIdToTagId[tag.externalId] = tag._id;
  });

  return externalIdToTagId;
}

async function readAllStoriesFromFile() {
  const stories = [];

  const externalIdToContent = readExternalIdToContent();
  const externalIdToCPUserId = await getExternalId2Cpuid();
  const externalIdToTagId = await getExternalId2Tagid();

  console.log(externalIdToTagId);

  for (let i = 1; i <= 5; i++) {
    const filePath = path.join(MIG_DATA_DIR, `story-presscenter-0000${i}.txt`);
    const fileContents = fs.readFileSync(filePath, "utf-8");

    fileContents
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((line) => {
        const story = JSON.parse(line);
        if (!externalIdToContent[story["external-id"]]) return;

        story.content = externalIdToContent[story["external-id"]];

        const tagIds = story.sections.map(
          (section) => externalIdToTagId[section["external-id"]]
        );
        story.tagIds = tagIds;

        story.categoryCode = sectionCategory[story.sections[0]["external-id"]].erxesCategory;

        story.createdByCpId = externalIdToCPUserId[story.authors[0]["external-id"]];

        stories.push(story);
        console.log(story.categoryCode);
      });
  }
  return stories;
}

async function main() {
  await connect();

  const stories = await readAllStoriesFromFile();
  await disconnect();
}

module.exports = main;
