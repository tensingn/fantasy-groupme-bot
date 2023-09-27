export class TeamWeek {
	starters_points: number;
	starters: Array<string>;
	roster_id: number;
	points: number;
	players_points: { [id: string]: number };
	players: Array<number | string>;
	matchup_id: number;
	custom_points: number | null;
}
