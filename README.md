# Что это?
Обёртка для промиса.

# Установка
```
npm fg-promise
```

# Инициализация и использование
```js
const exPromise = require('ex-promise');

let promise = new exPromise;

(async function(){
    try{
        let result = await promise;
        console.log('Промис разрешен с результатом:', result);
    }catch(error){
        console.log('Промис отклонен с ошибкой:', error);
    }
})();

setTimeout(promise.resolve.bind(promise, 42), Math.round(Math.random()*1000));
setTimeout(promise.reject.bind(promise, -42), Math.round(Math.random()*1000));
```

# Интерфейс

## promise.resolve(result)
- **result**: значение, с которым должен завершиться промис.
- **Returns** \<boolean>:
    - `true`: если состояние промиса успешно изменено на `'resolved'`.
    - `false`: если состояние промиса изменить не удалось; такое возможно, когда к моменту вызова **resolve** промис был не ожидающим, но завершенным.

Если состояние промиса было `'pending'`, то в результате выполнения данной функции оно будет изменено на `'resolved'`, флаги **isResolved** и **isSettled** будут установлены в `true`, флаг **isPending** - `false`. Также будут запущены **onresolve** и **onsettle**, если они утсановлены.

## promise.reject(error)
- **error**.
- **Returns** \<boolean>:
    - `true`: если состояние промиса успешно изменено на `'rejected'`.
    - `false`: если состояние промиса изменить не удалось; такое возможно, когда к моменту вызова **reject** промис был не ожидающим, но завершенным.
    
Если состояние промиса было `'pending'`, то в результате выполнения данной функции оно будет изменено на `'rejected'`, флаги **isRejected** и **isSettled** будут установлены в `true`, флаг **isPending** - `false`. Также будут запущены **onreject** и **onsettle**, если они утсановлены.

## Переменные
- **promise.result**;
- **promise.error**;
- **promise.state** \<string>: `'pending'` | `'resolved'` | `'rejected'`;
- **promise.isPending** \<boolean>;
- **promise.isResolved** \<boolean>;
- **promise.isRejected** \<boolean>;
- **promise.isSettled** \<boolean>.

## Функции обратного вызова
```js
promise.onresolve = (result) => { console.log('Resolved with result:', result) };

promise.onreject = (error) => { console.log('Rejected with error:', error) };

promise.onsettle = (result, error, isResolved) => {
    if(isResolved) console.log('Resolved with result:', result);
    else console.log('Rejected with error:', error);
}
```