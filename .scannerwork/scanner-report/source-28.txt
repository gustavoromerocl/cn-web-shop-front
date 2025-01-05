import { Component, OnInit } from '@angular/core';
import { OrderService, OrderRequest, OrderResponse } from '../../services/order/order.service';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../../services/cart/cart.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  orderDetail: OrderResponse | null = null;

  constructor(private readonly cartService: CartService, private readonly orderService: OrderService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  getTotal(): number {
    return this.cartService.getTotalPrice();
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  placeOrder(): void {
    const orderRequest: OrderRequest = {
      products: this.cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    (async () => {
      try {
        const response = await firstValueFrom(this.orderService.createOrder(orderRequest));
        this.orderDetail = response;
        this.clearCart();
        alert(`¡Orden creada con éxito! Número: ${response.orderNumber}`);
      } catch (error) {
        console.error('Error al realizar la orden:', error);
        alert('Hubo un problema al procesar la orden.');
      }
    })();
  }
}
