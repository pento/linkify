let shiftPressed = false;

const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

function pasteHandler(event) {
	if (shiftPressed) {
		return;
	}

	if (typeof (event.clipboardData) === 'undefined') {
		return;
	}

	const pasted = event.clipboardData.getData('text/plain');
	if (pasted === '') {
		return;
	}

	if (!pasted.match(/^https?:\/\//i)) {
		return;
	}

	const editor = event.target;

	if (!editor) {
		return;
	}

	// Don't run in WordPress' Gutenberg editor.
	if (editor.closest('.gutenberg')) {
		return;
	}

	if (editor.isContentEditable) {
		event.preventDefault();
		document.execCommand('createLink', false, pasted);
		return;
	}

	let inputTypeAllowed = false;

	if (editor.nodeName === 'TEXTAREA') {
		inputTypeAllowed = true;
	}

	// Normally we don't want to do this on <input> tags, but there are exceptions.
	const inputElementSites = [
		'teuxdeux.com'
	];

	if (editor.nodeName === 'INPUT' && editor.type === 'text' && inputElementSites.some(site => document.domain.includes(site))) {
		inputTypeAllowed = true;
	}

	if (!inputTypeAllowed) {
		return;
	}

	let start;
	let end;

	if (editor.selectionStart > editor.selectionEnd) {
		start = editor.selectionEnd;
		end = editor.selectionStart;
	} else {
		start = editor.selectionStart;
		end = editor.selectionEnd;
	}

	// If the current selection is also a URL, assume we want to replace it (not wrap it in an anchor)
	if (editor.value.slice(start, end).match(/^https?:\/\/\S*$/i)) {
		return;
	}

	const markdownSites = [
		'hackerone.com',
		'github.com',
		'reddit.com',
		'teuxdeux.com'
	];

	let bbCodeElement = document.querySelector('#disable_bbcode');
	if (!bbCodeElement) {
		bbCodeElement = document.querySelectorAll('.show_bbcode').item(0);
	}

	const tracForm = document.querySelector('#propertyform');
	if (tracForm &&
			(tracForm.getAttribute('action').includes('/newticket') ||
				tracForm.getAttribute('action').includes('/ticket/'))
	) {
		pasteTrac(event, editor, pasted, start, end);
	} else if (markdownSites.some(site => document.domain.includes(site))) {
		pasteMarkdown(event, editor, pasted, start, end);
	} else if (bbCodeElement) {
		pasteBBcode(event, editor, pasted, start, end);
	} else if (editor.classList.contains('remarkup-assist-textarea')) {
		pasteRemarkup(event, editor, pasted, start, end);
	} else {
		pasteHTML(event, editor, pasted, start, end);
	}
}

function shiftChecker(event) {
	shiftPressed = event.shiftKey;
}

function pasteTrac(event, editor, pasted, start, end) {
	event.preventDefault();
	insertText('[' + pasted + ' ' + editor.value.slice(start, end) + ']', editor, start, end);

	const newPos = start === end ? start + pasted.length + 2 : end + pasted.length + 3;

	editor.setSelectionRange(newPos, newPos);
}

function pasteMarkdown(event, editor, pasted, start, end) {
	event.preventDefault();
	insertText('[' + editor.value.slice(start, end) + '](' + pasted + ')', editor, start, end);

	const newPos = start === end ? start + 1 : end + pasted.length + 4;

	editor.setSelectionRange(newPos, newPos);
}

function pasteBBcode(event, editor, pasted, start, end) {
	event.preventDefault();
	insertText('[url=' + pasted + ']' + editor.value.slice(start, end) + '[/url]', editor, start, end);

	const newPos = start === end ? start + pasted.length + 6 : end + pasted.length + 12;

	editor.setSelectionRange(newPos, newPos);
}

function pasteRemarkup(event, editor, pasted, start, end) {
	event.preventDefault();
	insertText('[[ ' + pasted + ' | ' + editor.value.slice(start, end) + ' ]]', editor, start, end);

	const newPos = start === end ? start + pasted.length + 6 : end + pasted.length + 9;

	editor.setSelectionRange(newPos, newPos);
}

function pasteHTML(event, editor, pasted, start, end) {
	// Make sure we are not in a tag first
	const leftString = editor.value.slice(0, start).toLowerCase();

	// If we are inside a (start) tag for any HTML element, its not ok to paste as a an a-href
	if ((leftString.lastIndexOf('<') > -1) && (leftString.lastIndexOf('<') > leftString.lastIndexOf('>'))) {
		return;
	}

	// If we are inside an anchor's content, its not ok to paste as a an a-href
	if ((leftString.lastIndexOf('<a') > -1) && (leftString.lastIndexOf('<a') > leftString.lastIndexOf('</a>'))) {
		return;
	}

	// Looks safe, let's do this.
	event.preventDefault();
	insertText('<a href="' + pasted + '">' + editor.value.slice(start, end) + '</a>', editor, start, end);

	const newPos = start === end ? start + pasted.length + 11 : end + pasted.length + 15;

	editor.setSelectionRange(newPos, newPos);
}

function insertText(text, editor, start, end) {
	if (isFirefox) {
		editor.value = editor.value.slice(0, start) + text + editor.value.slice(end);
	} else {
		document.execCommand('insertText', false, text);
	}
}

// Don't bother attaching the paste event if we're on a site we don't want to run on.
let attach = true;

const blockedSites = [
	'gist.github.com',
	'facebook.com',
	'slack.com',
	'twitter.com',
	'whatsapp.com'
];

if (undefined !== blockedSites.some(site => document.domain.includes(site))) {
	attach = false;
}

// Don't load on o2 sites, as they already have this feature.
if (document.body.classList.contains('o2')) {
	attach = false;
}

if (attach) {
	document.addEventListener('paste', pasteHandler);
	document.addEventListener('keydown', shiftChecker);
}
