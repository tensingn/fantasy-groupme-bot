import axios from "axios";
import { SecretService } from "../gcp/secret.service";

export class ChatService {
	private url: string = "https://api.groupme.com/v3/bots/post";
	private readonly secretService: SecretService;

	constructor() {
		this.secretService = new SecretService();
	}

	async sendMessage(message: string) {
		await axios
			.post(this.url, {
				bot_id: await this.secretService.getSecret("groupmebot-id"),
				text: message,
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
