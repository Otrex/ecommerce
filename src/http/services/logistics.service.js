const models = require('../models');
const { Types } = require('mongoose');
const { ServiceError, NotFoundError } = require('../lib/exceptions');

class LogisticsService {
  static getLogisticsCompanies = async () => ({
    data: await models.Logistics.find({}),
  });

  static addLogisticsCompany = async ({
    name,
    costPerUnit,
    description,
  }) => {
    let company = await models.Logistics.findOne({
      name,
    });

    if (company) throw new ServiceError('company already exist');

    company = await models.Logistics.create({
      name,
      costPerUnit,
      description,
    });

    return {
      data: company,
      message: 'logistics company added succcessfully',
    };
  };

  static setDefaultLogisticCompany = async ({
    companyId,
    account,
  }) => {
    let company = await models.Category.findOne({
      _id: new Types.ObjectId(companyId),
    });

    if (!company)
      throw new NotFoundError('logistics company not found');

    const business = await models.Business.findOne({
      accountId: account._id,
    });

    if (!business) throw new ServiceError('user is not a vendor');

    await models.Business.findByIdAndUpdate(business._id, {
      logisticsId: company._id,
    });

    return {
      message: 'default logistics company has been set successfully',
    };
  };
}

module.exports = LogisticsService;
