export const types = ({ contacts }) => `
${
  contacts
    ? `
      extend type Customer @key(fields: "_id") {
        _id: String! @external
      }

      extend type Company @key(fields: "_id") {
        _id: String! @external
      }
      `
    : ''
}

  type invoicesTotalCount {
    total: Int
    byKind: JSON
    byStatus: JSON
  }

  type Invoice @key(fields: "_id") {
    _id: String
    selectedPaymentId: String
    amount: Float
    phone: String
    email: String
    description: String
    status: String
    companyId: String
    customerId: String
    contentType: String
    contentTypeId: String
    createdAt: Date
    resolvedAt: Date
    payment: Payment
    paymentKind: String
    apiResponse: JSON

    ${
      contacts
        ? `
        customer: Customer
        company: Company
        `
        : ''
    }

    pluginData: JSON
  }
`;

const mutationParams = `
  amount: Float!
  phone: String
  email: String
  description: String
  customerId: String
  companyId: String
  contentType: String
  contentTypeId: String
  paymentIds: [String]
`;

export const mutations = `
  generateInvoiceUrl(${mutationParams} redirectUri: String): String
  createInvoice(${mutationParams}): Invoice
`;

export const queries = `
  checkInvoice(_id:String!, paymentId: String!): Invoice
  invoices(searchValue: String, kind: String, status: String, page: Int, perPage: Int, contentType: String, contentTypeId: String): [Invoice]
  invoicesTotalCount(searchValue: String, kind: String, status: String, contentType: String, contentTypeId: String): invoicesTotalCount
  getInvoiceUrl(_id: String!, customerId: String, companyId: String): String
`;
