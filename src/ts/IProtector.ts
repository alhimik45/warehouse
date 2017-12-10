import {IResourceApplicator} from "./IResourceApplicator";
import {BadFactorDescription} from "./BadFactorDescription";
import {IComparable} from "./IComparable";
import {Visitor} from "./Visitor";
import {Cell} from "./Cell";

//Защитное средство можно применить к месту склада и оно имеет цену
export interface IProtector extends IResourceApplicator, IComparable {
    readonly cost: number;
    readonly damage: number;
    readonly name: string;
    readonly goodAgainst: Array<BadFactorDescription>;
    accept(v: Visitor): string;
}

export abstract class ChainedProtector implements IProtector {
    _next: ChainedProtector;


    constructor(next: ChainedProtector) {
        this._next = next;
    }

    abstract accept(v: Visitor): string;

    get compareCriteria(){
        return 1000;
    }

    get cost() {
        let n = this._next && this._next.cost || 0;
        return this.chainedCost() + n;
    }

    get damage() {
        return "Особый";
    }

    get name(){
        let n = this._next && this._next.name || null;
        if(n == null){
            return this.chainedName();
        }
        return this.chainedName() +", " + n;
    }

    abstract get chainedName();

    get goodAgainst() {
        return [];
    };

    abstract chainedCost();

    canApply(cell: Cell): boolean {
        if (this.canApplyChainMember(cell))
            return true;
        return this._next && this._next.canApply(cell);
    }

    abstract canApplyChainMember(cell: Cell): boolean;

    apply(cell: Cell): void {
        if (this.canApplyChainMember(cell))
            this.applyChainMember(cell);
        if (this._next)
            this._next.apply(cell);
    }

    abstract applyChainMember(cell: Cell): void;
}

export class FullHpDestroyer extends ChainedProtector {
    accept(v: Visitor): string {
        return v.visitFullHpDestroyer(this);
    }

    chainedName() {
        return "Уничтожает фактор с полным здоровьем"
    }

    chainedCost() {
        return 50;
    }

    canApplyChainMember(cell: Cell): boolean {
        return cell.badFactor && cell.badFactor.hitPoints == cell.badFactor.description.hitPoints;
    }

    applyChainMember(cell: Cell): void {
        cell.badFactor = null;
    }
}

export class BrickSaver extends ChainedProtector {
    accept(v: Visitor): string {
        return v.visitBrickSaver(this);
    }

    chainedName() {
        return "Уничтожает всё, что вредит кирпичам"
    }

    chainedCost() {
        return 30;
    }

    canApplyChainMember(cell: Cell): boolean {
        return cell.resource.description.name == "Кирпич";
    }

    applyChainMember(cell: Cell): void {
        cell.badFactor = null;
    }
}

export class LowHper extends ChainedProtector {
    accept(v: Visitor): string {
        return v.visitLowHper(this);
    }

    chainedName() {
        return "Делает ХП любого фактора равным одному";
    }

    chainedCost() {
        return 50;
    }

    canApplyChainMember(cell: Cell): boolean {
        return true;
    }

    applyChainMember(cell: Cell): void {
        if (cell.badFactor)
            cell.badFactor.hitPoints = 1;
    }
}