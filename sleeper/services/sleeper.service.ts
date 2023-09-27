import axios from "axios";
import { Matchup } from "../models/matchup.model";
import { TeamWeek } from "../models/team-week.model";
import { Roster } from "../models/roster.model";
import { User } from "../models/user.model";
import { Players } from "../models/players.model";

export class SleeperService {
	static readonly LEAGUEID: string = "992215050884292608";

	constructor() {}

	async getCurrentWeekNumber(): Promise<number> {
		const res = await axios.get("https://api.sleeper.app/v1/state/nfl");

		return res.data.week;
	}

	async getMatchupsByWeek(week: number): Promise<Array<Matchup>> {
		const res = await axios.get<Array<TeamWeek>>(
			`https://api.sleeper.app/v1/league/${SleeperService.LEAGUEID}/matchups/${week}`
		);

		const teamWeeks = res.data;

		return this.arrangeMatchups(teamWeeks);
	}

	async getRosters(): Promise<Array<Roster>> {
		const res = await axios.get(
			`https://api.sleeper.app/v1/league/${SleeperService.LEAGUEID}/rosters`
		);

		return res.data;
	}

	async getUsers(): Promise<Array<User>> {
		const res = await axios.get(
			`https://api.sleeper.app/v1/league/${SleeperService.LEAGUEID}/users`
		);

		return res.data;
	}

	// THIS PULLS DOWN ALL PLAYERS (5MB) FROM API.
	// ONLY USE IF ABSOLUTELY NECESSARY.
	//
	// FROM SLEEPER DOCS:
	// You should save this information on your own servers as this is not intended to be
	// called every time you need to look up players due to the filesize being close to 5MB in size.
	// You do not need to call this endpoint more than once per day.
	async getAllPlayers(): Promise<Players> {
		const res = await axios.get<Players>(
			"https://api.sleeper.app/v1/players/nfl"
		);

		return res.data;
	}

	private arrangeMatchups(teamWeeks: Array<TeamWeek>): Array<Matchup> {
		const matchups = new Array<Matchup>();

		teamWeeks.forEach((teamWeek) => {
			let matchup = matchups.find(
				(m) => m.matchupId === teamWeek.matchup_id
			);

			if (!matchup) {
				matchup = new Matchup();
				matchup.matchupId = teamWeek.matchup_id;
				matchups.push(matchup);
			}

			matchup.addTeamWeek(teamWeek);
		});

		return matchups;
	}
}
