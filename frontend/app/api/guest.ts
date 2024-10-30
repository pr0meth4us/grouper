import axios from "axios";

import { ApiResponse } from "@/app/types/auth";
import { Group } from "@/app/types/list";
const API_BASE_URL = "/guest";

export const guestApi = {
  uploadList: async (content: string): Promise<ApiResponse> => {
    const res = await axios.post(`${API_BASE_URL}/get-list`, {
      content: content,
    });

    return res.data;
  },

  getSessionList: async (): Promise<string[]> => {
    const res = await axios.get(`${API_BASE_URL}/get-session-list`);

    return res.data;
  },

  group: async (
    size: string,
    number: string,
    exclusions: string,
  ): Promise<Group[]> => {
    const url = `${API_BASE_URL}/grouping?${
      size ? `size=${size}` : `number=${number}`
    }&exclude=${encodeURIComponent(exclusions)}`;

    const response = await axios.get(url);

    return response.data.data;
  },
};
