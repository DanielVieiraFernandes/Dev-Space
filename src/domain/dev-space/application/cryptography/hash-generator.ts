export abstract class HashGenerator {
  abstract generate(plain: string): Promise<string>;
}
