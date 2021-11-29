import Alpine from 'alpinejs';

import ExperienceStore from './application/stores/experience';
import BookStore from './application/stores/book';
import ModalEditStore from './application/stores/modal-edit';
import ModalDeleteStore from './application/stores/modal-delete';
import NavigationStore from './application/stores/navigation';
import InfoStore from './application/stores/info';

Alpine.store( 'experience', ExperienceStore );
Alpine.store( 'info', InfoStore );
Alpine.store( 'book', BookStore );

Alpine.store( 'modalEdit', ModalEditStore );
Alpine.store( 'modalDelete', ModalDeleteStore );

Alpine.store( 'nav', NavigationStore );

Alpine.start();

if ( 'serviceWorker' in navigator )
	navigator.serviceWorker
		.register( '/sw.js' )
		.then( function () {
			console.log( 'Service worker registered!' );
		} )
		.catch( function ( err ) {
			console.log( err );
		} );