import { type DataProvider, type GetListParams, type GetOneParams, type CreateParams, type UpdateParams, type DeleteParams } from "react-admin";

const API_URL = 'http://localhost:3000';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const dataProvider: DataProvider = {
  getList: async (resource, params: GetListParams) => {
    const page = params.pagination?.page ?? 1;
    const perPage = params.pagination?.perPage ?? 10;

    let url = `${API_URL}/${resource}`;

    if (resource === 'comments' && params.meta?.postId) {
        url = `${API_URL}/comments/${params.meta.postId}`;
    } else if (resource === 'posts' && params.filter?.q) {
        url = `${API_URL}/posts/search?q=${params.filter.q}`;
    } else if (resource === 'posts' && params.meta?.userId) {
        url = `${API_URL}/posts/user/${params.meta.userId}`;
    }

    const response = await fetch(url, {
      headers: getHeaders(),
    });
    const json = await response.json();
    const data = json[resource] ?? json.data ?? [];
    return {
      data: data.slice((page - 1) * perPage, page * perPage),
      total: data.length,
    };
  },

  getOne: async (resource, params: GetOneParams) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      headers: getHeaders(),
    });
    const json = await response.json();
    const key = Object.keys(json)[0];
    return { data: json[key] };
  },

  getMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${resource}/${id}`, { headers: getHeaders() })
          .then((res) => res.json())
          .then((json) => {
            const key = Object.keys(json)[0];
            return json[key];
          })
      )
    );
    return { data: results };
  },

  getManyReference: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.target}/${params.id}`, {
      headers: getHeaders(),
    });
    const json = await response.json();
    const data = json[resource] ?? json.data ?? [];
    return { data, total: data.length };
  },

  create: async (resource, params: CreateParams) => {
    let url = `${API_URL}/${resource}`;

     if (resource === 'comments' && params.meta?.postId) {
        url = `${API_URL}/comments/${params.meta.postId}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params.data),
    });
    const json = await response.json();
    const key = Object.keys(json)[0];
    return { data: json[key] };
  },

  update: async (resource, params: UpdateParams) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(params.data),
    });
    const json = await response.json();
    const key = Object.keys(json)[0];
    return { data: json[key] };
  },

  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(params.data),
        })
      )
    );
    return { data: params.ids };
  },

  delete: async (resource, params: DeleteParams) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await response.json();
    return { data: json };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        fetch(`${API_URL}/${resource}/${id}`, {
          method: 'DELETE',
          headers: getHeaders(),
        })
      )
    );
    return { data: params.ids };
  },
};

export default dataProvider;