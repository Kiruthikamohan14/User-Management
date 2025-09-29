export interface AuthState {
  token: string | null;
  user: User | null; // <- match the API type
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface User {
  id: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}


export interface UsersState {
  allUsers: User[];   // all users from API
  users: User[];      // filtered/paginated users
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  search: string;     // for search filter
  perPage: number;    // items per page
}

