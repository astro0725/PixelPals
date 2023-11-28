module.exports = (sequelize, DataTypes) => {
    class Post extends sequelize.Sequelize.Model {}
    Post.init({
        firebaseUserId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Post'
    });
    return Post;
};