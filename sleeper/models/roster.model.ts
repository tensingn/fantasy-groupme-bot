import { RosterSettings } from "./roster-settings.model";

export class Roster {
	starters: Array<string>;
	settings: RosterSettings;
	roster_id: number;
	players: Array<string>;
	owner_id: string;
}
