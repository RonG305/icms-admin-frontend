/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */
'use server'

// Data Imports
import { db as eCommerceData } from '@/data/fake-db/apps/ecommerce'
import { db as academyData } from '@/data/fake-db/apps/academy'
import { db as vehicleData } from '@/data/fake-db/apps/logistics'
import { db as userData } from '@/data/fake-db/apps/userList'
import { db as permissionData } from '@/data/fake-db/apps/permissions'
import { db as profileData } from '@/data/fake-db/pages/userProfile'
import { db as faqData } from '@/data/fake-db/pages/faq'
import { db as pricingData } from '@/data/fake-db/pages/pricing'
import { db as statisticsData } from '@/data/fake-db/pages/widgetExamples'
import  {db as revenueAccountsData } from '@/data/fake-db/apps/revenue-accounts'
import { db as tasksData } from '@/data/fake-db/apps/tasks'
import { db as notificationsData } from '@/data/fake-db/apps/notifications'
import {db as invoicePaymentsData} from '@/data/fake-db/apps/invoice-payments'
import {db as pspTransactionsData} from '@/data/fake-db/apps/psp-transactions'
import {db as MCDAsData} from '@/data/fake-db/apps/mcdas'
import {db as mcdaCategories} from '@/data/fake-db/apps/mcda-categories'
import {db as pspsData} from '@/data/fake-db/apps/psps'
import {db as productsData} from '@/data/fake-db/apps/products-services'
import {db as usersData} from '@/data/fake-db/apps/users'
import {db as invoicesData} from '@/data/fake-db/apps/invoices'
import {db as userRoles} from '@/data/fake-db/apps/user-roles'
import {db as targetsData} from '@/data/fake-db/apps/targets'
import {db as productAndServicesCategories} from '@/data/fake-db/apps/product-services-categories'
import {db as paymentChannelsData} from '@/data/fake-db/apps/payment-channels'
import entityProfile from '../fake-db/pages/user/entityProfile';
import {db as reconciliations} from '../fake-db/apps/reconciliations';
import {db as settlements} from '../fake-db/apps/settements';
import {db as chartOfAccountsData} from '../fake-db/apps/chart-of-accounts'
import {db as revenueMetricsData} from '../fake-db/apps/revenue-metrics';

export const getRevenueAccountsData = async () => {
  return revenueAccountsData
}
export const getNotificationsData = async () => {
  return notificationsData
}

export const getReconciliationsData = async () => {
  const reconciliationTasks = reconciliations.filter((rec) => rec.status === 'Pending' || rec.status === 'In Progress')
  return reconciliationTasks
}


export const closedReconciliationPeriods = async () => {
  const closedPeriods = reconciliations
    .filter((rec) => rec.status === 'Reconciled' && rec.can_close_period)

  // Return unique periods
  return closedPeriods
}

export const getSettlementsData = async () => {
  const settlementTasks = settlements.filter((set) => set.status === 'Pending' || set.status === 'In Progress')
  return settlementTasks
}

export const closedSettlementPeriods = async () => {
  const closedPeriods = settlements
    .filter((set) => set.status === 'Settled' && set.can_finalize)

  // Return unique periods
  return closedPeriods
}

export const getInvoicePaymentsData = async () => {
  return invoicePaymentsData
}
export const getPspTransactionsData = async () => {
  return pspTransactionsData
}

export const getPaymentChannelsData = async () => {
  return paymentChannelsData
}

export const getMCDAsData = async () => {
  return MCDAsData
}

export const getMcdaCategories = async () => {
  return mcdaCategories
}

export const getPspsData = async () => {
  return pspsData
}

export const getTargetsData = async () => {
  return targetsData
}

export const getEcommerceData = async () => {
  return eCommerceData
}

export const getProductsData = async () => {
  return productsData
}

export const getRevenueMetricsData = async () => {
  return revenueMetricsData
}

export const getAcademyData = async () => {
  return academyData
}

export const getChartOfAccounts = async () => {
  return chartOfAccountsData
}

export const getUserRoles = async () => {
  return userRoles
}

export const getUsersData = async () => {
  return usersData
}

export const getProductAndServicesCategories = async () => {
  return productAndServicesCategories
}

export const getLogisticsData = async () => {
  return vehicleData
}

export const getInvoiceData = async () => {
  return invoicesData
}

export const getUserData = async () => {
  return userData
}

export const getPermissionsData = async () => {
  return permissionData
}

export const getProfileData = async () => {
  return profileData
}

export const getFaqData = async () => {
  return faqData
}

export const getPricingData = async () => {
  return pricingData
}

export const getStatisticsData = async () => {
  return statisticsData
}

export const getEntityProfileData = async () => {
  return entityProfile
}

export const getAllTasks = async () => {
  return  tasksData
}
