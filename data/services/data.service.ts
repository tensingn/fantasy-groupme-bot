import { Firestore } from "@google-cloud/firestore";
import { Player } from "../../sleeper/models/player.model";
import { PlayerDataModel } from "../models/player.data.model";
import { DataModel } from "../models/data-model.model";

export class DataService {
	private db: Firestore;

	private readonly PLAYERS: string = "players";

	constructor() {
		this.db = new Firestore({
			projectId: "nicks-fun-random-projects",
			keyFilename: "./key.json",
			ignoreUndefinedProperties: true,
		});
	}

	async addUsers() {
		const docRef = this.db.collection("users").doc("alovelace");

		await docRef.set({
			first: "Ada",
			last: "Lovelace",
			born: 1815,
		});
	}

	async addPlayers(players: Array<Player>) {
		const playerDataModels = players.map<PlayerDataModel>((player) => {
			const playerDataModel = new PlayerDataModel();
			playerDataModel.convertFromApiModel(player);
			return playerDataModel;
		});

		//this.batchAdd(this.PLAYERS, playerDataModels);
		this.batchAddReadFirst(this.PLAYERS, playerDataModels);
	}

	async getNumPlayers(): Promise<number> {
		return (await this.db.collection(this.PLAYERS).count().get()).data()
			.count;
	}

	// not sure yet, but this might be WORSE than batch add read first
	private async batchAdd(collectionName: string, data: Array<DataModel>) {
		const writer = this.db.bulkWriter();
		data.forEach((entity) => {
			const docRef = this.db.collection(collectionName).doc(entity.id);
			writer.create(docRef, Object.assign({}, entity));
		});
		writer.close().then((res) => {
			console.log(res);
		});
	}

	// not sure yet, but this might be better than batch add
	private async batchAddReadFirst(
		collectionName: string,
		data: Array<DataModel>
	) {
		const writer = this.db.bulkWriter();
		const existingData: Array<DataModel> = (
			await this.db.collection(collectionName).get()
		).docs.map((doc) => doc.data() as DataModel);
		data.forEach(async (entity) => {
			const docRef = this.db.collection(collectionName).doc(entity.id);
			if (!existingData.some((d) => d.id == entity.id)) {
				writer.set(docRef, Object.assign({}, entity));
			}
		});
		writer.close().then((res) => {
			console.log(res);
		});
	}
}
