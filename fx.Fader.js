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
		"cover2"
	],
	
	published: {
		variable: .1, //how much to increase the opacity
		timeout: 1, //seconds
		next: (function(){}),
		rotateFlag: false
	},
	
	components: [
		{name: "fader", kind: "Image", cover: 0},
		{name: "fadee", kind: "Image", cover: 1}
	],
	
	create: function(){
		this.inherited(arguments);
		
		this.$.fader.applyStyle("opacity", .5);
		this.$.fadee.applyStyle("opacity", .5);
		
		this.rotate();
		
		this.next = this.increase;
		
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
		this.imageSetup(fr);
		this.imageSetup(fe);
		
		switch(this.next){	//seriously, just don't even look here. it works.
			case this.decrease:
				this.next = this.increase;
				fr.applyStyle("opacity", 0);
				this.rotateFlag = false;
				break;
			case this.increase:
				this.next = this.decrease;
				fr.applyStyle("opacity", .1);
				this.fade();
				break;
		}
	},
	beginFade: function(){
		this.fading = setInterval(this.fade.bind(this), this.timeout * 1000);
	},
	fade: function(event){
		if (this.rotateFlag) this.rotate();
		
		var fr = this.$.fader;
		var fe = this.$.fadee;
		
		this.next(fr, fe);
		
		this.render();
	},
	increase: function(fr, fe){
		var opacity = 0;
		opacity = fr.domStyles.opacity + this.variable;
		
		opacity = opacity * 1000;
		opacity = Math.round(opacity);
		if (opacity >= 1000){
			this.rotateFlag = true;
		}
		opacity = opacity / 1000;
		
		fr.applyStyle("opacity", opacity);
		fe.applyStyle("opacity", 1 - opacity);
		
		
		//this.log("increasing...", opacity);
	},
	decrease: function(fe, fr){ // swapped the arguments. GENIUS.
		var opacity = 0;
		opacity = fe.domStyles.opacity - this.variable;
		
		opacity = opacity * 1000;
		opacity = Math.round(opacity);
		if (opacity <= 0){
			this.rotateFlag = true;
		}
		opacity = opacity / 1000;
		
		fe.applyStyle("opacity", opacity);
		fr.applyStyle("opacity", 1 - opacity);
		
		//this.log("decreasing...", opacity);
	},
	imageSetup: function(image){
		image.applyStyle("width", "1024px");
		image.applyStyle("height", "1024px");
		image.applyStyle("margin-right", (window.innerWidth - 1024) / 2 + "px");
		image.applyStyle("margin-bottom", (window.innerHeight - 1024) / 2 + "px");
		image.applyStyle("position", "fixed");
		image.setSrc(this.rootPath + this.covers[image.cover] + ".png");
		image.render();
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