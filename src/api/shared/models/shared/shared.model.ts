export interface ICountryMetaData {
	name: string;
	code: string;
	id: number;
	isdCode: string;
	symbol: string;
	capital: string;
	currency: string;
	continent: string;
	continent_code: string;
	alpha_3: string;
}

export interface IStaticMapParams {
	latitude: string;
	longitude: string;
}


export interface IGoogleMapParams {
	latitude: string;
	longitude: string;
}
