import { find, removeBook, add, put, findBook } from '../data/database';
import { isEmpty, normalizeArray, parseProxy } from '../utils/functions';

const BookStore = {
  // Por algum motivo o init estava sendo chamado uma segunda vez
  initCalled: false,
  books: [],
  filteredBooks: [],
  searchString: false,
  async init () {
    if ( this.initCalled ) return;
    this.initCalled = true;
    const books = await find( 'books' );
    this.books = books;
    this.filteredBooks = [ ...books ];
  },
  async upsert ( proxyBook ) {
    const book = parseProxy( proxyBook );

    if ( isEmpty( book.title ) )
      return Promise.reject();

    const upsert = book.id ? put : add;
    const id = await upsert( 'books', book );
    const updatedbook = await findBook( id );
    this.updateList( id, updatedbook );
    return updatedbook;
  },
  async remove ( proxyBook ) {
    const book = parseProxy( proxyBook );
    await removeBook( book.id );
    this.updateList( book.id );
    return book;
  },
  toggleSearch ( toggle ) {
    if ( typeof toggle !== 'undefined' ) return ( this.searchString = toggle ? '' : false );

    if ( this.searchString !== false ) return ( this.searchString = false );

    this.searchString = '';
  },
  updateList ( id, book ) {
    const equalId = x => x.id === id;
    const booksIndex = this.books.findIndex( equalId );
    const filteredBooksIndex = this.filteredBooks.findIndex( equalId );

    booksIndex >= 0 && this.books.splice( booksIndex, 1 );
    filteredBooksIndex >= 0 && this.filteredBooks.splice( filteredBooksIndex, 1 );

    if ( !book ) return;

    this.books.unshift( book );
    this.filteredBooks.unshift( book );
    this.filter();
  },
  filter () {
    if ( this.searchString === false ) return ( this.filteredBooks = [ ...this.books ] );

    const compare = ( str ) => str.includes( this.searchString.toUpperCase() );
    const filter = ( { tags, title } ) => normalizeArray( ...tags, title ).some( compare );
    this.filteredBooks = this.books.filter( filter );
  },
};

export default BookStore;
