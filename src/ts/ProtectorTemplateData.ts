import {IProtector} from "./IProtector";

export class ProtectorTemplateData {
    public can: boolean;
    public protector: IProtector;
    public protector_id: number;


    constructor(can: boolean, protector: IProtector, protector_id: number) {
        this.can = can;
        this.protector = protector;
        this.protector_id = protector_id;
    }
}