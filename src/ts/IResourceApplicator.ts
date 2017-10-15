import {Cell} from "./Cell";

//Что-то, что может быть применено к месту склада
export interface IResourceApplicator {
    canApply(cell: Cell): boolean;
    apply(cell: Cell): void;
}