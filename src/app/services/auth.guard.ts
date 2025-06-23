import { CanActivateFn } from '@angular/router'; 
import { inject } from '@angular/core'; 
import { Router } from '@angular/router'; 
 
export const canActivateFn: CanActivateFn = (_route, _state) => { 
  const router = inject(Router); 
  const isToken = localStorage.getItem('accessToken'); 
 
  //if (isToken) { 
    return true; 
 // }  
 
    // Redirige al login 
    router.navigate(['/login']); 
    return false; 
};