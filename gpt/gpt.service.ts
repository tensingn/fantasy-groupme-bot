import OpenAI from "openai";

export class GPTService {
	private readonly openAI: OpenAI;

	constructor() {
		this.openAI = new OpenAI({
			apiKey: "the api key",
		});
	}

	async getResponse(prompt: string): Promise<string | null> {
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
