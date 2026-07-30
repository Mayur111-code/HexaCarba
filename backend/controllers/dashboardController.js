const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/ApiResponse');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    ApiResponse.success(res, stats);
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const activity = await dashboardService.getRecentActivity();
    ApiResponse.success(res, activity);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getRecentActivity };
