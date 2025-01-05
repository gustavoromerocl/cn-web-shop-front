import { Component, OnInit } from '@angular/core';
import { OrderService, OrderRequest, OrderResponse } from '../../services/order/order.service';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../../services/cart/cart.service';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr'; // Importa el servicio de Toastr

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  orderDetail: OrderResponse | null = null;

  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly toastr: ToastrService
  ) {}

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
    this.toastr.error('Producto eliminado del carrito', 'Carrito'); // Notificación informativa
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
    this.toastr.warning('El carrito ha sido vaciado', 'Carrito'); // Notificación de advertencia
  }

  async placeOrder(): Promise<void> {
    const orderRequest: OrderRequest = {
      products: this.cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await firstValueFrom(this.orderService.createOrder(orderRequest));
      this.orderDetail = response;
      this.clearCart();
      this.toastr.success(`¡Orden creada con éxito! Número: ${response.orderNumber}`, 'Orden'); // Notificación de éxito
    } catch (error) {
      console.error('Error al realizar la orden:', error);
      this.toastr.error('Hubo un problema al procesar la orden.', 'Error'); // Notificación de error
    }
  }
}
