const Sequelize = require("sequelize");

const sequelize = new Sequelize(
   'athon_dashboard_kel6',
   'athon',
   'Yhn837pLmB4',
    {
      host: 'p1.eventeer.id',
      dialect: 'mysql'
    }
  );

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});