const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Thought = db.define('thought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
})

// usado para definir uma associação de "um para um" ou "um para muitos", onde um modelo pertence a outro modelo.
Thought.belongsTo(User)
// usado para definir uma associação de "um para muitos", onde um modelo pode ter vários outros modelos associados a ele.
User.hasMany(Thought)

module.exports = Thought