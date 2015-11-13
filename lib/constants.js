'use strict';

module.exports = {
  errors : {
    NO_QUERY_RESULTS : {
      code    : 6000,
      message : 'No results'
    },
    NO_DB_CONNECTION : {
      code    : 6001,
      message : 'Cannot connect to MySQL. Make sure the database is running.'
    },
    DUPLICATE : function(message) {
      return {
        code    : 6002,
        message : message
      };
    },
    UNKNOWN : function(message) {
      return {
        code    : 6999,
        message : message
      };
    }
  }
};
