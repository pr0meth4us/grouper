import axios from "axios";

import { Group, ListItem } from "@/app/types/list";

const API_BASE_URL = "/auth";

export const listApi = {
  getList: async (): Promise<ListItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/lists`);

    return response.data.data;
  },

  group: async (
    listId: string,
    size: string,
    number: string,
    exclusions: string,
  ): Promise<Group[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/lists/${listId}/group?size=${size}&number${number}&$exclusions=${exclusions}`,
    );

    return response.data.data;
  },

  getListById: async (id: string): Promise<ListItem> => {
    const response = await axios.get(`${API_BASE_URL}/lists/${id}`);

    return response.data.data;
  },
};
export { ListItem };

