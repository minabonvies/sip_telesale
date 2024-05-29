import App from "@/components/App"
import ReactDOM from "react-dom/client"
import BonTalkProvider from "@/Provider/BonTalkProvider"
import "./normalize.css"
import "./index.css"
import { Invitation, InvitationAcceptOptions, Inviter, Registerer, Session, SessionState, UserAgent, UserAgentDelegate } from "sip.js"
import BonTalkError from "@/utils/BonTalkError"
import ThemeProvider from "@/Provider/ThemeProvider"

export default class BonTalk {
  private rootId = "_bon_sip_phone_root"
  private _audioElementId = "_bon_sip_phone_audio"

  private buttonElementId: string
  private buttonElement: HTMLElement | null = null
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

  private sessions: Session[] = []
  private currentSessionIndex = 0

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
    buttonElementId,
    wsServer,
    domains,
    username,
    password,
    displayName,
  }: {
    buttonElementId: string
    wsServer: string
    domains: string[]
    username: string
    password: string
    displayName: string
  }) {
    this.buttonElementId = buttonElementId

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
  }

  get userAgentInstance() {
    return this.userAgent
  }

  get registererInstance() {
    return this.registerer
  }

  get currentSession() {
    return this.sessions[this.currentSessionIndex]
  }

  get audioElementId() {
    return this._audioElementId
  }

  get audioElement() {
    const element = document.getElementById(this._audioElementId)
    if (!element) {
      throw new BonTalkError(`[bonTalk] audioElement with id ${this._audioElementId} not found`)
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

  async audioCall(target: string) {
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

    const audioElement = document.getElementById(this._audioElementId)
    if (!audioElement) {
      throw new BonTalkError(`[bonTalk] audioElement with id ${this._audioElementId} not found`)
    }

    const targetURI = BonTalk.makeURI(this.urlTemplate(target))
    const inviter = new Inviter(this.userAgent, targetURI)
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
          BonTalk.cleanupMedia(audioElement as HTMLMediaElement)
          break
        default:
          throw new Error("Unknown session state.")
      }
    })
    await inviter.invite(invitationAcceptOptions)

    const sessionTotalCount = this.sessions.push(inviter)
    this.currentSessionIndex = sessionTotalCount - 1
  }

  async answerCall(invitation: Invitation) {
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
    const audioElement = document.getElementById(this._audioElementId)
    if (!audioElement) {
      throw new BonTalkError(`[bonTalk] audioElement with id ${this._audioElementId} not found`)
    }
    // invitation.stateChange.addListener((state: SessionState) => {
    //   switch (state) {
    //     case SessionState.Initial:
    //       break
    //     case SessionState.Establishing:
    //       break
    //     case SessionState.Established:
    //       BonTalk.setupRemoteMedia(invitation, audioElement as HTMLMediaElement)
    //       break
    //     case SessionState.Terminating:
    //     case SessionState.Terminated:
    //       BonTalk.cleanupMedia(audioElement as HTMLMediaElement)
    //       break
    //     default:
    //       throw new Error("Unknown session state.")
    //   }
    // })
    await invitation.accept(invitationAcceptOptions)
    const sessionTotalCount = this.sessions.push(invitation)
    this.currentSessionIndex = sessionTotalCount - 1
  }

  async rejectCall(invitation: Invitation) {
    if (!invitation) {
      throw new BonTalkError("[bonTalk] invitation not initialized")
    }
    await invitation.reject()
  }

  async hangupCall() {
    const currentSession = this.sessions[this.currentSessionIndex]
    console.log(currentSession)
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
        break
    }
    // remove the session from the list
    this.sessions.splice(this.currentSessionIndex, 1)
    // adjust the current session index
    this.currentSessionIndex = Math.min(this.currentSessionIndex, this.sessions.length - 1)
  }

  async hold() {
    const currentSession = this.sessions[this.currentSessionIndex]
    if (currentSession.state === SessionState.Established) {
      await currentSession.invite()
    }
  }

  /**
   * render the panel, should only call once on every instance
   */
  render() {
    if (this.reactRoot) {
      throw new BonTalkError("[bonTalk] already rendered")
    }

    const body = document.body
    const buttonElement = document.getElementById(this.buttonElementId)

    if (!buttonElement) {
      throw new BonTalkError(`[bonTalk] buttonElement with id ${this.buttonElementId} not found`)
    }

    const root = document.createElement("div")
    root.id = this.rootId
    this.rootElement = root
    this.rootElement.style.position = "fixed"
    this.rootElement.style.top = "0"
    this.rootElement.style.right = "0"
    body.appendChild(root)

    // attach open event to button
    this.buttonElement = buttonElement
    buttonElement.addEventListener("click", this.togglePanel.bind(this))

    this.reactRoot = ReactDOM.createRoot(root)
    this.reactRoot.render(
      <ThemeProvider mode="dark">
        <BonTalkProvider value={this}>
          <App />
        </BonTalkProvider>
      </ThemeProvider>
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
