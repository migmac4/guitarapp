declare module 'negotiator' {
  interface Negotiator {
    languages(): string[]
  }

  interface NegotiatorConstructor {
    new (headers: Record<string, string | string[]>): Negotiator
  }

  const Negotiator: NegotiatorConstructor
  export default Negotiator
}
