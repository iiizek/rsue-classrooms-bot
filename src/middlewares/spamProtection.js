const TIME_WINDOW = 7 * 1000; //7 seconds
const MESSAGE_LIMIT = 5;
const BLOCK_DURATION = 60 * 5000;

const userMessages = new Map();
const blockedUsers = new Map();

const spamProtection = (ctx, next) => {
	const userId = ctx.from.id;
	const now = Date.now();

	// Проверка, заблокирован ли пользователь
	if (blockedUsers.has(userId)) {
		const blockEndTime = blockedUsers.get(userId);
		if (now < blockEndTime) {
			ctx.reply("Вы заблокированы за спам. Подождите 5 минут.");
			return; // Прекращаем дальнейшую обработку сообщений
		} else {
			blockedUsers.delete(userId); // Снимаем блокировку, если время прошло
		}
	}

	if (!userMessages.has(userId)) {
		userMessages.set(userId, []);
	}

	const timestamps = userMessages.get(userId);

	// Удаляем старые записи
	while (timestamps.length > 0 && timestamps[0] <= now - TIME_WINDOW) {
		timestamps.shift();
	}

	// Добавляем текущую временную метку
	timestamps.push(now);

	if (timestamps.length > MESSAGE_LIMIT) {
		// Пользователь превысил лимит сообщений - блокируем
		ctx.reply(
			"Вы слишком часто отправляете сообщения. Вы заблокированы на 5 минут."
		);
		blockedUsers.set(userId, now + BLOCK_DURATION);
		return; // Прекращаем дальнейшую обработку сообщений
	}

	return next();
};

export default spamProtection;
