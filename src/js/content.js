let shiftPressed = false;

const isFirefox = navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > -1;

function pasteHandler( e ) {
	if ( shiftPressed ) {
		return;
	}

	if ( 'undefined' === typeof( e.clipboardData ) ) {
		return;
	}

	const pasted = e.clipboardData.getData( 'text/plain' );
	if ( '' === pasted ) {
		return;
	}

	if ( ! pasted.match( /^https?:\/\//i ) ) {
		return;
	}

	const editor = e.target;

	if ( ! editor ) {
		return;
	}

	// Don't run in WordPress' Gutenberg editor.
	if ( editor.closest( '.gutenberg' ) ) {
		return;
	}

	if ( editor.isContentEditable ) {
		e.preventDefault();
		document.execCommand( 'createLink', false, pasted );
		return;
	}

	let inputTypeAllowed = false;

	if ( 'TEXTAREA' === editor.nodeName ) {
		inputTypeAllowed = true;
	}

	// Normally we don't want to do this on <input> tags, but there are exceptions.
	const inputElementSites = [
		'teuxdeux.com'
	];

	if ( 'INPUT' === editor.nodeName && 'text' === editor.type && inputElementSites.find( domainCheck ) ) {
		inputTypeAllowed = true;
	}

	if ( ! inputTypeAllowed ) {
		return;
	}

	let start, end;

	if ( editor.selectionStart > editor.selectionEnd ) {
		start = editor.selectionEnd;
		end = editor.selectionStart;
	} else {
		start = editor.selectionStart;
		end = editor.selectionEnd;
	}

	// If the current selection is also a URL, assume we want to replace it (not wrap it in an anchor)
	if ( editor.value.slice( start, end ).match( /^https?:\/\/[^\s]*$/i ) ) {
		return;
	}

	const markdownSites = [
		'hackerone.com',
		'github.com',
		'reddit.com',
		'teuxdeux.com'
	];

	let bbCodeEl = document.getElementById( 'disable_bbcode' );
	if ( ! bbCodeEl ) {
		bbCodeEl = document.getElementsByClassName( 'show_bbcode' ).item( 0 );
	}

	const tracForm = document.getElementById( 'propertyform' );
	if ( tracForm &&
			( tracForm.getAttribute( 'action' ).indexOf( '/newticket' ) >= 0 ||
				tracForm.getAttribute( 'action' ).indexOf( '/ticket/' ) >= 0 )
	) {
		pasteTrac( e, editor, pasted, start, end );
	} else if ( markdownSites.find( domainCheck ) ) {
		pasteMarkdown( e, editor, pasted, start, end );
	} else if ( bbCodeEl ) {
		pasteBBcode( e, editor, pasted, start, end );
	} else if ( editor.classList.contains( 'remarkup-assist-textarea' ) ) {
		pasteRemarkup( e, editor, pasted, start, end );
	} else {
		pasteHTML( e, editor, pasted, start, end );
	}
}

function shiftChecker( e ) {
	shiftPressed = e.shiftKey;
}

function pasteTrac( e, editor, pasted, start, end ) {
	e.preventDefault();
	insertText( '[' + pasted + ' ' + editor.value.slice( start, end ) + ']', editor, start, end );

	let newPos;

	if ( start === end ) {
		newPos = start + pasted.length + 2;
	} else {
		newPos = end + pasted.length + 3;
	}

	editor.setSelectionRange( newPos, newPos );
}

function pasteMarkdown( e, editor, pasted, start, end ) {
	e.preventDefault();
	insertText( '[' + editor.value.slice( start, end ) + '](' + pasted + ')', editor, start, end );

	let newPos;

	if ( start === end ) {
		newPos = start + 1;
	} else {
		newPos = end + pasted.length + 4;
	}

	editor.setSelectionRange( newPos, newPos );
}

function pasteBBcode( e, editor, pasted, start, end ) {
	e.preventDefault();
	insertText( '[url=' + pasted + ']' + editor.value.slice( start, end ) + '[/url]', editor, start, end );

	let newPos;

	if ( start === end ) {
		newPos = start + pasted.length + 6;
	} else {
		newPos = end + pasted.length + 12;
	}

	editor.setSelectionRange( newPos, newPos );
}

function pasteRemarkup( e, editor, pasted, start, end ) {
	e.preventDefault();
	insertText( '[[ ' + pasted + ' | ' + editor.value.slice( start, end ) + ' ]]', editor, start, end );

	let newPos;

	if ( start === end ) {
		newPos = start + pasted.length + 6;
	} else {
		newPos = end + pasted.length + 9;
	}

	editor.setSelectionRange( newPos, newPos );
}

function pasteHTML( e, editor, pasted, start, end ) {
	// Make sure we are not in a tag first
	const leftString = editor.value.slice( 0, start ).toLowerCase();

	// If we are inside a (start) tag for any HTML element, its not ok to paste as a an a-href
	if ( ( -1 < leftString.lastIndexOf( '<' ) ) && ( leftString.lastIndexOf( '<' ) > leftString.lastIndexOf( '>' ) ) ) {
		return;
	}

	// If we are inside an anchor's content, its not ok to paste as a an a-href
	if ( ( -1 < leftString.lastIndexOf( '<a' ) ) && ( leftString.lastIndexOf( '<a' ) > leftString.lastIndexOf( '</a>' ) ) ) {
		return;
	}

	// Looks safe, let's do this.
	e.preventDefault();
	insertText( '<a href="' + pasted + '">' + editor.value.slice( start, end ) + '</a>', editor, start, end );

	let newPos;

	if ( start === end ) {
		newPos = start + pasted.length + 11;
	} else {
		newPos = end + pasted.length + 15;
	}

	editor.setSelectionRange( newPos, newPos );
}

function insertText( text, editor, start, end ) {
	if ( isFirefox ) {
		editor.value = editor.value.slice( 0, start ) + text + editor.value.slice( end );
	} else {
		document.execCommand( 'insertText', false, text );
	}
}

function domainCheck( site ) {
	return document.domain.includes( site );
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

if ( undefined !== blockedSites.find( domainCheck ) ) {
	attach = false;
}

// Don't load on o2 sites, as they already have this feature.
if ( document.body.classList.contains( 'o2' ) ) {
	attach = false;
}

if ( attach ) {
	document.addEventListener( 'paste', pasteHandler );
	document.addEventListener( 'keydown', shiftChecker );
}
