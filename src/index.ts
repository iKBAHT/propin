import "reflect-metadata";
import { hashCode } from './hash';

type ClassInstance = Object;

export interface Newable<T> {
  new (...args: any[]): T;
}

export interface BindCases<T> {
  toInstance: (instance: T) => void
}

const PROPERTY_TYPE_METADATA = 'design:type';
const INJECTION_INSTANCE_METADATA = Symbol();
let kernel: Map<number, ClassInstance> = new Map();

export const injector = {
  bind: function <T extends Object>(classConstructor: Newable<T>): BindCases<T> {
    return {
      toInstance: (instance: T): void => {
        const classConstructorHash = hashCode(classConstructor.toString());
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
    if (!classConstructor) {
      throw new Error('cannot find type of propperty ' + key + ' in ' + proto);
    }
    let resolve = (): ClassInstance => {
      const instance = kernel.get(hashCode(classConstructor.toString()));
      if (!instance) {
        throw new Error('cannot find binded instance for ' + classConstructor);
      }
      return instance;
    };

    defineProperty(proto, key, resolve);
  };
}

function defineProperty(
  proto: any,
  key: string,
  resolve: () => ClassInstance
) {

  function getter() {
    if (!Reflect.hasMetadata(INJECTION_INSTANCE_METADATA, proto, key)) {
      setter(resolve());
    }
    return Reflect.getMetadata(INJECTION_INSTANCE_METADATA, proto, key);
  }

  function setter(newInstance: ClassInstance) {
    Reflect.defineMetadata(INJECTION_INSTANCE_METADATA, newInstance, proto, key);
  }

  Object.defineProperty(proto, key, {
    configurable: true,
    enumerable: true,
    get: getter,
    set: setter
  });
}
