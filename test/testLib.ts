export function it(name: string, test: () => void) {
  try {
    test();
    console.info('OK: ' + name);
  } catch (error) {
    console.error('ERROR: ' + name);
    console.info(error);
  }
}