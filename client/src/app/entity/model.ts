
export interface LogResponse {
  countries: { [country: string]: number };
  browsers: { [browser: string]: number };
  operatingSystems: { [os: string]: number };
  dayAndTime: { [day: string]: { [time: string]: number } };
}
