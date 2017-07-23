/**
 * External dependencies
 */
import Vue from 'vue';

/**
 * Internal dependencies
 */
import Options from 'blocks/options';

window.addEventListener( 'load', () => {
	new Vue({
		el: '#app',
		render: h => h(Options),
	});
});
