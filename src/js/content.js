function pasteHandler( e ) {
	if ( 'undefined' === typeof( e.clipboardData ) ) {
		return;
	}

	var pasted = e.clipboardData.getData( 'text/plain' );
	if ( '' === pasted ) {
		return;
	}

	if ( ! pasted.match( /^https?:\/\//i ) ) {
		return;
	}

	var editor = e.target;

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

	var inputTypeAllowed = false;

	if ( 'TEXTAREA' === editor.nodeName ) {
		inputTypeAllowed = true;
	}

	// Normally we don't want to do this on <input> tags, but there are exceptions.
	var inputElementSites = [
		'teuxdeux.com'
	];

	if ( 'INPUT' === editor.nodeName && 'text' === editor.type && inputElementSites.find( domainCheck ) ) {
		inputTypeAllowed = true;
	}

	if ( ! inputTypeAllowed ) {
		return;
	}

	var start, end;

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

	var markdownSites = [
		'github.com',
		'reddit.com',
		'teuxdeux.com'
	];

	var bbCodeEl = document.getElementById( 'disable_bbcode' );
	if ( ! bbCodeEl ) {
		bbCodeEl = document.getElementsByClassName( 'show_bbcode' ).item( 0 );
	}

	var tracForm = document.getElementById( 'propertyform' );
	if( tracForm && ( tracForm.getAttribute( 'action' ).indexOf( '/newticket' ) >= 0 || tracForm.getAttribute( 'action' ).indexOf( '/ticket/' ) >= 0 ) ) {
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

function pasteTrac( e, editor, pasted, start, end ) {
	e.preventDefault();
	document.execCommand( 'insertText', false, '[' + pasted + ' ' + editor.value.slice( start, end ) + ']' );

	var newPos;

	if ( start === end ) {
		newPos = start + pasted.length + 2;
	} else {
		newPos = end + pasted.length + 3;
	}

	editor.setSelectionRange( newPos, newPos );
}

function pasteMarkdown( e, editor, pasted, start, end ) {
	e.preventDefault();
	document.execCommand( 'insertText', false, '[' + editor.value.slice( start, end ) + '](' + pasted + ')' );

	var newPos;

	if ( start === end ) {
		newPos = start + 1;
	} else {
		newPos = end + pasted.length + 4;
	}

	editor.setSelectionRange( newPos, newPos );
}

function pasteBBcode( e, editor, pasted, start, end ) {
	e.preventDefault();
	document.execCommand( 'insertText', false, '[url=' + pasted + ']' + editor.value.slice( start, end ) + '[/url]' );

	var newPos;

	if ( start === end ) {
		newPos = start + pasted.length + 6;
	} else {
		newPos = end + pasted.length + 12;
	}

	editor.setSelectionRange( newPos, newPos );
}

function pasteRemarkup( e, editor, pasted, start, end ) {
	e.preventDefault();
	document.execCommand( 'insertText', false, '[[ ' + pasted + ' || ' + editor.value.slice( start, end ) + ' ]]' );

	var newPos;

	if ( start === end ) {
		newPos = start + pasted.length + 7;
	} else {
		newPos = end + pasted.length + 10;
	}

	editor.setSelectionRange( newPos, newPos );
}

function pasteHTML( e, editor, pasted, start, end ) {
	// Make sure we are not in a tag first
	var leftString = editor.value.slice( 0, start ).toLowerCase();

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
	document.execCommand( 'insertText', false, '<a href="' + pasted + '">' + editor.value.slice( start, end ) + '</a>' );

	var newPos;

	if ( start === end ) {
		newPos = start + pasted.length + 11;
	} else {
		newPos = end + pasted.length + 15;
	}

	editor.setSelectionRange( newPos, newPos );
}

function domainCheck( site ) {
	return document.domain.includes( site );
}

// Don't bother attaching the paste event if we're on a site we don't want to run on.
var attach = true;

var blockedSites = [
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
}
