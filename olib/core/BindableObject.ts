///<reference path="Observer.ts" />
///<reference path="Identifier.ts" />
module olib {
	export class BindableObject extends Observer {
		protected dataSource:any;
		protected changedProperties:any;
		protected identity:Identifier;
		constructor() {
			super();
			this.dataSource = {};
			this.changedProperties = {};
			this.identity = Identifier.create("olib.BindableObject");
		}

		protected setProperty(name, value) {
			if(this.dataSource[name] != value) {
				this.changedProperties[name] = true;
				this.dataSource[name] = value;
				this.lazyTrigger(name,null, this.identity.key(`.${name}_changed`));
				this.lazyTrigger("changed",null,this.identity.key(".change"));
			}
		}

		protected calledTrigger(type:string, data:any):void {
			if(type == "changed") {
				this.changedProperties = {};
			}
		}

		protected getProperty(name) {
			return this.dataSource[name];
		}

		isChanged(name:string):boolean {
			return this.changedProperties[name] == true;
		}
	}
	export function bind(target:olib.BindableObject, name) {
		Object.defineProperty(target, name, {
			get: function () {
				return this.getProperty(name);
			},
			set: function (value) {
				this.setProperty(name, value);
			},
			enumerable: true,
			configurable: true
		});
		return target;
	}

}
