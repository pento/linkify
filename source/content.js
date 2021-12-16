import optionsStorage from './options-storage.js';

async function init() {
	const options = await optionsStorage.getAll();
	const text = options.text;

}

init();
