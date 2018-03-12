
export default (sequelize, DataTypes) => {
	const Booking = sequelize.define('Booking', {
		start: DataTypes.DATEONLY,
		end: DataTypes.DATEONLY
	});

	Booking.associate = ({Booking, Item}) => {
		Booking.belongsTo(Item, {
			onDelete: 'CASCADE',
			foreignKey: {
				allowNull: false
			}
		});
	};

	return Booking;
};