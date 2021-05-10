export interface IShareholder {
  row?: number;
  identityNumber: string;
  fullName: string;
  isDirector: boolean;
  sharePercentage: number;
  capital: number;
}

export enum ShareholderEnum {
  IdentityNumber = "identityNumber",
  FullName = "fullName",
  IsDirector = "isDirector",
  SharePercentage = "sharePercentage",
  Capital = "capital",
}
