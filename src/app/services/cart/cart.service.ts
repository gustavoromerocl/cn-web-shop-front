import { Injectable } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey = 'shoppingCart';

  getCartItems(): CartItem[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addToCart(item: CartItem): void {
    const cart = this.getCartItems();
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  removeFromCart(itemId: number): void {
    const cart = this.getCartItems().filter((item) => item.id !== itemId);
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  clearCart(): void {
    localStorage.removeItem(this.storageKey);
  }

  getTotalPrice(): number {
    return this.getCartItems().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
}
