const RequestHandler = require('.');
const LogisticsService = require('../services/logistics.service');
const {
  AddLogisticsValidator,
  SetDefaultLogisticsValidator,
} = require('../validators');

class LogisticsController {
  static getCategories = RequestHandler({
    handler: LogisticsService.getLogisticsCompanies,
  });

  static addCompany = RequestHandler({
    validator: AddLogisticsValidator,
    handler: LogisticsService.addLogisticsCompany,
  });

  static setDefault = RequestHandler({
    validator: SetDefaultLogisticsValidator,
    handler: LogisticsService.setDefaultLogisticCompany,
  });
}

module.exports = LogisticsController;
