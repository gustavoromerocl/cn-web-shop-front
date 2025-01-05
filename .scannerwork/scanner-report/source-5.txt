import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderRequest {
  products: { productId: number; quantity: number }[];
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  products: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = 'http://localhost:8082/api/orders';

  constructor(private readonly http: HttpClient) {}

  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, order);
  }
}
