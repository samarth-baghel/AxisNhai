import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, delay, filter, map, skipWhile, switchMap, tap } from 'rxjs/operators';
import { BaseService } from '../base.service';

@Injectable()
export class EncryptDecrypt implements HttpInterceptor {
    constructor(private baseService:BaseService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if(request.method === 'POST'){
            let encryptedRequest = request.clone({body:this.baseService.encryptionFunctionObject(request.body)})//{...request,body:this.baseService.encryptionFunctionObject(request.body)};
            // console.log(encryptedRequest.body);
            return next.handle(encryptedRequest).pipe(
                skipWhile((res:any)=> !res.body),
                map((res:any)=>{
                    if(!(res.body instanceof Blob)){
                        const body = (res.body.charAt(0) === '[')?JSON.parse(res.body)[0]:res.body;
                        let resData = res.clone({body:this.baseService.dencryptionFunction(body)});
                        return resData;
                    }
                    return res;
                })
            );            
        }
        if(request.method === 'GET'){
            console.log(request);
            return next.handle(request).pipe(
                skipWhile((res:any)=> !res.body),
                map((res:any)=>{
                    console.log(res.body, res.body instanceof Blob);
                    
                    const excludedChars = ['[','{'];
                     if(!excludedChars.includes(res.body.charAt(0)) && !(res.body instanceof Blob)){
                        return res.clone({body:this.baseService.dencryptionFunction(res.body)});
                    } 
                    return res;
                })
            )
        }

        return next.handle(request);
    }
}