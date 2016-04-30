'use strict';

/**
 * Define status of test result. e.g. pending, started, error
 */
class Status {}

Status.PENDING = 0;
Status.STARTED = 1;
Status.SUCCESS = 2;
Status.ERROR   = 3;

module.exports = Status;
