import { injector, inject } from '../src/index';
import { it } from './testLib';

class Robot {
  constructor(protected name: string) { }
  getInfo() {
    return this.name; 
  }
}

class Human {
  constructor(protected name: string) { }
  getInfo() {
    return this.name;
  }
}

class Woman extends Human {
  isCry() {
    return true;
  }
}

it('without bind', () => {
  class Arena {
    @inject()
    public robot: Robot;
  }

  let arena = new Arena();

  console.assert(arena.robot === void 0);
});

it('with bind', () => {
  const robot = new Robot('rob');
  injector.bind<Robot>(Robot).toInstance(robot);

  class Arena {
    @inject()
    public robot1: Robot;

    @inject()
    public robot2: Robot;
  }

  let arena = new Arena();

  console.assert(arena.robot1 === robot, 'robot1');
  console.assert(arena.robot2 === robot, 'robot2');
});

injector.clean();

it('with two different binds', () => {
  const robot = new Robot('rob');
  injector.bind<Robot>(Robot).toInstance(robot);

  const human = new Human('arnold');
  injector.bind<Human>(Human).toInstance(human);

  class Arena {
    @inject()
    public robot: Robot;

    @inject()
    public human: Human;
  }

  let arena = new Arena();

  console.assert(arena.robot === robot, 'robot');
  console.assert(arena.human === human, 'human');
});

injector.clean();

it('with two equal binds', () => {
  const robot1 = new Robot('rob');
  const robot2 = new Robot('rob');

  injector.bind<Robot>(Robot).toInstance(robot1);

  try {
    injector.bind<Robot>(Robot).toInstance(robot2);
  } catch (error) {
    console.assert(error != null, 'error throwed');
  }
});

injector.clean();

it('with two inherited binds', () => {
  const human = new Human('arnold');
  injector.bind<Human>(Human).toInstance(human);

  const woman = new Woman('anna');
  injector.bind<Woman>(Woman).toInstance(woman);

  class Arena {
    @inject()
    public human: Human;

    @inject()
    public woman: Woman;
  }

  let arena = new Arena();

  console.assert(arena.human === human, 'human');
  console.assert(arena.woman === woman, 'woman');
});
