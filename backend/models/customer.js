
export default (sequelize, DataTypes) => {
	const Customer = sequelize.define('Customer', {
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		simple_name: DataTypes.STRING
	});

	Customer.associate = ({Customer, Booking}) => {
		
	};

	return Customer;
};