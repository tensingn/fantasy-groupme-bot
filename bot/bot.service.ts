import { TeamDataModel } from "../data/models/team.data.model";
import { DataService } from "../data/services/data.service";
import { GPTService } from "../gpt/gpt.service";
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
	private gptService: GPTService;
	private readonly dursoId: string = "385344449577971712";
	private readonly prompt: string =
		"I am in a fantasy football league. TeamA lost last week's matchup against TeamB. Write a snarky click-bait sounding headline about TeamA losing to TeamB.";

	constructor() {
		this.sleeperService = new SleeperService();
		this.dataService = new DataService();
		this.chatService = new ChatService();
		this.gptService = new GPTService();
	}

	async runWeek() {
		// get current week
		const week = (await this.getCurrentWeek()) - 1;

		// get durso team
		const durso = await this.getTeamByOwnerId(this.dursoId);

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
			// get other team
			const otherTeam = await this.getTeamByRosterId(
				otherTeamWeek.roster_id
			);

			const prompt = this.prompt
				.replaceAll("TeamA", durso.displayName)
				.replaceAll("TeamB", otherTeam.displayName);

			const message = await this.gptService.getResponse(this.prompt);
			this.chatService.sendMessage(message ?? "durs lost this week!");
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

	private async getTeamByOwnerId(id: string): Promise<TeamDataModel> {
		return await this.dataService.getTeam(id);
	}

	private async getTeamByRosterId(id: number): Promise<TeamDataModel> {
		return await this.dataService.getTeamByRosterId(id);
	}
}
