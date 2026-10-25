import { DashboardDao, dashboardDao } from "../daos/dashboard.dao.js";

export class DashboardService {
  constructor(private readonly dao: DashboardDao = dashboardDao) {}

  public getDashboard() {
    return this.dao.getDashboard();
  }
}

export const dashboardService = new DashboardService();
