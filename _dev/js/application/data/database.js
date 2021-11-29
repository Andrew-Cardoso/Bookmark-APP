import Dexie from 'dexie';

const Database = new Dexie( 'Bookmark_App' );
Database.version( 1 ).stores( {
  books: '++id, title,tags,totalPages,currentPage,dateUpdated',
  experience: 'id,level,current,total',
  info: 'id,booksAdded,booksRead,pagesRead,rewards',
} );

const validateBookProperties = ( book ) => {
  const totalPages = parseInt( book.totalPages );
  book.totalPages = isNaN( totalPages ) || totalPages < 1 ? 1 : totalPages;
  const currentPage = parseInt( book.currentPage );
  book.currentPage = isNaN( currentPage ) || currentPage < 1 ? 1 : currentPage > totalPages ? totalPages : currentPage;
  book.dateUpdated = new Date();
  return book;
};


Database[ 'books' ].hook( 'creating', ( key, obj, transaction ) => {
  validateBookProperties( obj );
} );
Database[ 'books' ].hook( 'updating', ( mods, pk, obj ) => validateBookProperties( { ...obj, ...mods } ));

export const find = ( collectionName ) =>
  collectionName === 'books' ? Database[ 'books' ].orderBy( 'dateUpdated' ).reverse().toArray() : Database[ collectionName ].toArray();
export const add = ( collectionName, item ) => Database[ collectionName ].add( item );
export const put = ( collectionName, item ) => Database[ collectionName ].put( item );
export const findBook = ( id ) => Database[ 'books' ].get( id );
export const removeBook = ( title ) => Database[ 'books' ].delete( title );
