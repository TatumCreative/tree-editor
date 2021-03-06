module.exports = {
	name : "Basic Configuration",
	config : {},
	components : {
		vignette : {
			function: require('../components/vignette')
		},
		//Examples:
		graph: {
			function: require('../components/graph')
		},
		editor : {
			function: require('../components/force-layout/force-layout')
		}
		
		// controls : {
		// 	construct: require("../js/components/cameras/Controls"),
		// },
		// treeGrowth : {
		// 	function: require("../js/demos/treeGrowth"),
		// },
		// grid : {
		// 	construct: require("../js/demos/Grid"),
		// },
		// stats : {
		// 	construct: require("../js/components/utils/Stats")
		// }
	}
};