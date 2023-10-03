import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export class SecretService {
	private readonly client: SecretManagerServiceClient;

	constructor() {
		this.client = new SecretManagerServiceClient({
			projectId: "nicks-fun-random-projects",
			keyFilename: "./key.json",
		});
	}

	async getSecret(secretName: string): Promise<string> {
		const secretStuff = await this.client.accessSecretVersion({
			name: `projects/nicks-fun-random-projects/secrets/${secretName}/versions/latest`,
		});

		const secret = secretStuff[0].payload?.data?.toString();

		if (!secret) {
			throw new Error("couldn't get secret");
		}

		return secret;
	}
}
