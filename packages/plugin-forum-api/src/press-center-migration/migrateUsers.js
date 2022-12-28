"use strict";

const Random = require("meteor-random");

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
    let customer = await Customers.findOne({
      $or: [{ emails: { $in: [email] } }, { primaryEmail: email }],
    });

    if (customer) {
      qry = { erxesCustomerId: customer._id, clientPortalId };
    }

    user = await ClientPortalUsers.findOne(qry);

    if (user) {
      throw new Error("User already exists");
    }

    user = await ClientPortalUsers.insertOne({
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
      externalId: String(externalId),
    });

    customer = await Customers.insertOne({
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

    await models.ClientPortalUsers.updateOne(
      { _id: user._id },
      { $set: { erxesCustomerId: customer._id } }
    );
  }

  if (type === "company") {
    let company = await Companies.findOne({
      $or: [{ emails: { $in: [email] } }, { primaryEmail: email }],
    });

    if (company) {
      qry = { erxesCompanyId: company._id, clientPortalId };
    }

    user = await ClientPortalUsers.findOne(qry);

    if (user) {
      throw new Error("User already exists");
    }

    user = ClientPortalUsers.insertOne({
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
      externalId: String(externalId),
    });

    company = Companies.insertOne({
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
      externalId: String(externalId),
    });

    await models.ClientPortalUsers.updateOne(
      { _id: user._id },
      { $set: { erxesCompanyId: company._id } }
    );
  }

  return user;
};
