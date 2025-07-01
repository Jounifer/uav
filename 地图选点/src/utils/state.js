import { writable } from 'svelte/store'

/**
 * 消息中转
 * 需要时进行订阅: subscribe
 */
export default writable({ loaded: false })
