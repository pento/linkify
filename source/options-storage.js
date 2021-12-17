import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		textNotSelected: true,
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});
