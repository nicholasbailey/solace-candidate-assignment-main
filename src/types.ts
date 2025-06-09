export enum Degree {
    MD = "MD",
    DO = "PhD",
    PhD = "PhD",
    MSW = "MSW",
    PsyD = "PsyD",
}

export interface Advocate {
    firstName: string;
    lastName: string;
    city: string;
    degree: Degree;
    specialties: string[];
    yearsOfExperience: number;
    phoneNumber: string;
}