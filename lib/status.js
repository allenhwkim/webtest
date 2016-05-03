'use strict';

/**
 * Define status of test result. e.g. pending, started, error
 */
class Status {}

Status.PENDING = 0;
Status.STARTED = 1;
Status.PASS = 2;
Status.FAIL   = 3;

module.exports = Status;
