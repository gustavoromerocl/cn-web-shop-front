import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, PaginatedResponse } from './product.service';
import { Product } from '../../store/products/product.reducer';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifica que no queden solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('should retrieve all products and map the response content', () => {
      const mockResponse: PaginatedResponse<Product> = {
        content: [
          {
            id: '1',
            name: 'Product 1',
            price: 100,
            stock: 50,
            imageUrl: 'http://example.com/product1.jpg',
            category: 'Category 1',
          },
          {
            id: '2',
            name: 'Product 2',
            price: 200,
            stock: 30,
            imageUrl: 'http://example.com/product2.jpg',
            category: 'Category 2',
          },
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          offset: 0,
          paged: true,
          unpaged: false,
        },
        totalElements: 2,
        totalPages: 1,
        last: true,
        size: 10,
        number: 0,
        sort: { sorted: true, unsorted: false, empty: false },
        numberOfElements: 2,
        first: true,
        empty: false,
      };

      service.getAllProducts().subscribe((products) => {
        expect(products).toBeDefined();
        expect(products.length).toBe(2);
        expect(products).toEqual(mockResponse.content);
      });

      const req = httpTestingController.expectOne('http://localhost:8080/api/products');
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse); // Simula la respuesta del backend
    });

    it('should handle empty content in response', () => {
      const mockResponse: PaginatedResponse<Product> = {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          offset: 0,
          paged: true,
          unpaged: false,
        },
        totalElements: 0,
        totalPages: 0,
        last: true,
        size: 10,
        number: 0,
        sort: { sorted: true, unsorted: false, empty: false },
        numberOfElements: 0,
        first: true,
        empty: true,
      };

      service.getAllProducts().subscribe((products) => {
        expect(products).toBeDefined();
        expect(products.length).toBe(0);
      });

      const req = httpTestingController.expectOne('http://localhost:8080/api/products');
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });
  });

  describe('addProduct', () => {
    it('should send a POST request to add a new product', () => {
      const newProduct: Product = {
        id: '3',
        name: 'Product 3',
        price: 300,
        stock: 100,
        imageUrl: 'http://example.com/product3.jpg',
        category: 'Category 3',
      };

      service.addProduct(newProduct).subscribe((product) => {
        expect(product).toEqual(newProduct);
      });

      const req = httpTestingController.expectOne('http://localhost:8080/api/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);

      req.flush(newProduct); // Simula la respuesta del backend
    });
  });

  describe('removeProduct', () => {
    it('should send a DELETE request to remove a product by ID', () => {
      const productId = '1';

      service.removeProduct(productId).subscribe(() => {
        expect(true).toBeTrue(); // Verifica que la operación fue exitosa
      });

      const req = httpTestingController.expectOne(`http://localhost:8080/api/products/${productId}`);
      expect(req.request.method).toBe('DELETE');

      req.flush(null); // Simula una respuesta vacía exitosa
    });
  });
});
