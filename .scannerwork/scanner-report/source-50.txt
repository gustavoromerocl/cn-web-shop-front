import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectAllProducts } from '../../store/products/product.selectors';
import { loadProducts, Product } from '../../store/products/product.reducer';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      price: 100,
      stock: 10,
      imageUrl: 'https://example.com/image1.jpg',
      category: 'Electronics',
    },
    {
      id: '2',
      name: 'Product 2',
      price: 200,
      stock: 5,
      imageUrl: 'https://example.com/image2.jpg',
      category: 'Home',
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllProducts, value: mockProducts },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select all products from the store', (done) => {
    component.products$.subscribe((products) => {
      expect(products).toEqual(mockProducts);
      done();
    });
  });

  it('should dispatch loadProducts on initialization', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadProducts());
  });
});
