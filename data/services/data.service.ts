import { Firestore } from "@google-cloud/firestore";
import { Player } from "../../sleeper/models/player.model";
import { PlayerDataModel } from "../models/player.data.model";
import { DataModel } from "../models/data-model.model";
import { Roster } from "../../sleeper/models/roster.model";
import { TeamDataModel } from "../models/team.data.model";

export class DataService {
	private db: Firestore;

	private readonly PLAYERS: string = "players";

	private readonly TEAMS: string = "teams";

	constructor() {
		this.db = new Firestore({
			projectId: "nicks-fun-random-projects",
			keyFilename: "./key.json",
			ignoreUndefinedProperties: true,
		});
	}

	async updateRosters(rosters: Array<Roster>) {
		const updateEntities: Array<UpdateEntity> = await Promise.all(
			rosters.map<Promise<UpdateEntity>>(async (roster) => {
				const ue = new UpdateEntity();
				ue.id = roster.owner_id;

				const players = await Promise.all(
					roster.players.map<Promise<PlayerDataModel>>(
						async (player) => {
							const playerData = await this.get<PlayerDataModel>(
								this.PLAYERS,
								player
							);
							const playerDataModel = Object.assign(
								new TeamDataModel(),
								playerData
							);
							return playerDataModel;
						}
					)
				);

				const starters = await Promise.all(
					roster.starters.map<Promise<PlayerDataModel>>(
						async (starter) => {
							const playerData = await this.get<PlayerDataModel>(
								this.PLAYERS,
								starter
							);
							const playerDataModel = Object.assign(
								new TeamDataModel(),
								playerData
							);
							return playerDataModel;
						}
					)
				);

				ue.updateData = { players, starters };

				return ue;
			})
		);

		await this.batchUpdate(this.TEAMS, updateEntities);
	}

	async addPlayers(players: Array<Player>) {
		const playerDataModels = players.map<PlayerDataModel>((player) => {
			const playerDataModel = new PlayerDataModel();
			playerDataModel.convertFromApiModel(player);
			return playerDataModel;
		});

		this.batchAddReadFirst(this.PLAYERS, playerDataModels);
	}

	async getTeam(id: string): Promise<TeamDataModel> {
		const teamData = await this.get(this.TEAMS, id);
		const teamDataModel = Object.assign(new TeamDataModel(), teamData);
		return teamDataModel;
	}

	async getTeamByRosterId(id: number): Promise<TeamDataModel> {
		const teamData = (
			await this.getByProperty<TeamDataModel>(this.TEAMS, {
				key: "rosterId",
				value: id,
			})
		)[0];
		const teamDataModel = Object.assign(new TeamDataModel(), teamData);
		return teamDataModel;
	}

	private async batchUpdate(
		collectionName: string,
		updateEntities: Array<UpdateEntity>
	) {
		const writer = this.db.bulkWriter();
		updateEntities.forEach((entity) => {
			const docRef = this.db.collection(collectionName).doc(entity.id);
			writer.update(
				docRef,
				JSON.parse(JSON.stringify(entity.updateData))
			);
		});
		writer.close().then((res) => {
			console.log(res);
		});
	}

	private async get<T extends DataModel>(
		collectionName: string,
		id: string
	): Promise<T> {
		const docRef = this.db.collection(collectionName).doc(id);
		const obj: T = (await docRef.get()).data() as T;
		return obj;
	}

	private async getByProperty<T extends DataModel>(
		collectionName: string,
		property: { key: string; value: any }
	): Promise<T[]> {
		const docRef = this.db
			.collection(collectionName)
			.where(property.key, "==", property.value);
		const docs = (await docRef.get()).docs;
		const values = docs.map((doc) => doc.data() as T);
		return values;
	}

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
				writer.set(docRef, JSON.parse(JSON.stringify(entity)));
			}
		});

		writer.close().then((res) => {
			console.log(res);
		});
	}
}

class UpdateEntity {
	id: string;
	updateData: any;
}
