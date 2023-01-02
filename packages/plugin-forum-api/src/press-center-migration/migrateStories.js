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
  Categories,
  Posts,
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

async function getCategoryCode2Id() {
  const categories = await Categories()
    .find({})
    .toArray();

  const categoriesByCode = {};
  categories.forEach((category) => {
    if (category.code) categoriesByCode[category.code] = category._id;
  });

  return categoriesByCode;
}

async function readAllStoriesFromFile() {
  const stories = [];

  const externalIdToContent = readExternalIdToContent();
  const externalIdToCPUserId = await getExternalId2Cpuid();
  const externalIdToTagId = await getExternalId2Tagid();
  const categoryCode2Id = await getCategoryCode2Id();

  for (let i = 1; i <= 5; i++) {
    const filePath = path.join(MIG_DATA_DIR, `story-presscenter-0000${i}.txt`);
    const fileContents = fs.readFileSync(filePath, "utf-8");

    fileContents
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((line) => {
        const story = JSON.parse(line);
        if (!externalIdToContent[story["external-id"]]) return;

        let content = externalIdToContent[story["external-id"]];

        const reg = /https?:\/\/gumlet.assettype.com/g;
        const target = "https://apex-sync-test.s3.us-west-2.amazonaws.com";

        content = content.replace(reg, target);

        story.content = content;

        if(story["temporary-hero-image-url"]) {
          story["temporary-hero-image-url"] = story["temporary-hero-image-url"].replace(reg, target);
        }

        const tagIds = story.sections.map(
          (section) => externalIdToTagId[section["external-id"]]
        );
        story.tagIds = tagIds;

        story.categoryCode =
          sectionCategory[story.sections[0]["external-id"]].erxesCategory;

        story.categoryId = categoryCode2Id[story.categoryCode];

        story.createdByCpId =
          externalIdToCPUserId[story.authors[0]["external-id"]];

        stories.push(story);
      });
  }
  return stories;
}

async function main() {
  await connect();

  const stories = await readAllStoriesFromFile();

  const allExternalIds = stories.map((story) => String(story["external-id"]));

  await Posts().deleteMany({ externalId: { $in: allExternalIds } });

  const posts = stories.map((story) => {
    const lastPublishedAt = new Date(story["last-published-at"]);

    return {
      state: "PUBLISHED",
      viewCount: 0,
      trendScore: 0,
      tagIds: story.tagIds,
      categoryId: story.categoryId,
      title: story.headline,
      subTitle: story.subheadline,
      content: story.content,
      categoryApprovalState: "APPROVED",
      createdUserType: "CP",
      createdByCpId: story.createdByCpId,
      updatedUserType: "CP",
      updatedByCpId: story.updatedByCpId,
      lastPublishedAt,
      translations: [],
      createdAt: lastPublishedAt,
      updatedAt: lastPublishedAt,
      externalId: String(story["external-id"]),
      thumbnail: story["temporary-hero-image-url"],
      thumbnailAlt: story["hero-image-caption"],
      description: story.summary,
      __v: 0,
    };
  });

  await Posts().insertMany(posts);

  await disconnect();
}

module.exports = main;
