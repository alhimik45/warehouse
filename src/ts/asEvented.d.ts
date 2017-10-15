interface IEventEmitter {
    call(proto:any):void;
    on(event:string, listener:(...args:any[]) => void) :void;
    emit(event:string, ...args:any[]):void;
}