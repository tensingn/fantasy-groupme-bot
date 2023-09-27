import { DataService } from "../data/services/data.service";
import { Matchup } from "../sleeper/models/matchup.model";
import { Players } from "../sleeper/models/players.model";
import { Roster } from "../sleeper/models/roster.model";
import { User } from "../sleeper/models/user.model";
import { SleeperService } from "../sleeper/services/sleeper.service";

export class Bot {
	private sleeperService: SleeperService;
	private dataService: DataService;

	constructor() {
		this.sleeperService = new SleeperService();
		this.dataService = new DataService();
	}

	async run() {}

	// SLEEPER SERVICE METHODS

	private async getCurrentWeek(): Promise<number> {
		return await this.sleeperService.getCurrentWeekNumber();
	}

	private async getMatchupsByWeek(week: number): Promise<Array<Matchup>> {
		return await this.sleeperService.getMatchupsByWeek(week);
	}

	private async getRosters(): Promise<Array<Roster>> {
		return await this.sleeperService.getRosters();
	}

	private async getUsers(): Promise<Array<User>> {
		return await this.sleeperService.getUsers();
	}

	private async getAllPlayers(): Promise<Players> {
		return await this.sleeperService.getAllPlayers();
	}

	// DATA SERVICE METHODS

	private async getNumPlayers(): Promise<number> {
		return await this.dataService.getNumPlayers();
	}

	async downloadAllPlayers() {
		const players = await this.getAllPlayers();
		const joeBurrowAndBengals = [players["6770"], players["CIN"]];
		this.dataService.addPlayers(Object.values(players));
	}
}
