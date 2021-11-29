import { isEmpty, normalizeString } from '../utils/functions';

const adjustHeight = (ms) =>
  setTimeout(() => {
    const modal = document.getElementById`modal-edit`;
    if (!modal) return;
    const y = modal.getBoundingClientRect().y;
    const tagsContainer = modal.querySelector('article');

    if (y < 0) {
      const height = tagsContainer.getBoundingClientRect().height + y;
      return (tagsContainer.style.height = `${height}px`);
    }

    const hasScroll = tagsContainer.scrollHeight > tagsContainer.clientHeight;
    !hasScroll && (tagsContainer.style.height = 'auto');
  }, ms);

const newBook = (book) => ({
  id: book?.id,
  title: book?.title,
  currentPage: book?.currentPage,
  totalPages: book?.totalPages,
  tags: book?.tags ? [...book.tags] : [],
});

const ModalEditStore = {
  open: false,
  book: newBook(),
  error: false,
  toggle(book) {
    this.open = !this.open;
    this.error = false;
    this.book = newBook( book );
  },
  addTag(input) {
    const { value } = input;
    const tag = normalizeString(value ?? '');
    if (isEmpty(tag) || this.book.tags.includes(tag)) return;
    this.book.tags.push(tag);
    input.value = '';
    this.adjustModalHeight();
  },
  removeTag(tag) {
    const i = this.book.tags.indexOf(tag);
    i >= 0 && this.book.tags.splice(i, 1);
    this.adjustModalHeight();
  },
  adjustModalHeight() {
    // Chamando a funcao varias vezes em diferentes MS para garantir a funcionalidade (as vezes a tag demora para ir para tela )
    [25, 50, 75, 100, 125, 150, 175, 200].forEach(adjustHeight);
  },
};

export default ModalEditStore;
