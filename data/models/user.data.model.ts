import { User } from "../../sleeper/models/user.model";
import { ConvertFromApiModel } from "../interfaces/convert-from-api-model.interface";
import { DataModel } from "./data-model.model";
import { TeamDataModel } from "./team.data.model";

export class UserDataModel
	extends DataModel
	implements ConvertFromApiModel<User>
{
	userName: string;
	displayName: string;

	convertFromApiModel(user: User): void {
		this.id = user.user_id;
		this.userName = user.username;
		this.displayName = user.display_name;
	}
}
