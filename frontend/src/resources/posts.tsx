import {
  List,
  Datagrid,
  TextField,
  DateField,
  Create,
  Edit,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextInput,
  EditButton,
  DeleteButton,
  useGetIdentity,
  useRecordContext,
  useRedirect,
} from 'react-admin';
import { PostComments } from './comments';
import { PostLikes } from './likes';

export const PostList = () => {
  const { identity, isLoading } = useGetIdentity();

  if (isLoading) return null;

  return (
    <List>
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="content" />
        <TextField source="email" />
        <DateField source="created_at" />
        <OwnerActions currentUserId={identity?.id} />
      </Datagrid>
    </List>
  );
};

const OwnerActions = ({ currentUserId }: { currentUserId: any }) => {
  const record = useRecordContext();
  if (!record || record.user_id !== Number(currentUserId)) return null;
  return (
    <>
      <EditButton />
      <DeleteButton />
    </>
  );
};

export const PostShow = () => {
  const { identity } = useGetIdentity();

  return (
    <Show>
      <PostShowContent currentUserId={identity?.id} />
    </Show>
  );
};

const PostShowContent = ({ currentUserId }: { currentUserId: any }) => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="content" />
      <TextField source="email" />
      <DateField source="created_at" />
      {record.user_id === Number(currentUserId) && (
        <>
          <EditButton />
          <DeleteButton />
        </>
      )}
      <PostLikes />
      <PostComments />
    </SimpleShowLayout>
  );
};

const PostEditGuard = () => {
  const record = useRecordContext();
  const { identity } = useGetIdentity();
  const redirect = useRedirect();

  if (!record || !identity) return null;

  if (record.user_id !== Number(identity.id)) {
    redirect('/posts');
    return null;
  }

  return (
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="content" multiline />
    </SimpleForm>
  );
};

export const PostCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="content" multiline />
    </SimpleForm>
  </Create>
);

export const PostEdit = () => (
  <Edit>
    <PostEditGuard />
  </Edit>
);