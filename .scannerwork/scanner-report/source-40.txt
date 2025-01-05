import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8081/api';
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    role: 'admin',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const newUser = { email: 'newuser@example.com', password: 'password123' };

    service.registerUser(newUser).subscribe((response) => {
      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/signup`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);

    req.flush(mockUser, { status: 201, statusText: 'Created' });
  });

  it('should login a user and return a token', () => {
    const loginData = { email: 'john@example.com', password: '123456' };
    const mockToken = { token: 'mockToken' };

    service.login(loginData.email, loginData.password).subscribe((response) => {
      expect(response).toEqual(mockToken);
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginData);

    req.flush(mockToken);
  });

  it('should fetch user profile with token', () => {
    const mockToken = 'mockToken';
    const mockProfile = { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' };

    localStorage.setItem('token', mockToken);

    service.getProfile().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(`${apiUrl}/users/profile`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(mockProfile);
  });

  it('should find a user in memory without password', () => {
    service['users'] = [mockUser];

    const user = service.findUser('john@example.com', '123456');
    expect(user).toEqual({ id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' });
  });

  it('should return null if user is not found', () => {
    service['users'] = [];

    const user = service.findUser('nonexistent@example.com', 'wrongpassword');
    expect(user).toBeNull();
  });

  it('should return all users in memory', () => {
    service['users'] = [mockUser];

    const users = service.getAllUsers();
    expect(users).toEqual([mockUser]);
  });
});
