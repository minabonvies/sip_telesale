import App from "@/components/App"
import ReactDOM from "react-dom/client"
import BonTalkProvider from "@/Provider/BonTalkProvider"
import "./normalize.css"
import "./plugin.css"
import {
  Invitation,
  InvitationAcceptOptions,
  Inviter,
  Registerer,
  Session,
  SessionState,
  UserAgent,
  UserAgentDelegate,
  SessionInviteOptions,
} from "sip.js"
import BonTalkError from "@/utils/BonTalkError"
import ThemeProvider from "@/Provider/ThemeProvider"
import ErrorBoundary from "@/components/ErrorBoundary"
import ViewProvider from "@/Provider/ViewProvider"
import AudioProvider from "@/Provider/AudioProvider"

export default class BonTalk {
  private rootElement: HTMLElement | null = null
  private reactRoot: ReactDOM.Root | null = null

  private wsServer: string
  private domains: string[]
  private currentDomainIndex = 0
  private username: string
  private password: string
  private displayName: string

  private userAgent: UserAgent | null = null
  private noAnswerTimeout: number = 12

  private registerer: Registerer | null = null
  private registerExpires: number = 300

  public sessionManager: SessionManager = new SessionManager()

  private themeColor?: string

  static get audioElementId() {
    return "_bon_sip_phone_audio"
  }

  static get rootId() {
    return "_bon_sip_phone_root"
  }

  static makeURI(target: string) {
    const uri = UserAgent.makeURI(target)
    if (!uri) {
      throw new BonTalkError("[bonTalk] failed to create uri")
    }
    return uri
  }

  static setupRemoteMedia(session: Session, mediaElement: HTMLMediaElement) {
    if (!session) {
      throw new BonTalkError("[bonTalk] session not initialized")
    }
    const remoteStream = new MediaStream()
    // @ts-expect-error sip.js types are not up to date
    session.sessionDescriptionHandler!.peerConnection.getReceivers().forEach((receiver) => {
      if (receiver.track) {
        remoteStream.addTrack(receiver.track)
      }
    })
    mediaElement.load()
    mediaElement.srcObject = remoteStream
    mediaElement.play()
  }

  static cleanupMedia(mediaElement: HTMLMediaElement) {
    mediaElement.srcObject = null
    mediaElement.pause()
  }

  constructor({
    wsServer,
    domains,
    username,
    password,
    displayName,
    themeColor,
  }: {
    wsServer: string
    domains: string[]
    username: string
    password: string
    displayName: string
    themeColor?: string
  }) {
    this.wsServer = wsServer

    if (domains.length === 0) {
      throw new BonTalkError("[bonTalk] domains should not be empty")
    }
    this.domains = domains

    this.username = username
    this.password = password
    this.displayName = displayName

    const uri = UserAgent.makeURI(this.urlTemplate(username))
    if (!uri) {
      throw new BonTalkError("[bonTalk] failed to create uri")
    }

    this.userAgent = new UserAgent({
      uri,
      displayName: this.displayName,
      authorizationPassword: this.password,
      authorizationUsername: this.username,
      noAnswerTimeout: this.noAnswerTimeout,
      transportOptions: {
        server: this.wsServer,
        traceSip: false,
      },
      contactParams: { transport: "wss" },
    })

    this.registerer = new Registerer(this.userAgent, {
      expires: this.registerExpires,
    })

    this.themeColor = themeColor
  }

  get userAgentInstance() {
    return this.userAgent
  }

  get registererInstance() {
    return this.registerer
  }

  get audioElementId() {
    return BonTalk.audioElementId
  }

  get rootId() {
    return BonTalk.rootId
  }

  get audioElement() {
    const element = document.getElementById(this.audioElementId)
    if (!element) {
      throw new BonTalkError(`[bonTalk] audioElement with id ${this.audioElementId} not found`)
    }
    return element as HTMLMediaElement
  }

