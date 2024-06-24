import store from '../store';
import { PERMISSION } from "./index";
import { LOCAL_PATH } from "../constants";
import Blank from "../containers/frame/blank";
// import Construction from "../containers/frame/construction";
import Login from "../containers/login";
import PaymentOrder from "../containers/bill";
import BillDetail from "../containers/bill/bill-detail";
import Dashboard from "../containers/dashboard";
import Machine from "../containers/machine";
import MachineDetail from "../containers/machine/detail";
import ShortageRateReport from '../containers/reports/shortage-rate-report';
import RequireExport from '../containers/reports/shortage-rate-report/print-require-export';
import InventoryReport from '../containers/reports/inventory-report';
import MaterialInventoryReport from '../containers/reports/material-inventory-report';
import InventoryImportExportReport from '../containers/reports/inventory-import-export-report';
import whImport from '../containers/wh-import';
// import WhImportDetailList from '../containers/wh-import/detail-list';
import whImportDetail from '../containers/wh-import/detail';
import whExport from '../containers/wh-export';
// import whExportDetailList from '../containers/wh-export/detail-list';
import whExportDetail from '../containers/wh-export/detail';
import reconciliationRevenue from '../containers/reconciliation-revenue';
import ReconciliationRevenueDetail from '../containers/reconciliation-revenue/detail';
import ReconciliationRevenueCreate from '../containers/reconciliation-revenue/create';
import adjustPrice from '../containers/adjust-price';
import transactVendingLog from '../containers/transact-vending-log';
import ticket from '../containers/ticket';
import ticketDetail from '../containers/ticket/detail';
import product from '../containers/product';
import Promotion from '../containers/promotion';
import PromotionDetail from '../containers/promotion/detail';
import PromotionUserList from '../containers/promotion/user-list';
import ReportCash from '../containers/report-cash';
import changePassword from '../containers/changePassword';
import cashLeftOver from '../containers/cash-left-over';
import processingDeviceStatus from '../containers/processing-device/status';
import ServiceTopupTransaction from '../containers/service-topup-transaction';
import PayoutTransaction from '../containers/payout-transaction';
import PayoutTransactionDetail from '../containers/payout-transaction/detail';
import debt from '../containers/debt';
import inventoryDetailReport from '../containers/reports/inventory-detail-report';
import TransPaymentOrder from "../containers/payment-order";
import whInventory from '../containers/wh-inventory';
export const pages = {
  authorize: [
    {
      url: LOCAL_PATH.DASHBOARD.INDEX,
      permissions: [PERMISSION.DASHBOARD.INDEX],
      component: Dashboard,
    },
    {
      url: LOCAL_PATH.TRANSACTION.BILL.INDEX,
      permissions: [PERMISSION.BILL.INDEX, PERMISSION.BILL.LIST.INDEX, PERMISSION.BILL.DETAIL_LIST.INDEX],
      component: PaymentOrder,
    },
    {
      url: LOCAL_PATH.TRANSACTION.BILL_DETAIL.INDEX,
      permissions: [],
      component: BillDetail,
    },
    {
      url: LOCAL_PATH.EMPTY,
      permissions: [PERMISSION.MACHINE.INDEX],
      childs: [
        {
          permissions: [PERMISSION.MACHINE.LIST, PERMISSION.MACHINE.MAP],
          url: LOCAL_PATH.CATEGORY.MACHINE.INDEX,
          component: Machine,
        },
        {
          permissions: [PERMISSION.MACHINE.DETAIL],
          url: LOCAL_PATH.CATEGORY.MACHINE.DETAIL,
          component: MachineDetail,
        },
      ]
    },
    {
      url: LOCAL_PATH.WAREHOUSE.SHORTAGE_RATE.INDEX,
      permissions: [],
      component: ShortageRateReport,
    },
    {
      url: LOCAL_PATH.WAREHOUSE.SHORTAGE_RATE.PRINT,
      permissions: [],
      component: RequireExport,
    },
    {
      url: LOCAL_PATH.WAREHOUSE.INVENTORY.INDEX,
      permissions: [],
      component: InventoryReport,
    },
    {
      url: LOCAL_PATH.WAREHOUSE.INVERNTORY_DETAIL.INDEX,
      permissions: [],
      component: inventoryDetailReport,
    },
    {
      url: LOCAL_PATH.WAREHOUSE.MATERIAL_INVENTORY.INDEX,
      permissions: [],
      component: MaterialInventoryReport,
    },
    {
      url: LOCAL_PATH.WAREHOUSE.INVERNTORY_IMPORT_EXPORT.INDEX,
      permissions: [PERMISSION.INVENTORY_IMPORT_REPORT_REPORT.INDEX],
      component: InventoryImportExportReport,
    },
    {
      url: LOCAL_PATH.EMPTY,
      permissions: [PERMISSION.WAREHOUSE.INDEX],
      childs: [
        {
          permissions: [PERMISSION.WAREHOUSE_IMPORT.INDEX, PERMISSION.WAREHOUSE_IMPORT.LIST, PERMISSION.WAREHOUSE_IMPORT.EXPORT],
          url: LOCAL_PATH.WAREHOUSE.IMPORT.INDEX,
          component: whImport,
        },
        // {
        //   permissions: [PERMISSION.WAREHOUSE_IMPORT.INDEX, PERMISSION.WAREHOUSE_IMPORT.LIST, PERMISSION.WAREHOUSE_IMPORT.EXPORT],
        //   url: LOCAL_PATH.WAREHOUSE.IMPORT.DETAIL_LIST,
        //   component: WhImportDetailList,
        // },
        {
          permissions: [PERMISSION.WAREHOUSE_IMPORT.DETAIL],
          url: LOCAL_PATH.WAREHOUSE.IMPORT.DETAIL,
          component: whImportDetail,
        },
        {
          permissions: [PERMISSION.WAREHOUSE_EXPORT.INDEX, PERMISSION.WAREHOUSE_EXPORT.LIST, PERMISSION.WAREHOUSE_EXPORT.EXPORT],
          url: LOCAL_PATH.WAREHOUSE.EXPORT.INDEX,
          component: whExport,
        },
        // {
        //   permissions: [PERMISSION.WAREHOUSE_IMPORT.INDEX, PERMISSION.WAREHOUSE_IMPORT.LIST, PERMISSION.WAREHOUSE_IMPORT.EXPORT],
        //   url: LOCAL_PATH.WAREHOUSE.EXPORT.DETAIL_LIST,
        //   component: whExportDetailList,
        // },
        {
          permissions: [PERMISSION.WAREHOUSE_EXPORT.DETAIL],
          url: LOCAL_PATH.WAREHOUSE.EXPORT.DETAIL,
          component: whExportDetail,
        },

      ]
    },
    {
      permissions: [PERMISSION.INVENTORY_WAREHOUSE.INDEX],
      url: LOCAL_PATH.WAREHOUSE.INVENTORY_WAREHOUSE.INDEX,
      component: whInventory,
    },
    {
      url: LOCAL_PATH.EMPTY,
      permissions: [],
      childs: [
        {
          component: reconciliationRevenue,
          permissions: [PERMISSION.RECONCILIATION_REVENUE.INDEX],
          url: LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.INDEX,
        },
        {
          component: ReconciliationRevenueDetail,
          permissions: [PERMISSION.RECONCILIATION_REVENUE.INDEX],
          url: LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.DETAIL,
        },
        {
          component: ReconciliationRevenueCreate,
          permissions: [PERMISSION.RECONCILIATION_REVENUE.CREATE],
          url: LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.CREATE,
        }
      ]
    },
    {
      url: LOCAL_PATH.FINANCE.ADJUST_PRICE.INDEX,
      permissions: [PERMISSION.ADJUST_PRICE.INDEX],
      component: adjustPrice,
    },
    {
      url: LOCAL_PATH.FINANCE.TRANSACT_VENDING_LOG.INDEX,
      permissions: [PERMISSION.TRANSACT_VENDING_LOG.INDEX],
      component: transactVendingLog,
    },
    {
      url: LOCAL_PATH.EMPTY,
      permissions: [],
      childs: [
        {
          component: ticket,
          permissions: [PERMISSION.TICKET.INDEX],
          url: LOCAL_PATH.TICKET.INDEX,
        },
        {
          component: ticketDetail,
          permissions: [PERMISSION.TICKET.INDEX],
          url: LOCAL_PATH.TICKET.DETAIL,
        }
      ]
    },
    {
      url: LOCAL_PATH.CATEGORY.PRODUCT.INDEX,
      permissions: [],
      component: product,
    },
    {
      url: LOCAL_PATH.EMPTY,
      permissions: [],
      childs: [
        {
          component: Promotion,
          permissions: [],
          url: LOCAL_PATH.PROMOTION.INDEX,
        },
        {
          component: PromotionDetail,
          permissions: [],
          url: LOCAL_PATH.PROMOTION.DETAIL,
        },
        {
          component: PromotionUserList,
          permissions: [],
          url: LOCAL_PATH.PROMOTION.USER_LIST,
        }
      ]
    },
    {
      url: LOCAL_PATH.FINANCE.REPORT_CASH.INDEX,
      permissions: [PERMISSION.REPORT_CASH.INDEX],
      component: ReportCash,
    },
    {
      url: LOCAL_PATH.TRANSACTION.CASH_LEFT_OVER.INDEX,
      permissions: [PERMISSION.CASH_LEFT_OVER.INDEX, PERMISSION.CASH_LEFT_OVER.PROCESS],
      component: cashLeftOver,
    },
    {
      url: LOCAL_PATH.SYSTEM.PROCESSING_DEVICE.STATUS,
      permissions: [],
      component: processingDeviceStatus,
    },
    {
      url: LOCAL_PATH.TRANSACTION.SERVICE_TOPUP_TRANSACTION.INDEX,
      permissions: [PERMISSION.SERVICE_TOPUP_TRANSACTION.INDEX],
      component: ServiceTopupTransaction,
    },

    {
      url: LOCAL_PATH.EMPTY,
      permissions: [PERMISSION.PAYMENT_TRANSACTION.INDEX],
      childs: [
        {
          url: LOCAL_PATH.TRANSACTION.PAYMENT_ORDER.INDEX,
          permissions: [PERMISSION.PAYMENT_TRANSACTION.INDEX],
          component: TransPaymentOrder,
        },
        // {
        //   component: PayoutTransactionDetail,
        //   permissions: [PERMISSION.PAYOUT_TRANSACTION.INDEX],
        //   url: LOCAL_PATH.TRANSACTION.PAYOUT_TRANSACTION.DETAIL,
        // }
      ]
    },
    {
      url: LOCAL_PATH.EMPTY,
      permissions: [],
      childs: [
        {
          url: LOCAL_PATH.TRANSACTION.PAYOUT_TRANSACTION.INDEX,
          permissions: [PERMISSION.PAYOUT_TRANSACTION.INDEX],
          component: PayoutTransaction,
        },
        {
          component: PayoutTransactionDetail,
          permissions: [PERMISSION.PAYOUT_TRANSACTION.INDEX],
          url: LOCAL_PATH.TRANSACTION.PAYOUT_TRANSACTION.DETAIL,
        }
      ]
    },
    {
      url: LOCAL_PATH.USER.CHANGE_PASSWORD,
      permissions: [],
      component: changePassword
    },
    {
      url: LOCAL_PATH.EMPTY,
      permissions: [PERMISSION.DEBT.SEARCH],
      childs: [
        {
          permissions: [PERMISSION.DEBT.SEARCH, PERMISSION.DEBT.EXPORT],
          url: LOCAL_PATH.FINANCE.DEBT.INDEX,
          component: debt,
        },
      ]
    },
    {
      url: LOCAL_PATH.EMPTY,
      permissions: [],
      component: Blank,
    },
  ],
  unauthorize: [
    {
      component: Login,
      url: LOCAL_PATH.LOGIN,
    },

  ]
}

export const isAllow = (permission) => {
  if (!Array.isArray(permission)) {
    permission = [permission]
  }
  if (!permission.length) {
    return true;
  }
  let allow = false;
  let state = store.getState();
  let { auth: { userPermission } } = state;
  allow = permission.some(k => userPermission.includes(k));
  return allow;
}

export const parseRoutes = (tree) => {
  let listPages = [];
  tree.map(k => recursiveRoute(k, "", []));
  function recursiveRoute(route, url, permissions) {
    let current = {
      component: route.component,
      url: url + route.url,
      permissions: [...permissions, ...route.permissions]
    }
    if (route.component && isAllow(current.permissions)) {
      listPages.push(current);
    }
    if (route.childs) {
      route.childs.map(k => recursiveRoute(k, current.url, current.permissions));
    }
  }
  return listPages;
}