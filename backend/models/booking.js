
export default (sequelize, DataTypes) => {
	const Booking = sequelize.define('Booking', {
		start: DataTypes.DATEONLY,
		end: DataTypes.DATEONLY
	});

	Booking.associate = ({Booking, Item, UserInfo}) => {
		Booking.belongsTo(Item, {
			onDelete: 'CASCADE',
			foreignKey: {
				allowNull: false
			}
		});

		Booking.belongsTo(UserInfo, {
			onDelete: 'CASCADE',
			foreignKey: {
				allowNull: true
			}
		});
	};

	return Booking;
};