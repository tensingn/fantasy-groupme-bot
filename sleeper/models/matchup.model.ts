import { TeamWeek } from "./team-week.model";

export class Matchup {
	matchupId: number;

	private _teamWeeks: Array<TeamWeek>;
	set teamWeeks(teamWeeks: Array<TeamWeek>) {
		if (teamWeeks.length != 2) {
			throw new Error("Matchups can only have 2 TeamWeeks.");
		}
		this._teamWeeks = teamWeeks;
	}
	get teamWeeks(): Array<TeamWeek> {
		return this._teamWeeks;
	}

	addTeamWeek(teamWeek: TeamWeek) {
		if (this._teamWeeks.length > 1) {
			throw new Error("Matchups can only have 2 team weeks.");
		}
		this._teamWeeks.push(teamWeek);
	}

	constructor() {
		this._teamWeeks = new Array<TeamWeek>();
	}
}
