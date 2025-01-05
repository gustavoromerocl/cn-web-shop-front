import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService, CartItem } from '../../services/cart/cart.service';
import { OrderService, OrderRequest, OrderResponse } from '../../services/order/order.service';
import { of, throwError } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getCartItems',
      'getTotalPrice',
      'removeFromCart',
      'clearCart',
    ]);

    orderServiceSpy = jasmine.createSpyObj('OrderService', ['createOrder']);

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: OrderService, useValue: orderServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('placeOrder', () => {
    it('should place an order successfully and clear the cart', () => {
      const mockCartItems: CartItem[] = [
        { id: 1, name: 'Item 1', price: 100, quantity: 2 },
        { id: 2, name: 'Item 2', price: 50, quantity: 1 },
      ];
      const mockOrderResponse: OrderResponse = {
        id: 1,
        orderNumber: 'ORD-12345',
        orderDate: '2024-12-07',
        totalAmount: 250,
        status: 'CONFIRMED',
        products: mockCartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      // Configura el mock de getCartItems
      cartServiceSpy.getCartItems.and.returnValue(mockCartItems);
      orderServiceSpy.createOrder.and.returnValue(of(mockOrderResponse));

      // Llama a loadCart explícitamente
      component.loadCart();

      spyOn(window, 'alert'); // Espía sobre alert
      spyOn(component, 'clearCart'); // Espía sobre clearCart

      component.placeOrder();

      expect(cartServiceSpy.getCartItems).toHaveBeenCalled(); // Verifica que getCartItems fue llamado
      expect(orderServiceSpy.createOrder).toHaveBeenCalledWith({
        products: mockCartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      expect(component.orderDetail).toEqual(mockOrderResponse);
      expect(component.clearCart).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('¡Orden creada con éxito! Número: ORD-12345');
    });

    it('should handle errors when placing an order', () => {
      const mockCartItems: CartItem[] = [
        { id: 1, name: 'Item 1', price: 100, quantity: 2 },
      ];

      cartServiceSpy.getCartItems.and.returnValue(mockCartItems);
      orderServiceSpy.createOrder.and.returnValue(throwError(() => new Error('Order failed')));

      // Llama a loadCart explícitamente
      component.loadCart();

      spyOn(window, 'alert'); // Espía sobre alert

      component.placeOrder();

      expect(cartServiceSpy.getCartItems).toHaveBeenCalled(); // Verifica que getCartItems fue llamado
      expect(orderServiceSpy.createOrder).toHaveBeenCalledWith({
        products: mockCartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      expect(component.orderDetail).toBeNull();
      expect(window.alert).toHaveBeenCalledWith('Hubo un problema al procesar la orden.');
    });
  });
});

