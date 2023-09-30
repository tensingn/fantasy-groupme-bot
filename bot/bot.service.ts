import { TeamDataModel } from "../data/models/team.data.model";
import { DataService } from "../data/services/data.service";
import { ChatService } from "../groupme/chat.service";
import { Matchup } from "../sleeper/models/matchup.model";
import { Players } from "../sleeper/models/players.model";
import { Roster } from "../sleeper/models/roster.model";
import { TeamWeek } from "../sleeper/models/team-week.model";
import { SleeperService } from "../sleeper/services/sleeper.service";

export class Bot {
	private sleeperService: SleeperService;
	private dataService: DataService;
	private chatService: ChatService;
	private readonly dursoId: string = "385344449577971712";

	constructor() {
		this.sleeperService = new SleeperService();
		this.dataService = new DataService();
		this.chatService = new ChatService();
	}

	async runWeek() {
		// get current week
		const week = (await this.getCurrentWeek()) - 1;

		// get durso team
		const durso = await this.getTeam(this.dursoId);

		// get matchhups from sleeper
		const matchups = await this.getMatchupsByWeek(week);

		// store matchup results

		// find durso matchup
		const dursoMatchup = matchups.find((matchup) =>
			matchup.teamWeeks.some(
				(teamWeek) => teamWeek.roster_id === durso.rosterId
			)
		);

		// determine duro win/loss
		const dursoTeamWeek: TeamWeek = dursoMatchup?.teamWeeks.find(
			(teamWeek) => teamWeek.roster_id === durso.rosterId
		)!;
		const otherTeamWeek: TeamWeek = dursoMatchup?.teamWeeks.find(
			(teamWeek) => teamWeek.roster_id != durso.rosterId
		)!;
		const dursoLoss = dursoTeamWeek.points < otherTeamWeek.points;

		// if loss, send message (eventually from ai chatbot)
		if (dursoLoss) {
			this.chatService.sendMessage("durso lost1");
		}
	}

	async runGetPlayers() {
		await this.downloadAllPlayers();
	}

	async runUpdateRosters() {
		await this.updateRosters();
	}

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

	private async getAllPlayers(): Promise<Players> {
		return await this.sleeperService.getAllPlayers();
	}

	// DATA SERVICE METHODS

	async downloadAllPlayers() {
		const players = await this.getAllPlayers();
		this.dataService.addPlayers(Object.values(players));
	}

	private async updateRosters() {
		const rosters = await this.getRosters();
		this.dataService.updateRosters(rosters);
	}

	private async getTeam(id: string): Promise<TeamDataModel> {
		return await this.dataService.getTeam(id);
	}
}
