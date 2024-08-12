module.exports = (sequelize, DataTypes) => {
  const Tasks = sequelize.define('Tasks', {
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'tasks',
    timestamps: false, // Disable Sequelize's automatic timestamp fields
    underscored: true, // Use snake_case for column names
  });

  Tasks.associate = function(models) {
    Tasks.belongsTo(models.Users, { foreignKey: 'user_id' });
  };

  return Tasks;
};