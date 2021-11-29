export const isEmpty = str => !str || /^\s*$/.test( str )
export const normalizeString = str => str.replace( /\s{2,}/g, ' ' ).toUpperCase()
export const normalizeArray = ( ...strings ) => strings.map( normalizeString )
export const parseProxy = proxy => JSON.parse( JSON.stringify( proxy ) )