  async login() {
    if (!this.userAgent) {
      throw new BonTalkError("[bonTalk] userAgent not initialized")
    }
    if (!this.userAgent.isConnected()) {
      try {
        await this.userAgent.start()
      } catch (err) {
        throw new BonTalkError(`[bonTalk] failed to connect userAgent: ${err}`)
      }
    } else {
      console.warn("[bonTalk] the userAgent.start() been called, userAgent already connected")
    }

    if (!this.registerer) {
      throw new BonTalkError("[bonTalk] registerer not initialized")
    }
    if (this.registerer?.state !== "Registered") {
      try {
        await this.registerer.register()
      } catch (err) {
        throw new BonTalkError(`[bonTalk] failed to register userAgent: ${err}`)
      }
    } else {
      console.warn("[bonTalk] the registerer.register() been called, registerer already registered")
    }
  }

  async logout() {
    if (!this.userAgent) {
      throw new BonTalkError("[bonTalk] userAgent not initialized")
    }
    if (!this.registerer) {
      throw new BonTalkError("[bonTalk] registerer not initialized")
    }
    await this.registerer.unregister()
  }

  async audioCall(target: string, as: SessionName) {
    if (!this.userAgent) {
      throw new BonTalkError("[bonTalk] userAgent not initialized")
    }
    const invitationAcceptOptions: InvitationAcceptOptions = {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false,
        },
      },
    }

    const audioElement = document.getElementById(this.audioElementId)
    if (!audioElement) {
      throw new BonTalkError(`[bonTalk] audioElement with id ${this.audioElementId} not found`)
    }

    const targetURI = BonTalk.makeURI(this.urlTemplate(target))
    const inviter = new Inviter(this.userAgent, targetURI)
    this.sessionManager.addSession(as, inviter)
    inviter.stateChange.addListener((state: SessionState) => {
      switch (state) {
        case SessionState.Initial:
          break
        case SessionState.Establishing:
          break
        case SessionState.Established:
          BonTalk.setupRemoteMedia(inviter, audioElement as HTMLMediaElement)
          break
        case SessionState.Terminating:
        case SessionState.Terminated:
          this.sessionManager.removeSession(as)
          BonTalk.cleanupMedia(audioElement as HTMLMediaElement)
          break
        default:
          throw new Error("Unknown session state.")
      }
    })
    await inviter.invite(invitationAcceptOptions)
    return inviter
  }

  async answerCall(invitation: Invitation, as: SessionName) {
    if (!invitation) {
      throw new BonTalkError("[bonTalk] invitation not initialized")
    }
    const invitationAcceptOptions: InvitationAcceptOptions = {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false,
        },
      },
    }
    const audioElement = document.getElementById(this.audioElementId)
    if (!audioElement) {
      throw new BonTalkError(`[bonTalk] audioElement with id ${this.audioElementId} not found`)
    }
    await invitation.accept(invitationAcceptOptions)
    this.sessionManager.addSession(as, invitation)
  }

  async rejectCall(invitation: Invitation) {
    if (!invitation) {
      throw new BonTalkError("[bonTalk] invitation not initialized")
    }

    await invitation.reject()
  }

  async hangupCall(sessionName: SessionName) {
    const customSession = this.sessionManager.getSession(sessionName)
    const currentSession = customSession?.session
    if (!currentSession) {
      return
    }
    switch (currentSession.state) {
      case SessionState.Initial:
      case SessionState.Establishing:
        if (currentSession instanceof Inviter) {
          await currentSession.cancel()
        } else if (currentSession instanceof Invitation) {
          await currentSession.reject()
        } else {
          throw new BonTalkError("[bonTalk] unknown session type")
        }
        break
      case SessionState.Established:
        await currentSession.bye()
        await currentSession.dispose()
        break
      case SessionState.Terminating:
      case SessionState.Terminated:
        this.sessionManager.removeSession(sessionName)
        break
    }
  }

  async setHold(hold: boolean, sessionName: SessionName) {
    console.log(`[setHold] to switch hold to ${hold}, sessionName: ${sessionName}`)
    const customSession = this.sessionManager.getSession(sessionName)
    const currentSession = customSession?.session
    if (!currentSession) {
      return
    }

    if (currentSession.state === SessionState.Established) {
      const options: SessionInviteOptions = {
        requestDelegate: {
          onReject: () => {},
        },
        sessionDescriptionHandlerOptions: {
          // @ts-expect-error missing type
          hold,
        },
      }
      await currentSession.invite(options)

      if (hold) {
        this.sessionManager.holdSession(sessionName)
      } else {
        this.sessionManager.unHoldSession(sessionName)
      }
    }
  }

  /**
   * Puts Session on mute.
   * @param mute - Mute on if true, off if false.
   */
  toggleMicrophone(mute: boolean, sessionName: SessionName) {
    const customSession = this.sessionManager.getSession(sessionName)
    const currentSession = customSession?.session
    if (!currentSession) {
      return
    }
    // @ts-expect-error sip.js types are not up to date
    currentSession.sessionDescriptionHandler!.peerConnection.getLocalStreams().forEach(function (stream) {
      // @ts-expect-error sip.js types are not up to date
      stream.getAudioTracks().forEach(function (track) {
        track.enabled = !mute
      })
    })

    if (mute) {
      this.sessionManager.muteSession(sessionName)
    } else {
      this.sessionManager.unmuteSession(sessionName)
    }
    // MUTE HOLD NEED TO STATE
  }

  async sendDTMF(tone: string, sessionName: SessionName) {
    const currentSession = this.sessionManager.getSession(sessionName)
    if (!currentSession?.session) {
      throw new BonTalkError("[bonTalk] session not initialized")
    }
    const sessionInfoOptions = {
      requestOptions: {
        body: {
          contentDisposition: "render",
          contentType: "application/dtmf-relay",
          content: `Signal=${tone}\r\nDuration=100`,
        },
      },
    }
    await currentSession.session.info(sessionInfoOptions)
  }

  async blindTransfer(from: SessionName, target: string) {
    const newTarget = UserAgent.makeURI(this.urlTemplate(target))
    if (!newTarget) {
      throw new BonTalkError("[bonTalk] new target is not defined")
    }
    const customSession = this.sessionManager.getSession(from)
    const currentSession = customSession?.session
    if (!currentSession) {
      throw new BonTalkError("[bonTalk] session not initialized")
    }
    currentSession.refer(newTarget)

    this.sessionManager.removeSession(from)
  }

  async preAttendedTransfer(from: SessionName, target: string) {
    await this.setHold(true, from)
    return await this.audioCall(target, "attendedRefer")
  }

  async attendedTransfer(from: SessionName, target: SessionName) {
    const customSession = this.sessionManager.getSession(from)
    const firstSession = customSession?.session
    if (!firstSession) {
      throw new BonTalkError("[bonTalk] first session not initialized")
    }

    const customSession2 = this.sessionManager.getSession(target)
    const secondSession = customSession2?.session
    if (!secondSession) {
      throw new BonTalkError("[bonTalk] second session not initialized")
    }

    await firstSession.refer(secondSession)

    this.sessionManager.removeSession(from)
    this.sessionManager.removeSession(target)
  }

  /**
   * render the panel, should only call once on every instance
   */
  init() {
    if (this.reactRoot) {
      console.warn("[bonTalk] init() was called, to prevent unexpected behavior the process will return here.")
      return
    }

    const body = document.body

    const root = document.createElement("div")
    root.id = this.rootId
    this.rootElement = root
    this.rootElement.style.position = "fixed"
    this.rootElement.style.top = "0"
    this.rootElement.style.right = "0"
    body.appendChild(root)

    this.reactRoot = ReactDOM.createRoot(root)
    this.reactRoot.render(
      <ErrorBoundary>
        <ThemeProvider mode="dark" customThemeColor={this.themeColor}>
          <BonTalkProvider value={this}>
            <AudioProvider>
              <ViewProvider>
                <App />
              </ViewProvider>
            </AudioProvider>
          </BonTalkProvider>
        </ThemeProvider>
      </ErrorBoundary>
    )
  }

  /**
   * open or close the panel
   */
  togglePanel() {
    console.log("togglePanel")
    console.log(this.rootElement)
    if (!this.rootElement) {
      return
    }
    this.rootElement.style.transform = this.rootElement.style.transform === "translateX(100%)" ? "translateX(0)" : "translateX(100%)"
  }

  /**
   * destroy the panel
   * should call before destroy the element
   */
  destroy() {
    if (!this.reactRoot) {
      return
    }

    this.reactRoot.unmount()
  }

  /**
   *
   * @param target
   * @returns
   */
  urlTemplate(target: string) {
    return `sip:${target}@${this.domains[this.currentDomainIndex]}`
  }

  addDelegate<T extends keyof UserAgentDelegate>(onEvent: T, callback: UserAgentDelegate[T]) {
    if (!this.userAgent) {
      throw new BonTalkError("[bonTalk] userAgent not initialized")
    }
    if (!this.userAgent.delegate) {
      this.userAgent.delegate = {}
    }
    this.userAgent.delegate[onEvent] = callback
  }
}

