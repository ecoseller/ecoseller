## Layout of the dashboard

This section describes the layout of the dashboard. The dashboard is divided into three main areas: the header, the sidebar, and the main content area. The header contains the logo, the title, and user menu. The sidebar contains the navigation menu. The main content area contains the content of the page which changes.

The header and sidebar are fixed and always visible. The main content area is scrollable.

The header and sidebar are responsive. On small screens, the sidebar is hidden and can be opened by clicking the hamburger menu in the header.

Layout of the dashboard is created using nested layouts with [`getLayout()` pattern](https://nextjs.org/docs/basic-features/layouts#per-page-layouts). The main layout is defined in `src/dashboard/pages/layout.tsx`. The main layout contains only global definitions of font family and it's sizes in the MUI ThemeProvider component. The main layout of dashboard itself (excl. login page, etc.) is defined in `src/dashboard/pages/dashboard/layout.tsx`. The dashboard layout contains the header and sidebar.

### Header

The header is defined in `src/dashboard/components/Dashboard/Header.tsx` directory.

### Sidebar

The sidebar is defined in `src/dashboard/components/Dashboard/Nav.tsx` directory. It contains collapsible navigation menu made using [MUI Drawer](https://mui.com/material-ui/react-drawer/).
