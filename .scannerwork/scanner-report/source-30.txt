import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { loadProducts, Product } from '../../store/products/product.reducer';
import { Store } from '@ngrx/store';
import { selectAllProducts } from '../../store/products/product.selectors';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products$: Observable<Product[]>;

  constructor(private readonly store: Store, private readonly cartService: CartService) {
    this.products$ = this.store.select(selectAllProducts);
  }

  ngOnInit(): void {
    console.log('Dispatching loadProducts');
    this.store.dispatch(loadProducts());
  }

  addToCart(product: Product): void {
    this.cartService.addToCart({
      id: +product.id,
      name: product.name,
      price: product.price,
      quantity: 1, // Por defecto, agregar una unidad
    });
    alert(`${product.name} agregado al carrito`);
  }
}
