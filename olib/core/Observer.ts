///<reference path="AsyncQue.ts" />
module olib {
    export interface IObserver {
        on(type:string, handler:Function):void;
        off(type:string, handler:Function):void;
        trigger(type:string, data:any):void;
    }

    export class Observer implements IObserver {

        private listeners:any;

	    constructor() {
		    this.listeners = {};
	    }

        protected getListener(type:string):Function[] {
	        if(!this.listeners[type])this.listeners[type] = []
            return this.listeners[type];
        }

        protected contain(type:string, handler:Function):boolean {
            return this.getListener(type).indexOf(handler) != -1;
        }

        on(type:string, handler:Function):void {
            this.getListener(type).push(handler);
        }

        off(type:string, handler:Function = null):void {
            if (!handler) {
                this.listeners[type] = [];
                return;
            }

            if (!this.contain(type, handler)) {
                return;
            }

            var list = this.getListener(type);
            for (var i = 0; i < list.length; i++) {
                if (list[i] == handler) {
                    list.splice(i, 1);
                    return;
                }
            }
        }

        trigger(type:string, data:any = null):void {
            var sender = {type: type, data: data, currentTarget:this};
            this.getListener(type).forEach(function (hanlder) {
                try {
                    hanlder(sender);
                } catch (error) {
                    if (window["console"]) {
                        console.error(error.stack);
                    }
                }
            });
            this.calledTrigger(type, data);
        }

        protected calledTrigger(type:string, data:any):void {

        }

        lazyTrigger(type:string, data:any = null, queID:string = null):void {
            var now = Date.now();
            async(()=> {
                this.trigger(type, data)
            }, queID);
        }
    }
}