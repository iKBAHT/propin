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

  let arena: Arena;
  try {
    arena = new Arena();
  } catch (error) {
    console.assert(error != null, 'error throwed');
    console.assert(error.toString().indexOf('cannot find binded instance for') !== -1);
  }
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

  console.assert(arena.robot1 === robot, 'robot1 second check');
  console.assert(arena.robot2 === robot, 'robot2 second check');
});

injector.clean();

it('change bind on the fly', () => {
  class Arena {
    @inject()
    public robot: Robot;
  }

  const robot1 = new Robot('rob1');
  injector.bind<Robot>(Robot).toInstance(robot1);
  let arena1 = new Arena();

  console.assert(arena1.robot === robot1, 'robot1');


  const robot2 = new Robot('rob2');
  injector.clean();
  injector.bind<Robot>(Robot).toInstance(robot2);
  let arena2 = new Arena();

  console.assert(arena2.robot === robot2, 'robot2');
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
    console.assert(error.toString().indexOf('already has been binded to') !== -1);
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

injector.clean();

it('inject in inherited class', () => {
  const robot = new Robot('rob');
  injector.bind<Robot>(Robot).toInstance(robot);

  const human = new Human('arnold');
  injector.bind<Human>(Human).toInstance(human);

  const woman = new Woman('anna');
  injector.bind<Woman>(Woman).toInstance(woman);

  class Arena {
    @inject()
    public robot1: Robot;

    @inject()
    public human1: Human;
  }

  class NewArena extends Arena {
    @inject()
    public robot2: Robot;

    @inject()
    public human2: Human;

    @inject()
    public woman: Woman;
  }

  let arena = new NewArena();

  console.assert(arena.robot1 === robot, 'robot1');
  console.assert(arena.robot2 === robot, 'robot2');
  console.assert(arena.human1 === human, 'human1');
  console.assert(arena.human2 === human, 'human2');
  console.assert(arena.woman === woman, 'woman');
});

injector.clean();

it('set prop by hand', () => {
  class Arena {
    @inject()
    public robot: Robot;
  }

  const robot1 = new Robot('rob1');
  injector.bind<Robot>(Robot).toInstance(robot1);
  let arena1 = new Arena();
  let arena2 = new Arena();

  const robot2 = new Robot('rob2');
  arena1.robot = robot2;

  console.assert(arena1.robot === robot2, 'arena1');
  console.assert(arena2.robot === robot1, 'arena2');
});