export type SessionName = "incoming" | "outgoing" | "attendedRefer"
type SessionMap = {
  incoming: Invitation
  outgoing: Inviter
  attendedRefer: Inviter
}

class CustomSession {
  _id = Math.random().toString(36).substr(2, 9)
  session: Inviter | Invitation | null = null
  isMuted: boolean = false
  isHold: boolean = false
  time: number = 0
  timerId: number | null = null

  get name() {
    if (!this.session) {
      return "No Session"
    }

    if (this.session instanceof Inviter) {
      return this.session.request.to.uri.user
    }

    if (this.session instanceof Invitation) {
      return this.session.request.from.displayName
    }

    return "Unknown"
  }

  constructor({
    session,
    isMuted,
    isHold,
    time,
    timerId,
  }: {
    session: Inviter | Invitation
    isMuted: boolean
    isHold: boolean
    time: number
    timerId: number | null
  }) {
    this.session = session
    this.isMuted = isMuted
    this.isHold = isHold
    this.time = time
    this.timerId = timerId
  }

  copy() {
    return new CustomSession({
      session: this.session!,
      isMuted: this.isMuted,
      isHold: this.isHold,
      time: this.time,
      timerId: this.timerId,
    })
  }
}
class SessionManager {
  /**
   * {
   *  incoming: invitation
   *  outgoing: inviter
   *  attendedRefer: inviter
   * }
   */
  private sessions: Map<SessionName, CustomSession> = new Map()

