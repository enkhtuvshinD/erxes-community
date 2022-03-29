import { moduleCheckPermission } from '@erxes/api-utils/src/permissions';

import { ITopic } from '../../models/definitions/knowledgebase';
import { IArticleCreate, ICategoryCreate } from '../../models/KnowledgeBase';
import { putCreateLog, putDeleteLog, putUpdateLog } from '../../logUtils';
import { MODULE_NAMES } from '../../constants';
import { IContext } from '../../connectionResolver';

const knowledgeBaseMutations = {
  /**
   * Creates a topic document
   */
  async knowledgeBaseTopicsAdd(
    _root,
    { doc }: { doc: ITopic },
    { user, docModifier, models, subdomain }: IContext
  ) {
    const topic = await models.KnowledgeBaseTopics.createDoc(
      docModifier(doc),
      user._id
    );

    await putCreateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.KB_TOPIC,
        newData: {
          ...doc,
          createdBy: user._id,
          createdDate: topic.createdDate,
        },
        object: topic,
      },
      user
    );

    return topic;
  },

  /**
   * Updates a topic document
   */
  async knowledgeBaseTopicsEdit(
    _root,
    { _id, doc }: { _id: string; doc: ITopic },
    { user, models, subdomain }: IContext
  ) {
    const topic = await models.KnowledgeBaseTopics.getTopic(_id);
    const updated = await models.KnowledgeBaseTopics.updateDoc(_id, doc, user._id);

    await putUpdateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.KB_TOPIC,
        object: topic,
        newData: {
          ...doc,
          modifiedBy: user._id,
          modifiedDate: updated.modifiedDate,
        },
        updatedDocument: updated,
      },
      user
    );

    return updated;
  },

  /**
   * Remove topic document
   */
  async knowledgeBaseTopicsRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext
  ) {
    const topic = await models.KnowledgeBaseTopics.getTopic(_id);
    const removed = await models.KnowledgeBaseTopics.removeDoc(_id);

    await putDeleteLog(models, subdomain, { type: MODULE_NAMES.KB_TOPIC, object: topic }, user);

    return removed;
  },

  /**
   * Create category document
   */
  async knowledgeBaseCategoriesAdd(
    _root,
    { doc }: { doc: ICategoryCreate },
    { user, models, subdomain }: IContext
  ) {
    const kbCategory = await models.KnowledgeBaseCategories.createDoc(doc, user._id);

    await putCreateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.KB_CATEGORY,
        newData: {
          ...doc,
          createdBy: user._id,
          createdDate: kbCategory.createdDate,
        },
        object: kbCategory,
      },
      user
    );

    return kbCategory;
  },

  /**
   * Update category document
   */
  async knowledgeBaseCategoriesEdit(
    _root,
    { _id, doc }: { _id: string; doc: ICategoryCreate },
    { user, models, subdomain }: IContext
  ) {
    const kbCategory = await models.KnowledgeBaseCategories.getCategory(_id);
    const updated = await models.KnowledgeBaseCategories.updateDoc(_id, doc, user._id);

    await putUpdateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.KB_CATEGORY,
        object: kbCategory,
        newData: {
          ...doc,
          modifiedBy: user._id,
          modifiedDate: updated.modifiedDate,
        },
        updatedDocument: updated,
      },
      user
    );

    return updated;
  },

  /**
   * Remove category document
   */
  async knowledgeBaseCategoriesRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext
  ) {
    const kbCategory = await models.KnowledgeBaseCategories.getCategory(_id);

    const removed = await models.KnowledgeBaseCategories.removeDoc(_id);

    await putDeleteLog(
      models,
      subdomain,
      { type: MODULE_NAMES.KB_CATEGORY, object: kbCategory },
      user
    );

    return removed;
  },

  /**
   * Create article document
   */
  async knowledgeBaseArticlesAdd(
    _root,
    { doc }: { doc: IArticleCreate },
    { user, models, subdomain }: IContext
  ) {
    const kbArticle = await models.KnowledgeBaseArticles.createDoc(doc, user._id);

    await putCreateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.KB_ARTICLE,
        newData: {
          ...doc,
          createdBy: user._id,
          createdDate: kbArticle.createdDate,
        },
        object: kbArticle,
      },
      user
    );

    return kbArticle;
  },

  /**
   * Update article document
   */
  async knowledgeBaseArticlesEdit(
    _root,
    { _id, doc }: { _id: string; doc: IArticleCreate },
    { user, models, subdomain }: IContext
  ) {
    const kbArticle = await models.KnowledgeBaseArticles.getArticle(_id);
    const updated = await models.KnowledgeBaseArticles.updateDoc(_id, doc, user._id);

    await putUpdateLog(
      models,
      subdomain,
      {
        type: MODULE_NAMES.KB_ARTICLE,
        object: kbArticle,
        newData: {
          ...doc,
          modifiedBy: user._id,
          modifiedDate: updated.modifiedDate,
        },
        updatedDocument: updated,
      },
      user
    );

    return updated;
  },

  /**
   * Remove article document
   */
  async knowledgeBaseArticlesRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext
  ) {
    const kbArticle = await models.KnowledgeBaseArticles.getArticle(_id);
    const removed = await models.KnowledgeBaseArticles.removeDoc(_id);

    await putDeleteLog(
      models,
      subdomain,
      { type: MODULE_NAMES.KB_ARTICLE, object: kbArticle },
      user
    );

    return removed;
  },
};

moduleCheckPermission(knowledgeBaseMutations, 'manageKnowledgeBase');

export default knowledgeBaseMutations;