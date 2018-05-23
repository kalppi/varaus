
export default (sequelize, DataTypes) => {
	const Item = sequelize.define('Item', {
		name: { type: DataTypes.STRING, allowNull: false },
		order: DataTypes.INTEGER
	});

	return Item;
};