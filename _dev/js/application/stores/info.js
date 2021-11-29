import { add, find, put } from '../data/database';
import { parseProxy } from '../utils/functions';

const roman = ( number ) => {
  const dict = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let result = '';

  for ( const romanNumeral in dict )
    while ( number >= dict[ romanNumeral ] ) {
      result += romanNumeral;
      number -= dict[ romanNumeral ];
    }

  return result;
};

const NextRewards = Object.freeze( {
  pageRead: { value: 100, level: 1 },
  bookAdded: { value: 10, level: 1 },
  bookRead: { value: 1, level: 1 },
} );

const MapKey = Object.freeze( {
  leitor: 'pageRead',
  colecionador: 'bookAdded',
  finalizado: 'bookRead',
} );

const updateNextReward = ( key, value, level ) => {
  const reward = NextRewards[ key ];
  reward.value = value ? value * 10 : reward.value * 10;
  reward.level = level ? level + 1 : reward.level + 1;
};

const addNewRewards = info => {
  const rewards = [];

  if ( info.pagesRead >= NextRewards.pageRead.value ) {
    rewards.push( {
      title: 'leitor',
      text: `${ NextRewards.pageRead.value.toLocaleString() } páginas lidas`,
      value: NextRewards.pageRead.value,
      level: NextRewards.pageRead.level,
    } );
    updateNextReward( 'pageRead' );
  }
  if ( info.booksRead >= NextRewards.bookRead.value ) {
    rewards.push( {
      title: 'finalizado',
      text: `finalizou ${ NextRewards.bookRead.value.toLocaleString() } livro${ NextRewards.bookRead.value > 1 ? 's' : '' }`,
      value: NextRewards.bookRead.value,
      level: NextRewards.bookRead.level,
    } );
    updateNextReward( 'bookRead' );
  }
  if ( info.booksAdded >= NextRewards.bookAdded.value ) {
    rewards.push( {
      title: 'colecionador',
      text: `${ NextRewards.bookAdded.value.toLocaleString() } livros adicionados`,
      value: NextRewards.bookAdded.value,
      level: NextRewards.bookAdded.level,
    } );
    updateNextReward( 'bookAdded' );
  }

  if ( rewards.length === 0 ) return;

  info.rewards.push( ...rewards );

  addNewRewards( info );
};

const reverseNextReward = key => {
  NextRewards[ key ].value /= 10;
  NextRewards[ key ].level--;
};

const removeRewards = info => {
  const indexes = [];

  if ( info.pagesRead < NextRewards.pageRead.value / 10 ) {
    indexes.push( info.rewards.findIndex( ( { title, level } ) => title === 'leitor' && level === NextRewards.pageRead.level - 1 ) );
    reverseNextReward( 'pageRead' );
  }
  if ( info.booksRead < Math.floor( NextRewards.bookRead.value / 10 ) ) {
    indexes.push( info.rewards.find( ( { title, level } ) => title === 'finalizado' && level === NextRewards.bookRead.level - 1 ) );
    reverseNextReward( 'bookRead' );
  }
  if ( info.booksAdded < NextRewards.bookAdded.value / 10 ) {
    indexes.push( info.rewards.find( ( { title, level } ) => title === 'colecionador' && level === NextRewards.bookAdded.level - 1 ) );
    reverseNextReward( 'bookAdded' );
  }

  if ( indexes.length === 0 ) return;

  indexes.forEach( i => i !== -1 && info.rewards.splice( i, 1 ) );

  removeRewards( info );
};


const addInfo = ( { currentPage, totalPages }, info ) => {
  info.booksAdded++;
  currentPage === totalPages && ( info.booksRead++ );
  info.pagesRead += currentPage;
  addNewRewards( info );
};

const updateInfo = ( book, originalBook, info ) => {
  if ( book.currentPage < book.totalPages && originalBook.totalPages === originalBook.currentPage )
    info.booksRead--;
  else if ( book.currentPage === book.totalPages && originalBook.currentPage < originalBook.totalPages )
    info.booksRead++;

  info.pagesRead += book.currentPage - originalBook.currentPage;

  removeRewards( info );
  addNewRewards( info );
};

const InfoStore = {
  // Por algum motivo o init estava sendo chamado uma segunda vez
  initCalled: false,
  info: {
    id: 'info',
    booksAdded: 0,
    booksRead: 0,
    pagesRead: 0,
    rewards: [],
  },
  rewardTitles: [],
  async init () {
    if ( this.initCalled ) return;
    this.initCalled = true;
    const [ info ] = await find( 'info' );
    info ? ( this.info = info ) : add( 'info', { ...this.info, rewards: [ ...this.info.rewards ] } );
  },
  async onBookUpserted ( book, originalBook ) {
    const info = parseProxy( this.info );
    originalBook ? updateInfo( book, originalBook, info ) : addInfo( book, info );
    await put( 'info', info );
    this.info = info;
  },
  onRewardsChanged () {
    this.rewardTitles = this.info.rewards.map( ( { title, level, text, value } ) => {
      const key = MapKey[ title ];
      level >= NextRewards[ key ].level && updateNextReward( key, value, level );
      return `${ title } ${ roman( level ) } - ${ text }`;
    } );
  }
};

export default InfoStore;
