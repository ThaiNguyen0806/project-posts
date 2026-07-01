import {
  List,
  SimpleList,
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
  SearchInput,
  useDelete,
  useRefresh,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { PostComments } from './comments';
import { PostLikes } from './likes';

const postFilters = [
  <SearchInput source="q" alwaysOn />,
];

const ClickableEmail = () => {
  const record = useRecordContext();
  const navigate = useNavigate();
  if (!record) return null;
  return (
    <span
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      onClick={() => navigate(`/users/${record.user_id}`)}
    >
      {record.email}
    </span>
  );
};

export const PostList = () => {
  const { identity, isLoading } = useGetIdentity();
  const [deleteOne] = useDelete();
  const refresh = useRefresh();
  const navigate = useNavigate();

  if (isLoading) return null;

  return (
    <List filters={postFilters}>
      <SimpleList
        primaryText={(record) => record.title}
        secondaryText={(record) => (
          <span>
            <span style={{ color: '#666', fontSize: '14px' }}>{record.content}</span>
            <br />
            <span
              style={{ cursor: 'pointer', textDecoration: 'underline', color: '#333', fontSize: '13px' }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigate(`/users/${record.user_id}`);
              }}
            >
              {record.email}
            </span>
          </span>
        )}
        tertiaryText={(record) => (
          <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#999', fontSize: '13px' }}>
              {new Date(record.created_at).toLocaleDateString()}
            </span>
            {record.user_id === Number(identity?.id) && (
              <>
                <span
                  style={{
                    cursor: 'pointer',
                    color: '#333',
                    fontSize: '13px',
                    padding: '2px 8px',
                    border: '1px solid #333',
                    borderRadius: '4px',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate(`/posts/${record.id}`);
                  }}
                >
                  Edit
                </span>
                <span
                  style={{
                    cursor: 'pointer',
                    color: '#e53e3e',
                    fontSize: '13px',
                    padding: '2px 8px',
                    border: '1px solid #e53e3e',
                    borderRadius: '4px',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    deleteOne(
                      'posts',
                      { id: record.id },
                      {
                        mutationMode: 'pessimistic',
                        onSuccess: () => refresh(),
                      }
                    );
                  }}
                >
                  Delete
                </span>
              </>
            )}
          </span>
        )}
        rowClick="show"
        sx={{
          '& .MuiListItem-root': {
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '6px',
            marginBottom: '12px',
            padding: '16px',
          },
          '& .MuiListItem-root:hover': {
            backgroundColor: '#f5f5f5',
            cursor: 'pointer',
          },
          '& .MuiListItemText-primary': {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '4px',
          },
          '& .MuiListItemText-secondary': {
            fontSize: '14px',
            color: '#666',
          },
        }}
      />
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
    <SimpleShowLayout
      sx={{
          '& .RaSimpleShowLayout-row': {
            fontSize: '14px',
            color: '#333',
            borderBottom: '1px solid #f0f0f0',
            padding: '8px 0',
          },
        }}
    >
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="content" />
      <ClickableEmail />
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
    <SimpleForm
      sx={{
          '& .MuiTextField-root': {
            marginBottom: '12px',
          },
        }}
    >
      <TextInput source="title" fullWidth />
      <TextInput source="content" multiline fullWidth />
    </SimpleForm>
  );
};

export const PostCreate = () => (
  <Create>
    <SimpleForm
      sx={{
          '& .MuiTextField-root': {
            marginBottom: '12px',
          },
        }}
    >
      <TextInput source="title" fullWidth />
      <TextInput source="content" multiline fullWidth />
    </SimpleForm>
  </Create>
);

export const PostEdit = () => (
  <Edit>
    <PostEditGuard />
  </Edit>
);