var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
	    app.preload();
        //app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    preload: function() {
	    var support = { animations : Modernizr.cssanimations },
			container = document.getElementById( 'container' ),
			header = container.querySelector( 'header.ip-header' ),
			loader = new PathLoader( document.getElementById( 'ip-loader-circle' ) ),
			animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
			// animation end event name
			animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
	
		function init() {
			var onEndInitialAnimation = function() {
				if( support.animations ) {
					this.removeEventListener( animEndEventName, onEndInitialAnimation );
				}
	
				startLoading();
			};
	
			// disable scrolling
			window.addEventListener( 'scroll', noscroll );
	
			// initial animation
			classie.add( container, 'loading' );
	
			if( support.animations ) {
				container.addEventListener( animEndEventName, onEndInitialAnimation );
			}
			else {
				onEndInitialAnimation();
			}
		}
	
		function startLoading() {
			
			var images = document.querySelector('.grid');
			var imgLoad = imagesLoaded( images );
			var loadedImageCount = 0;
			var imageCount = imgLoad.images.length;
			
			// simulate loading something..		
			var simulationFn = function(instance) {
				
				var progress = 0;
				imgLoad.on('progress', function(obj, image) {
					
					loadedImageCount++; 
					
					progress = (loadedImageCount / imageCount); 
	
					instance.setProgress( progress );
	
					// reached the end
					if( progress === 1 ) {
						classie.remove( container, 'loading' );
						classie.add( container, 'loaded' );
	
						var onEndHeaderAnimation = function(ev) {
							if( support.animations ) {
								if( ev.target !== header ) return;
								this.removeEventListener( animEndEventName, onEndHeaderAnimation ); 
							}
	
							classie.add( document.body, 'layout-switch' );
							window.removeEventListener( 'scroll', noscroll );
	
						};
	
						if( support.animations ) {
							header.addEventListener( animEndEventName, onEndHeaderAnimation );
						}
						else {
							onEndHeaderAnimation();
						}
						//---grid animation----------------------
						// create SVG circle overlay and append it to the preview element
						function createCircleOverlay(previewEl) {
							var dummy = document.createElementNS("http://www.w3.org/2000/svg", "svg");
							dummy.setAttributeNS(null, "version", "1.1");
							dummy.setAttributeNS(null, "width", "100%");
							dummy.setAttributeNS(null, "height", "100%");
							dummy.setAttributeNS(null, "class", "overlay");
							var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
							var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
							circle.setAttributeNS(null, "cx", 0);
							circle.setAttributeNS(null, "cy", 0);
							circle.setAttributeNS(null, "r", Math.sqrt(Math.pow(previewEl.offsetWidth,2) + Math.pow(previewEl.offsetHeight,2)));
							dummy.appendChild(g);
							g.appendChild(circle);
							previewEl.appendChild(dummy);
						}
						
						new GridFx(document.querySelector(".grid"), {
							onInit : function(instance) {
								createCircleOverlay(instance.previewEl);
							},
							onResize : function(instance) {
								instance.previewEl.querySelector("svg circle").setAttributeNS(null, "r", Math.sqrt(Math.pow(instance.previewEl.offsetWidth,2) + Math.pow(instance.previewEl.offsetHeight,2)));
							},
							onOpenItem : function(instance, item) {
								// item's image
								var gridImg = item.querySelector("img"),
									gridImgOffset = gridImg.getBoundingClientRect(),
									win = {width: document.documentElement.clientWidth, height: window.innerHeight},
									SVGCircleGroupEl = instance.previewEl.querySelector("svg > g"),
									SVGCircleEl = SVGCircleGroupEl.querySelector("circle");
									
								SVGCircleEl.setAttributeNS(null, "r", Math.sqrt(Math.pow(instance.previewEl.offsetWidth,2) + Math.pow(instance.previewEl.offsetHeight,2)));
								// set the transform for the SVG g node. This will animate the circle overlay. The origin of the circle depends on the position of the clicked item.
								if( gridImgOffset.left + gridImg.offsetWidth/2 < win.width/2 ) {
									SVGCircleGroupEl.setAttributeNS(null, "transform", "translate(" + win.width + ", " + (gridImgOffset.top + gridImg.offsetHeight/2 < win.height/2 ? win.height : 0) + ")");
								}
								else {
									SVGCircleGroupEl.setAttributeNS(null, "transform", "translate(0, " + (gridImgOffset.top + gridImg.offsetHeight/2 < win.height/2 ? win.height : 0) + ")");
								}
							}
						});
						//---end grid animation----------------------					
					}
					
				});
			};
			/*
			// simulate loading something..
			
			var simulationFn = function(instance) {
				var progress = 0,
					interval = setInterval( function() {
						progress = Math.min( progress + Math.random() * 0.1, 1 );
	
						instance.setProgress( progress );
	
						// reached the end
						if( progress === 1 ) {
							classie.remove( container, 'loading' );
							classie.add( container, 'loaded' );
							clearInterval( interval );
	
							var onEndHeaderAnimation = function(ev) {
								if( support.animations ) {
									if( ev.target !== header ) return;
									this.removeEventListener( animEndEventName, onEndHeaderAnimation );
								}
	
								classie.add( document.body, 'layout-switch' );
								window.removeEventListener( 'scroll', noscroll );
							};
	
							if( support.animations ) {
								header.addEventListener( animEndEventName, onEndHeaderAnimation );
							}
							else {
								onEndHeaderAnimation();
							}
						}
					}, 80 );
			};
			*/
	
			loader.setProgressFn( simulationFn );
		}
		
		function noscroll() {
			window.scrollTo( 0, 0 );
		}
	
		init();
    }
    
};