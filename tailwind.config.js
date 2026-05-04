/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.hbs', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        page: '#f3f3f3',
        ink: '#000000',
        divider: '#c7c7c7',
        orange: '#eea302',
        orangeBorder: '#593e03',
        coral: '#ff3b25',
        coralBorder: '#55140c',
        teal: '#80d8da',
        tealBorder: '#135454',
        navHover: '#926402',
      },
      fontFamily: {
        worksansSemi: ['worksans-semibold', '"work sans"', 'sans-serif'],
        avenir: ['avenir-lt-w01_35-light1475496', 'sans-serif'],
        din: ['din-next-w01-light', 'sans-serif'],
      },
      fontSize: {
        hello: ['100px', { lineHeight: '1.4em' }],
        h1page: ['42px', { lineHeight: '1.4em' }],
        h2section: ['26px', { lineHeight: '1.4em' }],
        navname: ['22px', { lineHeight: 'normal' }],
        body: ['16px', { lineHeight: '1.4em' }],
        footerlabel: ['18px', { lineHeight: 'normal' }],
        copyright: ['13px', { lineHeight: '1.4em' }],
      },
      maxWidth: {
        site: '980px',
      },
      spacing: {
        'btn-circle': '140px',
      },
    },
  },
  plugins: [],
};
