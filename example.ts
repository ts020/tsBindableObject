///<reference path="olib/core/BindableObject.ts" />
import bind = olib.bind;
module app {
	export class Greeter extends olib.BindableObject {

		constructor() {
			super();
		}

		@bind name:string;
		@bind message: string;
		@bind num : number;

		@before("this.beforeTest")
		@after("this.afterTest")
			test : string;

		private beforeTest() {
			console.log("beforeTest");
		}

		private afterTest () {
			console.log("afterTest");
		}
	}
}

function before(handler:string) {
	return function(target,name){
		console.log("before",arguments);
		target.___prop___ = target.___prop___ || {};
		Object.defineProperty(target, name, {
			get: function () {
				return this.___prop___[name];
			},
			set: function (value) {
				eval(handler)();
				this.___prop___[name] = value;
			},
			enumerable: true,
			configurable: true
		});
	};
}

function after(handler:string){
	return function(target,name){
		console.log("after",arguments);
		target.___prop___ = target.___prop___ || {};
		Object.defineProperty(target, name, {
			get: function () {
				return this.___prop___[name];
			},
			set: function (value) {
				this.___prop___[name] = value;
				eval(handler)();
			},
			enumerable: true,
			configurable: true
		});
	};
}
