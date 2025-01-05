import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService, OrderRequest, OrderResponse } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });

    service = TestBed.inject(OrderService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifica que no queden solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createOrder', () => {
    it('should send a POST request to create an order and return the response', () => {
      const mockOrderRequest: OrderRequest = {
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      };

      const mockOrderResponse: OrderResponse = {
        id: 1,
        orderNumber: 'ORD-12345',
        orderDate: '2024-12-07T12:00:00Z',
        totalAmount: 100.0,
        status: 'CONFIRMED',
        products: [
          { productId: 1, name: 'Product 1', price: 40.0, quantity: 2 },
          { productId: 2, name: 'Product 2', price: 20.0, quantity: 1 },
        ],
      };

      service.createOrder(mockOrderRequest).subscribe((response) => {
        expect(response).toEqual(mockOrderResponse);
      });

      const req = httpTestingController.expectOne('http://localhost:8082/api/orders');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockOrderRequest);

      req.flush(mockOrderResponse); // Responde con el mock
    });

    it('should handle an error response', () => {
      const mockOrderRequest: OrderRequest = {
        products: [{ productId: 1, quantity: 2 }],
      };

      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

      service.createOrder(mockOrderRequest).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        },
      });

      const req = httpTestingController.expectOne('http://localhost:8082/api/orders');
      expect(req.request.method).toBe('POST');
      req.flush(null, mockErrorResponse);
    });
  });
});
