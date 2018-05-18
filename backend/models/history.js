
export default (sequelize, DataTypes) => {
	const History = sequelize.define('History', {
		type: DataTypes.STRING,
		data: DataTypes.JSONB
	});

	return History;
};