export const isEmpty = ( str ) => !str || /^\s*$/.test( str );
export const removeSpaces = ( str ) => str.replace( /\s+/g, '' );
export const normalizeString = ( str ) => removeSpaces( str ).toUpperCase();
export const normalizeArray = ( ...strings ) => strings.map( normalizeString );

export const parseProxy = proxy => JSON.parse( JSON.stringify( proxy ) );

// Number.prototype.toRoman = function () {
// 	const dict = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };

// 	let result = '';
// 	let number = this;

// 	for ( const romanNumeral in dict ) {
// 		while ( number >= dict[ romanNumeral ] ) {
// 			result += romanNumeral;
// 			number -= dict[ romanNumeral ];
// 		}
// 	}

// 	return result;
// };

// String.prototype.toHtml = function () {
// 	const container = document.createElement`div`;
// 	const fragment = document.createDocumentFragment();
// 	container.innerHTML = this;
// 	fragment.appendChild( container.firstElementChild );
// 	container.remove();
// 	return fragment.firstElementChild;
// };

// String.prototype.contains = function ( searchString ) {
// 	if ( !searchString ) return true;
// 	const text = this;
// 	return text.removeSpaces().toLowerCase().includes( searchString.removeSpaces().toLowerCase() );
// };
