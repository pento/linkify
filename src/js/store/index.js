/**
 * External dependencies
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use( Vuex );

const state = {
	rules: [
		{
			id: "lolwhee",
			url: "src.wordpress-develop.dev",
			replace: "lol %url HAHAHA %text %text %url 👍🏻"
		}
	]
};

export default new Vuex.Store( {
	state,
} );
