type DebugLevel = 'info' | 'warn' | 'error'

const debugColors = {
  info: '\x1b[36m%s\x1b[0m', // cyan
  warn: '\x1b[33m%s\x1b[0m', // yellow
  error: '\x1b[31m%s\x1b[0m', // red
}

export const debug = {
  log: (component: string, message: string, data?: any, level: DebugLevel = 'info') => {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${component}]`
    
    if (typeof window === 'undefined') {
      // Server-side logging
      console.log(debugColors[level], `${prefix} ${message}`)
      if (data) console.dir(data, { depth: null, colors: true })
    } else {
      // Client-side logging
      console.log(`${prefix} ${message}`)
      if (data) console.dir(data)
    }
  },

  info: (component: string, message: string, data?: any) => {
    debug.log(component, message, data, 'info')
  },

  warn: (component: string, message: string, data?: any) => {
    debug.log(component, message, data, 'warn')
  },

  error: (component: string, message: string, data?: any) => {
    debug.log(component, message, data, 'error')
  },

  trace: (component: string, message: string) => {
    debug.info(component, `${message}\nStack: ${new Error().stack}`)
  }
}
