/**
 * External dependencies
 */
import Vue from 'vue';

/**
 * Internal dependencies
 */
import Options from 'blocks/options';
import store from 'store';

window.addEventListener( 'load', () => {
	new Vue( {
		el: '#app',
		store,
		render: h => h(Options),
	} );
} );
