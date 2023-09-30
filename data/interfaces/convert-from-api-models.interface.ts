export interface ConvertFromApiModels<TApiModel extends any[]> {
	convertFromApiModels(...apiModels: TApiModel): void;
}
