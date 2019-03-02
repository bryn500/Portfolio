/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 */
/** @namespace */
window.THREEx = {}

/**
 * provide info on THREE.WebGLRenderer
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
*/
THREEx.RendererStats = function () {
    var container = document.createElement('div');
    container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

    var msDiv = document.createElement('div');
    msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#200;';
    //container.appendChild(msDiv);

    var msText = document.createElement('div');
    msText.style.cssText = 'color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
    msText.innerHTML = 'WebGLRenderer';
    msDiv.appendChild(msText);

    var msTexts = [];
    var nLines = 10;
    for (var i = 0; i < nLines; i++) {
        msTexts[i] = document.createElement('div');
        msTexts[i].style.cssText = 'color:#f00;background-color:#311;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
        msDiv.appendChild(msTexts[i]);
        msTexts[i].innerHTML = '-';
    }


    var lastTime = Date.now();
    return {
        domElement: container,

        update: function (webGLRenderer) {
            // sanity check
            //console.assert(webGLRenderer instanceof THREE.WebGLRenderer)

            // refresh only 30time per second
            if (Date.now() - lastTime < 1000 / 30) return;
            lastTime = Date.now();

            var i = 0;
            msTexts[i++].textContent = "== Memory =====";
            msTexts[i++].textContent = "Programs: " + webGLRenderer.info.programs.length;
            msTexts[i++].textContent = "Geometries: " + webGLRenderer.info.memory.geometries;
            msTexts[i++].textContent = "Textures: " + webGLRenderer.info.memory.textures;

            msTexts[i++].textContent = "== Render =====";
            msTexts[i++].textContent = "Calls: " + webGLRenderer.info.render.calls;
            msTexts[i++].textContent = "Lines: " + webGLRenderer.info.render.lines;
            msTexts[i++].textContent = "Vertices: " + webGLRenderer.info.render.vertices;
            msTexts[i++].textContent = "Faces: " + webGLRenderer.info.render.faces;
            msTexts[i++].textContent = "Points: " + webGLRenderer.info.render.points;
        }
    }
};

/**
 * @author mrdoob / http://mrdoob.com/
 */

window.Stats = function () {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	//

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}

		mode = id;

	}

	//

	var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
	var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) );

	if ( self.performance && self.performance.memory ) {

		var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );

	}

	showPanel( 0 );

	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		begin: function () {

			beginTime = ( performance || Date ).now();

		},

		end: function () {

			frames ++;

			var time = ( performance || Date ).now();

			msPanel.update( time - beginTime, 200 );

			if ( time >= prevTime + 1000 ) {

				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

				prevTime = time;
				frames = 0;

				if ( memPanel ) {

					var memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

				}

			}

			return time;

		},

		update: function () {

			beginTime = this.end();

		},

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

Stats.Panel = function ( name, fg, bg ) {

	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 80 * PR, HEIGHT = 48 * PR,
			TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
			GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
			GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:80px;height:48px';

	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';

	context.fillStyle = bg;
	context.fillRect( 0, 0, WIDTH, HEIGHT );

	context.fillStyle = fg;
	context.fillText( name, TEXT_X, TEXT_Y );
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	context.fillStyle = bg;
	context.globalAlpha = 0.9;
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	return {

		dom: canvas,

		update: function ( value, maxValue ) {

			min = Math.min( min, value );
			max = Math.max( max, value );

			context.fillStyle = bg;
			context.globalAlpha = 1;
			context.fillRect( 0, 0, WIDTH, GRAPH_Y );
			context.fillStyle = fg;
			context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

			context.fillStyle = bg;
			context.globalAlpha = 0.9;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

		}

	};

};

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
//document.body.appendChild( stats.dom );

function animate() {

	stats.begin();

	// monitored code goes here

	stats.end();

	requestAnimationFrame( animate );

}

requestAnimationFrame( animate );

window.rendererStats = new window.THREEx.RendererStats();
