import {Resource} from "./Resource";
import {ResourceDescription} from "./ResourceDescription";

export class ResourcePool {
    private static _instance: ResourcePool;
    private _pool: Map<Resource, boolean> = new Map();

    private constructor() {
    }

    public static getInstance() {
        if (!ResourcePool._instance) {
            ResourcePool._instance = new ResourcePool();
        }
        return ResourcePool._instance;
    }

    public acquire(): Resource {
        for (let [res, acq] of this._pool.entries()) {
            if (!acq) {
                this._pool.set(res, true);
                return res;
            }
        }
        let res = new Resource(<ResourceDescription>{});
        this._pool.set(res, true);
        return res;
    }

    public release(res: Resource): void {
        res && this._pool.set(res, false);
    }
}