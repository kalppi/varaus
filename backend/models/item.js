
export default (sequelize, DataTypes) => {
	return sequelize.define('Item', {
		name: DataTypes.STRING
	});
};