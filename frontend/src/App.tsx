import { Admin, Resource } from 'react-admin';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import { PostList, PostCreate, PostEdit, PostShow } from './resources/posts';

function App() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
    >
      <Resource
        name="posts"
        list={PostList}
        create={PostCreate}
        edit={PostEdit}
        show = {PostShow}
      />
    </Admin>
  );
}

export default App;