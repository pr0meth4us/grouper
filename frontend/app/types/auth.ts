export interface User {
  email: string;
  lists: ListItem[];
}

export interface ListItem {
  listId: string;
  name: string;
  items: string[];
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token?: string;
  };
}
