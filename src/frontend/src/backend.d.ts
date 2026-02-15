import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AttMonth {
    cl: bigint;
    da: number;
    el: bigint;
    pf: number;
    sl: bigint;
    esi: number;
    weekoff: bigint;
    staffName: string;
    otherAllowances: number;
    salaryAdvance: number;
    present: bigint;
    totalDays: bigint;
    grossPay: number;
    absent: bigint;
    basic: number;
    monthYear: string;
}
export interface UserProfile {
    name: string;
    email: string;
    department: string;
}
export interface Staff {
    da: number;
    name: string;
    designation: string;
    otherAllowance: number;
    basic: number;
    mobile: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addStaff(name: string, mobile: string, designation: string, basic: number, da: number, otherAllowance: number): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    finalizeSalary(staffId: string): Promise<void>;
    getAttMonth(name: string): Promise<AttMonth | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNetPay(key: string): Promise<number>;
    getStaff(from: bigint, to: bigint): Promise<Array<Staff>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    saveAttMonth(staffName: string, monthYear: string, absent: bigint, cl: bigint, el: bigint, sl: bigint, present: bigint, weekoff: bigint, totalDays: bigint, pf: number, esi: number, grossPay: number, salaryAdvance: number, basic: number, da: number, otherAllowances: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
