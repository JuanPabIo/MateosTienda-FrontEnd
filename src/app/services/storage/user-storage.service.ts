import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOKEN = 'ecom-token';
const USER = 'ecom-user';
const FAVORITES_KEY = 'ecom-favorites';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  private cartItemsSubject = new BehaviorSubject<number>(0);
  cartItems$ = this.cartItemsSubject.asObservable();
  
  constructor() { }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  public saveUser(user): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  public saveFavorites(favorites: any[]): void {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  public getFavorites(): any[] {
    const favoritesString = window.localStorage.getItem(FAVORITES_KEY);
    return favoritesString ? JSON.parse(favoritesString) : [];
  }

  static getToken(): string {
    return localStorage.getItem(TOKEN);
  }

  static getUser(): any {
    const userString = localStorage.getItem(USER);
    return userString ? JSON.parse(userString) : null;
  }

  static getUserId(): string {
    const user = this.getUser();
    return user ? user.userId : '';
  }

  static getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : '';
  }

  static isAdminLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && this.getUserRole() === 'ADMIN';
  }

  static isCustomerLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && this.getUserRole() === 'CUSTOMER';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }

  updateCartItemCount(count: number) {
    this.cartItemsSubject.next(count);
  }
}
