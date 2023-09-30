import { Roster } from "../../sleeper/models/roster.model";
import { User } from "../../sleeper/models/user.model";
import { ConvertFromApiModels } from "../interfaces/convert-from-api-models.interface";
import { DataModel } from "./data-model.model";
import { PlayerDataModel } from "./player.data.model";

export class TeamDataModel
	extends DataModel
	implements ConvertFromApiModels<[User, Roster]>
{
	// id is ownerID
	username: string;
	displayName: string;
	wins: number;
	losses: number;
	pointsFor: number;
	pointsAgainst: number;
	players: PlayerDataModel[];
	starters: PlayerDataModel[];
	rosterId: number;

	convertFromApiModels(user: User, roster: Roster): void {
		this.id = user.user_id;
		this.username = user.username;
		this.displayName = user.display_name;

		this.addRoster(roster);
	}

	addRoster(roster: Roster) {
		this.rosterId = roster.roster_id;
		this.wins = roster.settings.wins;
		this.losses = roster.settings.losses;
		this.pointsFor = roster.settings.fpts;
		this.pointsAgainst = roster.settings.fpts_against;
		this.players = roster.players.map<PlayerDataModel>((player) => {
			const playerDataModel = new PlayerDataModel();
			playerDataModel.id = player;
			return playerDataModel;
		});
		this.starters = roster.starters.map<PlayerDataModel>((player) => {
			const playerDataModel = new PlayerDataModel();
			playerDataModel.id = player;
			return playerDataModel;
		});
	}
}
