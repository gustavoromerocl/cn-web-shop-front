import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    // Limpia localStorage antes de cada prueba
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCartItems', () => {
    it('should return an empty array when no items are in the cart', () => {
      const items = service.getCartItems();
      expect(items).toEqual([]);
    });

    it('should return items from localStorage', () => {
      const mockCart: CartItem[] = [
        { id: 1, name: 'Item 1', price: 10, quantity: 2 },
      ];
      localStorage.setItem('shoppingCart', JSON.stringify(mockCart));

      const items = service.getCartItems();
      expect(items).toEqual(mockCart);
    });
  });

  describe('addToCart', () => {
    it('should add a new item to the cart', () => {
      const item: CartItem = { id: 1, name: 'Item 1', price: 10, quantity: 1 };
      service.addToCart(item);

      const cart = service.getCartItems();
      expect(cart.length).toBe(1);
      expect(cart[0]).toEqual(item);
    });

    it('should increase the quantity of an existing item in the cart', () => {
      const item: CartItem = { id: 1, name: 'Item 1', price: 10, quantity: 1 };
      service.addToCart(item);

      const additionalItem: CartItem = {
        id: 1,
        name: 'Item 1',
        price: 10,
        quantity: 2,
      };
      service.addToCart(additionalItem);

      const cart = service.getCartItems();
      expect(cart.length).toBe(1);
      expect(cart[0].quantity).toBe(3); // 1 + 2
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from the cart', () => {
      const item: CartItem = { id: 1, name: 'Item 1', price: 10, quantity: 1 };
      service.addToCart(item);

      service.removeFromCart(1);

      const cart = service.getCartItems();
      expect(cart.length).toBe(0);
    });

    it('should not affect other items in the cart', () => {
      const item1: CartItem = { id: 1, name: 'Item 1', price: 10, quantity: 1 };
      const item2: CartItem = { id: 2, name: 'Item 2', price: 20, quantity: 1 };
      service.addToCart(item1);
      service.addToCart(item2);

      service.removeFromCart(1);

      const cart = service.getCartItems();
      expect(cart.length).toBe(1);
      expect(cart[0]).toEqual(item2);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from the cart', () => {
      const item: CartItem = { id: 1, name: 'Item 1', price: 10, quantity: 1 };
      service.addToCart(item);

      service.clearCart();

      const cart = service.getCartItems();
      expect(cart.length).toBe(0);
    });
  });

  describe('getTotalPrice', () => {
    it('should return 0 when the cart is empty', () => {
      const total = service.getTotalPrice();
      expect(total).toBe(0);
    });

    it('should return the correct total price', () => {
      const item1: CartItem = { id: 1, name: 'Item 1', price: 10, quantity: 2 };
      const item2: CartItem = { id: 2, name: 'Item 2', price: 20, quantity: 1 };
      service.addToCart(item1);
      service.addToCart(item2);

      const total = service.getTotalPrice();
      expect(total).toBe(40); // (10 * 2) + (20 * 1)
    });
  });
});
