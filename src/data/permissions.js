export const PERMISSION = {
  DASHBOARD: {
    INDEX: "DASHBOARD",
  },
  BILL: {
    INDEX: "BILL",
    LIST: {
      INDEX: "BILL_LIST",
      EXPORT: "BILL_LIST_EXPORT",
      INVOICE: "BILL_LIST_INVOICE",
    },
    DETAIL_LIST: {
      INDEX: "BILL_DETAIL_LIST",
      SUPPLIER_PRICE: "SUPPLIER_PRICE",
      EXPORT: "BILL_DETAIL_LIST_EXPORT",
    }
  },
  MACHINE: {
    INDEX: "VENDING_MACHINE",
    LIST: "VENDING_MACHINE_LIST",
    MAP: "VENDING_MACHINE_MAP",
    DETAIL: "VENDING_MACHINE_DETAIL",
  },
  SHORTAGE_RATE_REPORT: {
    INDEX: "SHORTAGE_RATE_REPORT",
    LIST: "SHORTAGE_RATE_REPORT_LIST",
    EXPORT: "SHORTAGE_RATE_REPORT_EXPORT",
  },
  INVENTORY_REPORT: {
    INDEX: "INVENTORY_REPORT",
    LIST: "INVENTORY_REPORT_LIST",
    EXPORT: "INVENTORY_REPORT_LIST_EXPORT",
  },
  INVENTORY_DETAIL_REPORT: {
    INDEX: "INVENTORY_DETAIL_REPORT",
    LIST: "INVENTORY_DETAIL_REPORT_LIST",
    EXPORT: "INVENTORY_DETAIL_REPORT_EXPORT",
  },
  MATERIAL_INVENTORY_REPORT: {
    INDEX: "MATERIAL_INVENTORY_REPORT",
    LIST: "MATERIAL_INVENTORY_REPORT_LIST",
    EXPORT: "MATERIAL_INVENTORY_REPORT_EXPORT",
  },
  INVENTORY_IMPORT_REPORT_REPORT: {
    INDEX: "INVENTORY_IMPORT_EXPORT_REPORT"
  },
  INVENTORY_WAREHOUSE: {
    INDEX: "INVENTORY_WAREHOUSE"
  },
  WAREHOUSE: {
    INDEX: "WAREHOUSE",
  },
  WAREHOUSE_IMPORT: {
    INDEX: "WAREHOUSE_IMPORT",
    LIST: "WAREHOUSE_IMPORT_LIST",
    DETAIL: "WAREHOUSE_IMPORT_DETAIL",
    EXPORT: "WAREHOUSE_IMPORT_LIST_EXPORT",
    EDIT: "WAREHOUSE_IMPORT_EDIT",
  },
  WAREHOUSE_EXPORT: {
    INDEX: "WAREHOUSE_EXPORT",
    LIST: "WAREHOUSE_EXPORT_LIST",
    DETAIL: "WAREHOUSE_EXPORT_DETAIL",
    EXPORT: "WAREHOUSE_EXPORT_LIST_EXPORT",
    EDIT: "WAREHOUSE_EXPORT_EDIT",
    CONFIRM: "WAREHOUSE_EXPORT_CONFIRM"
  },
  RECONCILIATION_REVENUE: {
    INDEX: "RECONCILIATION_REVENUE",
    LIST: "RECONCILIATION_REVENUE_LIST",
    EXPORT: "RECONCILIATION_REVENUE_EXPORT",
    CONFIRM: "RECONCILIATION_REVENUE_CONFIRM",
    CANCEL: "RECONCILIATION_REVENUE_CANCEL",
    CREATE: "CREATE_RECONCILIATION_REVENUE"
  },
  TRANSACT_VENDING_LOG: {
    INDEX: "COLLECT_MONEY_LIST",
  },
  ADJUST_PRICE: {
    INDEX: "ADJUST_PRICE",
    LIST: "ADJUST_PRICE_LIST",
    CONFIRM: "ADJUST_PRICE_CONFIRM",
  },
  REPORT_CASH: {
    INDEX: "REPORT_CASH",
  },
  TICKET: {
    INDEX: "VIEW_TICKET",
    CREATE: "PARTNER_CREATE_TICKET",
  },
  PRODUCT: {
    INDEX: "PRODUCT",
    EDIT_PRICE: "EDIT_PRICE",
  },
  PROMOTION: {
    INDEX: "PROMOTION",
    VIEW: "VIEW_PROMOTION",
    USER_LIST: "PROMOTION_USER_LIST",
  },
  CASH_LEFT_OVER: {
    INDEX: "VIEW_CASH_LEFT_OVER",
    PROCESS: "PROCESS_CASH_LEFT_OVER",
  },
  SERVICE_TOPUP_TRANSACTION: {
    INDEX: "VIEW_SERVICE_TOPUP_TRANSACTION",
  },
  PAYOUT_TRANSACTION: {
    INDEX: "PAYOUT_TRANSACTION_LIST",
    DETAIL: "PAYOUT_TRANSACTION_DETAIL",
    PROCESS: "PAYOUT_TRANSACTION_PROCESS",
  },
  PAYMENT_TRANSACTION: {
    INDEX: "PAYMENT_TRANSACTION_LIST",
    PROCESS: "PAYMENT_TRANSACTION_PROCESS",
  },
  FINANCE: {
    INDEX: "FINANCE",
  },
  DEBT: {
    INDEX: "DEBT",
    SEARCH: "SEARCH_DEBT",
    EXPORT: "EXPORT_DEBT",
  },
  PROCESSING_STATUS: {
    INDEX: "PROCESSING_STATUS",
  },
}
