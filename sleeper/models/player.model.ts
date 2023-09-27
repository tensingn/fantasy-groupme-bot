import { PlayerStatus } from "../../data/enums/player-status.enum";
import { PlayerDataModel } from "../../data/models/player.data.model";

export class Player {
	player_id: string;
	status: string;
	fantasy_positions: Array<string>;
	last_name: string;
	first_name: string;
	full_name: string;
	team: string;
}

/*
        "status": "Active",
        "stats_id": null,
        "practice_description": null,
        "birth_city": null,
        "injury_notes": null,
        "position": "QB",
        "sport": "nfl",
        "birth_date": "1996-12-10",
        "injury_body_part": "Calf",
        "swish_id": 878785,
        "team": "CIN",
        "rotowire_id": 14442,
        "fantasy_positions": [
            "QB"
        ],
        "years_exp": 3,
        "sportradar_id": "3023ac10-4e7f-425f-9fc5-2b8e6332c92e",
        "practice_participation": null,
        "birth_state": null,
        "espn_id": 3915511,
        "yahoo_id": 32671,
        "search_full_name": "joeburrow",
        "injury_status": "Questionable",
        "high_school": "Athens (OH)",
        "depth_chart_position": "QB",
        "height": "76",
        "fantasy_data_id": 21693,
        "depth_chart_order": 1,
        "rotoworld_id": 14863,
        "age": 26,
        "news_updated": 1695571811038,
        "last_name": "Burrow",
        "injury_start_date": null,
        "search_first_name": "joe",
        "number": 9,
        "pandascore_id": null,
        "college": "LSU",
        "search_rank": 14,
        "birth_country": null,
        "hashtag": "#joeburrow-NFL-CIN-9",
        "active": true,
        "player_id": "6770",
        "search_last_name": "burrow",
        "first_name": "Joe",
        "weight": "215",
        "metadata": null,
        "full_name": "Joe Burrow",
        "oddsjam_id": "26DF8843FD11",
        "gsis_id": null
 */
