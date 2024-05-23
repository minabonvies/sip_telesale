export default class BonTalkError extends Error {
  constructor(message: string) {
    super(`[BonTalk] ${message}`)
    this.name = "BonTalkError"
  }
}
