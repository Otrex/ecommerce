const { DB } = require('../../database');
const { seedCategories } = require('.');
const Logger = require('../../core/Logger');
const { PRODUCT_STATUS } = require('../../constants');
const AuthService = require('../../http/services/auth.service');
const { Product, Business, Category } = require('../../http/models');

const productData = [
  {
    imageUrl: 'http://placeimg.com/640/480',
    name: 'Rustic Concrete Pizza',
    price: 500,
    weight: 30,
    quantity: 10,
    expiryDate: '2022-05-25T00:23:54.443Z',
    minimumOrder: 0,
    handlingFee: 10,
    description:
      'Rem sapiente et atque voluptas amet. Dicta occaecati ipsum aut ullam ab qui voluptatibus dignissimos iste. Iusto fuga voluptate porro quidem sed reiciendis. Non hic labore veritatis tempore aut porro. Voluptatibus voluptas et.',
  },
];

const businessData = {
  sellerDetails: {
    email: 'Beulah53@gmail.com',
    password: 'kwK1HFw4es6HUlu',
    phoneNumber: '+2345678765456',
    fullName: 'Harry Friesen',
  },
  businessDetails: {
    type: 'Implemented holistic capacity',
    name: 'Open-architected static project',
    cacNumber: 'Optimized client-driven firmware',
    state: 'Maryland',
    lga: 'South Dakota',
    address: {
      lat: 324.43,
      long: 2424.42,
      label: 'Aruba',
    },
  },
  paymentDetails: {
    accountNumber: '456789000987',
    bank: 'Proactive real-time hierarchy',
    accountName: 'Marlin Lowe',
    payoutFrequency: 5,
  },
};

const run = async () => {
  let business = await Business.findOne({
    name: businessData['businessDetails'].name,
  });

  if (!business) {
    await AuthService.registerBusiness(businessData);
    business = await Business.findOne({
      name: businessData['businessDetails'].name,
    });
  }

  let categories = await Category.find({});

  if (!categories.length) {
    await seedCategories();
    categories = await Category.find({});
  }

  for (let product of productData) {
    await Product.create({
      ...product,
      quantityLeft: product.quantity,
      creatorId: business._id,
      categoryId: categories[2]._id,
      status: PRODUCT_STATUS.APPROVED,
    });
  }
};

if (require.main === module) {
  // const logger = new Logger('script');
  const db = new DB();
  db.connect()
    .then(async () => {
      await run();
      console.log('Seeding Completed');
    })
    .catch(console.error)
    .finally(() => process.exit(-1));
}
