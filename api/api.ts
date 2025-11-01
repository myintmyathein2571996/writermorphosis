import axios from "axios";

const api = axios.create({
  // baseURL: "https://writermorphosis.com/wp-json/wp/v2",
  baseURL: "http://192.168.78.155/wp-writerposis/wp-json",
  timeout: 10000,
});

export const getCategories = async () => {
  const res = await api.get("/wp/v2/categories", { params: { per_page: 100 } });
  return res.data;
};


export const getLatestPosts = async (
  page = 1,
  perPage = 6,
  extraParams: Record<string, any> = {}
) => {
  const params: any = {
    _embed: true,
    page,
    per_page: perPage,
    status: "publish",
    orderby: "date",
    order: "desc",
    ...extraParams, // merge any extra query params like { author: 1 }
  };

  const res = await api.get("/wp/v2/posts", { params });

  return {
    data: res.data,
    totalPages: parseInt(res.headers['x-wp-totalpages'] || '1', 10),
  };
};

export const getPopularCategories = async (limit = 10) => {
  const res = await api.get("/wp/v2/categories", { params: { per_page: 100 } });

  // Sort categories by post count (descending)
  const sorted = res.data.sort((a: any, b: any) => b.count - a.count);

  // Return top `limit` categories
  return sorted.slice(0, limit);
};


export const getPopularTags = async (limit = 10) => {
  const res = await api.get("/wp/v2/tags", { params: { per_page: 100 } });

  // Sort categories by post count (descending)
  const sorted = res.data.sort((a: any, b: any) => b.count - a.count);

  // Return top `limit` categories
  return sorted.slice(0, limit);
};


export const getTags = async () => {
  const res = await api.get("/wp/v2/tags", { params: { per_page: 100 } });
  return res.data;
};

export const getPostsByCategory = async (categoryId: number) => {
  const res = await api.get("/wp/v2/posts", {
    params: { categories: categoryId, _embed: true, per_page: 20 },
  });
  return res.data;
};


export const getPopularPosts = async (page = 1, perPage = 6) => {
 const res = await api.get(`/custom/v1/popular-posts?per_page=${perPage}&page=${page}`);

  return {
    data: res.data,
    totalPages: parseInt(res.headers['x-wp-totalpages'] || '1', 10),
  };
};