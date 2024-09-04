import dotenv from "dotenv";
import { Telegraf, Markup } from "telegraf";
import fs from "fs";

import textScenario from "./commands/textScenario.js";
import { buttonReplies } from "./commands/mainBuildKeyboard.js";
import spamProtection from "./middlewares/spamProtection.js";

dotenv.config();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const mainBuild = JSON.parse(fs.readFileSync("./src/data/main-build.json"));

bot.use(spamProtection);

bot.start(async ctx => {
	ctx.reply(
		"Привет, студент!👋\nЯ специальный бот, который поможет тебе найти аудиторию главного корпуса в нашем университете.\n\n*Введи номер аудитории (например, 251), который тебя интересует* или нажми на одну из кнопок😊",
		Markup.inlineKeyboard([
			[
				Markup.button.callback("Спортзал 🏅", "sport"),
				Markup.button.callback("Точка кипения 🔥", "tochka"),
			],
			[
				Markup.button.callback("Актовый зал 🎭", "actoviy"),
				Markup.button.callback("Студенческий совет ❤️‍🔥", "studentCouncil"),
			],
		])
	);
});

bot.on("text", ctx => {
	const message = ctx.message.text;
	textScenario(ctx, message);
});

bot.action("sport", ctx => {
	ctx.reply(buttonReplies.sport);
});

bot.action("tochka", ctx => {
	ctx.reply(buttonReplies.tochka);
});

bot.action("actoviy", ctx => {
	ctx.reply(buttonReplies.actoviy);
});

bot.action("studentCouncil", ctx => {
	ctx.reply(buttonReplies.studentCouncil, { parse_mode: "Markdown" });
});

bot
	.launch()
	.then(() => console.log("Бот успешно запущен! 🚀"))
	.catch(error => console.error("🪲 Ошибка запуска бота:", error));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default bot;
