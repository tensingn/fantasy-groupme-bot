import { Player } from "../../sleeper/models/player.model";
import { PlayerStatus } from "../enums/player-status.enum";
import { ConvertFromApiModel } from "../interfaces/convert-from-api-model.interface";
import { DataModel } from "./data-model.model";

export class PlayerDataModel
	extends DataModel
	implements ConvertFromApiModel<Player>
{
	firstName: string;
	lastName: string;
	fullName: string;
	positions: Array<string>;
	status: PlayerStatus;
	team: string;

	convertFromApiModel(player: Player): void {
		this.id = player.player_id;
		this.firstName = player.first_name;
		this.lastName = player.last_name;
		this.fullName = player.full_name;
		this.positions = player.fantasy_positions;
		this.status = PlayerDataModel.convertPlayerStatus(player.status);
		this.team = player.team;
	}

	static convertPlayerStatus(status: string): PlayerStatus {
		switch (status) {
			case "Active":
				return PlayerStatus.Active;
			case "Inactive":
				return PlayerStatus.Inactive;
			case "Injured Reserve":
				return PlayerStatus.InjuredReserve;
			case "Physically Unable to Perform":
				return PlayerStatus.PhysicallyUnableToPerform;
			case "Non Football Injury":
				return PlayerStatus.NonFootballInjury;
			default:
				return PlayerStatus.NotSet;
		}
	}
}
