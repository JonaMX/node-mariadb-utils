'use strict';

var DB = function(dbPool) {
  return {
    resolveOrRejectOnBooleanField : require('./methods/resolveOrRejectOnBooleanField'),
    query                         : require('./methods/query')(dbPool),
    lookup                        : require('./methods/lookup')(dbPool),
    fuzzify                       : require('./methods/fuzzify'),
    transformToColumn             : require('./methods/transformToColumn'),
    transformFromColumn           : require('./methods/transformFromColumn'),
    transformQueryResponse        : require('./methods/transformQueryResponse'),
    prepareValues                 : require('./methods/prepareValues'),
    prepareProvidedFieldsForSet   : require('./methods/prepareProvidedFieldsForSet'),
    createNowDateString           : require('./methods/createNowDateString'),
    createNowUnixTime             : require('./methods/createNowUnixTime')
  };
};

module.exports = DB;
