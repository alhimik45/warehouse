import {IProtector} from "./IProtector";
import {BadFactorDescription} from "./BadFactorDescription";
import {Cell} from "./Cell";
import {Resource} from "./Resource";
import {Visitor} from "./Visitor";


export class ResourceProtectorAdapter implements IProtector {
    private _resource: Resource;

    constructor(resource: Resource) {
        this._resource = resource;
    }

    canApply(cell: Cell): boolean {
        return true;
    }

    apply(cell: Cell): void {
        let damage = this.damage;
        this._resource.quality -= damage;
        cell.badFactor.hitPoints -= damage;
        if (cell.badFactor.hitPoints <= 0) {
            cell.badFactor = null;
        }
    }

    get cost(): number {
        return 0;
    }

    get damage(): number {
        return Math.floor(this._resource.quality / 2);
    }

    get name(): string {
        return this._resource.description.name;
    }

    get goodAgainst(): Array<BadFactorDescription> {
        return [];
    }

    get compareCriteria(): number {
        return this.damage;
    }

    accept(v: Visitor) {
        return v.visitResourceProtector(this);
    }
}