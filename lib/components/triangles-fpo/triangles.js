var	Glslify		    = require('glslify')
var CreateVAO	    = require('gl-vao')
  , CreateBuffer    = require('gl-buffer')
  , GlShader	    = require('gl-shader')
  , Extend		    = require('xtend')
  , ConsoleMat      = require('../console')
  , GlMatrix        = require('gl-matrix')
  , CreateGeometry  = require('gl-geometry')
  , Mat4		    = GlMatrix.mat4
  , Quat		    = GlMatrix.quat

var internals = {
	
	init : function( gl ) {
		
		var shader = GlShader(gl,
			Glslify('./triangles.vert'),
			Glslify('./triangles.frag')
		)
		
		// shader.attributes.position.location = 0
		//
		// //Create vertex array object
		// var vao = CreateVAO(gl, [{
		// 	buffer: CreateBuffer(gl, [
		// 		-1,  0, 0,
		// 		 0, -1, 0,
		// 		 1,  1, 0
		// 	]),
		// 	type: gl.FLOAT,
		// 	size: 3
		// }])
		
		
		var sc = {
			"positions": [
				[-1,  0, 0],
				[ 0, -1, 0],
				[ 1,  1, 0],
				[-1,  0, -1],
				[ 0, -1, -1],
				[ 1,  1, -1],
			],
			"cells": [
				[0, 1, 2],
				[3, 4, 5]
			]
		}

		var geometry = CreateGeometry(gl)
			.attr('positions', sc)
			.faces(sc.cells)
		
		
		return [ shader, geometry ]
	},
	
	updateFn : function(state) {
		
		return function(e) {
			state.rotation += 0.03
			state.position[0] = Math.cos( e.elapsed * 0.001 )
			state.position[1] = Math.sin( e.elapsed * 0.001 )
			state.position[2] = Math.cos( e.elapsed * 0.0005 ) * 5
		}
	},
		
	drawFn : function( gl, shader, geometry, camera, state ) {
		
		var identity = Mat4.create()
		var modelView = Mat4.create()
		var model = Mat4.create()
		var rotation = Quat.create()
		
		return function() {
			
			shader.bind()
			camera.bind( shader )

			// Calculate modelView
			Quat.rotateY( rotation, identity, state.rotation )
			Quat.rotateX( rotation, rotation, state.rotation * 0.3 )
			Mat4.fromRotationTranslation( model, rotation, state.position )
			Mat4.multiply( modelView, camera.view, model )
			
			shader.uniforms.modelView = modelView
			
			// Draw
			geometry.bind( shader )
			geometry.draw(gl.TRIANGLES, 3)
			geometry.unbind()
			
		}
	}
	
}

module.exports = function createTriangles( app, properties ) {
	
	var config = Extend({
		
	}, properties)
	
	var [ shader, geometry ] = internals.init( app.gl )
	
	var state = {
		position : [0,0,0]
	  , rotation : 0
	}

	app.emitter.on('update',
		internals.updateFn( state )
	)
	
	app.emitter.on('draw',
		internals.drawFn( app.gl, shader, geometry, app.camera, state )
	)
	
}