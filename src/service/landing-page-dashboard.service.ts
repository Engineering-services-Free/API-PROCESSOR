import {
  LandingPageDashboardDao,
  landingPageDashboardDao,
} from "../daos/landing-page-dashboard.dao.js";

export class LandingPageDashboardService {
  constructor(
    private readonly dao: LandingPageDashboardDao = landingPageDashboardDao,
  ) {}

  public getLandingPageDashboard() {
    return this.dao.getLandingPageDashboard();
  }
}

export const landingPageDashboardService = new LandingPageDashboardService();
