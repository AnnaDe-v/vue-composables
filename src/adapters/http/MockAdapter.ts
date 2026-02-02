import type { IHttpClient, HttpRequestOptions, HttpResponse } from '../../ports/IHttpClient';
import type { User, CreateUserDto, CreateUserResponse } from '../../api/types';


export class MockAdapter implements IHttpClient {
  private users: User[] = [];
  private nextId = 1;
  private delayMs: number;

  constructor(delayMs = 300) {
    this.delayMs = delayMs;
    this.seedUsers();
  }

  private async delay(): Promise<void> {
    return new Promise((r) => setTimeout(r, this.delayMs));
  }

  private seedUsers(): void {
    this.users = [
      this.makeUser(1, 'Leanne Graham', 'Sincere@april.biz', 'Bret'),
      this.makeUser(2, 'Ervin Howell', 'Shanna@melissa.tv', 'Antonette'),
      this.makeUser(3, 'Clementine Bauch', 'Nathan@yesenia.net', 'Samantha'),
    ];
    this.nextId = 4;
  }

  private makeUser(
    id: number,
    name: string,
    email: string,
    username: string
  ): User {
    return {
      id,
      name,
      email,
      username,
      phone: '',
      website: '',
      company: { name: '', catchPhrase: '', bs: '' },
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: { lat: '', lng: '' },
      },
    };
  }

  private fakeHeaders(): Headers {
    const h = new Headers();
    h.set('Content-Type', 'application/json');
    return h;
  }

  private okResponse<T>(data: T, status = 200): HttpResponse<T> {
    return {
      data,
      status,
      statusText: 'OK',
      headers: this.fakeHeaders(),
      ok: true,
    };
  }

  async get<T>(url: string, _options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    await this.delay();

    if (url.includes('/users') && !url.match(/\/users\/\d+/)) {
      return this.okResponse(this.users as unknown as T);
    }

    const idMatch = url.match(/\/users\/(\d+)/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      const user = this.users.find((u) => u.id === id);
      if (user) return this.okResponse(user as unknown as T);
    }

    return this.okResponse({} as T);
  }

  async post<T>(url: string, body?: unknown, _options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    await this.delay();

    if (url.includes('/users') && !url.match(/\/users\/\d+/)) {
      const dto = body as CreateUserDto;
      const newUser: User = this.makeUser(
        this.nextId++,
        dto?.name ?? 'Mock User',
        dto?.email ?? 'mock@example.com',
        'mock'
      );
      this.users.push(newUser);
      const response: CreateUserResponse = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      return this.okResponse(response as unknown as T, 201);
    }

    return this.okResponse(body as T, 201);
  }

  async put<T>(url: string, body?: unknown, _options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    await this.delay();

    const idMatch = url.match(/\/users\/(\d+)/);
    if (idMatch && body && typeof body === 'object') {
      const id = Number(idMatch[1]);
      const idx = this.users.findIndex((u) => u.id === id);
      if (idx >= 0) {
        const updated = { ...this.users[idx], ...(body as Partial<User>) };
        this.users[idx] = updated as User;
        return this.okResponse(updated as unknown as T);
      }
    }

    return this.okResponse(body as T);
  }

  async patch<T>(url: string, body?: unknown, _options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    return this.put<T>(url, body, _options);
  }

  async delete<T>(url: string, _options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    await this.delay();

    const idMatch = url.match(/\/users\/(\d+)/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      this.users = this.users.filter((u) => u.id !== id);
      return this.okResponse({} as T, 204);
    }

    return this.okResponse({} as T, 204);
  }
}
