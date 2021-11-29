const NavigationStore = {
  open: false,
  page: 'books',
  next: {
    route: 'rewards',
    title: 'Recompensas',
  },
  toggle() {
    this.open = !this.open;
  },
};

export default NavigationStore;
