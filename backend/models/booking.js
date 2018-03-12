
export default (sequelize, DataTypes) => {
	return sequelize.define('Booking', {
		start: DataTypes.DATE,
		end: DataTypes.DATE
	});
};