
module.exports = {
    definition: {
      openapi: '3.0.1',
      info: {
        title: 'Your API Documentation',
        description: 'Documentation for your project using Swagger',
      },
    },
    apis: [
      `${__dirname}/src/docs/products.yaml`,
      `${__dirname}/src/docs/cart.yaml`,
      
    ],
  };
  