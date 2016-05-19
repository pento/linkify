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

	if ( ! editor || 'TEXTAREA' !== editor.nodeName ) {
		return;
	}

	if ( editor.selectionStart === editor.selectionEnd ) {
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

	var tracForm = document.getElementById( 'propertyform' );
	if( tracForm && tracForm.action.indexOf( '/newticket' ) >= 0 ) {
		pasteTrac( e, editor, pasted, start, end );
	} else if ( 'github.com' === document.domain ) {
		pasteMarkdown( e, editor, pasted, start, end );
	} else {
		pasteHTML( e, editor, pasted, start, end );
	}
}

document.addEventListener( 'paste', pasteHandler );

function pasteTrac( e, editor, pasted, start, end ) {
	e.preventDefault();
	editor.value = editor.value.slice( 0, start ) + '[' + pasted + ' ' + editor.value.slice( start, end ) + ']' + editor.value.slice( end, editor.value.length );

	var newPos = end + pasted.length + 3;
	editor.setSelectionRange( newPos, newPos );
}

function pasteMarkdown( e, editor, pasted, start, end ) {
	e.preventDefault();
	editor.value = editor.value.slice( 0, start ) + '[' + editor.value.slice( start, end ) + '](' + pasted + ')' + editor.value.slice( end, editor.value.length );

	var newPos = end + pasted.length + 4;
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
	editor.value = editor.value.slice( 0, start ) + '<a href="' + pasted + '">' + editor.value.slice( start, end ) + '</a>' + editor.value.slice( end, editor.value.length );

	var newPos = end + pasted.length + 15;
	editor.setSelectionRange( newPos, newPos );
}
