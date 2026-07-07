import { Admin, CustomRoutes, Resource } from 'react-admin';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import { PostList, PostCreate, PostEdit, PostShow } from './resources/posts';
import { UserProfile } from './resources/profiles'
import { Route } from 'react-router-dom';
import { defaultTheme } from 'react-admin';
import { Register } from './register';
import { Login } from './login';

const theme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    primary: {
      main: '#333333',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#555555',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    error: {
      main: '#e53e3e',
    },
  },
  typography: {
    fontFamily: 'sans-serif',
    fontSize: 14,
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#333333',
          color: '#ffffff',
          '& .MuiListItemText-primary': {
            color: '#ffffff',
          },
          '& .MuiListItemIcon-root': {
            color: '#ffffff',
          },
          '& .MuiMenuItem-root:hover': {
            backgroundColor: '#555555',
          },
        },
      },
    },
  },
};

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      theme={theme}
      loginPage={Login}
    >
      <Resource
        name="posts"
        list={PostList}
        create={PostCreate}
        edit={PostEdit}
        show = {PostShow}
      />
      <CustomRoutes noLayout>
        <Route path="/register" element={<Register />} />
      </CustomRoutes>
      <CustomRoutes>
        <Route path="/users/:userId" element={<UserProfile />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;