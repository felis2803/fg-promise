module.exports = function(){
    // в этих переменных хранятся состояния и функции промиса
    // они будут замкнуты, а доступ к ним - через геттеры и сеттеры
    let resolve, reject;
    let result      = undefined;
    let error       = null;
    let state       = 'pending';        // string: 'pending' | 'resolved' | 'rejected'
    let isPending   = true;
    let isResolved  = false;
    let isRejected  = false;
    let isSettled   = false;
    let onresolve   = undefined;
    let onreject    = undefined;
    let onsettle    = undefined;
    // 
    let promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    // 
    Object.defineProperties(promise, {
        // этот метод разрешает промис со значением, переданным ему в качестве аргумента,
        //   который будет записан в result
        // в нем будут установлены соответствующие статус и флаги, и синхронно вызваны
        //   onresolve и onsettle
        // метод вернет true, если промис был в состоянии ожидания и false - если он был завершен
        resolve: {
            value: (res) => {
                if(!isPending) return false;
                result      = res;
                state       = 'resolved';
                isPending   = false;
                isResolved  = true;
                isSettled   = true;
                resolve(result);
                if(onresolve) onresolve(result);
                if(onsettle) onsettle(result, error, true);
                return true;
            },
            enumerable: false,
            writable: false,
            configurable: false
        },
        // этот метод отклоняет промис с указанным в качестве аргумента значением, которое
        //   будет записано в error
        // в нем будут установлены соответствующие статус и флаги, и синхронно вызваны
        //   onreject и onsettle
        // метод вернет true, если промис был в состоянии ожидания и false - если он был завершен
        reject: {
            value: (err) => {
                if(!isPending) return false;
                error       = err;
                state       = 'rejected';
                isPending   = false;
                isRejected  = true;
                isSettled   = true;
                reject(error);
                if(onreject) onreject(error);
                if(onsettle) onsettle(result, error, false);
                return true;
            },
            enumerable: false,
            writable: false,
            configurable: false
        },
        result: {
            get: () => {return result},
            enumerable: true,
            configurable: false
        },
        error: {
            get: () => {return error},
            enumerable: true,
            configurable: false
        },
        state: {
            get: () => {return state},
            enumerable: true,
            configurable: false
        },
        isPending: {
            get: () => {return isPending},
            enumerable: true,
            configurable: false
        },
        isResolved: {
            get: () => {return isResolved},
            enumerable: true,
            configurable: false
        },
        isRejected: {
            get: () => {return isRejected},
            enumerable: true,
            configurable: false
        },
        isSettled: {
            get: () => {return isSettled},
            enumerable: true,
            configurable: false
        },
        onresolve: {
            get: () => {return onresolve},
            set: (callback) => {
                if(typeof callback != 'function') throw new Error('onresolve must be a function');
                else{
                    onresolve = callback;
                    if(isResolved) callback(result);
                }
            },
            enumerable: false,
            configurable: false
        },
        onreject: {
            get: () => {return onreject},
            set: (callback) => {
                if(typeof callback != 'function') throw new Error('onreject must be a function');
                else{
                    onreject = callback;
                    if(isRejected) callback(error);
                }
            },
            enumerable: false,
            configurable: false
        },
        onsettle: {
            get: () => {return onsettle},
            set: (callback) => {
                if(typeof callback != 'function') throw new Error('onsettle must be a function');
                else{
                    onsettle = callback;
                    if(isSettled) callback(result, error, isResolved);
                }
            },
            enumerable: false,
            configurable: false
        },
    });
    // 
    return promise;
};