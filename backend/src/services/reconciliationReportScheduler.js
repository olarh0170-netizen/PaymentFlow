'use strict';

const { generateAllReconciliationReports } = require('./reconciliationService');
const logger = require('../utils/logger').child('ReconciliationReportScheduler');

const INTERVAL_MS = parseInt(process.env.RECONCILIATION_REPORT_INTERVAL_MS, 10) || 24 * 60 * 60 * 1000;
let _timer = null;

/**
 * Manages reconciliation report scheduler for reconciliationReportScheduler.
 * @returns {void} Completes without a return value.
 */
function startReconciliationReportScheduler() {
  if (_timer) return;
  _timer = setInterval(async () => {
    try {
      await generateAllReconciliationReports();
    } catch (err) {
      logger.error('Reconciliation report scheduler error', { error: err.message });
    }
  }, INTERVAL_MS);
  if (_timer.unref) _timer.unref();
  logger.info('Reconciliation report scheduler started');
}

/**
 * Manages reconciliation report scheduler for reconciliationReportScheduler.
 * @returns {void} Completes without a return value.
 */
function stopReconciliationReportScheduler() {
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
    logger.info('Reconciliation report scheduler stopped');
  }
}

module.exports = {
  startReconciliationReportScheduler,
  stopReconciliationReportScheduler,
};
