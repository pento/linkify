import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		createBlankAnchorLink: false,
		markdownSites: "hackerone.com, reddit.com, teuxdeux.com, trello.com, zendesk.com",
		blockedSites: "github.com, facebook.com, slack.com, twitter.com, whatsapp.com, google.com",
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});
