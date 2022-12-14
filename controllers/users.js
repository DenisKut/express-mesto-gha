const User = require('../models/user');

module.exports.getUsers = (req, res) => {
	User.find({})
		.then(users =>
			res.send({ data:users }))
		.catch(error =>{
			res.status(500)
				.send({message: 'Ошибка выполнения запроса на сервере'});
			});
};

module.exports.getUserById = (req, res) => {
	const {userId} = req.params;
	User.findById(userId)
		.then(user => {
			if(!user) {
				res.status(404)
					.send({message: 'Данный пользователь не найден'});
				return;
			}
			res.send(user);
		})
		.catch(error => {
			if(error.name === 'CastError') {
				res.status(400)
					.send({message: 'Проверьте корректность введённых данных'});
			} else {
				res.status(500)
					.send({message: 'Ошибка выполнения запроса на сервере'});
			}
		});
};

module.exports.createUser = (req, res) => {
	const { name, about, avatar } = req.body;
	User.create({ name, about, avatar })
		.then(user => {
			res.send(user)
		})
		.catch(error => {
			if(error.name === 'ValidationError') {
				res.status(400)
					.send({message: 'Проверьте корректность введённых данных'});
				} else {
					res.status(500)
						.send({message: 'Ошибка выполнения запроса на сервере'});
				}
		});
};

module.exports.updateProfileUser = (req, res) => {
	const { name, about } = req.body;
  User.findOneAndUpdate(
    req.user._id,
    { name, about },
    { new: true }
  )
  .then(user => {
		if(!user) {
			res.status(404)
				.send({message: 'Данный пользователь не найден'});
			return;
		}
		res.send(user);
	})
	.catch(error => {
		if(error.name === 'ValidationError') {
			res.status(400)
				.send({message: 'Проверьте корректность введённых данных'});
		} else {
			res.status(500)
				.send({message: 'Ошибка выполнения запроса на сервере'});
		}
	});
};

module.exports.updateAvatarUser = (req, res) => {
	const {avatar} = req.body;
	User.findByIdAndUpdate(
		req.user._id,
    { avatar },
    { new: true }
	)
	.then(user => {
		if(!user) {
			res.status(404)
				.send({message: 'Данный пользователь не найден'});
			return;
		}
		res.send(user);
	})
	.catch(error => {
		if(error.name === 'ValidationError') {
			res.status(400)
				.send({message: 'Проверьте корректность введённых данных'});
		} else {
			res.status(500)
				.send({message: 'Ошибка выполнения запроса на сервере'});
		}
	});
}
