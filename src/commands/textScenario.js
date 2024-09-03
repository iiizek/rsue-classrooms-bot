import fs from "fs";

const mainBuild = JSON.parse(fs.readFileSync("./src/data/main-build.json"));

const scriptMessages = {
	numberCountValidation: () => {
		return "Номер аудитории должен содержать 3 цифры\nПопробуй еще раз🤨";
	},

	classroomNotFound: message => {
		return `Аудитория ${message} не найдена🤔\nПерепроверь введенный номер.`;
	},

	doNotUnderstand: () => {
		return "Извини, я не нейросеть, чтобы понимать контекст текстовых сообщений.\nПросто введи номер аудитории (Например, 251) и я тебе напишу информацию о ней😊";
	},

	unknownError: () => {
		return "Что-то пошло не так. Попробуй еще раз позже🪲";
	},

	default: (message, classroom) => {
		return `✨Информация по аудитории ${message}:\n\nКорпус: ${classroom.place}\nЭтаж: ${classroom.floor}\nКак найти? 👉 ${classroom.find}\n\nНадеюсь, я тебе помог😊`;
	},
};

const sendClassroomInfo = (ctx, message, classroom) => {
	const replyMessage = scriptMessages.default(message, classroom);

	// Если есть фото, отправляем его вместе с сообщением
	if (classroom.photoPath) {
		ctx.reply("Отправляю информацию, немного подождите...");
		return ctx.replyWithPhoto(
			{ source: classroom.photoPath },
			{ caption: replyMessage }
		);
	} else {
		return ctx.reply(replyMessage);
	}
};

const textScenario = (ctx, message) => {
	try {
		if (!isNaN(message)) {
			if (message.length !== 3) {
				return ctx.reply(scriptMessages.numberCountValidation());
			}

			// Проверка на то, что второй символ равен "5"
			if (message[1] === "5") {
				const classroom = mainBuild.find(
					item => item.classroomId === Number(message[0] + message[1])
				);

				if (classroom) {
					return sendClassroomInfo(ctx, message, classroom);
				} else {
					return ctx.reply(scriptMessages.classroomNotFound(message));
				}
			}

			// Magic code, don't touch
			const classroom = mainBuild.find(item => {
				try {
					if (item.classroomId.includes(Number(message))) {
						return true;
					}
				} catch (err) {
					return false;
				}
			});

			if (classroom) {
				return sendClassroomInfo(ctx, message, classroom);
			} else {
				return ctx.reply(scriptMessages.classroomNotFound(message));
			}
		} else {
			return ctx.reply(scriptMessages.doNotUnderstand());
		}
	} catch (err) {
		console.log("🪲 Произошла ошибка: ", err);
		return ctx.reply(scriptMessages.unknownError());
	}
};

export default textScenario;
