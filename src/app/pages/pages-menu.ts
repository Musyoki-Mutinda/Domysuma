import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Designs',
    icon: 'pantone-outline',
    link: '/design-ideas',
    home: true,
  },
  {
    title: 'Services',
    icon: 'shopping-cart-outline',
    link: '/app-pages/dashboard',
  },
  {
    title: 'Projects',
    icon: 'list-outline',
    link: '/app-pages/dashboard',
  },


  {
    title: 'APP PAGES',
    group: true,
  },
  {
    title: 'Pages',
    icon: 'book-open-outline',
    children: [
      {
        title: 'Home',
        link: '/app-pages/dashboard',
      },
      {
        title: 'Design',
        link: '/app-pages/dashboard',
      },
      {
        title: 'Services',
        link: '/app-pages/dashboard',
      },
      {
        title: 'Projects',
        link: '/app-pages/dashboard',
      },
      {
        title: 'About',
        link: '/app-pages/dashboard',
      },
      {
        title: 'Blog',
        link: '/app-pages/dashboard',
      },
      {
        title: 'Contact',
        link: '/app-pages/dashboard',
      },
    ]
  },


  {
    title: 'NOTIFICATIONS',
    group: true,
  },

  {
    title: 'Modification Request',
    icon: 'edit-2-outline',
    link: '/app-pages/dashboard',
  },
  {
    title: 'Messages',
    icon: 'email-outline',
    link: '/app-pages/dashboard',
  },
];
