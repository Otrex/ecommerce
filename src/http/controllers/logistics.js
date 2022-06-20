const RequestHandler = require('.');
const LogisticsService = require('../services/logistics.service');
const {
  SetDefaultLogisticsValidator,
  AddLogisticsValidator,
} = require('../validators');

class InfoController {
  static getCompanies = RequestHandler({
    handler: LogisticsService.getLogisticsCompanies,
  });

  static setDefault = RequestHandler({
    validator: SetDefaultLogisticsValidator,
    handler: LogisticsService.setDefaultLogisticCompany,
  });

  static addCompany = RequestHandler({
    validator: AddLogisticsValidator,
    handler: LogisticsService.addLogisticsCompany,
  });
}

module.exports = InfoController;
