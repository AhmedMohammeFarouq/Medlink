import { HttpInterceptorFn } from '@angular/common/http';
import { StorageUtil } from '../utils/storage.util';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = StorageUtil.getAccessToken();

  if (token && !req.headers.has('Authorization')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
