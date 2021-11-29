import { add, find, put } from '../data/database';
import { parseProxy } from '../utils/functions';

const increaseXp = exp => {
  if ( exp.current < exp.total ) return;
  exp.current -= exp.total;
  exp.total += 8;
  exp.level++;

  return increaseXp( exp );
};

const decreaseXp = exp => {
  if ( exp.current >= 0 ) return;

  exp.total -= 8;
  exp.level--;
  exp.current += exp.total;

  return decreaseXp( exp );
};

const getExpDiff = ( book, originalBook ) => {
  const diff = book.currentPage - originalBook.currentPage;

  if ( book.currentPage < book.totalPages && originalBook.currentPage < originalBook.totalPages )
    return diff;

  if ( book.currentPage === book.totalPages && originalBook.currentPage === originalBook.totalPages )
    return diff * 2;

  if ( book.currentPage < book.totalPages )
    return diff - originalBook.totalPages;

  return diff + book.totalPages;
};

const removeExperience = ( { currentPage, totalPages }, exp ) => {
  const expDiff = currentPage === totalPages ? totalPages * 2 : currentPage;
  exp.current -= expDiff;
  decreaseXp( exp );
};

const updateExperience = ( book, exp, originalBook ) => {
  const expDiff = originalBook
    ? getExpDiff( book, originalBook )
    : book.currentPage === book.totalPages
      ? book.currentPage * 2
      : book.currentPage;

  exp.current += expDiff;
  expDiff > 0 ? increaseXp( exp ) : decreaseXp( exp );
};

const updateView = ( store ) => {
  const { current, level, total } = store.experience;
  store.percentage = `${ ( current / total ) * 100 }%`;
  store.title = `nível ${ level }`;
  store.subtitle = `${ total - current } páginas para o próximo nível`;
};

const ExperienceStore = {
  // Por algum motivo o init estava sendo chamado uma segunda vez
  initCalled: false,
  experience: {
    id: 'experience',
    current: 0,
    level: 0,
    total: 32,
  },
  title: 'nível 0',
  subtitle: '32 páginas para o próximo nível',
  percentage: '0%',
  async init () {
    if ( this.initCalled ) return;
    this.initCalled = true;
    const [ exp ] = await find( 'experience' );
    exp ? ( this.experience = exp ) : add( 'experience', parseProxy( this.experience ) );
  },

  async onBookUpserted ( book, originalBook ) {
    const experience = parseProxy( this.experience );
    updateExperience( book, experience, originalBook );
    await put( 'experience', experience );
    this.experience = experience;
  },
  async onBookDeleted ( book ) {
    const experience = parseProxy( this.experience );
    removeExperience( book, experience );
    await put( 'experience', experience );
    this.experience = experience;
  },
  onExperienceChanged () {
    updateView( this );
  }
};

export default ExperienceStore;
