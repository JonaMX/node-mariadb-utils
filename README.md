# alien-node-mysql-utils
Helper functions for MySql on NodeJS. The functions are pure and curried with Ramda.

[![Build Status](https://travis-ci.org/AlienCreations/alien-node-mysql-utils.svg?branch=master)](https://travis-ci.org/AlienCreations/alien-node-mysql-utils) [![Coverage Status](https://coveralls.io/repos/AlienCreations/alien-node-mysql-utils/badge.svg?branch=master&service=github)](https://coveralls.io/github/AlienCreations/alien-node-mysql-utils?branch=master) [![npm version](http://img.shields.io/npm/v/alien-node-mysql-utils.svg)](https://npmjs.org/package/alien-node-mysql-utils) [![Dependency Status](https://david-dm.org/AlienCreations/alien-node-mysql-utils.svg)](https://david-dm.org/AlienCreations/alien-node-mysql-utils)

## Install

```
$ npm install alien-node-mysql-utils --save
```

Run the specs

```
$ npm test
```

## Methods

#### query()
Make a SQL query in which you expect zero or more results. Returns a promise which
either resolves to an array containing found records (as objects) or rejects if no records found. 

##### Suggested model usage: 
```js

'use strict';

var mysql  = require('mysql'),
    config = require('config'),
    dbPool = mysql.createPool(config.mysql)
    
var DB                  = require('alien-node-mysql-utils')(dbPool),
    validateAccountData = require('../some-validator');

var createAndExecuteQuery = function(status) {
  var query = 'SELECT * FROM accounts WHERE status = ?',
      queryStatement = [query, [status]];

  return DB.query(queryStatement);
};

/**
 * Query accounts based on status
 * @param {Number} status
 * @returns {Promise}
 */
function getAccountsByStatus(status) {
  validateAccountData({status : status});
  return createAndExecuteQuery(status);
}

module.exports = getAccountsByStatus;
```

##### Suggested controller usage
```js

var getAccountsByStatus = require('../models/getAccountsByStatus');

getAccountsByStatus('active').then(function(accounts) {
    // handle array of accounts here
  })
  .catch(function(err) {
    // handle "No records found" or other errors here
  });
  
```

#### lookup()
Make a SQL query in which you expect zero or one result. Returns a promise which
either resolves to an object matching the row schema or rejects if no records found. 

```js

'use strict';

var mysql  = require('mysql'),
    config = require('config'),
    dbPool = mysql.createPool(config.mysql)
    
var DB                  = require('alien-node-mysql-utils')(dbPool),
    validateAccountData = require('../some-validator');

var createAndExecuteQuery = function(id) {
  var query = 'SELECT * FROM accounts WHERE id = ?',
      queryStatement = [query, [id]];

  return DB.query(queryStatement);
};

/**
 * Lookup account by id
 * @param {Number} id
 * @returns {Promise}
 */
function getAccountById(id) {
  validateAccountData({id : id});
  return createAndExecuteQuery(id);
}

module.exports = getAccountById;
```

##### Suggested controller usage
```js

var getAccountById = require('../models/getAccountById');


getAccountById(1234).then(function(account) {
    // handle account object here
  })
  .catch(function(err) {
    // handle "No records found" or other errors here
  });
  
```

## TODO 
 - Make the transform to/from column methods unbiased with decorator injection
