
const SERVICE_LINES = {
  COGNITIVE_PROCESS_TRANSFORMATION: `Cognitive Process Transformation`,
};

const SERVICE_LINES_LIST = Object.keys(SERVICE_LINES).reduce((l, r) => l.concat({ id: r, text: SERVICE_LINES[r] }), []);

export default {
  STATUS: {
    LOADING: `loading`,
    ERROR: `error`,
    READY: `ready`,
  },
  SERVICE_LINES,
  SERVICE_LINES_LIST,

  ROLE: {
    ADMIN: `root`,
    EDITOR: `editor`,
    AUTHOR: `author`,
    REVIEWER: `reviewer`,
    USER: `authenticated`,
    GUEST: `public`,
  },
  ACTIVITY_TYPES: {
    SELECT: `select`,
    SHORT_TEXT: `shorttext`,
    LONG_TEXT: `longtext`,
    CHECK_LIST: `checklist`,
    MATRIX: `matrix`,
    NESTED: `nested`,
    UPLOAD: `upload`,
  },
  COMMENT: {
    FEEDBACK: `feedback`,
    NOTE: `note`,
  },
  FEED_TYPES: {
    COMMENT: `comment`,
    RESPONSE_ACTIVITY: `response-activity`,
  },
  RESPONSE_ACTIVITY_TYPES: {
    SAVE: `save`,
    REVERT: `revert`,
  },

  ARTIFACT: {
    IN_PROGRESS: `in-progress`,
    CHECK_IN: `requested`,
    ON_CALENDAR: `scheduled`,
    APPROVED: `approved`,
    NOT_APPROVED: `not-approved`,
    PUBLISH_APPROVAL: `publish-approval`,
  },

  ARTIFACT_FILE: {
    READY_TO_PUBLISH: `ready-to-publish`,
    IN_PUBLISH_QUEUE: `pending`,
    PUBLISHED: `published`,
    IN_REMOVAL_QUEUE: `pending-removal`,
  },
};
