import {IResourceApplicator} from "./IResourceApplicator";
import {BadFactorDescription} from "./BadFactorDescription";
import {IComparable} from "./IComparable";

//Защитное средство можно применить к месту склада и оно имеет цену
export interface IProtector extends IResourceApplicator, IComparable {
    readonly cost: number;
    readonly damage: number;
    readonly name: string;
    readonly goodAgainst: Array<BadFactorDescription>;
}