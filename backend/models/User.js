const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const TodoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    active: { type: Boolean, default: true },
  });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  todos:[{ type: TodoSchema }]
});

UserSchema.methods.hashPassword = function () {
    return bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  };
  
  UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

module.exports = mongoose.model('Users', UserSchema);