### Login page

Login page is separated from the "dashboard" part of the application. It's defined in `src/dashboard/pages/login/index.tsx` directory. It's a Next.js page that uses `getServerSideProps()` to check if the user is already logged in. If the user is logged in, the user is redirected to the dashboard. If the user is not logged in, the login form is displayed.

The login form is defined in `src/dashboard/components/Login/LoginBox.tsx` directory. It's a login form that uses [MUI TextField](https://mui.com/components/text-fields/) and [MUI Button](https://mui.com/components/buttons/) components.
Data from the login form is sent to the server using `axios`. The server responds with a JWT access and refresh token. Both are stored in the browser's cookies.
