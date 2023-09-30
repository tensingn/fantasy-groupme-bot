import axios from "axios";

export class ChatService {
	private id: string = "bot id";
	private url: string = "https://api.groupme.com/v3/bots/post";

	async sendMessage(message: string) {
		await axios.post(this.url, {
			bot_id: this.id,
			text: message,
		});
	}
}
