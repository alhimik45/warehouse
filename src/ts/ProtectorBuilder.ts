import {BadFactorDescription} from "./BadFactorDescription";
import {Protector} from "./Protector";

export class ProtectorBuilder {
    private _name: string;
    private _goodAgainst: Array<BadFactorDescription>;
    private _cost: number;
    private _damage: number;

    constructor() {
        this._name = "";
        this._cost = 0;
        this._damage = 0;
        this._goodAgainst = [];
    }

    public setName(name: string): ProtectorBuilder {
        this._name = name;
        return this;
    }

    public setCost(cost: number): ProtectorBuilder {
        this._cost = cost || 1;
        return this;
    }

    public setDamage(damage: number): ProtectorBuilder {
        this._damage = damage || 10;
        return this;
    }

    public addBadFactor(factor: BadFactorDescription): ProtectorBuilder {
        this._goodAgainst.push(factor);
        return this;
    }

    public build(): Protector {
        return new Protector(this._name, this._cost, this._damage, this._goodAgainst)
    }
}