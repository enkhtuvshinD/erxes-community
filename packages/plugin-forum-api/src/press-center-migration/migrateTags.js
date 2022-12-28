const example = {
  _id: "5tedH3Ep3vTEjQijE",
  relatedIds: [],
  scopeBrandIds: [],
  name: "t1.1",
  type: "forum:post",
  colorCode: "#697689",
  parentId: "Ye9oAxPGC5t3uN6xt",
  order: "t1forum:post/t1.1forum:post",
  createdAt: {
    $date: {
      $numberLong: "1672149431170",
    },
  },
  __v: 0,
};

const quintypeExample = {
  "display-name": "Агентлаг",
  name: "Агентлаг",
  slug: "agent",
  "external-id": 34281,
  parent: {
    name: "Мэдэх эрх",
    slug: "medeh-erh",
    "external-id": 34354,
    parent_id: null,
  },
};

const Random = require("meteor-random");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const path = require("path");

const { connect, disconnect, Tags } = require("./db/index.js");
const randomColorCode = require("./randomColorCode");

const { MIG_DATA_DIR } = process.env;

function readAllTagsFromFile() {
  const filePath = path.join(MIG_DATA_DIR, "sections-00001.txt");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  return fileContents
    .split(/\r?\n/)
    .filter(Boolean)
    .map(JSON.parse);
}

async function getTagsByExternalId() {
  const tags = await Tags()
    .find({})
    .toArray();

  const tagsByExternalId = {};

  tags.forEach((tag) => {
    if (tag.externalId) {
      tagsByExternalId[tag.externalId] = tag;
    }
  });

  return tagsByExternalId;
}

async function migrateTags() {
  await connect();

  const now = new Date();
  const qtSections = readAllTagsFromFile();

  const allExternalIds = qtSections.map((s) => String(s["external-id"]));


  await Tags().deleteMany({ externalId: { $in: allExternalIds } });

  const qtParents = qtSections.filter((tag) => !tag.parent || !tag.parent["external-id"]);
  const qtChildren = qtSections.filter((tag) => tag.parent && tag.parent["external-id"]);

  const parents = qtParents.map((qt) => ({
    _id: Random.id(),
    relatedIds: [],
    scopeBrandIds: [],
    name: qt.name,
    type: "forum:post",
    colorCode: randomColorCode(),
    parentId: "",
    order: `${qt.name}forum:post`,
    createdAt: now,
    externalId: String(qt["external-id"]),
    __v: 0,
  }));

  await Tags().insertMany(parents);

  const tagsByExternalId = await getTagsByExternalId();

  const children = qtChildren
    .map((qt) => {
      const parentExternalId = qt.parent["external-id"];

      const parent = tagsByExternalId[parentExternalId];

      if (!parent) return null;

      return {
        _id: Random.id(),
        relatedIds: [],
        scopeBrandIds: [],
        name: qt.name,
        type: "forum:post",
        colorCode: randomColorCode(),
        parentId: parent._id,
        order: `${parent.order}/${qt.name}forum:post`,
        createdAt: now,
        externalId: String(qt["external-id"]),
        __v: 0,
      };
    })
    .filter(Boolean);

  await Tags().insertMany(children);

  await disconnect();
}

module.exports = migrateTags;
