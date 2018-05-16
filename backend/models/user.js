
export default (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		simple_name: DataTypes.STRING
	});

	User.associate = ({User, Booking}) => {
		
	};

	return User;
};