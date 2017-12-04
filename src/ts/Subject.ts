export abstract class Subject {
    protected evs: { [string: string]: Observer };


    constructor() {
        this.evs = {};
    }

    public attach(e: string, o: Observer) {
        this.evs[e] = o;
    }

    public detach(e: string, o: Observer) {
        if (this.evs[e] === o) {
            this.evs[e] = null;
        }
    }

    public notify(e: string, data: any) {
        if (this.evs[e] != null) {
            this.evs[e].update(data);
        }
    }
}

export abstract class Observer {
    constructor() {
    }

    public abstract update(data: any);
}

export class WrapObserver extends Observer {
    private o: Observer;
    private a: any;


    constructor(o: Observer, a: any) {
        super();
        this.o = o;
        this.a = a;
    }

    update(data: any) {
        this.a(data);
        this.o.update(data);
    }
}