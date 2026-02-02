export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  username?: string;
}

export interface CreateUserResponse {
  id: number;
  name: string;
  email: string;
}

export interface UpdateUserResponse extends User {}

export interface DeleteUserResponse {}
