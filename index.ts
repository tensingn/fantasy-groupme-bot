import { CloudEvent, Context } from "@google-cloud/functions-framework";
import { Bot } from "./bot/bot.service";

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.runBot = (event: CloudEvent<string>, context: Context) => {
	const dickBotkus = new Bot();
	dickBotkus.runWeek();
};
