import React from "react";
import {
  MenuOutlined,
  PartitionOutlined,
  BarsOutlined,
  SettingOutlined,
  FundOutlined
} from '@ant-design/icons';
import { LOCAL_PATH } from "../constants";
import { PERMISSION } from "./index";

export const leftMenu = [
  {
    name: "DASHBOARD",
    permission: [PERMISSION.DASHBOARD.INDEX],
    enable: true,
    url: LOCAL_PATH.DASHBOARD.INDEX,
    icon: <MenuOutlined />,
  },
  //Giao dịch
  {
    name: "TRANSACTION",
    permission: [
      PERMISSION.BILL.INDEX, PERMISSION.BILL.DETAIL_LIST.INDEX,
      PERMISSION.PAYOUT_TRANSACTION.INDEX
    ],
    enable: true,
    url: LOCAL_PATH.TRANSACTION.INDEX,
    icon: <FundOutlined />,
    childs: [
      {
        name: "BILL",
        permission: [PERMISSION.BILL.INDEX],
        enable: true,
        url: LOCAL_PATH.TRANSACTION.BILL.INDEX,
      },
      {
        name: "BILL_DETAIL",
        permission: [PERMISSION.BILL.DETAIL_LIST.INDEX],
        enable: true,
        url: LOCAL_PATH.TRANSACTION.BILL_DETAIL.INDEX,
      },
      {
        name: "PAYOUT_TRANSACTION_MENU",
        permission: [PERMISSION.PAYOUT_TRANSACTION.INDEX],
        enable: true,
        url: LOCAL_PATH.TRANSACTION.PAYOUT_TRANSACTION.INDEX,
      },
      {
        name: "PAYMENT_ORDER_MENU",
        permission: [PERMISSION.PAYMENT_TRANSACTION.INDEX],
        enable: true,
        url: LOCAL_PATH.TRANSACTION.PAYMENT_ORDER.INDEX,
      },
    ]
  },
  //Quản lý kho
  {
    name: "WAREHOUSE",
    permission: [
      PERMISSION.WAREHOUSE_IMPORT.INDEX, PERMISSION.WAREHOUSE_IMPORT.INDEX, PERMISSION.WAREHOUSE_EXPORT.INDEX, PERMISSION.WAREHOUSE_EXPORT.INDEX,
      PERMISSION.SHORTAGE_RATE_REPORT.INDEX, PERMISSION.INVENTORY_REPORT.INDEX, PERMISSION.INVENTORY_DETAIL_REPORT.INDEX, PERMISSION.MATERIAL_INVENTORY_REPORT.INDEX,
      PERMISSION.INVENTORY_IMPORT_REPORT_REPORT.INDEX
    ],
    enable: true,
    url: LOCAL_PATH.WAREHOUSE.INDEX,
    icon: <PartitionOutlined />,
    childs: [
      {
        name: "WAREHOUSE_IMPORT",
        permission: [PERMISSION.WAREHOUSE_IMPORT.INDEX, PERMISSION.WAREHOUSE_IMPORT.LIST, PERMISSION.WAREHOUSE_IMPORT.EXPORT],
        enable: true,
        url: LOCAL_PATH.WAREHOUSE.IMPORT.INDEX,
      },
      {
        name: "WAREHOUSE_EXPORT",
        permission: [PERMISSION.WAREHOUSE_EXPORT.INDEX, PERMISSION.WAREHOUSE_EXPORT.LIST, PERMISSION.WAREHOUSE_EXPORT.EXPORT],
        enable: true,
        url: LOCAL_PATH.WAREHOUSE.EXPORT.INDEX,
      },
      {
        name: "MACHINE_SHORTAGE_RATE_REPORT_MENU",
        permission: [PERMISSION.SHORTAGE_RATE_REPORT.INDEX],
        enable: true,
        url: LOCAL_PATH.WAREHOUSE.SHORTAGE_RATE.INDEX,
      },
      {
        name: "MACHINE_INVENTORY_REPORT",
        permission: [PERMISSION.INVENTORY_REPORT.INDEX],
        enable: true,
        url: LOCAL_PATH.WAREHOUSE.INVENTORY.INDEX,
      },
      {
        name: "MACHINE_INVENTORY_DETAIL_REPORT",
        permission: [PERMISSION.INVENTORY_DETAIL_REPORT.INDEX],
        enable: true,
        url: LOCAL_PATH.WAREHOUSE.INVERNTORY_DETAIL.INDEX,
      },
      {
        name: "INVENTORY_IMPORT_EXPORT_REPORT_MENU",
        permission: [PERMISSION.INVENTORY_IMPORT_REPORT_REPORT.INDEX],
        enable: true,
        url: LOCAL_PATH.WAREHOUSE.INVERNTORY_IMPORT_EXPORT.INDEX,
      },
      {
        name: "INVENTORY_WAREHOUSE",
        permission: [PERMISSION.INVENTORY_WAREHOUSE.INDEX],
        enable: true,
        url: LOCAL_PATH.WAREHOUSE.INVENTORY_WAREHOUSE.INDEX,
      },
    ]
  },
  //Tài chính
  {
    name: "FINANCE",
    permission: [
      PERMISSION.RECONCILIATION_REVENUE.INDEX, PERMISSION.REPORT_CASH.INDEX
    ],
    enable: true,
    url: LOCAL_PATH.FINANCE.INDEX,
    icon: <FundOutlined />,
    childs: [
      {
        name: "RECONCILIATION_REVENUE_LIST_MENU",
        permission: [PERMISSION.RECONCILIATION_REVENUE.INDEX],
        enable: true,
        url: LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.INDEX,
      },
      {
        name: "REPORT_CASH",
        permission: [PERMISSION.REPORT_CASH.INDEX],
        enable: true,
        url: LOCAL_PATH.FINANCE.REPORT_CASH.INDEX,
      },
    ]
  },
  // {
  //   name: "PROMOTION_MENU",
  //   permission: [],
  //   enable: true,
  //   //url: LOCAL_PATH.PROMOTION.INDEX,
  //   icon: <BarsOutlined />,
  //   childs: [
  //     {
  //       name: "PROMOTION_MENU",
  //       permission: [],
  //       enable: true,
  //       url: LOCAL_PATH.PROMOTION.INDEX
  //     },
  //     {
  //       name: "PROMOTION_USER_LIST_MENU",
  //       permission: [],
  //       enable: true,
  //       url: LOCAL_PATH.PROMOTION.USER_LIST
  //     },
  //   ]
  // },
  //Danh mục
  {
    name: "CATEGORY_MENU",
    permission: [PERMISSION.MACHINE.INDEX, PERMISSION.PRODUCT.INDEX],
    enable: true,
    url: LOCAL_PATH.CATEGORY.INDEX,
    icon: <BarsOutlined />,
    childs: [
      {
        name: "LOCATION_AND_MACHINE",
        permission: [PERMISSION.MACHINE.INDEX],
        enable: true,
        url: LOCAL_PATH.CATEGORY.MACHINE.INDEX,
      },
      {
        name: "PRODUCT",
        permission: [PERMISSION.PRODUCT.INDEX],
        enable: true,
        url: LOCAL_PATH.CATEGORY.PRODUCT.INDEX,
      },
    ]
  },
  //Hệ thống
  {
    name: "SYSTEM",
    permission: [PERMISSION.PROCESSING_STATUS.INDEX],
    enable: true,
    url: LOCAL_PATH.SYSTEM.INDEX,
    icon: <SettingOutlined />,
    childs: [
      {
        name: "PROCESSING_DEVICE.MENU",
        permission: [PERMISSION.PROCESSING_STATUS.INDEX],
        enable: true,
        url: LOCAL_PATH.SYSTEM.PROCESSING_DEVICE.STATUS,
      }
    ]
  }
]