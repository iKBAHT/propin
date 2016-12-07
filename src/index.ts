import "reflect-metadata";

type ClassInstance = Object;

export interface Newable<T> {
  new (...args: any[]): T;
}

interface BindCases<T> {
  toInstance: (instance: T) => void
}

const PROPERTY_TYPE_METADATA = 'design:type';
let kernel: Map<string, ClassInstance> = new Map();

export const injector = {
  bind: function <T extends Object>(classConstructor: Newable<T>): BindCases<T> {
    return {
      toInstance: (instance: T): void => {
        const classConstructorHash = classConstructor.toString();
        const prevBind = kernel.get(classConstructorHash);
        if (prevBind) {
          throw new Error(classConstructor + ' already has been binded to ' + prevBind);
        }
        kernel.set(classConstructorHash, instance);
      }
    }
  },
  clean: function (): void {
    kernel.clear();
  }
};

export function inject() {
  return function (proto: any, key: string): void {
    const classConstructor: Newable<any> = Reflect.getMetadata(PROPERTY_TYPE_METADATA, proto, key);
    let resolve = (): ClassInstance | undefined => {
      const instance = kernel.get(classConstructor.toString());
      return instance;
    };

    defineProperty(proto, key, resolve);
  };
}

function defineProperty(
  proto: any,
  key: string,
  resolve: () => ClassInstance | undefined
) {
  Object.defineProperty(proto, key, {
    configurable: false,
    enumerable: true,
    writable: false,
    value: resolve()
  });
}
