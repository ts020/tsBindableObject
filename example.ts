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

	}
}