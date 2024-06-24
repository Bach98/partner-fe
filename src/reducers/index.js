import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { localizeReducer } from "react-localize-redux";
import { layout } from './layout.reducers';
import { common } from './common.reducers';
import { message } from './message.reducers';
import { auth } from './auth.reducers';
import { bill } from './bill.reducers';
import { machine } from './machine.reducers';
import { shortageRateReport } from './shortage-rate-report.reducers';
import { inventoryReport } from './inventory-report.reducers';
import { materialInventoryReport } from './material-inventory-report.reducers';
import { whImport } from './wh-import.reducers';
import { whExport } from './wh-export.reducers';
import { dashboard } from './dashboard.reducers';
import { reconciliationRevenue } from './reconciliation-revenue.reducers';
import { adjustPrice } from './adjust-price.reducers';
import { transactVendingLog } from './transact-vending-log.reducers';
import { ticket } from './ticket.reducers';
import { product } from './product.reducers';
import { promotion } from './promotion.reducers';
import { reportCash } from './report-cash.reducers';
import { inventoryImportExportReport } from './inventory-import-export-report.reducers';
import { cashLeftOver } from './cash-left-over.reducers';
import { processingDevice } from './processing-device.reducers';
import { serviceTopupTransaction } from './service-topup-transaction.reducers';
import { debt } from './debt.reducers';
import { inventoryDetailReport } from './inventory-detail-report.reducers';
import { payoutTransaction } from './payoutTransaction.reducers';
import { paymentOrder } from './paymentOrder.reducers';
import { whInventory } from './wh-inventory.reducers';
export default combineReducers({
  router: routerReducer,
  auth: auth,
  layout: layout,
  localize: localizeReducer,
  common: common,
  message: message,
  dashboard,
  bill,
  machine,
  shortageRateReport,
  inventoryReport,
  materialInventoryReport,
  whImport,
  whExport,
  reconciliationRevenue,
  adjustPrice,
  transactVendingLog,
  ticket,
  product,
  promotion,
  reportCash,
  inventoryImportExportReport,
  cashLeftOver,
  processingDevice,
  serviceTopupTransaction,
  debt,
  inventoryDetailReport,
  payoutTransaction,
  paymentOrder,
  whInventory
});