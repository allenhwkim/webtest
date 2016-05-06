'use strict';

/**
 * Define status of test result. e.g. pending, started, error
 */
class Status {}

Status.PENDING = 'PENDING';
Status.STARTED = 'STARTING';
Status.PASS    = 'PASS';
Status.FAIL    = 'FAIL';

module.exports = Status;
