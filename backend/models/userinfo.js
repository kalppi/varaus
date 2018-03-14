
export default (sequelize, DataTypes) => {
	const UserInfo = sequelize.define('UserInfo', {
		name: DataTypes.STRING,
		email: DataTypes.STRING
	});

	UserInfo.associate = ({UserInfo, Booking}) => {
		/*UserInfo.hasOne(Booking, {
			onDelete: 'CASCADE',
			foreignKey: {
				allowNull: true
			}
		});*/
	};

	return UserInfo;
};