export interface LogMethodOptions {
  printStackTrace?: boolean;
}

export function LogMethod(options?: LogMethodOptions): MethodDecorator {
  console.log('Evaluate Log decorator');
  return (
    target: object,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    return {
      value(...args: any[]): any {
        console.groupCollapsed(`${target.constructor.name}.${propertyKey}()`);

        console.groupCollapsed('Arguments:');
        console.log(args);
        console.groupEnd();

        if (options && options.printStackTrace) {
          console.groupCollapsed('Call stack');
          console.log(new Error().stack);
          console.groupEnd();
        }

        console.group('Function logs');
        const result: any = propertyDescriptor.value.apply(this, args);
        console.groupEnd();

        console.groupCollapsed('Function result');
        console.log(result);
        console.groupEnd();

        console.groupEnd();
        return result;
      }
    };
  };
}

export function LogConstructor<T extends new (...args: any[]) => {}>(
  ctor: T
): any {
  // const Wrapper: any = function NewCTor(...args: any[]): any {
  //   class Wrapper extends ctor {
  //     constructor(...childArgs: any[]) {
  //       console.log(`${ctor.name}.constructor`, ...childArgs);
  //       super(...childArgs);
  //     }
  //   }
  //
  //
  //   return new Wrapper(...args);
  // };
  // Wrapper.prototype = Object.create(ctor.prototype);
  //
  // // // Object.setPrototypeOf(Wrapper.prototype, ctor.prototype);
  // // console.log(ctor);
  // // console.log(Wrapper);
  // // console.log(new ctor());
  // // console.log(new Wrapper());
  // return Wrapper;

  console.log('Decorator');

  function Wrapper(...args: any[]): any {
    console.group('Constructing ' + ctor.name);
    const inst = new ctor(...args);
    console.groupEnd();
    return inst;
  }

  Wrapper.prototype = Object.create(ctor.prototype);
  return Wrapper;

  // const original = ctor;
  // // tslint:disable-next-line:typedef
  // const wrapper: any = function Wrapper(...args) {
  //   // tslint:disable-next-line:typedef
  //   const c: any = function ChildConstructor() {
  //     console.groupCollapsed(`${original.name}.constructor()`);
  //     const inst = original.apply(this, arguments);
  //     console.groupEnd();
  //     return inst;
  //   };
  //   c.prototype = Object.create(original.prototype); // c.prototype = {__proto__: original.prototype}
  //   const instance = new c(...args);
  //   console.log(instance);
  //   return instance;
  // };
  //
  // wrapper.prototype = Object.create(ctor.prototype);
  // return wrapper;
}
