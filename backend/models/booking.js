
export default (sequelize, DataTypes) => {
	const Booking = sequelize.define('Booking', {
		start: DataTypes.DATEONLY,
		end: DataTypes.DATEONLY,
		search_data: DataTypes.ARRAY(DataTypes.STRING)
	});

	Booking.associate = ({Booking, Item, User}) => {
		Booking.belongsTo(Item, {
			onDelete: 'CASCADE',
			foreignKey: {
				allowNull: false
			}
		});

		Booking.belongsTo(User, {
			onDelete: 'CASCADE',
			foreignKey: {
				allowNull: true
			}
		});
	};

	return Booking;
};