
export default (sequelize, DataTypes) => {
	const UserInfo = sequelize.define('UserInfo', {
		name: DataTypes.STRING,
		email: DataTypes.STRING
	});

	UserInfo.associate = ({UserInfo, Booking}) => {
		
	};

	return UserInfo;
};