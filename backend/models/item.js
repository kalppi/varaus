
export default (sequelize, DataTypes) => {
	const Item = sequelize.define('Item', {
		name: DataTypes.STRING
	});

	return Item;
};