  listeners: ((...argus: unknown[]) => unknown)[] = []

  constructor() {}

  getSessions() {
    return this.sessions
  }

  addSession<T extends SessionName>(type: T, session: SessionMap[T]) {
    const newSession = new CustomSession({ session, isMuted: false, isHold: false, time: 0, timerId: null })
    this.sessions.set(type, newSession)
    this.emitChange()

    newSession.timerId = window.setInterval(() => {
      try {
        const prevSession = this.sessions.get(type)!
        prevSession.time += 1
        const copiedSession = prevSession.copy()
        this.sessions.set(type, copiedSession)
        this.emitChange()
      } catch {
        console.log("clearInterval")
        window.clearInterval(newSession.timerId!)
      }
    }, 1000)
  }

  getSession<T extends SessionName | "">(type: T) {
    if (!type) {
      return null
    }

    return this.sessions.get(type)
  }

  removeSession<T extends SessionName>(type: T) {
    const session = this.sessions.get(type)
    if (session) {
      window.clearInterval(session.timerId!)
    }
    this.sessions.delete(type)
  }

  muteSession<T extends SessionName>(type: T) {
    const session = this.sessions.get(type)
    if (session) {
      session.isMuted = true
    }
  }

  unmuteSession<T extends SessionName>(type: T) {
    const session = this.sessions.get(type)
    if (session) {
      session.isMuted = false
    }
  }

  isSessionMuted<T extends SessionName>(type: T) {
    const session = this.sessions.get(type)
    return session ? session.isMuted : false
  }

  holdSession<T extends SessionName>(type: T) {
    const session = this.sessions.get(type)
    if (session) {
      session.isHold = true
      const newSession = session.copy()
      this.sessions.set(type, newSession)
      this.emitChange()
    }
  }

  unHoldSession<T extends SessionName>(type: T) {
    const session = this.sessions.get(type)
    if (session) {
      session.isHold = false
      const newSession = session.copy()
      this.sessions.set(type, newSession)
      this.emitChange()
    }
  }

  isSessionHold<T extends SessionName>(type: T) {
    const session = this.sessions.get(type)
    return session ? session.isHold : false
  }

  subscribe(listener: (...argus: unknown[]) => unknown) {
    this.listeners = [...this.listeners, listener]
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  emitChange() {
    this.listeners.forEach((listener) => {
      listener()
    })
  }
}
