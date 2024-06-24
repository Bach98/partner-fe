//URL Prefix
const prefix = `api/v1`;
//API URL
export const PATH = {
  //auth
  AUTH: {
    LOGIN: `${prefix}/Auth/Login`,
    LOGOUT: `${prefix}/Auth/SignOut`,
    GET_USER_INFO: `${prefix}/PartnerUser/GetPartnerUserInfo`,
    FORGET_PASSWORD: `${prefix}/Auth/ForgetPassword`,
    CLAIM_PASSWORD: `${prefix}/Auth/ClaimPassword`,
    CLAIM_PASSWORD_EXECUTE: `${prefix}/Auth/ClaimPassword`,
    CHANGE_PASSWORD: `${prefix}/PartnerUser/ChangePassword`,
  },
  DASHBOARD: {
    INIT: `${prefix}/Dashboard/InitData`,
    EXPORT: `${prefix}/Dashboard/ExportExcel`,
  },
  BILL: {
    INIT: `${prefix}/Bill/InitData`,
    SEARCH: `${prefix}/Bill/Search`,
    SEARCH_DETAIL: `${prefix}/Bill/SearchDetail`,
    SEARCH_BILL_DETAIL: `${prefix}/Bill/SearchBillDetail`,
    EXPORT_EXCEL: `${prefix}/Bill/ExportExcel`,
    EXPORT_EXCEL_DETAIL: `${prefix}/Bill/ExportExcelDetail`,
    EXPORT_EXCEL_BILL_DETAIL: `${prefix}/Bill/ExportExcelBillDetail`,
    GET_LIST_ORDER_DETAIL: `${prefix}/Bill/GetListOrderDetail`,
    CREATE_INVOICE: `${prefix}/Bill/CreateInvoice`,
    SEND_INVOICE: `${prefix}/Bill/SendInvoice`,
  },
  PAYMENT_ORDER: {
    INIT: `${prefix}/PartnerPaymentOrder/InitData`,
    SEARCH: `${prefix}/PartnerPaymentOrder/Search`,
    REFUND: `${prefix}/PartnerPaymentOrder/Refund`,
    RE_REFUND: `${prefix}/PartnerPaymentOrder/ReRefund`,
    EXPORT_EXCEL: `${prefix}/PartnerPaymentOrder/ExportExcel`,
  },
  MACHINE: {
    INIT: `${prefix}/Machine/InitData`,
    SEARCH: `${prefix}/Machine/Search`,
    DETAIL: `${prefix}/Machine/Detail`,
  },
  SHORTAGE_RATE_REPORT: {
    INIT: `${prefix}/Report/Inventory/ShortageRateInitData`,
    SEARCH: `${prefix}/Report/Inventory/ShortageRateSearch`,
    EXPORT_EXCEL: `${prefix}/Report/Inventory/ShortageRateExportExcel`,
    PRINT: `${prefix}/Report/Inventory/ShortageRateExportExcel/PRINT`,
  },
  INVENTORY_REPORT: {
    INIT: `${prefix}/Report/Inventory/InitData`,
    SEARCH: `${prefix}/Report/Inventory/Search`,
    EXPORT_EXCEL: `${prefix}/Report/Inventory/ExportExcel`,
  },
  MATERIAL_INVENTORY_REPORT: {
    INIT: `${prefix}/Report/Inventory/MaterialInventoryInitData`,
    SEARCH: `${prefix}/Report/Inventory/MaterialSearch`,
    EXPORT_EXCEL: `${prefix}/Report/Inventory/MaterialInventoryExportExcel`,
  },
  WAREHOUSE_IMPORT: {
    INIT: `${prefix}/Warehouse/Import/InitData`,
    SEARCH: `${prefix}/Warehouse/Import/Search`,
    DETAIL: `${prefix}/Warehouse/Import/Detail`,
    SAVE: `${prefix}/Warehouse/Import/Created`,
    CONFIRM: `${prefix}/Warehouse/Import/Confirm`,
    EXPORT_EXCEL: `${prefix}/Warehouse/Import/ExportExcel`,
    INIT_DETAIL_LIST: `${prefix}/Warehouse/Import/InitDataDetailList`,
    SEARCH_DETAIL_LIST: `${prefix}/Warehouse/Import/SearchDetailList`,
    EXPORT_EXCEL_DETAIL_LIST: `${prefix}/Warehouse/Import/ExportExcelDetailList`,
    IMPORT_EXCEL: `${prefix}/Warehouse/Import/ImportExcel`,
  },
  WAREHOUSE_INVENTORY: {
    INIT: `${prefix}/Warehouse/Inventory/InitData`,
    SEARCH: `${prefix}/Warehouse/Inventory/Search`,
    EXPORT_EXCEL: `${prefix}/Warehouse/Inventory/ExportExcel`,
  },
  WAREHOUSE_EXPORT: {
    INIT: `${prefix}/Warehouse/Export/InitData`,
    SEARCH: `${prefix}/Warehouse/Export/Search`,
    DETAIL: `${prefix}/Warehouse/Export/Detail`,
    EDIT: `${prefix}/Warehouse/Export/Edit`,
    CONFIRM: `${prefix}/Warehouse/Export/Confirm`,
    GET_PRODUCT_BY_LAYOUT: `${prefix}/Warehouse/Export/GetProductByLayout`,
    GET_PRODUCT_BY_INVENTORY_MACHINE: `${prefix}/Warehouse/Export/GetProductRecallByMachine`,
    EXPORT_EXCEL: `${prefix}/Warehouse/Export/ExportExcel`,
    INIT_DETAIL_LIST: `${prefix}/Warehouse/Export/InitDataDetailList`,
    SEARCH_DETAIL_LIST: `${prefix}/Warehouse/Export/SearchDetailList`,
    EXPORT_EXCEL_DETAIL_LIST: `${prefix}/Warehouse/Export/ExportExcelDetailList`,
  },
  LOCATION: {
    GET_DISTRICT: `${prefix}/Location/GetDistrict`,
    GET_WARD: `${prefix}/Location/GetWard`,
  },
  RECONCILIATION_REVENUE: {
    INIT: `${prefix}/PartnerReconciliationRevenue/InitData`,
    SEARCH: `${prefix}/PartnerReconciliationRevenue/Search`,
    EXPORT_EXCEL: `${prefix}/PartnerReconciliationRevenue/ExportExcel`,
    EXPORT_FORM: `${prefix}/PartnerReconciliationRevenue/ExportForm`,
    CHANGE_RECONCILIATION_STATUS: `${prefix}/PartnerReconciliationRevenue/ChangeReconciliationRevenueStatus`,
    DETAIL: `${prefix}/PartnerReconciliationRevenue/Detail`,
    GET_CASH_SHEET_DETAIL: `${prefix}/PartnerReconciliationRevenue/GetCashSheetDetail`,
    SEARCH_MACHINE: `${prefix}/PartnerReconciliationRevenue/SearchListMachineForReconciliation`,
    CREATE: `${prefix}/PartnerReconciliationRevenue/Create`,
  },
  ADJUST_PRICE: {
    INIT: `${prefix}/AdjustPrice/InitData`,
    SEARCH: `${prefix}/AdjustPrice/Search`,
    CONFIRM: `${prefix}/AdjustPrice/Confirm`,
  },
  TRANSACT_VENDING_LOG: {
    INIT: `${prefix}/PartnerCashCollection/InitTransactVendingLog`,
    SEARCH: `${prefix}/PartnerCashCollection/GetListTransactVendingLog`,
    EXPORT_EXCEL: `${prefix}/PartnerCashCollection/ExportExcel`,
    EXPORT_EXCEL_DETAIL: `${prefix}/PartnerCashCollection/ExportExcelDetail`,
    DETAIL: `${prefix}/PartnerCashCollection/GetTransactVendingLogDetail`,
  },
  TICKET: {
    INIT: `${prefix}/TicketManagement/TicketInit`,
    SEARCH: `${prefix}/TicketManagement/TicketSearch`,
    DETAIL: `${prefix}/TicketManagement/GetTicketDetail`
  },
  PRODUCT: {
    INIT: `${prefix}/Product/Init`,
    SEARCH: `${prefix}/Product/Search`,
    EDIT_PRODUCT: `${prefix}/Product/EditProduct`,
    EXPORT_EXCEL: `${prefix}/Product/ExportExcel`,
  },
  PROMOTION: {
    INIT: `${prefix}/Promotion/InitData`,
    SEARCH: `${prefix}/Promotion/Search`,
    DETAIL: `${prefix}/Promotion/Detail`,
    EXPORT_EXCEL: `${prefix}/Promotion/ExportExcel`,
    SEARCH_USER_LIST: `${prefix}/Promotion/SearchUserList`,
    EXPORT_EXCEL_USER_LIST: `${prefix}/Promotion/ExportExcelUserList`,
  },
  REPORT_CASH: {
    INIT: `${prefix}/ReportCash/InitData`,
    SEARCH: `${prefix}/ReportCash/Search`,
    EXPORT_EXCEL: `${prefix}/ReportCash/ExportExcel`,
    EXPORT_EXCEL_DETAIL: `${prefix}/ReportCash/ExportExcelDetail`,
    GET_CASH_SHEET_DETAIL: `${prefix}/ReportCash/GetCashSheetDetail`,
  },
  INVENTORY_IMPORT_EXPORT_REPORT: {
    INIT: `${prefix}/Report/InventoryImportExportReportInitData`,
    SEARCH: `${prefix}/Report/InventoryImportExportReportSearch`,
    EXPORT_EXCEL: `${prefix}/Report/InventoryImportExportReportExportExcel`,
  },
  CASH_LEFT_OVER: {
    INIT: `${prefix}/PartnerCashLeftOver/InitData`,
    SEARCH: `${prefix}/PartnerCashLeftOver/Search`,
    PROCESS: `${prefix}/PartnerCashLeftOver/Process`,
    EXPORT_EXCEL: `${prefix}/PartnerCashLeftOver/ExportExcel`,
    GET_BANK: `${prefix}/PartnerCashLeftOver/GetBank`,
  },
  PROCESSING_DEVICE: {
    INIT: `${prefix}/ProcessingDevice/InitData`,
    SEARCH_STATUS: `${prefix}/ProcessingDevice/SearchStatus`,
    EXPORT_EXCEL: `${prefix}/ProcessingDevice/ExportExcel`,
    SEARCH_ALIVE_HISTORY: `${prefix}/ProcessingDevice/SearchAliveHistory`,
  },
  SERVICE_TOPUP_TRANSACTION: {
    INIT: `${prefix}/PartnerServiceTopupTransaction/InitData`,
    SEARCH: `${prefix}/PartnerServiceTopupTransaction/Search`,
    EXPORT_EXCEL: `${prefix}/PartnerServiceTopupTransaction/ExportExcel`,
  },
  DEBT: {
    INIT: `${prefix}/PartnerDebt/InitData`,
    SEARCH: `${prefix}/PartnerDebt/Search`,
    EXPORT_EXCEL: `${prefix}/PartnerDebt/ExportExcel`,
  },
  INVENTORY_DETAIL_REPORT: {
    INIT: `${prefix}/ReportInventoryDetail/InitData`,
    SEARCH: `${prefix}/ReportInventoryDetail/Search`,
    EXPORT_EXCEL: `${prefix}/ReportInventoryDetail/ExportExcel`,
  },
  PAYOUT_TRANSACTION: {
    INIT: `${prefix}/PayoutTransaction/InitData`,
    SEARCH: `${prefix}/PayoutTransaction/Search`,
    DETAIL: `${prefix}/PayoutTransaction/Detail`,
    PROCESS: `${prefix}/PayoutTransaction/Process`,
    EXPORT_EXCEL: `${prefix}/PayoutTransaction/ExportExcel`,
  },
}
//SITE URL
export const LOCAL_PATH = {
  EMPTY: ``,
  HOME: `/home`,
  LOGIN: `/login`,
  BLANK: `/404`,
  USER: {
    CHANGE_PASSWORD: `/user/change-password`,
  },
  DASHBOARD: {
    INDEX: `/dashboard`,
  },
  //Giao dịch
  TRANSACTION: {
    INDEX: `/transaction`,
    BILL: {
      INDEX: `/transaction/bill`,
    },
    BILL_DETAIL: {
      INDEX: `/transaction/list-bill-detail`,
    },
    CASH_LEFT_OVER: {
      INDEX: `/transaction/cash-left-over`,
    },
    SERVICE_TOPUP_TRANSACTION: {
      INDEX: `/transaction/service-topup-transaction`
    },
    PAYOUT_TRANSACTION: {
      INDEX: `/payout-transaction`,
      DETAIL: `/payout-transaction/:id`
    },
    PAYMENT_ORDER: {
      INDEX: `/transaction/payment-order`,
      DETAIL: `/transaction/payment-order/:id`
    },
  },
  //Quản lý kho
  WAREHOUSE: {
    INDEX: `/warehouse`,
    IMPORT: {
      INDEX: `/warehouse/wh-import`,
      DETAIL: `/warehouse/wh-import/detail/:id`,
      DETAIL_LIST: `/warehouse/import-detail-list`,
    },
    EXPORT: {
      INDEX: `/warehouse/wh-export`,
      DETAIL: `/warehouse/wh-export/detail/:id`,
      DETAIL_LIST: `/warehouse/export-detail-list`
    },
    SHORTAGE_RATE: {
      INDEX: `/warehouse/shortage-rate-report`,
      PRINT: `/warehouse/print-require-export`
    },
    INVENTORY: {
      INDEX: `/warehouse/inventory`
    },
    MATERIAL_INVENTORY: {
      INDEX: `/warehouse/material-inventory-report`
    },
    INVERNTORY_IMPORT_EXPORT: {
      INDEX: `/warehouse/import-export-report-inventory`
    },
    INVENTORY_WAREHOUSE: {
      INDEX: `/warehouse/main-inventory`
    },
    INVERNTORY_DETAIL: {
      INDEX: `/warehouse/report-inventory-detail`
    }
  },
  //Tài chính
  FINANCE: {
    INDEX: `/finance`,
    DEBT: {
      INDEX: `/finance/debt`,
    },
    RECONCILIATION_REVENUE: {
      INDEX: `/finance/reconciliation-revenue`,
      DETAIL: `/finance/reconciliation-revenue/detail/:id`,
      CREATE: `/finance/reconciliation-revenue/create`
    },
    REPORT_CASH: {
      INDEX: `/finance/reportCash`,
    },
    TRANSACT_VENDING_LOG: {
      INDEX: `/finance/transactvendinglog`,
    },
    ADJUST_PRICE: {
      INDEX: `/finance/adjust-price`,
    },
  },
  //Khuyến mại
  PROMOTION: {
    INDEX: `/promotion`,
    DETAIL: `/promotion/detail/:id`,
    USER_LIST: `/user-list-promotion`,
  },
  //Danh mục
  CATEGORY: {
    INDEX: `/category`,
    MACHINE: {
      INDEX: `/category/machine`,
      DETAIL: `/category/machine/detail`,
    },
    PRODUCT: {
      INDEX: `/category/product`,
    },
  },
  //Ticket
  TICKET: {
    INDEX: `/ticket`,
    DETAIL: `/ticket/detail`,
  },
  //Danh mục
  SYSTEM: {
    INDEX: `/system`,
    PROCESSING_DEVICE: {
      STATUS: `/system/processing-device/status`,
    },
  }
}
