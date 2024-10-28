import axios from "axios";

export interface ListItem {
  listId: string;
  name: string;
  items: string[];
  createdAt: string;
}

const API_BASE_URL = '/auth';

export const listApi = {
  getList: async (): Promise<ListItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/lists`);
    return response.data.data;
  }
};