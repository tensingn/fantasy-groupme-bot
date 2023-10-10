import OpenAI from "openai";
import { SecretService } from "../gcp/secret.service";

export class GPTService {
	private openAI: OpenAI;
	private readonly secretService: SecretService;

	constructor() {
		this.secretService = new SecretService();
	}

	async getResponse(prompt: string): Promise<string | null> {
		this.openAI = new OpenAI({
			apiKey: await this.secretService.getSecret("openai-key"),
		});

		const res = await this.openAI.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.8,
			max_tokens: 128,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});
		return res.choices[0]?.message?.content;
	}
}
