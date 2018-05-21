
export default (sequelize, DataTypes) => {
	const Item = sequelize.define('User', {
		name: DataTypes.STRING,
		username: { type: DataTypes.STRING, unique: true },
		password: DataTypes.STRING
	});

	return Item;
};