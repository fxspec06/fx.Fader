/*
 * 
 * 
 * fx.Fader.js
 * 
 * Created by: 	Bryan Leasot
 * 				@fxspec06
 * 				bshado@charter.net on 8/26/2012
 * 
 * 
 * Enyo 2.0 Image Fader JavaScript extension
 * 
 * Requires Enyo 2.0 or later
 * 
 * Usage
 * {name: "fader", kind: "fx.Fader"}
 * 
 * to hide and pause:
 * this.$.fader.hide();
 * 
 * to show and start:
 * this.$.fader.show();
 * 
 * Not a whole lot here!
 * 
 * 
 * Feel free to use and contribute as you like!
 * If you like it, feel free to give a shout-out @fxspec06
 * 
 * Happy Enyo-ing!
 * 
 */
enyo.kind({
	name: "fx.Fader",
	
	rootPath: "assets/cover/",
	
	//images named .png, they fade in order declared here
	covers: [
		"cover1",
		"cover0",
		"cover1",
		"cover2",
		"cover0"
	],
	
	published: {
		variable: .02, //how much to increase the opacity
		timeout: .1, //seconds
		size: 350, //how big is the image [centered]
		_switch: false,
		rotateFlag: false
	},
	
	components: [
		{name: "fader", kind: "Image", cover: 0, domStyles: {opacity: .5}},
		{name: "fadee", kind: "Image", cover: 1, domStyles: {opacity: .5}}
	],
	
	create: function(){
		this.inherited(arguments);
		
		this.rotate();
		
		this.beginFade();
	},
	rotate: function(){
		var fr = this.$.fader;
		var fe = this.$.fadee;
		fr.cover++;
		fe.cover++;
		if(fe.cover >= this.covers.length){
			fe.cover = 0;
		}
		if(fr.cover >= this.covers.length){
			fr.cover = 0;
		}
		
		var _switch = fe.cover;
		fe.cover = fr.cover;
		fr.cover = _switch;
		
		this._switch = (!this._switch);
		
		this.imageSetup(fr);
		this.imageSetup(fe);
		
		if (fr.domStyles.opacity >= 1) {
			fr.applyStyle("opacity", -this.variable);
		}
		if (fe.domStyles.opacity >= 1) {
			fe.applyStyle("opacity", -this.variable);
		}
		
		this.rotateFlag = false;
	},
	beginFade: function(){
		this.fading = setInterval(this.fade.bind(this), this.timeout * 1000);
	},
	fade: function(event){
		if (this.rotateFlag) this.rotate();
		
		var fr = this.$.fader;
		var fe = this.$.fadee;
		
		if (this._switch) this.next(fr, fe);
			else this.next(fe, fr);
	},
	next: function(fr, fe){
		var opacity = 0;
		opacity = fr.domStyles.opacity + this.variable;
		
		
		
		opacity = roundNumber(opacity, 4);
		if (opacity >= 1){
			this.rotateFlag = true;
		}
		
		fr.applyStyle("opacity", opacity);
		fe.applyStyle("opacity", 1 - opacity);
		
		
		//this.log("increasing...", opacity);
	},
	imageSetup: function(image){
		image.applyStyle("width", this.size + "px");
		image.applyStyle("height", this.size + "px");
		image.applyStyle("right", (window.innerWidth - this.size) / 2 + "px");
		image.applyStyle("bottom", (window.innerHeight - this.size) / 2 + "px");
		image.applyStyle("position", "fixed");
		//image.applyStyle("opacity", -this.variable);
		image.setSrc(this.rootPath + this.covers[image.cover] + ".png");
	},
	show: function(){
		var r = this.inherited(arguments);
		this.beginFade();
		return r;
	},
	hide: function(){
		var r = this.inherited(arguments);
		clearTimeout(this.fading);
		return r;
	}
});
function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}