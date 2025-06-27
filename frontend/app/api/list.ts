import apiClient from "./axiosConfig"; // Import the configured instance

import { Group, ListItem } from "@/app/types/list";
import { ApiResponse } from "@/app/types/auth";

const API_BASE_URL = "/auth";

export const listApi = {
  getList: async (): Promise<ListItem[]> => {
    const response = await apiClient.get(`${API_BASE_URL}/lists`);

    return response.data.data;
  },

  addList: async (req: {
    name: string;
    content?: string;
  }): Promise<ApiResponse> => {
    const response = await apiClient.post(`${API_BASE_URL}/lists/add`, {
      name: req.name,
      content: req.content || "",
    });

    return response.data;
  },

  editList: async (
      listId: string,
      req: {
        name: string;
        content?: string;
      },
  ): Promise<ApiResponse> => {
    const response = await apiClient.put(`${API_BASE_URL}/lists/${listId}`, {
      name: req.name,
      content: req.content,
    });

    return response.data;
  },

  group: async (
      listId: string,
      size: string,
      number: string,
      exclusions: string,
  ): Promise<Group[]> => {
    const url = `${API_BASE_URL}/lists/${listId}/group?${
        size ? `size=${size}` : `number=${number}`
    }&exclude=${encodeURIComponent(exclusions)}`;

    const response = await apiClient.get(url);

    return response.data.data;
  },

  getListById: async (id: string): Promise<ListItem> => {
    const response = await apiClient.get(`${API_BASE_URL}/lists/${id}`);

    return response.data.data;
  },

  deleteList: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`${API_BASE_URL}/lists/${id}`);

    return response.data;
  },

  deleteItem: async (id: string, itemIndex: number): Promise<ApiResponse> => {
    return await apiClient.delete(
        `${API_BASE_URL}/lists/${id}/items/${itemIndex}/delete`,
    );
  },

  editItem: async (
      id: string,
      itemIndex: number,
      editValue: string,
  ): Promise<ApiResponse> => {
    return await apiClient.put(
        `${API_BASE_URL}/lists/${id}/items/${itemIndex}/edit`,
        `"${editValue}"`,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        },
    );
  },

  addItem: async (id: string, newValue: string): Promise<ApiResponse> => {
    return await apiClient.post(
        `${API_BASE_URL}/lists/${id}/items/add`,
        `"${newValue}"`,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        },
    );
  },
};

export type { ListItem };
